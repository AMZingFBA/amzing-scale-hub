import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type {
  SearchFilters,
  ProductResult,
  ProductSearch,
  SearchPreset,
  SearchResponse,
} from '@/lib/product-search-types';

export function useProductSearch() {
  const { user } = useAuth();
  const [searches, setSearches] = useState<ProductSearch[]>([]);
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [currentResults, setCurrentResults] = useState<ProductResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSearches = useCallback(async () => {
    if (!user) return;
    const { data, error: err } = await supabase
      .from('product_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!err && data) {
      setSearches(data as unknown as ProductSearch[]);
    }
  }, [user]);

  const loadPresets = useCallback(async () => {
    if (!user) return;
    const { data, error: err } = await supabase
      .from('search_presets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!err && data) {
      setPresets(data as unknown as SearchPreset[]);
    }
  }, [user]);

  const submitSearch = useCallback(async (name: string, filters: SearchFilters): Promise<SearchResponse | null> => {
    if (!user) return null;

    setIsSearching(true);
    setError(null);
    setCurrentResults([]);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('product-search', {
        body: { name, filters },
      });

      if (fnError) {
        const errMsg = fnError.message || 'Erreur lors de la recherche';
        setError(errMsg);
        return null;
      }

      const response = data as SearchResponse;

      if (response.error) {
        setError(response.error);
        return response;
      }

      setCurrentResults(response.results || []);
      await loadSearches();
      return response;
    } catch (err: any) {
      const errMsg = err?.message || 'Erreur inattendue';
      setError(errMsg);
      return null;
    } finally {
      setIsSearching(false);
    }
  }, [user, loadSearches]);

  const savePreset = useCallback(async (name: string, filters: SearchFilters) => {
    if (!user) return;

    const { error: err } = await supabase
      .from('search_presets')
      .insert({ user_id: user.id, name, filters: filters as any });

    if (!err) {
      await loadPresets();
    }
    return !err;
  }, [user, loadPresets]);

  const deletePreset = useCallback(async (presetId: string) => {
    const { error: err } = await supabase
      .from('search_presets')
      .delete()
      .eq('id', presetId);

    if (!err) {
      await loadPresets();
    }
  }, [loadPresets]);

  useEffect(() => {
    if (!user) return;

    loadSearches();
    loadPresets();

    const channel = supabase
      .channel(`product-searches-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_searches',
          filter: `user_id=eq.${user.id}`,
        } as any,
        (payload: any) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setSearches(prev => {
              const updated = payload.new as ProductSearch;
              const exists = prev.findIndex(s => s.id === updated.id);
              if (exists >= 0) {
                const next = [...prev];
                next[exists] = updated;
                return next;
              }
              return [updated, ...prev];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadSearches, loadPresets]);

  return {
    searches,
    presets,
    currentResults,
    isSearching,
    error,
    submitSearch,
    savePreset,
    deletePreset,
    loadSearches,
    setCurrentResults,
    setError,
  };
}
