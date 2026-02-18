import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Sparkles, RefreshCw, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { A2AProductCard, parseNumericValue } from '@/components/a2a/A2AProductCard';
import type { A2AProduct } from '@/components/a2a/A2AProductCard';

const CANAL_MAP: Record<string, string> = {
  'a2a-france-medium': 'france-medium',
  'a2a-france-high': 'france-high',
  'a2a-allemagne': 'allemagne',
  'a2a-espagne': 'espagne',
  'a2a-italie': 'italie',
};

const CANAL_TITLES: Record<string, string> = {
  'a2a-france-medium': 'A2A France Medium',
  'a2a-france-high': 'A2A France High',
  'a2a-allemagne': 'A2A Allemagne',
  'a2a-espagne': 'A2A Espagne',
  'a2a-italie': 'A2A Italie',
};

export default function AmazonToAmazon() {
  const navigate = useNavigate();
  const location = useLocation();
  const { source } = useParams<{ source?: string }>();
  const { user, isLoading: authLoading, isVIP } = useAuth();
  const { isAdmin } = useAdmin();
  const [allProducts, setAllProducts] = useState<A2AProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [previousCount, setPreviousCount] = useState<number | null>(null);
  const [newCount, setNewCount] = useState(0);
  const autoSyncRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useScrollPosition(location.pathname);

  const canalFilter = source ? CANAL_MAP[source] : null;
  const pageTitle = source ? CANAL_TITLES[source] || 'Amazon to Amazon' : 'Amazon to Amazon';

  const fetchProducts = useCallback(async (silent = false) => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-a2a-from-sheets');
      if (error) throw error;
      if (data?.success) {
        const products = data.products || [];
        
        // Calculate new alerts count
        if (previousCount !== null && products.length > previousCount) {
          setNewCount(products.length - previousCount);
        }
        setPreviousCount(products.length);
        
        setAllProducts(products);
        if (!silent) toast.success(`${data.count} produits chargés`);
      } else {
        throw new Error(data?.error || 'Fetch failed');
      }
    } catch (error: any) {
      console.error('A2A fetch error:', error);
      if (!silent && error?.name !== 'AbortError') {
        toast.error('Erreur lors du chargement des produits A2A');
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

  const filteredProducts = allProducts
    .filter((p) => {
      if (canalFilter && p.canal.toLowerCase() !== canalFilter) return false;
      return true;
    });

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
                {pageTitle}
              </h1>
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
        {filteredProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun produit</h3>
              <p className="text-muted-foreground">Les produits A2A apparaîtront ici.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredProducts.map((product) => (
              <A2AProductCard key={product.id} product={product} onCopy={copyToClipboard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
