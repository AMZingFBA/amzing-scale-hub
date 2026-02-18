import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Search, SlidersHorizontal, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [minRoi, setMinRoi] = useState('');
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
        setAllProducts(data.products || []);
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
  }, [isSyncing]);

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
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return p.titre.toLowerCase().includes(term) || p.asin.toLowerCase().includes(term) || p.source.toLowerCase().includes(term);
      }
      return true;
    })
    .filter((p) => {
      if (minRoi) return parseNumericValue(p.roi) >= parseFloat(minRoi);
      return true;
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'roi': return parseNumericValue(b.roi) - parseNumericValue(a.roi);
      case 'profit': return parseNumericValue(b.profit) - parseNumericValue(a.profit);
      case 'rank': return parseNumericValue(a.classement) - parseNumericValue(b.classement);
      default: return 0;
    }
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
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
              <p className="text-sm text-muted-foreground">
                {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}
              </p>
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

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-9 text-sm" />
            </div>
            <Input type="number" placeholder="ROI min %" value={minRoi} onChange={(e) => setMinRoi(e.target.value)} className="w-24 h-9 text-sm" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 h-9 text-sm">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Récent</SelectItem>
                <SelectItem value="roi">ROI ↓</SelectItem>
                <SelectItem value="profit">Profit ↓</SelectItem>
                <SelectItem value="rank">Rank ↑</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products */}
        {sortedProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun produit</h3>
              <p className="text-muted-foreground">Les produits A2A apparaîtront ici.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedProducts.map((product) => (
              <A2AProductCard key={product.id} product={product} onCopy={copyToClipboard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
