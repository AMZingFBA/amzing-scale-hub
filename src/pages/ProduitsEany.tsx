import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshButton } from '@/components/RefreshButton';
import { usePullRefresh } from '@/hooks/use-pull-refresh';

interface EanyProduct {
  id: string;
  ean: string;
  timestamp: string;
  qogita_price_ht: number;
  qogita_price_ttc: number;
  qogita_stock: number;
  qogita_url: string | null;
  selleramp_bsr: string | null;
  selleramp_sale_price: number | null;
  selleramp_sales: string | null;
  selleramp_sellers: string | null;
  selleramp_variations: string | null;
  selleramp_url: string | null;
  fbm_profit: number | null;
  fbm_roi: number | null;
  fba_profit: number | null;
  fba_roi: number | null;
  alerts: string[] | null;
  amazon_url: string | null;
}

const ProduitsEany = () => {
  const [products, setProducts] = useState<EanyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [minProfit, setMinProfit] = useState('');
  const [minRoi, setMinRoi] = useState('');
  const [maxBsr, setMaxBsr] = useState('');
  const [eanFilter, setEanFilter] = useState('');
  const [profitType, setProfitType] = useState<'fba' | 'fbm'>('fba');
  const [fbmCosts, setFbmCosts] = useState('3');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  
  const productsPerPage = 24;
  const { toast } = useToast();
  const { user, isVIP, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('eany_products')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits Eany",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const syncFromGist = async () => {
    try {
      setSyncing(true);
      const { data, error } = await supabase.functions.invoke('sync-eany-gist-to-db');
      
      if (error) throw error;
      
      toast({
        title: "Synchronisation réussie",
        description: `${data.synced} produits Eany synchronisés`,
      });
      
      await loadProducts();
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser les produits Eany",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const { isRefreshing, handleRefresh } = usePullRefresh(async () => {
    await syncFromGist();
  });

  useEffect(() => {
    if (!authLoading && user) {
      loadProducts();
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('refresh') === 'true') {
      syncFromGist();
      window.history.replaceState({}, '', window.location.pathname);
    }

    const channel = supabase
      .channel('eany-products-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'eany_products' 
      }, () => {
        loadProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, authLoading]);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('eanyProductsScroll');
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll));
      sessionStorage.removeItem('eanyProductsScroll');
    }
  }, [products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [minProfit, minRoi, maxBsr, eanFilter, profitType, fbmCosts]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const profit = profitType === 'fba' ? product.fba_profit : product.fbm_profit;
      const roi = profitType === 'fba' ? product.fba_roi : product.fbm_roi;
      
      const adjustedProfit = profitType === 'fbm' && profit !== null
        ? profit - parseFloat(fbmCosts)
        : profit;
      
      const profitMatch = !minProfit || (adjustedProfit !== null && adjustedProfit >= parseFloat(minProfit));
      const roiMatch = !minRoi || (roi !== null && roi >= parseFloat(minRoi));
      
      const bsrNumber = product.selleramp_bsr ? parseInt(product.selleramp_bsr.replace(/\s/g, '')) : null;
      const bsrMatch = !maxBsr || (bsrNumber !== null && bsrNumber <= parseInt(maxBsr));
      
      const eanMatch = !eanFilter || product.ean.includes(eanFilter);
      
      return profitMatch && roiMatch && bsrMatch && eanMatch;
    });
  }, [products, minProfit, minRoi, maxBsr, eanFilter, profitType, fbmCosts]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isVIP) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Accès VIP requis</h2>
          <p className="text-muted-foreground mb-6">
            Cette page est réservée aux membres VIP.
          </p>
          <Button onClick={() => navigate('/tarifs')}>
            Devenir VIP
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              sessionStorage.setItem('eanyProductsScroll', window.scrollY.toString());
              navigate('/dashboard');
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold">Products Eany</h1>
          <RefreshButton
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing || syncing}
            className="ml-auto"
          />
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
              {lastRefresh && (
                <p className="text-sm text-muted-foreground">
                  Dernière mise à jour : {lastRefresh.toLocaleTimeString('fr-FR')}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label>Type de profit</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={profitType === 'fba' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProfitType('fba')}
                    className="flex-1"
                  >
                    FBA
                  </Button>
                  <Button
                    variant={profitType === 'fbm' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProfitType('fbm')}
                    className="flex-1"
                  >
                    FBM
                  </Button>
                </div>
              </div>

              {profitType === 'fbm' && (
                <div>
                  <Label htmlFor="fbm-costs">Coûts FBM (€)</Label>
                  <Input
                    id="fbm-costs"
                    type="number"
                    step="0.01"
                    value={fbmCosts}
                    onChange={(e) => setFbmCosts(e.target.value)}
                    placeholder="Ex: 3"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="min-profit">Profit min (€)</Label>
                <Input
                  id="min-profit"
                  type="number"
                  value={minProfit}
                  onChange={(e) => setMinProfit(e.target.value)}
                  placeholder="Ex: 5"
                />
              </div>

              <div>
                <Label htmlFor="min-roi">ROI min (%)</Label>
                <Input
                  id="min-roi"
                  type="number"
                  value={minRoi}
                  onChange={(e) => setMinRoi(e.target.value)}
                  placeholder="Ex: 20"
                />
              </div>

              <div>
                <Label htmlFor="max-bsr">BSR max</Label>
                <Input
                  id="max-bsr"
                  type="number"
                  value={maxBsr}
                  onChange={(e) => setMaxBsr(e.target.value)}
                  placeholder="Ex: 100000"
                />
              </div>

              <div>
                <Label htmlFor="ean-filter">Recherche EAN</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="ean-filter"
                    type="text"
                    value={eanFilter}
                    onChange={(e) => setEanFilter(e.target.value)}
                    placeholder="Ex: 5449000"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {paginatedProducts.map((product) => {
            const profit = profitType === 'fba' ? product.fba_profit : product.fbm_profit;
            const roi = profitType === 'fba' ? product.fba_roi : product.fbm_roi;
            const adjustedProfit = profitType === 'fbm' && profit !== null
              ? profit - parseFloat(fbmCosts)
              : profit;

            return (
              <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-mono text-sm text-muted-foreground">EAN: {product.ean}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(product.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    {product.alerts && product.alerts.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.alerts.map((alert, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                            {alert}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Prix TTC</p>
                      <p className="font-semibold">{product.qogita_price_ttc.toFixed(2)}€</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stock</p>
                      <p className="font-semibold">{product.qogita_stock}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Profit {profitType.toUpperCase()}</p>
                      <p className={`font-bold ${adjustedProfit && adjustedProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {adjustedProfit !== null ? `${adjustedProfit.toFixed(2)}€` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ROI {profitType.toUpperCase()}</p>
                      <p className={`font-bold ${roi && roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roi !== null ? `${roi.toFixed(0)}%` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Prix vente</p>
                      <p className="font-semibold">
                        {product.selleramp_sale_price ? `${product.selleramp_sale_price.toFixed(2)}€` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">BSR</p>
                      <p className="font-semibold">{product.selleramp_bsr || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {product.qogita_url && (
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <a href={product.qogita_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Eany
                        </a>
                      </Button>
                    )}
                    {product.selleramp_url && (
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <a href={product.selleramp_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          SellerAmp
                        </a>
                      </Button>
                    )}
                    {product.amazon_url && (
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <a href={product.amazon_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Amazon
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProduitsEany;