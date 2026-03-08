import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Copy, ExternalLink, Sparkles, RefreshCw, Bell, Store, Trash2, Clock } from 'lucide-react';
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
  variations: string | null;
  ip: string | null;
  hazmat: string | null;
  meltable: string | null;
  adult: string | null;
  fragile: string | null;
  oversize: string | null;
  restriction: string | null;
  raw_alerts: string | null;
  nb_vendors: string | null;
  nb_fba: string | null;
  nb_fbm: string | null;
  amazon_url: string | null;
  ibood_url: string | null;
  chart_url: string | null;
  created_at: string | null;
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

  // Fast load from DB (product_find_alerts table)
  const extractAsin = (url: string | null): string | null => {
    if (!url) return null;
    const match = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
    return match?.[1] || null;
  };

  const loadFromDB = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('product_find_alerts')
        .select('id, product_title, ean, amazon_url, source_url, bsr, monthly_sales, sellers, sale_price, current_price, fba_profit, fba_roi, profit, roi, private_label, meltable, variations, created_at')
        .eq('source_name', 'iBood')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const mapped: IboodProduct[] = (data || []).map((row) => {
        const asin = extractAsin(row.amazon_url);
        return {
          id: row.id,
          product_name: row.product_title,
          ean: row.ean,
          asin,
          bsr: row.bsr,
          cost: row.current_price ? `${row.current_price}€` : null,
          sale_price: row.sale_price ? String(row.sale_price) : null,
          monthly_sales: row.monthly_sales,
          fba_profit: row.fba_profit ? `€ ${row.fba_profit}` : null,
          fba_roi: row.fba_roi ? `${row.fba_roi}%` : null,
          fbm_profit: row.profit ? `€ ${row.profit}` : null,
          fbm_roi: row.roi ? `${row.roi}%` : null,
          private_label: row.private_label,
          variations: row.variations,
          ip: null,
          hazmat: null,
          meltable: row.meltable,
          adult: null,
          fragile: null,
          oversize: null,
          restriction: null,
          raw_alerts: null,
          nb_vendors: row.sellers,
          nb_fba: null,
          nb_fbm: null,
          amazon_url: row.amazon_url,
          ibood_url: row.source_url,
          chart_url: asin ? `https://graph.keepa.com/pricehistory.png?asin=${asin}&domain=fr&salesrank=1&bb=1&range=90` : null,
          created_at: row.created_at,
        };
      });

      if (previousCount !== null && mapped.length > previousCount) {
        setNewCount(mapped.length - previousCount);
      }
      setPreviousCount(mapped.length);
      setProducts(mapped);
    } catch (err) {
      console.error('DB load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [previousCount]);

  // Background sync from sheets (non-blocking)
  const syncFromSheets = useCallback(async (silent = true) => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-ibood-from-sheets');
      if (error) throw error;
      if (!silent) toast.success(`${data?.count || 0} produits iBood synchronisés`);
      // Reload from DB after sync
      await loadFromDB();
    } catch (error: any) {
      console.error('iBood sync error:', error);
      if (!silent) toast.error('Erreur lors de la synchronisation');
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, loadFromDB]);

  useEffect(() => {
    if (!authLoading && user && (isVIP || isAdmin)) {
      // Fast: load from DB immediately
      loadFromDB();
      // Then sync in background
      syncFromSheets(true);
      // Auto-sync every 60s
      autoSyncRef.current = setInterval(() => syncFromSheets(true), 60 * 1000);

      // Mark ibood alerts as read
      supabase.rpc('mark_alerts_as_read', {
        category_param: 'produits',
        subcategory_param: 'produits-ibood'
      });

      return () => { if (autoSyncRef.current) clearInterval(autoSyncRef.current); };
    }
  }, [user, authLoading, isVIP, isAdmin]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié !');
  };

  const deleteProduct = async (productId: string) => {
    const { error } = await supabase
      .from('product_find_alerts')
      .delete()
      .eq('id', productId);
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Produit supprimé');
    }
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
              onClick={() => syncFromSheets(false)}
              disabled={isSyncing}
              className="shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

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
              <IboodProductCard key={product.id} product={product} onCopy={copyToClipboard} onDelete={isAdmin ? deleteProduct : undefined} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDateTime(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' à ' +
      d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return null;
  }
}

