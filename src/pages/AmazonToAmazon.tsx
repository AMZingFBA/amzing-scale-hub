import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Copy, ExternalLink, TrendingUp, Package, Sparkles, RefreshCw, Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface A2AProduct {
  id: string;
  date: string;
  canal: string;
  source: string;
  titre: string;
  pays_achat: string;
  pays_vente: string;
  prix_achat: string;
  prix_vente: string;
  profit: string;
  marge_profit: string;
  roi: string;
  ventes_amazon: string;
  classement: string;
  asin: string;
  offres: string;
  lien_sas: string;
  lien_bbp: string;
  lien_keepa: string;
  lien_idealo: string;
  lien_amazon: string;
  image: string;
  note: string;
}

const parseNumericValue = (value: string): number => {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d.,%-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const { data, error } = await supabase.functions.invoke('sync-a2a-from-sheets');
      clearTimeout(timeoutId);

      if (error) throw error;

      if (data?.success) {
        setAllProducts(data.products || []);
        if (!silent) {
          toast.success(`${data.count} produits chargés`);
        }
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

      // Auto-refresh every 1 minute
      autoSyncRef.current = setInterval(() => {
        fetchProducts(true);
      }, 60 * 1000);

      return () => {
        if (autoSyncRef.current) clearInterval(autoSyncRef.current);
      };
    }
  }, [user, authLoading, isVIP, isAdmin]);

  // Filter by canal
  const filteredProducts = allProducts
    .filter((p) => {
      if (canalFilter && p.canal.toLowerCase() !== canalFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          p.titre.toLowerCase().includes(term) ||
          p.asin.toLowerCase().includes(term) ||
          p.source.toLowerCase().includes(term)
        );
      }
      return true;
    })
    .filter((p) => {
      if (minRoi) {
        const roiVal = parseNumericValue(p.roi);
        return roiVal >= parseFloat(minRoi);
      }
      return true;
    });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return parseNumericValue(b.roi) - parseNumericValue(a.roi);
      case 'profit':
        return parseNumericValue(b.profit) - parseNumericValue(a.profit);
      case 'rank':
        return parseNumericValue(a.classement) - parseNumericValue(b.classement);
      case 'date':
      default:
        return 0; // Already sorted by sheet order (newest first)
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

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!isVIP && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <h2 className="text-xl font-bold text-center">💳 Accès VIP requis</h2>
          </CardHeader>
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary hover:bg-primary/90 p-3 md:p-2 rounded-full shadow-lg transition-all shrink-0"
              aria-label="Retour au dashboard"
            >
              <ArrowLeft className="w-6 h-6 md:w-5 md:h-5 text-white" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2">
                {pageTitle}
              </h1>
              <p className="text-muted-foreground">
                {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
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
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher (titre, ASIN...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              type="number"
              placeholder="ROI min %"
              value={minRoi}
              onChange={(e) => setMinRoi(e.target.value)}
              className="w-28"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Plus récent</SelectItem>
                <SelectItem value="roi">ROI ↓</SelectItem>
                <SelectItem value="profit">Profit ↓</SelectItem>
                <SelectItem value="rank">Classement ↑</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products list */}
        {sortedProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun produit pour le moment</h3>
              <p className="text-muted-foreground">Les produits A2A apparaîtront ici.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {sortedProducts.map((product) => (
              <A2AProductCard
                key={product.id}
                product={product}
                onCopy={copyToClipboard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function A2AProductCard({ product, onCopy }: { product: A2AProduct; onCopy: (text: string) => void }) {
  const roiValue = parseNumericValue(product.roi);
  const roiColor = roiValue >= 30 ? 'bg-green-500' : roiValue >= 15 ? 'bg-orange-500' : 'bg-muted';

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 px-6 py-3 border-b">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg capitalize">{product.canal.replace('-', ' ')}</span>
            {product.pays_achat && product.pays_vente && (
              <Badge variant="outline" className="ml-2">
                {product.pays_achat} → {product.pays_vente}
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{product.date}</span>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Image + Title */}
        <div className="flex gap-4">
          {product.image && (
            <img
              src={product.image}
              alt={product.titre}
              className="w-20 h-20 object-contain rounded-lg border bg-white shrink-0"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold leading-tight line-clamp-2">{product.titre}</h3>
            {product.asin && (
              <div className="flex items-center gap-2 mt-2">
                <code className="bg-muted px-2 py-0.5 rounded font-mono text-xs">{product.asin}</code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onCopy(product.asin)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 p-4 bg-muted/30 rounded-xl">
          {product.prix_achat && (
            <div className="space-y-1 text-center">
              <span className="text-xs text-muted-foreground block">Achat</span>
              <span className="font-semibold text-sm">{product.prix_achat}</span>
            </div>
          )}
          {product.prix_vente && (
            <div className="space-y-1 text-center">
              <span className="text-xs text-muted-foreground block">Vente</span>
              <span className="font-semibold text-sm">{product.prix_vente}</span>
            </div>
          )}
          {product.profit && (
            <div className="space-y-1 text-center">
              <span className="text-xs text-muted-foreground block">Profit</span>
              <span className="font-semibold text-sm text-green-500">{product.profit}</span>
            </div>
          )}
          {product.roi && (
            <div className="space-y-1 text-center">
              <span className="text-xs text-muted-foreground block">ROI</span>
              <Badge className={`${roiColor} text-white`}>{product.roi}</Badge>
            </div>
          )}
          {product.classement && (
            <div className="space-y-1 text-center">
              <span className="text-xs text-muted-foreground block">Rank</span>
              <span className="font-semibold text-sm">{product.classement}</span>
            </div>
          )}
          {product.ventes_amazon && (
            <div className="space-y-1 text-center">
              <span className="text-xs text-muted-foreground block">Ventes</span>
              <span className="font-semibold text-sm">{product.ventes_amazon}</span>
            </div>
          )}
        </div>

        {/* Extra info row */}
        <div className="flex flex-wrap gap-3 text-sm">
          {product.offres && (
            <Badge variant="secondary">
              <Package className="w-3 h-3 mr-1" />
              {product.offres} offres
            </Badge>
          )}
          {product.marge_profit && (
            <Badge variant="secondary">Marge: {product.marge_profit}</Badge>
          )}
          {product.source && (
            <Badge variant="outline">{product.source}</Badge>
          )}
        </div>

        {/* Action links */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {product.lien_amazon && (
            <a href={product.lien_amazon} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="w-3 h-3" /> Amazon
              </Button>
            </a>
          )}
          {product.lien_sas && (
            <a href={product.lien_sas} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="w-3 h-3" /> SAS
              </Button>
            </a>
          )}
          {product.lien_keepa && (
            <a href={product.lien_keepa} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="w-3 h-3" /> Keepa
              </Button>
            </a>
          )}
          {product.lien_idealo && (
            <a href={product.lien_idealo} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="w-3 h-3" /> Idealo
              </Button>
            </a>
          )}
          {product.lien_bbp && (
            <a href={product.lien_bbp} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="w-3 h-3" /> BBP
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
