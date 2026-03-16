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
import { SUPPLIER_OPTIONS } from '@/lib/product-search-types';

const USE_EDGE_FUNCTION = false;
const ACTORIO_BRIDGE_URL = 'http://localhost:3456';

function generateFiltersHash(filters: SearchFilters): string {
  const normalized = JSON.stringify(
    Object.keys(filters)
      .sort()
      .reduce((acc: any, key: string) => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null && value !== '' &&
            !(Array.isArray(value) && value.length === 0)) {
          acc[key] = Array.isArray(value) ? [...value].sort() : value;
        }
        return acc;
      }, {})
  );
  return btoa(normalized).replace(/[^a-zA-Z0-9]/g, '').substring(0, 64);
}

function generateMockResults(filters: SearchFilters): ProductResult[] {
  const categories = ['Electronics', 'Toys', 'Home & Kitchen', 'Sports', 'Beauty', 'Books', 'Garden'];
  const brands = ['Samsung', 'Sony', 'Philips', 'Bosch', 'Braun', 'LEGO', 'Hasbro', 'Nike', 'Adidas'];
  const suppliers = filters.suppliers?.length ? filters.suppliers : SUPPLIER_OPTIONS;
  const marketplace = filters.marketplace || 'amazon.fr';

  const count = 8 + Math.floor(Math.random() * 30);
  const results: ProductResult[] = [];

  for (let i = 0; i < count; i++) {
    const supplierPrice = (filters.supplier_price_min || 5) + Math.random() * ((filters.supplier_price_max || 80) - (filters.supplier_price_min || 5));
    const amazonPrice = (filters.amazon_price_min || 15) + Math.random() * ((filters.amazon_price_max || 250) - (filters.amazon_price_min || 15));
    const profit = amazonPrice - supplierPrice - (amazonPrice * 0.15);
    const roi = supplierPrice > 0 ? (profit / supplierPrice) * 100 : 0;
    const margin = amazonPrice > 0 ? (profit / amazonPrice) * 100 : 0;
    const bsr = Math.floor(Math.random() * (filters.bsr_max || 100000));
    const monthlySales = (filters.monthly_sales_min || 5) + Math.floor(Math.random() * 500);
    const monthlyProfit = profit * monthlySales;
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const category = filters.category || categories[Math.floor(Math.random() * categories.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];

    if (filters.roi_min && roi < filters.roi_min) continue;
    if (filters.roi_max && roi > filters.roi_max) continue;
    if (filters.unit_profit_min && profit < filters.unit_profit_min) continue;
    if (filters.unit_profit_max && profit > filters.unit_profit_max) continue;
    if (filters.monthly_profit_min && monthlyProfit < filters.monthly_profit_min) continue;
    if (filters.monthly_profit_max && monthlyProfit > filters.monthly_profit_max) continue;
    if (filters.monthly_sales_max && monthlySales > filters.monthly_sales_max) continue;

    results.push({
      id: crypto.randomUUID(),
      title: `${brand} ${filters.keywords || 'Product'} ${category} #${i + 1}`,
      asin: `B0${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      ean: `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      price: Math.round(amazonPrice * 100) / 100,
      sale_price: Math.round(amazonPrice * 1.1 * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      margin: Math.round(margin * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      monthly_sales: monthlySales,
      monthly_profit: Math.round(monthlyProfit * 100) / 100,
      bsr,
      category,
      brand,
      marketplace,
      supplier,
      supplier_price: Math.round(supplierPrice * 100) / 100,
      competition_level: bsr < 10000 ? 'high' : bsr < 50000 ? 'medium' : 'low',
      source: 'mock',
      found_at: new Date().toISOString(),
    });
  }

  return results;
}

export function useProductSearch() {
  const { user } = useAuth();
  const [searches, setSearches] = useState<ProductSearch[]>([]);
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [currentResults, setCurrentResults] = useState<ProductResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bridgeAvailable, setBridgeAvailable] = useState<boolean | null>(null);

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

  const submitSearchLocal = useCallback(async (filters: SearchFilters): Promise<SearchResponse | null> => {
    if (!user) return null;

    const startTime = Date.now();
    const filtersHash = generateFiltersHash(filters);

    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

    const results = generateMockResults(filters);
    const processingDuration = Date.now() - startTime;

    const autoName = [
      filters.marketplace || 'amazon.fr',
      filters.suppliers?.join(', '),
      filters.roi_min ? `ROI>${filters.roi_min}%` : null,
      filters.keywords,
    ].filter(Boolean).join(' - ') || 'Recherche';

    await supabase
      .from('product_searches')
      .insert({
        user_id: user.id,
        name: autoName.substring(0, 200),
        filters: filters as any,
        filters_hash: filtersHash,
        status: 'completed',
        provider: 'mock',
        results_count: results.length,
        cache_hit: false,
        processing_duration_ms: processingDuration,
        results_summary: results.length > 0 ? {
          avg_roi: Math.round(results.reduce((s, r) => s + r.roi, 0) / results.length * 100) / 100,
          avg_margin: Math.round(results.reduce((s, r) => s + r.margin, 0) / results.length * 100) / 100,
          avg_price: Math.round(results.reduce((s, r) => s + r.price, 0) / results.length * 100) / 100,
        } as any : null,
      } as any);

    const response: SearchResponse = {
      search_id: crypto.randomUUID(),
      status: 'completed',
      cache_hit: false,
      results,
      results_count: results.length,
      processing_duration_ms: processingDuration,
    };

    setCurrentResults(results);
    await loadSearches();
    return response;
  }, [user, loadSearches]);

  const submitSearchActorio = useCallback(async (filters: SearchFilters): Promise<SearchResponse | null> => {
    if (!user) return null;

    const startTime = Date.now();
    const filtersHash = generateFiltersHash(filters);

    const res = await fetch(`${ACTORIO_BRIDGE_URL}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || 'Erreur bridge Actorio');
    }

    const results: ProductResult[] = (data.results || []).map((item: any) => ({
      id: crypto.randomUUID(),
      title: item.title || '',
      asin: item.asin || '',
      ean: item.ean || '',
      image_url: item.image_url || '',
      price: item.amazon_price || 0,
      sale_price: item.amazon_price || 0,
      roi: item.roi || 0,
      margin: item.margin || 0,
      profit: item.profit || 0,
      monthly_sales: item.monthly_sales || 0,
      monthly_profit: item.monthly_profit || 0,
      bsr: item.bsr || 0,
      category: item.category || '',
      brand: item.brand || '',
      marketplace: filters.marketplace || 'amazon.fr',
      supplier: item.supplier || '',
      supplier_price: item.supplier_price || 0,
      competition_level: item.competition_level || '',
      source: 'actorio',
      found_at: new Date().toISOString(),
    }));

    const processingDuration = Date.now() - startTime;

    const autoName = [
      filters.marketplace || 'amazon.fr',
      filters.suppliers?.slice(0, 3).join(', '),
      filters.roi_min ? `ROI>${filters.roi_min}%` : null,
    ].filter(Boolean).join(' - ') || 'Recherche Actorio';

    await supabase
      .from('product_searches')
      .insert({
        user_id: user.id,
        name: autoName.substring(0, 200),
        filters: filters as any,
        filters_hash: filtersHash,
        status: 'completed',
        provider: 'actorio',
        results_count: results.length,
        cache_hit: false,
        processing_duration_ms: processingDuration,
        results_summary: results.length > 0 ? {
          avg_roi: Math.round(results.reduce((s, r) => s + r.roi, 0) / results.length * 100) / 100,
          avg_margin: Math.round(results.reduce((s, r) => s + r.margin, 0) / results.length * 100) / 100,
          avg_price: Math.round(results.reduce((s, r) => s + r.price, 0) / results.length * 100) / 100,
        } as any : null,
      } as any);

    setCurrentResults(results);
    await loadSearches();

    return {
      search_id: crypto.randomUUID(),
      status: 'completed',
      cache_hit: false,
      results,
      results_count: results.length,
      processing_duration_ms: processingDuration,
    };
  }, [user, loadSearches]);

  const submitSearchRemote = useCallback(async (filters: SearchFilters): Promise<SearchResponse | null> => {
    if (!user) return null;

    const autoName = [
      filters.marketplace || 'amazon.fr',
      filters.roi_min ? `ROI>${filters.roi_min}%` : null,
    ].filter(Boolean).join(' - ') || 'Recherche';

    const { data, error: fnError } = await supabase.functions.invoke('product-search', {
      body: { name: autoName, filters },
    });

    if (fnError) {
      setError(fnError.message || 'Erreur lors de la recherche');
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
  }, [user, loadSearches]);

  // Queue-based search: works for all members on amzingfba.com.
  // Inserts a 'pending' row into Supabase; the bridge (running on the owner's Mac)
  // picks it up, scrapes Actorio, stores results in search_results_cache, and marks
  // the row 'completed'. Supabase Realtime then notifies the frontend automatically.
  const submitSearchQueue = useCallback(async (filters: SearchFilters): Promise<SearchResponse | null> => {
    if (!user) return null;

    const filtersHash = generateFiltersHash(filters);
    const autoName = [
      filters.marketplace || 'amazon.fr',
      filters.suppliers?.slice(0, 3).join(', '),
      filters.roi_min ? `ROI>${filters.roi_min}%` : null,
      filters.keywords,
    ].filter(Boolean).join(' - ') || 'Recherche Actorio';

    // Insert the search as pending — the bridge will pick it up
    const { data: newSearch, error: insertErr } = await supabase
      .from('product_searches')
      .insert({
        user_id: user.id,
        name: autoName.substring(0, 200),
        filters: filters as any,
        filters_hash: filtersHash,
        status: 'pending',
        provider: 'actorio',
      } as any)
      .select()
      .single();

    if (insertErr || !newSearch) {
      throw new Error(insertErr?.message || 'Impossible de créer la recherche');
    }

    const searchId = (newSearch as any).id;
    console.log('[search] Queued search:', searchId);

    // Poll Supabase every 5 s until the bridge marks it completed (max 5 min)
    const deadline = Date.now() + 5 * 60_000;
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 5000));

      const { data: record } = await supabase
        .from('product_searches')
        .select('id, status, error_message, filters_hash, results_count, processing_duration_ms, results_summary')
        .eq('id', searchId)
        .single();

      if (!record) continue;
      const rec = record as any;

      if (rec.status === 'completed') {
        // Read results from results_summary (embedded by bridge in bridge_complete_search)
        const summary = rec.results_summary as any;
        const results: ProductResult[] = Array.isArray(summary?.results) ? summary.results : [];
        setCurrentResults(results);
        await loadSearches();

        return {
          search_id: rec.id,
          status: 'completed',
          cache_hit: false,
          results,
          results_count: results.length,
          processing_duration_ms: rec.processing_duration_ms || 0,
        };
      }

      if (rec.status === 'error') {
        throw new Error(rec.error_message || 'La recherche a échoué côté serveur');
      }
      // else still 'pending' or 'processing' — keep polling
    }

    throw new Error('Timeout : la recherche a pris plus de 5 minutes');
  }, [user, loadSearches]);

  const submitSearch = useCallback(async (filters: SearchFilters): Promise<SearchResponse | null> => {
    if (!user) return null;

    setIsSearching(true);
    setError(null);
    setCurrentResults([]);

    try {
      // Dev mode: bridge running on same machine as browser — call directly
      if (bridgeAvailable) {
        return await submitSearchActorio(filters);
      }
      // Queue the search via Supabase — the bridge picks it up.
      // If the bridge doesn't respond within 30s, fall back to the edge function.
      try {
        const queueResult = await Promise.race([
          submitSearchQueue(filters),
          new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error('__QUEUE_TIMEOUT__')), 30_000)
          ),
        ]);
        return queueResult;
      } catch (queueErr: any) {
        if (queueErr?.message === '__QUEUE_TIMEOUT__') {
          console.log('[search] Queue timeout — fallback vers edge function');
          return await submitSearchRemote(filters);
        }
        throw queueErr;
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur inattendue');
      return null;
    } finally {
      setIsSearching(false);
    }
  }, [user, bridgeAvailable, submitSearchActorio, submitSearchQueue]);

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

    // Check if Actorio Bridge is running
    fetch(`${ACTORIO_BRIDGE_URL}/api/status`)
      .then(res => res.json())
      .then(data => {
        setBridgeAvailable(data.ready === true);
        if (data.ready) console.log('[search] Actorio Bridge connecté');
      })
      .catch(() => {
        setBridgeAvailable(false);
        console.log('[search] Actorio Bridge non disponible, mode mock');
      });

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
    bridgeAvailable,
    submitSearch,
    savePreset,
    deletePreset,
    loadSearches,
    setCurrentResults,
    setError,
  };
}
