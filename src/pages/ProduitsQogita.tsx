import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Loader2, TrendingUp, Package, Clock, ArrowLeft, Copy, ExternalLink, Store, BarChart3, ShoppingCart, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QogitaProduct {
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

interface GistProduct {
  ean: string;
  timestamp: string;
  qogita?: {
    priceHT: number;
    priceTTC: number;
    stock: number;
    url?: string;
  };
  selleramp?: {
    bsr: string;
    salePrice: number | null;
    sales: string;
    sellers: string;
    variations: string;
    url?: string;
  };
  fbm?: {
    profit: number;
    roi: number;
  };
  fba?: {
    profit: number;
    roi: number;
  };
  alerts?: string[];
  amazon?: {
    url?: string;
  };
}

interface GistData {
  generated: string;
  total: number;
  products: GistProduct[];
}

const PRODUCTS_PER_PAGE = 50;
const SCROLL_POSITION_KEY = 'qogita_scroll_position';
const CURRENT_PAGE_KEY = 'qogita_current_page';

export default function ProduitsQogita() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading, isVIP } = useAuth();
  const { isAdmin } = useAdmin();
  const [products, setProducts] = useState<QogitaProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  // Load products from Supabase
  const loadProducts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('qogita_products')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        console.log('No products found in database');
        setProducts([]);
        setLastUpdate(new Date().toISOString());
        toast.info('Aucun produit disponible pour le moment');
        return;
      }

      // Transform DB data to app format
      const transformedProducts: QogitaProduct[] = data.map((p: any) => ({
        id: p.id,
        ean: p.ean,
        timestamp: p.timestamp,
        qogita_price_ht: p.qogita_price_ht,
        qogita_price_ttc: p.qogita_price_ttc,
        qogita_stock: p.qogita_stock,
        qogita_url: p.qogita_url,
        selleramp_bsr: p.selleramp_bsr || 'N/A',
        selleramp_sale_price: p.selleramp_sale_price || null,
        selleramp_sales: p.selleramp_sales || 'Unknown',
        selleramp_sellers: p.selleramp_sellers || 'N/A',
        selleramp_variations: p.selleramp_variations || 'None',
        selleramp_url: p.selleramp_url,
        fbm_profit: p.fbm_profit || 0,
        fbm_roi: p.fbm_roi || 0,
        fba_profit: p.fba_profit || 0,
        fba_roi: p.fba_roi || 0,
        alerts: p.alerts || [],
        amazon_url: p.amazon_url,
        created_at: p.created_at
      }));

      // Garde l'ordre par timestamp de la requête SQL (du plus récent au moins récent)
      setProducts(transformedProducts);
      
      // Get the most recent timestamp from ALL products (not just first by profit)
      if (transformedProducts.length > 0) {
        const mostRecentProduct = transformedProducts.reduce((latest, current) => {
          return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
        });
        setLastUpdate(mostRecentProduct.timestamp);
      }
      
      // Set the current time as last refresh time
      setLastRefresh(new Date().toISOString());
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filter by profit type
      const fbmCostValue = fbmCost ? parseFloat(fbmCost) : 0;
      const profit = profitType === 'fbm' 
        ? (product.fbm_profit ? product.fbm_profit - fbmCostValue : null)
        : profitType === 'fba' 
        ? product.fba_profit 
        : Math.max((product.fbm_profit || 0) - fbmCostValue, product.fba_profit || 0);
      const roi = profitType === 'fbm' ? product.fbm_roi : profitType === 'fba' ? product.fba_roi : Math.max(product.fbm_roi || 0, product.fba_roi || 0);
      
      if (minProfit && profit < parseFloat(minProfit)) {
        return false;
      }
      if (minROI && roi < parseFloat(minROI)) {
        return false;
      }
      if (maxBSR && product.selleramp_bsr) {
        const bsr = parseInt(product.selleramp_bsr.replace(/\D/g, ''));
        if (bsr > parseInt(maxBSR)) return false;
      }
      if (searchEAN && !product.ean.includes(searchEAN)) {
        return false;
      }
      return true;
    });
  }, [products, minProfit, minROI, maxBSR, searchEAN, profitType, fbmCost]);

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
  }, [minProfit, minROI, maxBSR, searchEAN, profitType, fbmCost]);

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

  // Écouter les changements d'URL pour forcer le reload
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('refresh') === 'true') {
      console.log('🔄 Force refresh depuis URL');
      loadProducts();
      // Nettoyer l'URL
      navigate('/produits-gagnants/produits-qogita', { replace: true });
    }
  }, [location.search]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh produits Qogita...');
      loadProducts();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [user]);

  const handleRefresh = () => {
    console.log('🔄 Refresh manuel déclenché');
    setIsRefreshing(true);
    loadProducts();
  };

  const handlePageChange = (page: number) => {
    saveScrollPosition();
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              Ton abonnement ne permet pas d'accéder au moniteur Qogita.
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
                🚀 Monitor Qogita
              </h1>
              <p className="text-muted-foreground text-lg">
                Produits rentables en temps réel
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Produits filtrés</p>
                <p className="text-2xl font-bold">{filteredProducts.length}</p>
                <p className="text-xs text-muted-foreground mt-1">sur 26 770 analysés</p>
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
                <p className="text-2xl font-bold">{currentPage} / {totalPages}</p>
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
                  toast.success('Filtres réinitialisés');
                }}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </Button>
            </div>
            {/* Type de profit section */}
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
                        // Convertir en nombre puis en string pour enlever les zéros du début
                        setFbmCost(String(numValue));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    // Au blur, nettoyer la valeur
                    const numValue = parseFloat(e.target.value);
                    if (!isNaN(numValue) && numValue > 0) {
                      setFbmCost(String(numValue));
                    } else {
                      setFbmCost('0');
                    }
                  }}
                  className="h-11 border-2 focus:ring-2"
                />
              </div>
            </div>
            
            {/* Other filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-6">
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground">Profit min (€)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 2.00"
                  value={minProfit}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || value === '0') {
                      setMinProfit('0');
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue) && numValue >= 0) {
                        setMinProfit(String(numValue));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const numValue = parseFloat(e.target.value);
                    if (!isNaN(numValue) && numValue > 0) {
                      setMinProfit(String(numValue));
                    } else {
                      setMinProfit('0');
                    }
                  }}
                  className="h-11 border-2 focus:ring-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground">ROI min (%)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 20"
                  value={minROI}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || value === '0') {
                      setMinROI('0');
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue) && numValue >= 0) {
                        setMinROI(String(numValue));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const numValue = parseFloat(e.target.value);
                    if (!isNaN(numValue) && numValue > 0) {
                      setMinROI(String(numValue));
                    } else {
                      setMinROI('0');
                    }
                  }}
                  className="h-11 border-2 focus:ring-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground">BSR max</label>
                <Input
                  type="number"
                  placeholder="Ex: 1000"
                  value={maxBSR}
                  onChange={(e) => setMaxBSR(e.target.value)}
                  className="h-11 border-2 focus:ring-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground">Recherche EAN</label>
                <Input
                  type="text"
                  placeholder="Ex: 0000030095656"
                  value={searchEAN}
                  onChange={(e) => setSearchEAN(e.target.value)}
                  className="h-11 border-2 focus:ring-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {paginatedProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Aucun produit trouvé</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{product.ean}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(product.ean);
                            toast.success('EAN copié !');
                          }}
                          className="h-7 w-7 p-0"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      {product.alerts && product.alerts.filter(alert => alert !== 'V').length > 0 && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                          {product.alerts.filter(alert => alert !== 'V').join(', ')}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Qogita Prices */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Prix Qogita HT/TTC</span>
                      <span className="font-semibold">{product.qogita_price_ht}€ / {product.qogita_price_ttc}€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Stock</span>
                      <span className="font-semibold">{product.qogita_stock}</span>
                    </div>

                    {/* SellerAmp Data */}
                    {product.selleramp_bsr && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">BSR</span>
                        <span className="font-semibold">{product.selleramp_bsr}</span>
                      </div>
                    )}
                    {product.selleramp_sales && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Ventes</span>
                        <span className="font-semibold">{product.selleramp_sales}</span>
                      </div>
                    )}
                    {product.selleramp_sellers && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Sellers</span>
                        <span className="font-semibold">{product.selleramp_sellers}</span>
                      </div>
                    )}
                    {product.selleramp_variations && 
                     product.selleramp_variations !== 'None' && 
                     product.selleramp_variations !== 'No' &&
                     product.selleramp_variations !== '0' ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Variations</span>
                        <span className="font-semibold">{product.selleramp_variations}</span>
                      </div>
                    ) : (
                      <div className="h-6"></div>
                    )}

                    {/* Profits */}
                    <div className="pt-3 border-t space-y-2">
                      {product.fbm_profit !== null && product.fbm_profit !== undefined && (() => {
                        const fbmCostValue = parseFloat(fbmCost) || 0;
                        const adjustedFbmProfit = product.fbm_profit - fbmCostValue;
                        const priceTTC = product.qogita_price_ttc || (product.qogita_price_ht * 1.2);
                        const adjustedFbmRoi = priceTTC > 0 ? (adjustedFbmProfit / priceTTC) * 100 : 0;
                        
                        return (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Profit FBM</span>
                              {fbmCostValue > 0 && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full border border-orange-300">
                                  Coûts FBM -{fbmCostValue}€
                                </span>
                              )}
                            </div>
                            <span className={`font-bold ${adjustedFbmProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {adjustedFbmProfit.toFixed(2)}€ ({adjustedFbmRoi.toFixed(2)}%)
                            </span>
                          </div>
                        );
                      })()}
                      {product.fba_profit !== null && product.fba_profit !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Profit FBA</span>
                          <span className={`font-bold ${product.fba_profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.fba_profit.toFixed(2)}€ ({product.fba_roi?.toFixed(2)}%)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Links - Professional & Creative */}
                    <div className="pt-4 border-t">
                      <p className="text-xs font-semibold text-muted-foreground mb-3">Liens rapides</p>
                      <div className="grid grid-cols-3 gap-2">
                        {product.qogita_url && (
                          <a
                            href={product.qogita_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 transition-all hover:shadow-md group"
                          >
                            <Store className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-blue-700">Qogita</span>
                          </a>
                        )}
                        {product.selleramp_url && (
                          <a
                            href={product.selleramp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 transition-all hover:shadow-md group"
                          >
                            <BarChart3 className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-purple-700">SellerAmp</span>
                          </a>
                        )}
                        {product.amazon_url && (
                          <a
                            href={product.amazon_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200 transition-all hover:shadow-md group"
                          >
                            <ShoppingCart className="h-4 w-4 text-orange-600 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-orange-700">Amazon</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page = i + 1;
                    if (totalPages > 5) {
                      if (currentPage > 3) {
                        page = currentPage - 2 + i;
                      }
                      if (currentPage > totalPages - 3) {
                        page = totalPages - 4 + i;
                      }
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}