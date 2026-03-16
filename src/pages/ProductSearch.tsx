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
    setCurrentResults,
    setError,
  } = useProductSearch();

  const [lastResponse, setLastResponse] = useState<SearchResponse | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers les résultats quand ils apparaissent
  useEffect(() => {
    if (currentResults.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentResults]);

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

  const handleViewResults = useCallback(async (search: ProductSearchType) => {
    // Try loading from search_results_cache first
    const { data: cached } = await supabase
      .from('search_results_cache')
      .select('results, results_count')
      .eq('filters_hash', search.filters_hash)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cached && Array.isArray((cached as any).results)) {
      setCurrentResults((cached as any).results);
      setLastResponse({
        search_id: search.id,
        status: 'completed',
        cache_hit: true,
        results: (cached as any).results,
        results_count: (cached as any).results_count || (cached as any).results.length,
        processing_duration_ms: search.processing_duration_ms || 0,
      });
      toast.success(`${(cached as any).results.length} résultats chargés`);
      return;
    }

    // Fallback: check results_summary.results
    const summary = search.results_summary as any;
    if (summary && Array.isArray(summary.results) && summary.results.length > 0) {
      setCurrentResults(summary.results);
      setLastResponse({
        search_id: search.id,
        status: 'completed',
        cache_hit: false,
        results: summary.results,
        results_count: summary.results.length,
        processing_duration_ms: search.processing_duration_ms || 0,
      });
      toast.success(`${summary.results.length} résultats chargés`);
      return;
    }

    toast.error('Les résultats de cette recherche ne sont plus disponibles');
  }, [setCurrentResults]);

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
              <div className="mb-5" ref={resultsRef}>
                <SearchResults
                  results={currentResults}
                  cacheHit={lastResponse?.cache_hit}
                  processingDuration={lastResponse?.processing_duration_ms}
                  resultsCount={lastResponse?.results_count}
                />
              </div>
            )}

            {/* History */}
            <SearchHistory searches={searches} onViewResults={handleViewResults} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductSearch;
