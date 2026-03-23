import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export interface MPProfile {
  id: string;
  name: string;
  country_code: string;
  vat_rate: number;
  prep_cost: number;
  inbound_cost: number;
  custom_margin: number;
  is_default: boolean;
}

export interface MPLookup {
  id: string;
  query_type: 'single' | 'batch';
  query_input: string;
  country_code: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error_message: string | null;
  processing_ms: number | null;
  results_count: number;
  created_at: string;
}

export interface MPResult {
  id: string;
  lookup_id: string;
  asin: string;
  ean: string | null;
  product_name: string | null;
  image_url: string | null;
  category: string | null;
  bsr: number | null;
  sales_monthly: number | null;
  sell_price: number | null;
  amazon_price: number | null;
  fba_price: number | null;
  fba_fee: number | null;
  commission_pct: number | null;
  commission_eur: number | null;
  closing_fee: number | null;
  profit_fba: number | null;
  roi_fba: number | null;
  profit_fbm: number | null;
  roi_fbm: number | null;
  fba_sellers: number | null;
  fbm_sellers: number | null;
  variations: number | null;
  alerts: string | null;
  buy_price: number | null;
  country_code: string;
  amazon_url: string | null;
  keepa_data: any;
  created_at: string;
}

export interface MPFavorite {
  id: string;
  asin: string;
  country_code: string;
  product_name: string | null;
  image_url: string | null;
  notes: string | null;
  created_at: string;
}

const COUNTRY_OPTIONS = [
  { code: 'FR', label: 'France', vat: 1.20 },
  { code: 'UK', label: 'UK', vat: 1.20 },
  { code: 'DE', label: 'Allemagne', vat: 1.19 },
  { code: 'ES', label: 'Espagne', vat: 1.21 },
  { code: 'IT', label: 'Italie', vat: 1.22 },
];

export { COUNTRY_OPTIONS };

