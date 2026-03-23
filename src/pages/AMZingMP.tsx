import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useMP } from '@/hooks/use-mp';
import { Search } from 'lucide-react';
import SearchBar from '@/components/mp/SearchBar';
import ProductCard from '@/components/mp/ProductCard';
import SearchHistory from '@/components/mp/SearchHistory';

const AMZingMP = () => {
  const { user, isVIP, isLoading } = useAuth();
  const {
    lookups,
    currentResults,
    selectedLookupId,
    isSearching,
    submitLookup,
    loadResults,
    deleteLookup,
    favorites,
    addFavorite,
    removeFavorite,
  } = useMP();

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentResults.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentResults]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isVIP) return <Navigate to="/tarifs" replace />;

  const favoriteAsins = new Set(favorites.map(f => `${f.asin}-${f.country_code}`));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Search className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">AMZing AMP</h1>
            <p className="text-muted-foreground">
              Recherchez un ASIN ou EAN, visualisez les données produit et calculez votre rentabilité instantanément.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Search */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <SearchBar onSearch={submitLookup} isSearching={isSearching} />
            </div>

            {/* History */}
            <SearchHistory
              lookups={lookups}
              selectedId={selectedLookupId}
              onViewResults={loadResults}
              onDelete={deleteLookup}
            />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 space-y-4" ref={resultsRef}>
            {currentResults.length === 0 && !isSearching && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">Aucun résultat</h3>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Recherchez un ASIN ou EAN pour voir les données produit
                </p>
              </div>
            )}

            {currentResults.map(result => (
              <ProductCard
                key={result.id}
                result={result}
                onFavorite={addFavorite}
                isFavorite={favoriteAsins.has(`${result.asin}-${result.country_code}`)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AMZingMP;
