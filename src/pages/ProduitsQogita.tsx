import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RefreshButton } from '@/components/RefreshButton';
import { Loader2, TrendingUp, Package, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface QogitaProduct {
  id: string;
  ean: string;
  timestamp: string;
  qogita_price_ht: number;
  qogita_price_ttc: number;
  qogita_stock: number;
  selleramp_bsr?: string;
  selleramp_sale_price?: number;
  selleramp_sales?: string;
  selleramp_sellers?: string;
  selleramp_variations?: string;
  fbm_profit?: number;
  fbm_roi?: number;
  fba_profit?: number;
  fba_roi?: number;
  alerts?: string[];
  created_at: string;
}

interface GistProduct {
  ean: string;
  timestamp: string;
  qogita: {
    priceHT: number;
    priceTTC: number;
    stock: number;
  };
  selleramp: {
    bsr: string;
    salePrice: number;
    sales: string;
    sellers: string;
    variations: string;
  };
  fbm: {
    profit: number;
    roi: number;
  };
  fba: {
    profit: number;
    roi: number;
  };
  alerts: string[];
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

  // Filters
  const [minProfit, setMinProfit] = useState('');
  const [minROI, setMinROI] = useState('');
  const [maxBSR, setMaxBSR] = useState('');
  const [searchEAN, setSearchEAN] = useState('');

  // Load products from GitHub Gist
  const loadProducts = async () => {
    try {
      const response = await fetch('https://gist.githubusercontent.com/raw/8152fd7f63434f16118c967e041a9144/results.json');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const gistData: GistData = await response.json();
      
      console.log('Gist data received:', gistData);
      
      // Transform Gist data to app format with safety checks
      const transformedProducts: QogitaProduct[] = gistData.products
        .filter(p => p && p.qogita && p.selleramp && p.fbm && p.fba)
        .map((p, index) => ({
          id: `${p.ean}-${index}`,
          ean: p.ean || '',
          timestamp: p.timestamp || '',
          qogita_price_ht: p.qogita?.priceHT || 0,
          qogita_price_ttc: p.qogita?.priceTTC || 0,
          qogita_stock: p.qogita?.stock || 0,
          selleramp_bsr: p.selleramp?.bsr || '',
          selleramp_sale_price: p.selleramp?.salePrice || 0,
          selleramp_sales: p.selleramp?.sales || '',
          selleramp_sellers: p.selleramp?.sellers || '',
          selleramp_variations: p.selleramp?.variations || '',
          fbm_profit: p.fbm?.profit || 0,
          fbm_roi: p.fbm?.roi || 0,
          fba_profit: p.fba?.profit || 0,
          fba_roi: p.fba?.roi || 0,
          alerts: p.alerts || [],
          created_at: new Date().toISOString()
        }));

      // Sort by FBM profit descending
      transformedProducts.sort((a, b) => (b.fbm_profit || 0) - (a.fbm_profit || 0));

      setProducts(transformedProducts);
      setLastUpdate(gistData.generated);
      
      if (transformedProducts.length === 0) {
        toast.info('Aucun produit disponible pour le moment');
      }
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
      if (minProfit && product.fbm_profit && product.fbm_profit < parseFloat(minProfit)) {
        return false;
      }
      if (minROI && product.fbm_roi && product.fbm_roi < parseFloat(minROI)) {
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
  }, [products, minProfit, minROI, maxBSR, searchEAN]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

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

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      loadProducts();
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const handleRefresh = () => {
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                🚀 Monitor Qogita → SellerAmp
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
                <p className="text-sm text-muted-foreground">Produits traités</p>
                <p className="text-2xl font-bold">{filteredProducts.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Dernière MAJ</p>
                <p className="text-sm font-semibold">
                  {lastUpdate ? new Date(lastUpdate).toLocaleString('fr-FR') : '-'}
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
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Profit min (€)</label>
                <Input
                  type="number"
                  placeholder="Ex: 2.00"
                  value={minProfit}
                  onChange={(e) => setMinProfit(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">ROI min (%)</label>
                <Input
                  type="number"
                  placeholder="Ex: 20"
                  value={minROI}
                  onChange={(e) => setMinROI(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">BSR max</label>
                <Input
                  type="number"
                  placeholder="Ex: 1000"
                  value={maxBSR}
                  onChange={(e) => setMaxBSR(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Recherche EAN</label>
                <Input
                  type="text"
                  placeholder="Ex: 0000030095656"
                  value={searchEAN}
                  onChange={(e) => setSearchEAN(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />
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
                      <span className="font-mono">{product.ean}</span>
                      {product.alerts && product.alerts.length > 0 && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                          {product.alerts.join(', ')}
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
                    {product.selleramp_sale_price && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Sale Price</span>
                        <span className="font-semibold">{product.selleramp_sale_price}€</span>
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

                    {/* Profits */}
                    <div className="pt-3 border-t space-y-2">
                      {product.fbm_profit !== null && product.fbm_profit !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Profit FBM</span>
                          <span className={`font-bold ${product.fbm_profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.fbm_profit.toFixed(2)}€ ({product.fbm_roi?.toFixed(2)}%)
                          </span>
                        </div>
                      )}
                      {product.fba_profit !== null && product.fba_profit !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Profit FBA</span>
                          <span className={`font-bold ${product.fba_profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.fba_profit.toFixed(2)}€ ({product.fba_roi?.toFixed(2)}%)
                          </span>
                        </div>
                      )}
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