import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Copy, ExternalLink, Sparkles, RefreshCw, Bell, Store, TrendingUp, Package, Users } from 'lucide-react';
import { toast } from 'sonner';

interface IboodProduct {
  id: string;
  product_name: string;
  ean: string;
  asin: string | null;
  bsr: string | null;
  cost: string | null;
  sale_price: string | null;
  monthly_sales: string | null;
  fba_profit: string | null;
  fba_roi: string | null;
  fbm_profit: string | null;
  fbm_roi: string | null;
  private_label: string | null;
  size: string | null;
  meltable: string | null;
  variations: string | null;
  sellers: string | null;
  nb_vendors: string | null;
  nb_fba: string | null;
  nb_fbm: string | null;
  amazon_url: string | null;
  ibood_url: string | null;
  chart_url: string | null;
}

export default function ProduitsIbood() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading, isVIP } = useAuth();
  const { isAdmin } = useAdmin();
  const [products, setProducts] = useState<IboodProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [previousCount, setPreviousCount] = useState<number | null>(null);
  const [newCount, setNewCount] = useState(0);
  const autoSyncRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useScrollPosition(location.pathname);

  const fetchProducts = useCallback(async (silent = false) => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-ibood-from-sheets');
      if (error) throw error;
      if (data?.success) {
        const loadedProducts = data.products || [];
        if (previousCount !== null && loadedProducts.length > previousCount) {
          setNewCount(loadedProducts.length - previousCount);
        }
        setPreviousCount(loadedProducts.length);
        setProducts(loadedProducts);
        if (!silent) toast.success(`${data.count} produits iBood chargés`);
      } else {
        throw new Error(data?.error || 'Fetch failed');
      }
    } catch (error: any) {
      console.error('iBood fetch error:', error);
      if (!silent && error?.name !== 'AbortError') {
        toast.error('Erreur lors du chargement des produits iBood');
      }
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [isSyncing, previousCount]);

  useEffect(() => {
    if (!authLoading && user && (isVIP || isAdmin)) {
      fetchProducts(true);
      autoSyncRef.current = setInterval(() => fetchProducts(true), 60 * 1000);
      return () => { if (autoSyncRef.current) clearInterval(autoSyncRef.current); };
    }
  }, [user, authLoading, isVIP, isAdmin]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié !');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) { navigate('/auth'); return null; }

  if (!isVIP && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader><h2 className="text-xl font-bold text-center">💳 Accès VIP requis</h2></CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">Cette section est réservée aux membres VIP.</p>
            <Button onClick={() => navigate('/tarifs')}>Devenir VIP</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* New alerts banner */}
        {newCount > 0 && (
          <div
            className="mb-4 bg-destructive text-destructive-foreground rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer animate-pulse"
            onClick={() => { setNewCount(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <span className="font-semibold text-sm">
                🔔 {newCount} nouvelle{newCount > 1 ? 's' : ''} alerte{newCount > 1 ? 's' : ''} !
              </span>
            </div>
            <span className="text-xs underline">Voir</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary hover:bg-primary/90 p-3 md:p-2 rounded-full shadow-lg transition-all shrink-0"
              aria-label="Retour au dashboard"
            >
              <ArrowLeft className="w-6 h-6 md:w-5 md:h-5 text-primary-foreground" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1">
                Produits iBood
              </h1>
              <p className="text-muted-foreground text-sm">Alertes iBood en temps réel</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchProducts(false)}
              disabled={isSyncing}
              className="shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun produit iBood</h3>
              <p className="text-muted-foreground">Les produits iBood apparaîtront ici.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {products.map((product) => (
              <IboodProductCard key={product.id} product={product} onCopy={copyToClipboard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IboodProductCard({ product, onCopy }: { product: IboodProduct; onCopy: (text: string) => void }) {
  // Extract chart image URL from the IMAGE formula if present
  const chartImageUrl = product.chart_url
    ? product.chart_url.replace(/^=IMAGE\("?/i, '').replace(/"?\)$/i, '').replace(/^"|"$/g, '')
    : null;

  const fallbackImages = [
    chartImageUrl,
    product.asin ? `https://images-na.ssl-images-amazon.com/images/P/${product.asin}.01._SX679_.jpg` : null,
    product.ibood_url ? `https://image.thum.io/get/width/1200/noanimate/${encodeURIComponent(product.ibood_url)}` : null,
    '/placeholder.svg',
  ].filter(Boolean) as string[];

  const [imageIndex, setImageIndex] = useState(0);
  const currentImageSrc = fallbackImages[imageIndex] ?? null;

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 px-6 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg">iBood</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Chart image / product photo */}
        {currentImageSrc && (
          <div className="rounded-xl overflow-hidden border">
            <img
              src={currentImageSrc}
              alt={product.product_name}
              className="w-full h-auto max-h-64 object-contain bg-white"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => {
                if (imageIndex < fallbackImages.length - 1) {
                  setImageIndex((prev) => prev + 1);
                }
              }}
            />
          </div>
        )}

        {/* Product title */}
        <h3 className="text-xl font-semibold leading-tight">{product.product_name}</h3>

        {/* ASIN */}
        {product.asin && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">ASIN:</span>
            <code className="bg-muted px-3 py-1 rounded font-mono text-sm">{product.asin}</code>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onCopy(product.asin!)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Prices row */}
        <div className="flex flex-wrap items-center gap-4">
          {product.cost && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Coût:</span>
              <span className="font-bold">{product.cost}</span>
            </div>
          )}
          {product.sale_price && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Prix vente:</span>
              <span className="text-xl font-bold text-green-500">{product.sale_price} €</span>
            </div>
          )}
        </div>

        {/* SAS Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-xl">
          {product.bsr && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">BSR</span>
              <span className="font-semibold">{product.bsr}</span>
            </div>
          )}
          {product.monthly_sales && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Ventes/mois</span>
              <span className="font-semibold">{product.monthly_sales}</span>
            </div>
          )}
          {product.private_label && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Private Label</span>
              <Badge variant={product.private_label === 'PL' ? 'destructive' : 'secondary'}>
                {product.private_label}
              </Badge>
            </div>
          )}
          {product.size && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Taille</span>
              <span className="font-semibold">{product.size}</span>
            </div>
          )}
          {product.meltable && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Meltable</span>
              <Badge variant={product.meltable === 'Yes' ? 'destructive' : 'secondary'}>
                {product.meltable}
              </Badge>
            </div>
          )}
          {product.variations && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Variations</span>
              <span className="font-semibold">{product.variations}</span>
            </div>
          )}
          {product.sellers && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Sellers</span>
              <span className="font-semibold">{product.sellers}</span>
            </div>
          )}
        </div>

        {/* Profit Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FBM */}
          {product.fbm_profit && product.fbm_roi && (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-500">FBM 🔹</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Profit</span>
                  <span className="text-lg font-bold text-green-500">{product.fbm_profit}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">ROI</span>
                  <span className="text-lg font-bold text-primary">{product.fbm_roi}</span>
                </div>
              </div>
            </div>
          )}

          {/* FBA */}
          {product.fba_profit && product.fba_roi && (
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-500">FBA 📦</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Profit</span>
                  <span className="text-lg font-bold text-green-500">{product.fba_profit}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">ROI</span>
                  <span className="text-lg font-bold text-primary">{product.fba_roi}</span>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Links */}
        <div className="flex flex-wrap gap-3">
          {product.amazon_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={product.amazon_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Amazon
              </a>
            </Button>
          )}
          {product.ibood_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={product.ibood_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                iBood
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
