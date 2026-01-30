import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, Package, Clock, ArrowLeft, Copy, ExternalLink, Store, BarChart3, ShoppingCart, RotateCcw, Flame, Trash2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EanyProduct {
  id: string;
  ean: string;
  timestamp: string;
  qogita_price_ht: number;
  qogita_price_ttc: number;
  qogita_stock: number;
  qogita_url?: string;
  selleramp_bsr?: string;
  selleramp_sale_price?: number;
  selleramp_sales?: string;
  selleramp_sellers?: string;
  selleramp_variations?: string;
  selleramp_url?: string;
  fbm_profit?: number;
  fbm_roi?: number;
  fba_profit?: number;
  fba_roi?: number;
  alerts?: string[];
  amazon_url?: string;
  created_at: string;
}

const PRODUCTS_PER_PAGE = 50;
const SCROLL_POSITION_KEY = 'eany_scroll_position';
const CURRENT_PAGE_KEY = 'eany_current_page';

// Default Eany Sheet ID - update this with your actual Sheet ID
const EANY_SHEET_ID = '1UNjqp8d7mCouPClazZfOKyX9nZMyRsxhxmmi52QeWbE';

export default function ProduitsEany() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading, isVIP } = useAuth();
  const { isAdmin } = useAdmin();
  const [products, setProducts] = useState<EanyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem(CURRENT_PAGE_KEY);
    return saved ? parseInt(saved) : 1;
  });
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [lastRefresh, setLastRefresh] = useState<string>('');

  // Filters
  const [minProfit, setMinProfit] = useState('');
  const [minROI, setMinROI] = useState('');
  const [maxBSR, setMaxBSR] = useState('');
  const [searchEAN, setSearchEAN] = useState('');
  const [profitType, setProfitType] = useState<'both' | 'fbm' | 'fba'>('both');
  const [fbmCost, setFbmCost] = useState('0');
  const [minSales, setMinSales] = useState<number>(0);

  // Sales filter presets
  const salesPresets = [
    { label: 'Tous', value: 0, icon: null },
    { label: '10+', value: 10, icon: '📈' },
    { label: '30+', value: 30, icon: '🔥' },
    { label: '50+', value: 50, icon: '💎' },
    { label: '100+', value: 100, icon: '🚀' },
  ];

  // Helper function to parse sales value from string
  const parseSalesValue = (salesStr: string | undefined): number => {
    if (!salesStr || salesStr === 'Unknown' || salesStr === 'N/A') return 0;
    
    // Normalize the string: remove spaces, convert to lowercase
    const normalized = salesStr.toLowerCase().trim();
    
    // Handle "2k+" or "2.5k" format (thousands)
    const kMatch = normalized.match(/(\d+(?:\.\d+)?)\s*k/);
    if (kMatch) {
      return Math.floor(parseFloat(kMatch[1]) * 1000);
    }
    
    // Handle ranges like "50-100" - take the first number
    // Handle formats like "30+/mo", "100+", "29/mo"
    const numMatch = normalized.match(/(\d+)/);
    return numMatch ? parseInt(numMatch[1]) : 0;
  };

  // Load products ONLY from Google Sheet (via backend function)
  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('sync-eany-from-sheets', {
        body: {
          sheetId: EANY_SHEET_ID,
        },
      });

      if (error) throw error;

      const sheetProducts = (data?.products ?? []) as any[];

      const transformedProducts: EanyProduct[] = sheetProducts.map((p: any) => ({
        id: p.id || `${p.ean}-${p.timestamp}`,
        ean: p.ean,
        timestamp: p.timestamp,
        qogita_price_ht: p.qogita_price_ht ?? 0,
        qogita_price_ttc: p.qogita_price_ttc ?? 0,
        qogita_stock: p.qogita_stock ?? null,
        qogita_url: p.qogita_url ?? undefined,
        selleramp_bsr: p.selleramp_bsr ?? 'N/A',
        selleramp_sale_price: p.selleramp_sale_price ?? null,
        selleramp_sales: p.selleramp_sales ?? 'Unknown',
        selleramp_sellers: p.selleramp_sellers ?? 'N/A',
        selleramp_variations: p.selleramp_variations ?? 'None',
        selleramp_url: p.selleramp_url ?? undefined,
        fbm_profit: p.fbm_profit ?? 0,
        fbm_roi: p.fbm_roi ?? 0,
        fba_profit: p.fba_profit ?? 0,
        fba_roi: p.fba_roi ?? 0,
        alerts: p.alerts ?? [],
        amazon_url: p.amazon_url ?? undefined,
        created_at: p.created_at ?? new Date().toISOString(),
      }));

      setProducts(transformedProducts);

      if (transformedProducts.length > 0) {
        const mostRecentProduct = transformedProducts.reduce((latest, current) => {
          return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
        });
        setLastUpdate(mostRecentProduct.timestamp);
      } else {
        setLastUpdate('');
      }

      setLastRefresh(new Date().toISOString());
    } catch (error) {
      console.error('Error loading products from Google Sheet:', error);
      setProducts([]);
      toast.error('Erreur de connexion au Google Sheet');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Clear table (admin only)
  const handleClearTable = async () => {
    if (!confirm('⚠️ Vider la table ? Cette action est irréversible.')) return;
    
    setIsClearing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-eany-from-sheets', {
        body: { action: 'clear' },
      });

      if (error) throw error;
      
      toast.success('Table vidée avec succès');
      setProducts([]);
    } catch (error) {
      console.error('Error clearing table:', error);
      toast.error('Erreur lors du vidage de la table');
    } finally {
      setIsClearing(false);
    }
  };

  // Filtered + default sort (timestamp desc - newest first)
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const fbmCostValue = fbmCost ? parseFloat(fbmCost) : 0;
      const profit =
        profitType === 'fbm'
          ? product.fbm_profit
            ? product.fbm_profit - fbmCostValue
            : null
          : profitType === 'fba'
            ? product.fba_profit
            : Math.max((product.fbm_profit || 0) - fbmCostValue, product.fba_profit || 0);
      const roi =
        profitType === 'fbm'
          ? product.fbm_roi
          : profitType === 'fba'
            ? product.fba_roi
            : Math.max(product.fbm_roi || 0, product.fba_roi || 0);

      if (minProfit && profit !== null && profit < parseFloat(minProfit)) return false;
      if (minROI && roi !== undefined && roi < parseFloat(minROI)) return false;

      if (maxBSR && product.selleramp_bsr) {
        const bsr = parseInt(product.selleramp_bsr.replace(/\D/g, ''));
        if (bsr > parseInt(maxBSR)) return false;
      }

      if (searchEAN && !product.ean.includes(searchEAN)) return false;

      if (minSales > 0) {
        const productSales = parseSalesValue(product.selleramp_sales);
        if (productSales < minSales) return false;
      }

      return true;
    });

    // Sort by timestamp descending (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return filtered;
  }, [products, minProfit, minROI, maxBSR, searchEAN, profitType, fbmCost, minSales]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
      localStorage.setItem(CURRENT_PAGE_KEY, '1');
    }
  }, [currentPage, totalPages]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    localStorage.setItem(CURRENT_PAGE_KEY, '1');
  }, [minProfit, minROI, maxBSR, searchEAN, profitType, fbmCost, minSales]);

  // Save scroll position
  const saveScrollPosition = () => {
    localStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
    localStorage.setItem(CURRENT_PAGE_KEY, currentPage.toString());
  };

  // Restore scroll position
  useEffect(() => {
    const savedPosition = localStorage.getItem(SCROLL_POSITION_KEY);
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition));
      }, 100);
    }

    return () => {
      saveScrollPosition();
    };
  }, []);

  // Initial load
  useEffect(() => {
    if (!authLoading && user) {
      loadProducts();
    }
  }, [user, authLoading]);

  // Listen for URL refresh param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('refresh') === 'true') {
      console.log('🔄 Force refresh from URL');
      loadProducts();
      navigate('/products/eany', { replace: true });
    }
  }, [location.search]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh produits Eany...');
      loadProducts();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh - reload from Google Sheet');
    setIsRefreshing(true);
    await loadProducts();
  };

  const handlePageChange = (page: number) => {
    saveScrollPosition();
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('EAN copié dans le presse-papier');
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Not VIP
  if (!isVIP && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">💳 Accès réservé aux membres VIP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Ton abonnement ne permet pas d'accéder au moniteur Eany.
              Mets à niveau ton compte pour débloquer les produits rentables en temps réel.
            </p>
            <Button onClick={() => navigate('/tarifs')} className="w-full">
              Devenir VIP
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#FF9900] hover:bg-[#FF9900]/90 p-3 md:p-2 rounded-full shadow-lg transition-all shrink-0"
              aria-label="Retour au dashboard"
            >
              <ArrowLeft className="w-6 h-6 md:w-5 md:h-5 text-white" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-amber-500 via-yellow-500 via-green-500 via-cyan-500 to-blue-500 bg-[length:200%_auto] animate-[gradient-shift_2s_ease-in-out_infinite] bg-clip-text text-transparent pb-2 leading-tight">
                🚀 Monitor Eany
              </h1>
              <p className="text-muted-foreground text-lg">
                Produits rentables en temps réel
              </p>
            </div>
          </div>

          {/* Admin: Clear table button */}
          {isAdmin && (
            <div className="flex justify-center mb-4">
              <Button
                variant="destructive"
                onClick={handleClearTable}
                disabled={isClearing}
                className="gap-2"
              >
                {isClearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Vider la table
              </Button>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Produits filtrés</p>
                <p className="text-2xl font-bold">{filteredProducts.length.toLocaleString('fr-FR')}</p>
                <p className="text-xs text-muted-foreground mt-1">sur {products.length.toLocaleString('fr-FR')} au total</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Dernier chargement</p>
                <p className="text-sm font-semibold">
                  {lastRefresh ? new Date(lastRefresh).toLocaleString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }) : '-'}
                </p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Page actuelle</p>
                <p className="text-2xl font-bold">{currentPage} / {totalPages || 1}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-2">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Filtres</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setProfitType('both');
                  setFbmCost('0');
                  setMinProfit('');
                  setMinROI('');
                  setMaxBSR('');
                  setSearchEAN('');
                  setMinSales(0);
                  toast.success('Filtres réinitialisés');
                }}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </Button>
            </div>
            
            {/* Profit type section */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-border">
              <div className="flex-1 w-full">
                <label className="text-sm font-semibold mb-3 block text-foreground">Type de profit</label>
                <div className="inline-flex rounded-xl border-2 border-border p-1.5 bg-muted/30 shadow-sm">
                  <button
                    onClick={() => setProfitType('both')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      profitType === 'both'
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background'
                    }`}
                  >
                    Les 2
                  </button>
                  <button
                    onClick={() => setProfitType('fbm')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      profitType === 'fbm'
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background'
                    }`}
                  >
                    FBM
                  </button>
                  <button
                    onClick={() => setProfitType('fba')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      profitType === 'fba'
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background'
                    }`}
                  >
                    FBA
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full lg:max-w-xs">
                <label className="text-sm font-semibold mb-3 block text-foreground">Coûts FBM (€)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 2.50"
                  value={fbmCost}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || value === '0') {
                      setFbmCost('0');
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue) && numValue >= 0) {
                        setFbmCost(String(numValue));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const numValue = parseFloat(e.target.value);
                    if (isNaN(numValue) || numValue < 0) {
                      setFbmCost('0');
                    }
                  }}
                  className="h-12 text-lg"
                />
              </div>
            </div>

            {/* Main filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground">Profit min (€)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 5"
                  value={minProfit}
                  onChange={(e) => setMinProfit(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground">ROI min (%)</label>
                <Input
                  type="number"
                  step="1"
                  placeholder="Ex: 20"
                  value={minROI}
                  onChange={(e) => setMinROI(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground">BSR max</label>
                <Input
                  type="number"
                  placeholder="Ex: 100000"
                  value={maxBSR}
                  onChange={(e) => setMaxBSR(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground">Rechercher EAN</label>
                <Input
                  type="text"
                  placeholder="Ex: 5012345678900"
                  value={searchEAN}
                  onChange={(e) => setSearchEAN(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
            </div>

            {/* Sales filter */}
            <div className="mt-6 pt-6 border-t border-border">
              <label className="text-sm font-semibold mb-3 block text-foreground">Ventes mensuelles minimum</label>
              <div className="flex flex-wrap gap-2">
                {salesPresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setMinSales(preset.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      minSales === preset.value
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {preset.icon && <span className="mr-1">{preset.icon}</span>}
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product count info */}
        {!EANY_SHEET_ID && (
          <Card className="mb-8 border-amber-500/50 bg-amber-50/10">
            <CardContent className="p-4">
              <p className="text-amber-600 text-center">
                ⚠️ Aucun Google Sheet configuré. Contactez l'administrateur pour définir l'ID du Sheet Eany.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Products grid */}
        {paginatedProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {products.length === 0
                  ? 'Aucun produit disponible. Le Google Sheet est peut-être vide ou non configuré.'
                  : 'Aucun produit ne correspond à vos critères de filtrage. Essayez de réduire les filtres.'}
              </p>
              <Button onClick={handleRefresh} className="mt-4" disabled={isRefreshing}>
                {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Actualiser
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {paginatedProducts.map((product) => {
                const fbmCostValue = fbmCost ? parseFloat(fbmCost) : 0;
                const adjustedFbmProfit = (product.fbm_profit || 0) - fbmCostValue;
                const displayProfit =
                  profitType === 'fbm'
                    ? adjustedFbmProfit
                    : profitType === 'fba'
                      ? product.fba_profit || 0
                      : Math.max(adjustedFbmProfit, product.fba_profit || 0);
                const displayROI =
                  profitType === 'fbm'
                    ? product.fbm_roi || 0
                    : profitType === 'fba'
                      ? product.fba_roi || 0
                      : Math.max(product.fbm_roi || 0, product.fba_roi || 0);

                return (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(product.ean)}
                            className="flex items-center gap-1 text-sm font-mono bg-muted px-2 py-1 rounded hover:bg-muted/80 transition-colors"
                          >
                            {product.ean}
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          {product.amazon_url && (
                            <a
                              href={product.amazon_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-[#FF9900]/10 hover:bg-[#FF9900]/20 transition-colors"
                            >
                              <Store className="w-4 h-4 text-[#FF9900]" />
                            </a>
                          )}
                          {product.selleramp_url && (
                            <a
                              href={product.selleramp_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                            >
                              <BarChart3 className="w-4 h-4 text-blue-500" />
                            </a>
                          )}
                          {product.qogita_url && (
                            <a
                              href={product.qogita_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-green-500/10 hover:bg-green-500/20 transition-colors"
                            >
                              <ShoppingCart className="w-4 h-4 text-green-500" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Prices */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-muted-foreground text-xs">Prix Eany HT</p>
                          <p className="font-semibold">{product.qogita_price_ht?.toFixed(2) || '0.00'}€</p>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-muted-foreground text-xs">Prix Amazon</p>
                          <p className="font-semibold">{product.selleramp_sale_price?.toFixed(2) || 'N/A'}€</p>
                        </div>
                      </div>

                      {/* Stock & BSR */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-muted-foreground text-xs">Stock</p>
                          <p className="font-semibold">{product.qogita_stock ?? 'N/A'}</p>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-muted-foreground text-xs">BSR</p>
                          <p className="font-semibold">{product.selleramp_bsr || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Sales & Sellers */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-muted-foreground text-xs">Ventes/mois</p>
                          <p className="font-semibold flex items-center gap-1">
                            {product.selleramp_sales || 'N/A'}
                            {parseSalesValue(product.selleramp_sales) >= 50 && <Flame className="w-3 h-3 text-orange-500" />}
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-muted-foreground text-xs">Vendeurs</p>
                          <p className="font-semibold">{product.selleramp_sellers || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Profit & ROI */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`rounded p-2 ${displayProfit > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          <p className="text-muted-foreground text-xs">Profit</p>
                          <p className={`font-bold text-lg ${displayProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {displayProfit.toFixed(2)}€
                          </p>
                        </div>
                        <div className={`rounded p-2 ${displayROI > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          <p className="text-muted-foreground text-xs">ROI</p>
                          <p className={`font-bold text-lg ${displayROI > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {displayROI.toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      {/* FBM/FBA breakdown */}
                      <div className="text-xs text-muted-foreground border-t pt-2">
                        <div className="flex justify-between">
                          <span>FBM: {adjustedFbmProfit.toFixed(2)}€ ({product.fbm_roi?.toFixed(0) || 0}%)</span>
                          <span>FBA: {product.fba_profit?.toFixed(2) || '0.00'}€ ({product.fba_roi?.toFixed(0) || 0}%)</span>
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="text-xs text-muted-foreground text-center pt-1">
                        {new Date(product.timestamp).toLocaleString('fr-FR')}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  «
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  ›
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  »
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
