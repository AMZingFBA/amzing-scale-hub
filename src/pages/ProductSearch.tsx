import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchForm from '@/components/product-search/SearchForm';
import SearchResults from '@/components/product-search/SearchResults';
import SearchHistory from '@/components/product-search/SearchHistory';
import { useProductSearch } from '@/hooks/use-product-search';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { SearchPreset, SearchResponse, SearchFilters } from '@/lib/product-search-types';

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
                {bridgeAvailable === null ? 'Connexion...' : bridgeAvailable ? 'Actorio Live' : 'Mock (demo)'}
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

            {/* Results */}
            {currentResults.length > 0 && (
              <div className="mb-5">
                <SearchResults
                  results={currentResults}
                  cacheHit={lastResponse?.cache_hit}
                  processingDuration={lastResponse?.processing_duration_ms}
                  resultsCount={lastResponse?.results_count}
                />
              </div>
            )}

            {/* History */}
            <SearchHistory searches={searches} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductSearch;