export function useMP() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<MPProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [lookups, setLookups] = useState<MPLookup[]>([]);
  const [currentResults, setCurrentResults] = useState<MPResult[]>([]);
  const [selectedLookupId, setSelectedLookupId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<MPFavorite[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load profiles
  const loadProfiles = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('mp_settings_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (data) {
      const typed = data as any as MPProfile[];
      setProfiles(typed);
      // Auto-select default or first profile
      if (!activeProfileId || !typed.find(p => p.id === activeProfileId)) {
        const def = typed.find(p => p.is_default) || typed[0];
        if (def) setActiveProfileId(def.id);
      }
    }
  }, [user, activeProfileId]);

  // Create default profile if none exists
  const ensureDefaultProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('mp_settings_profiles')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);
    if (!data || data.length === 0) {
      await supabase.from('mp_settings_profiles').insert({
        user_id: user.id,
        name: 'France (défaut)',
        country_code: 'FR',
        vat_rate: 1.20,
        prep_cost: 0,
        inbound_cost: 0,
        custom_margin: 0,
        is_default: true,
      } as any);
      await loadProfiles();
    }
  }, [user, loadProfiles]);

  // Save profile (create or update)
  const saveProfile = useCallback(async (profile: Partial<MPProfile> & { name: string; country_code: string }) => {
    if (!user) return;
    if (profile.id) {
      const { error } = await supabase
        .from('mp_settings_profiles')
        .update({
          name: profile.name,
          country_code: profile.country_code,
          vat_rate: profile.vat_rate ?? 1.20,
          prep_cost: profile.prep_cost ?? 0,
          inbound_cost: profile.inbound_cost ?? 0,
          custom_margin: profile.custom_margin ?? 0,
          is_default: profile.is_default ?? false,
        } as any)
        .eq('id', profile.id);
      if (error) toast.error('Erreur mise à jour profil');
      else toast.success('Profil mis à jour');
    } else {
      const { error } = await supabase
        .from('mp_settings_profiles')
        .insert({
          user_id: user.id,
          name: profile.name,
          country_code: profile.country_code,
          vat_rate: profile.vat_rate ?? 1.20,
          prep_cost: profile.prep_cost ?? 0,
          inbound_cost: profile.inbound_cost ?? 0,
          custom_margin: profile.custom_margin ?? 0,
          is_default: profile.is_default ?? false,
        } as any);
      if (error) toast.error('Erreur création profil');
      else toast.success('Profil créé');
    }
    await loadProfiles();
  }, [user, loadProfiles]);

  // Delete profile
  const deleteProfile = useCallback(async (profileId: string) => {
    await supabase.from('mp_settings_profiles').delete().eq('id', profileId);
    await loadProfiles();
  }, [loadProfiles]);

  // Load lookup history
  const loadLookups = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('mp_lookups')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setLookups(data as any);
  }, [user]);

  // Load results for a lookup
  const loadResults = useCallback(async (lookupId: string) => {
    const { data } = await supabase
      .from('mp_lookup_results')
      .select('*')
      .eq('lookup_id', lookupId)
      .order('created_at', { ascending: true });
    if (data) {
      setCurrentResults(data as any);
      setSelectedLookupId(lookupId);
    }
  }, []);

  // Submit a new lookup
  const submitLookup = useCallback(async (queryInput: string, countryCode?: string) => {
    if (!user) return;
    setIsSearching(true);

    try {
      const profile = profiles.find(p => p.id === activeProfileId);
      const country = countryCode || profile?.country_code || 'FR';
      const items = queryInput.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
      const queryType = items.length > 1 ? 'batch' : 'single';

      const { data, error } = await supabase
        .from('mp_lookups')
        .insert({
          user_id: user.id,
          profile_id: activeProfileId,
          query_type: queryType,
          query_input: queryInput.trim(),
          country_code: country,
          status: 'pending',
        } as any)
        .select()
        .single();

      if (error) throw new Error(error.message);
      toast.success('Recherche lancée...');
      await loadLookups();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSearching(false);
    }
  }, [user, profiles, activeProfileId, loadLookups]);

  // Delete lookup
  const deleteLookup = useCallback(async (lookupId: string) => {
    await supabase.from('mp_lookups').delete().eq('id', lookupId);
    if (selectedLookupId === lookupId) {
      setCurrentResults([]);
      setSelectedLookupId(null);
    }
    await loadLookups();
  }, [selectedLookupId, loadLookups]);

  // Favorites
  const loadFavorites = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('mp_favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setFavorites(data as any);
  }, [user]);

  const addFavorite = useCallback(async (asin: string, countryCode: string, productName?: string, imageUrl?: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('mp_favorites')
      .insert({
        user_id: user.id,
        asin,
        country_code: countryCode,
        product_name: productName || null,
        image_url: imageUrl || null,
      } as any);
    if (error) {
      if (error.code === '23505') toast.info('Déjà dans les favoris');
      else toast.error('Erreur ajout favori');
    } else {
      toast.success('Ajouté aux favoris');
      await loadFavorites();
    }
  }, [user, loadFavorites]);

  const removeFavorite = useCallback(async (favoriteId: string) => {
    await supabase.from('mp_favorites').delete().eq('id', favoriteId);
    toast.success('Retiré des favoris');
    await loadFavorites();
  }, [loadFavorites]);

  // Initial load
  useEffect(() => {
    if (user) {
      ensureDefaultProfile();
      loadProfiles();
      loadLookups();
      loadFavorites();
    }
  }, [user, ensureDefaultProfile, loadProfiles, loadLookups, loadFavorites]);

  // Realtime subscription for lookup status updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`mp-lookups-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mp_lookups',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const updated = payload.new as any as MPLookup;
            setLookups(prev => {
              const idx = prev.findIndex(l => l.id === updated.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = updated;
                return next;
              }
              return [updated, ...prev];
            });

            if (updated.status === 'completed') {
              toast.success(`Recherche terminée : ${updated.results_count} résultat(s)`);
              // Auto-load results for the latest completed lookup
              loadResults(updated.id);
            } else if (updated.status === 'error') {
              toast.error(`Erreur : ${updated.error_message || 'Erreur inconnue'}`);
            }
          } else if (payload.eventType === 'DELETE') {
            setLookups(prev => prev.filter(l => l.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadResults]);

  return {
    // Profiles
    profiles,
    activeProfileId,
    setActiveProfileId,
    saveProfile,
    deleteProfile,
    // Lookups
    lookups,
    currentResults,
    selectedLookupId,
    isSearching,
    submitLookup,
    loadResults,
    deleteLookup,
    setCurrentResults,
    // Favorites
    favorites,
    addFavorite,
    removeFavorite,
  };
}
