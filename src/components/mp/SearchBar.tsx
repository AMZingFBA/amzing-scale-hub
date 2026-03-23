import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Loader2, List } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const SearchBar = ({ onSearch, isSearching }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [batchMode, setBatchMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isSearching) return;
    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !batchMode && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2">
        <Toggle
          pressed={batchMode}
          onPressedChange={setBatchMode}
          size="sm"
          aria-label="Mode batch"
          className="shrink-0"
        >
          <List className="h-4 w-4 mr-1" />
          Batch
        </Toggle>
      </div>

      {batchMode ? (
        <Textarea
          placeholder="Entrez vos ASINs (un par ligne ou séparés par des virgules)&#10;Ex: B09QW4RL4W, B08N5WRWNW"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          className="font-mono text-sm"
        />
      ) : (
        <Input
          placeholder="Entrez un ASIN ou EAN (ex: B09QW4RL4W)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="font-mono text-sm"
        />
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!query.trim() || isSearching}
      >
        {isSearching ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Recherche en cours...
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </>
        )}
      </Button>
    </form>
  );
};

export default SearchBar;
