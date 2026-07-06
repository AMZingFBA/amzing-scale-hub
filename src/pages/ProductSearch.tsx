import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchForm from '@/components/product-search/SearchForm';
import SearchResults from '@/components/product-search/SearchResults';
import SearchHistory from '@/components/product-search/SearchHistory';
import { useProductSearch } from '@/hooks/use-product-search';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { SearchPreset, SearchResponse, SearchFilters, ProductSearch as ProductSearchType } from '@/lib/product-search-types';
import { toast } from 'sonner';

const ProductSearch = () => {
  const { user, isVIP, isLoading } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const {
    searches,
    presets,
    currentResults,
    isSearching,
    error,
    bridgeAvailable,
    submitSearch,
    savePreset,
    deletePreset,
    deleteSearch,
    renameSearch,
    setCurrentResults,
    setError,
  } = useProductSearch();

  const [lastResponse, setLastResponse] = useState<SearchResponse | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers les résultats quand ils apparaissent.
  // requestAnimationFrame garantit que le DOM des résultats est peint AVANT le scroll,
  // sinon on peut scroller vers une position obsolète.
  useEffect(() => {
    if (currentResults.length > 0 && resultsRef.current) {
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [currentResults]);

  const handleViewResults = useCallback(async (search: ProductSearchType) => {
    // Reset immediately so the user gets visual feedback that something is happening
    setCurrentResults([]);
    setLastResponse(null);

    // Normalize results shape: Older cached rows or edge-function outputs may lack
    // the fields SearchResults expects (id, price, marketplace, ...). Remap so the
    // table always has something to render.
    const normalize = (raw: any[], marketplace?: string): any[] =>
      (Array.isArray(raw) ? raw : []).map((item: any) => ({
        id:               item.id ?? crypto.randomUUID(),
        title:            item.title || '',
        asin:             item.asin || '',
        ean:              item.ean || '',
        image_url:        item.image_url || '',
        price:            item.price ?? item.amazon_price ?? item.sale_price ?? 0,
        sale_price:       item.sale_price ?? item.amazon_price ?? item.price ?? 0,
        roi:              Number(item.roi ?? 0),
        margin:           Number(item.margin ?? 0),
        profit:           Number(item.profit ?? 0),
        monthly_sales:    Number(item.monthly_sales ?? 0),
        monthly_profit:   Number(item.monthly_profit ?? 0),
        bsr:              Number(item.bsr ?? 0),
        category:         item.category || '',
        brand:            item.brand || '',
        marketplace:      item.marketplace || marketplace || 'amazon.fr',
        supplier:         item.supplier || '',
        supplier_price:   Number(item.supplier_price ?? 0),
        supplier_price_ht: !!item.supplier_price_ht,
        supplier_url:     item.supplier_url || '',
        amazon_url:       item.amazon_url || '',
        keepa_url:        item.keepa_url || '',
        keepa_b64:        item.keepa_b64 || '',
        correspondance:   item.correspondance || '',
        competition_level: item.competition_level || '',
        source:           item.source || 'actorio',
        found_at:         item.found_at || new Date().toISOString(),
      }));

    // Try loading from search_results_cache first
    const { data: cached } = await supabase
      .from('search_results_cache')
      .select('results, results_count')
      .eq('filters_hash', search.filters_hash)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const mp = (search.filters as any)?.marketplace;

    if (cached && Array.isArray((cached as any).results) && (cached as any).results.length > 0) {
      const normalized = normalize((cached as any).results, mp);
      setCurrentResults(normalized);
      setLastResponse({
        search_id: search.id,
        status: 'completed',
        cache_hit: true,
        results: normalized,
        results_count: (cached as any).results_count || normalized.length,
        processing_duration_ms: search.processing_duration_ms || 0,
      });
      toast.success(`${normalized.length} résultats chargés`);
      return;
    }

    // Fallback: check results_summary.results
    const summary = search.results_summary as any;
    if (summary && Array.isArray(summary.results) && summary.results.length > 0) {
      const normalized = normalize(summary.results, mp);
      setCurrentResults(normalized);
      setLastResponse({
        search_id: search.id,
        status: 'completed',
        cache_hit: false,
        results: normalized,
        results_count: normalized.length,
        processing_duration_ms: search.processing_duration_ms || 0,
      });
      toast.success(`${normalized.length} résultats chargés`);
      return;
    }

    toast.error('Les résultats de cette recherche ne sont plus disponibles');
  }, [setCurrentResults]);

  if (isLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isVIP && !isAdmin) return <Navigate to="/" replace />;

  const handleSubmit = async (filters: SearchFilters) => {
    setError(null);
    const response = await submitSearch(filters);
    if (response) setLastResponse(response);
  };

  const handleLoadPreset = (preset: SearchPreset) => {
    setCurrentResults([]);
    setLastResponse(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Search className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Recherche de produits</h1>
              <Badge
                variant={bridgeAvailable ? 'default' : 'secondary'}
                className={`ml-auto text-xs ${bridgeAvailable ? 'bg-green-600' : ''}`}
              >
                {bridgeAvailable === null ? 'Connexion...' : bridgeAvailable ? 'En direct' : 'En ligne'}
              </Badge>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Search form */}
            <div className="mb-5">
              <SearchForm
                onSubmit={handleSubmit}
                onSavePreset={savePreset}
                presets={presets}
                onLoadPreset={handleLoadPreset}
                onDeletePreset={deletePreset}
                isSearching={isSearching}
              />
            </div>

            {/* Indicateur de progrès pendant la recherche */}
            {isSearching && (
              <div className="mb-5 p-6 rounded-lg border bg-card text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-lg font-semibold">Recherche en cours...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Récupération des produits via notre moteur de recherche. Cela prend généralement 1 à 2 minutes.
                </p>
              </div>
            )}

            {/* Results */}
            {currentResults.length > 0 && (
              <div className="mb-5 scroll-mt-24" ref={resultsRef}>
                <SearchResults
                  results={currentResults}
                  cacheHit={lastResponse?.cache_hit}
                  processingDuration={lastResponse?.processing_duration_ms}
                  resultsCount={lastResponse?.results_count}
                />
              </div>
            )}

            {/* History */}
            <SearchHistory
              searches={searches}
              onViewResults={handleViewResults}
              onDelete={deleteSearch}
              onRename={renameSearch}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductSearch;
