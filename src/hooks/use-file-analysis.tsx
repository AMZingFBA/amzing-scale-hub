import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export interface AnalysisFilters {
  country: string;
  min_roi_fba?: number | null;
  min_profit_fba?: number | null;
  min_roi_fbm?: number | null;
  min_profit_fbm?: number | null;
  min_sales_monthly?: number | null;
  max_sellers_fba?: number | null;
  max_sellers_fbm?: number | null;
  min_bsr?: number | null;
  max_bsr?: number | null;
  exclude_alerts?: string[];
  max_variations?: number | null;
  min_sell_price?: number | null;
  max_sell_price?: number | null;
}

export interface AnalysisResult {
  id: string;
  asin: string;
  ean: string | null;
  product_name: string | null;
  buy_price: number;
  sell_price: number;
  profit_fba: number | null;
  roi_fba: number | null;
  profit_fbm: number | null;
  roi_fbm: number | null;
  bsr: number;
  sales_monthly: number;
  fba_sellers: number;
  fbm_sellers: number;
  category: string;
  variations: number;
  alerts: string;
  commission_pct: number;
  fba_fee: number | null;
  country_code: string;
  amazon_url: string;
}

export interface FileAnalysis {
  id: string;
  file_name: string;
  file_path: string;
  filters: AnalysisFilters;
  column_mapping: Record<string, string> | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  results_count: number;
  total_rows: number;
  error_message: string | null;
  processing_duration_ms: number | null;
  created_at: string;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: AnalysisFilters;
  is_default: boolean;
}

export const DEFAULT_FILTERS: AnalysisFilters = {
  country: 'FR',
  min_roi_fba: null,
  min_profit_fba: null,
  min_roi_fbm: null,
  min_profit_fbm: null,
  min_sales_monthly: null,
  max_sellers_fba: null,
  max_sellers_fbm: null,
  min_bsr: null,
  max_bsr: null,
  exclude_alerts: [],
  max_variations: null,
  min_sell_price: null,
  max_sell_price: null,
};

export function useFileAnalysis() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<FileAnalysis[]>([]);
  const [currentResults, setCurrentResults] = useState<AnalysisResult[]>([]);
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  // Load analyses history
  const loadAnalyses = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('file_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setAnalyses(data as any);
  }, [user]);

  // Load presets
  const loadPresets = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('analysis_filter_presets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setPresets(data as any);
  }, [user]);

  // Load results for a specific analysis
  const loadResults = useCallback(async (analysisId: string) => {
    const { data } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('analysis_id', analysisId)
      .order('roi_fba', { ascending: false });
    if (data) {
      setCurrentResults(data as any);
      setSelectedAnalysisId(analysisId);
    }
  }, []);

  // Upload file and start analysis
  const submitAnalysis = useCallback(async (file: File, filters: AnalysisFilters, columnMapping?: { asin: string; ean: string; price: string }) => {
    if (!user) return;
    setIsUploading(true);

    try {
      // Upload to Storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('file-uploads')
        .upload(filePath, file);

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      // Build column mapping (only include non-__none__ values)
      const mapping: Record<string, string> = {};
      if (columnMapping) {
        if (columnMapping.asin !== '__none__') mapping.asin = columnMapping.asin;
        if (columnMapping.ean !== '__none__') mapping.ean = columnMapping.ean;
        if (columnMapping.price !== '__none__') mapping.price = columnMapping.price;
      }

      // Run analysis directly in Supabase Edge Function (no external Hetzner worker dependency)
      toast.info('Analyse en cours...');
      const { data, error: fnError } = await supabase.functions.invoke('analysis-run', {
        body: {
          filePath,
          fileName: file.name,
          filters,
          columnMapping: Object.keys(mapping).length > 0 ? mapping : null,
        },
      });

      if (fnError) throw new Error(`Analyse échouée: ${fnError.message}`);
      if (data?.error) throw new Error(data.error);

      toast.success('Analyse terminée');
      await loadAnalyses();
      if (data?.analysisId) {
        await loadResults(data.analysisId);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  }, [user, loadAnalyses, loadResults]);

  // Save filter preset
  const savePreset = useCallback(async (name: string, filters: AnalysisFilters) => {
    if (!user) return;
    const { error } = await supabase
      .from('analysis_filter_presets')
      .insert({
        user_id: user.id,
        name,
        filters: filters as any,
      });
    if (error) {
      toast.error('Erreur sauvegarde preset');
    } else {
      toast.success('Preset sauvegardé');
      await loadPresets();
    }
  }, [user, loadPresets]);

  // Delete preset
  const deletePreset = useCallback(async (presetId: string) => {
    await supabase.from('analysis_filter_presets').delete().eq('id', presetId);
    await loadPresets();
  }, [loadPresets]);

  // Delete analysis
  const deleteAnalysis = useCallback(async (analysisId: string) => {
    // Delete file from storage
    const analysis = analyses.find(a => a.id === analysisId);
    if (analysis) {
      await supabase.storage.from('file-uploads').remove([analysis.file_path]);
    }
    await supabase.from('file_analyses').delete().eq('id', analysisId);
    if (selectedAnalysisId === analysisId) {
      setCurrentResults([]);
      setSelectedAnalysisId(null);
    }
    await loadAnalyses();
  }, [analyses, selectedAnalysisId, loadAnalyses]);

  // Initial load
  useEffect(() => {
    loadAnalyses();
    loadPresets();
  }, [loadAnalyses, loadPresets]);

  // Realtime subscription for status updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`file-analyses-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'file_analyses',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const updated = payload.new as any as FileAnalysis;
            setAnalyses(prev => {
              const idx = prev.findIndex(a => a.id === updated.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = updated;
                return next;
              }
              return [updated, ...prev];
            });

            if (updated.status === 'completed') {
              toast.success(`Analyse terminée : ${updated.results_count} résultats sur ${updated.total_rows} produits`);
            } else if (updated.status === 'error') {
              toast.error(`Erreur : ${updated.error_message || 'Unknown error'}`);
            }
          } else if (payload.eventType === 'DELETE') {
            setAnalyses(prev => prev.filter(a => a.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    analyses,
    currentResults,
    presets,
    isUploading,
    selectedAnalysisId,
    submitAnalysis,
    loadResults,
    savePreset,
    deletePreset,
    deleteAnalysis,
    setCurrentResults,
  };
}