function IboodProductCard({ product, onCopy, onDelete }: { product: IboodProduct; onCopy: (text: string) => void; onDelete?: (id: string) => void }) {
  const keepaChartUrl = product.asin
    ? `https://graph.keepa.com/pricehistory.png?asin=${product.asin}&domain=fr&salesrank=1&bb=1&range=90`
    : null;

  const hasAlertFlags = product.private_label || product.ip || product.hazmat || product.meltable || product.adult || product.fragile || product.oversize || product.restriction;

  const dateTime = formatDateTime(product.created_at);

  return (
    <Card className="overflow-hidden border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
      <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-primary">iBood</span>
          {dateTime && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground ml-2">
              <Clock className="w-3 h-3" />
              {dateTime}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {product.ean && product.ean !== 'N/A' && (
            <button
              onClick={() => onCopy(product.ean)}
              className="flex items-center gap-1.5 bg-muted hover:bg-muted/80 px-2.5 py-1 rounded-md transition-colors"
            >
              <code className="font-mono text-xs">{product.ean}</code>
              <Copy className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-base font-semibold leading-snug mb-2">{product.product_name}</h3>
          {hasAlertFlags && (
            <div className="flex flex-wrap gap-1.5">
              {product.private_label && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">PL</Badge>}
              {product.ip && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">IP</Badge>}
              {product.hazmat && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Hazmat</Badge>}
              {product.meltable && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Meltable</Badge>}
              {product.adult && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Adult</Badge>}
              {product.fragile && <Badge className="bg-amber-500/90 text-white text-[10px] px-1.5 py-0">Fragile</Badge>}
              {product.oversize && <Badge className="bg-amber-500/90 text-white text-[10px] px-1.5 py-0">Oversize</Badge>}
              {product.restriction && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Restricted</Badge>}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-3 min-w-0">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 p-2.5 bg-muted/20 rounded-lg text-sm">
              {product.cost && (
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-wide">Coût</span>
                  <span className="font-bold text-sm">{product.cost}</span>
                </div>
              )}
              {product.sale_price && (
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-wide">Prix vente</span>
                  <span className="font-bold text-sm text-green-500">{product.sale_price} €</span>
                </div>
              )}
              {product.bsr && (
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-wide">BSR</span>
                  <span className="font-semibold text-sm">{product.bsr}</span>
                </div>
              )}
              {product.monthly_sales && (
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-wide">Ventes/mo</span>
                  <span className="font-semibold text-sm">{product.monthly_sales}</span>
                </div>
              )}
              {product.nb_vendors && (
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-wide">Vendeurs</span>
                  <span className="font-semibold text-sm">{product.nb_vendors}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {product.fbm_profit && product.fbm_roi && (
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide block mb-1">FBM 🔹</span>
                  <div className="flex items-baseline gap-3">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Profit</span>
                      <span className="text-sm font-bold text-green-500">{product.fbm_profit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">ROI</span>
                      <span className="text-sm font-bold text-primary">{product.fbm_roi}</span>
                    </div>
                  </div>
                </div>
              )}
              {product.fba_profit && product.fba_roi && (
                <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wide block mb-1">FBA 📦</span>
                  <div className="flex items-baseline gap-3">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Profit</span>
                      <span className="text-sm font-bold text-green-500">{product.fba_profit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">ROI</span>
                      <span className="text-sm font-bold text-primary">{product.fba_roi}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {product.amazon_url && (
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <a href={product.amazon_url} target="_blank" rel="noopener noreferrer" className="gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Amazon
                  </a>
                </Button>
              )}
              {product.ibood_url && (
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <a href={product.ibood_url} target="_blank" rel="noopener noreferrer" className="gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    iBood
                  </a>
                </Button>
              )}
            </div>
          </div>

          {keepaChartUrl && (
            <div className="w-full md:w-[340px] lg:w-[400px] shrink-0 rounded-lg overflow-hidden border bg-white flex items-center justify-center p-2 self-start">
              <img
                src={keepaChartUrl}
                alt={`Graphique Keepa – ${product.product_name}`}
                className="w-full h-auto object-contain"
                style={{ maxHeight: '360px' }}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
