-- =============================================================================
-- Migration: File Analysis System
-- Created: 2026-03-22
-- Description: Queue-based file analysis system. Members upload CSV/Excel files
--              with product data, a Python worker on Hetzner processes them via
--              SellerAmp API, applies user-defined filters, and stores results.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Table: file_analyses (job queue)
-- ---------------------------------------------------------------------------
CREATE TABLE public.file_analyses (
  id                      UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                 UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path               TEXT        NOT NULL,
  file_name               TEXT        NOT NULL,
  filters                 JSONB       NOT NULL DEFAULT '{}',
  column_mapping          JSONB,
  status                  TEXT        NOT NULL DEFAULT 'pending'
                                      CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  results_count           INTEGER     DEFAULT 0,
  total_rows              INTEGER     DEFAULT 0,
  error_message           TEXT,
  processing_duration_ms  INTEGER,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.file_analyses IS 'Queue of file analysis jobs. Workers poll for pending rows.';

-- ---------------------------------------------------------------------------
-- 2. Table: analysis_results (filtered results per analysis)
-- ---------------------------------------------------------------------------
CREATE TABLE public.analysis_results (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id     UUID        NOT NULL REFERENCES public.file_analyses(id) ON DELETE CASCADE,
  asin            TEXT,
  ean             TEXT,
  product_name    TEXT,
  buy_price       NUMERIC,
  sell_price      NUMERIC,
  profit_fba      NUMERIC,
  roi_fba         NUMERIC,
  profit_fbm      NUMERIC,
  roi_fbm         NUMERIC,
  bsr             INTEGER,
  sales_monthly   INTEGER,
  fba_sellers     INTEGER,
  fbm_sellers     INTEGER,
  category        TEXT,
  variations      INTEGER     DEFAULT 0,
  alerts          TEXT,
  commission_pct  NUMERIC,
  fba_fee         NUMERIC,
  country_code    TEXT,
  amazon_url      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.analysis_results IS 'Products that passed the user filters after SellerAmp analysis.';

-- ---------------------------------------------------------------------------
-- 3. Table: analysis_filter_presets (saved filter presets per user)
-- ---------------------------------------------------------------------------
CREATE TABLE public.analysis_filter_presets (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  filters     JSONB       NOT NULL DEFAULT '{}',
  is_default  BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.analysis_filter_presets IS 'User-saved filter presets for file analysis.';

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.file_analyses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_filter_presets ENABLE ROW LEVEL SECURITY;

-- file_analyses: per-user isolation
CREATE POLICY "Users can view own analyses"
  ON public.file_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON public.file_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON public.file_analyses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON public.file_analyses FOR DELETE
  USING (auth.uid() = user_id);

-- analysis_results: user can read results of their own analyses
CREATE POLICY "Users can view own results"
  ON public.analysis_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.file_analyses fa
      WHERE fa.id = analysis_id AND fa.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own results"
  ON public.analysis_results FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.file_analyses fa
      WHERE fa.id = analysis_id AND fa.user_id = auth.uid()
    )
  );

-- analysis_filter_presets: per-user isolation
CREATE POLICY "Users can view own filter presets"
  ON public.analysis_filter_presets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own filter presets"
  ON public.analysis_filter_presets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own filter presets"
  ON public.analysis_filter_presets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own filter presets"
  ON public.analysis_filter_presets FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 5. Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX idx_file_analyses_user_id    ON public.file_analyses(user_id);
CREATE INDEX idx_file_analyses_status     ON public.file_analyses(status);
CREATE INDEX idx_file_analyses_created_at ON public.file_analyses(created_at DESC);

CREATE INDEX idx_analysis_results_analysis_id ON public.analysis_results(analysis_id);

CREATE INDEX idx_analysis_filter_presets_user_id ON public.analysis_filter_presets(user_id);

-- ---------------------------------------------------------------------------
-- 6. Auto-update triggers
-- ---------------------------------------------------------------------------
CREATE TRIGGER update_file_analyses_updated_at
  BEFORE UPDATE ON public.file_analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analysis_filter_presets_updated_at
  BEFORE UPDATE ON public.analysis_filter_presets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 7. Realtime — allow frontend subscriptions on file_analyses
-- ---------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.file_analyses;

-- ---------------------------------------------------------------------------
-- 8. RPC Functions (SECURITY DEFINER, protected by shared secret)
-- ---------------------------------------------------------------------------

-- 8a. Claim the next pending analysis job
CREATE OR REPLACE FUNCTION public.analysis_claim_next(p_secret TEXT)
RETURNS SETOF public.file_analyses
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
  v_row public.file_analyses;
BEGIN
  IF p_secret != 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT id INTO v_id
  FROM public.file_analyses
  WHERE status = 'pending'
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.file_analyses
  SET status = 'processing', updated_at = NOW()
  WHERE id = v_id
  RETURNING * INTO v_row;

  RETURN NEXT v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.analysis_claim_next(TEXT) TO anon, authenticated;

-- 8b. Mark analysis as completed
CREATE OR REPLACE FUNCTION public.analysis_complete(
  p_secret      TEXT,
  p_id          UUID,
  p_count       INTEGER,
  p_total       INTEGER,
  p_mapping     JSONB,
  p_duration_ms INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_secret != 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.file_analyses
  SET
    status                 = 'completed',
    results_count          = p_count,
    total_rows             = p_total,
    column_mapping         = p_mapping,
    processing_duration_ms = p_duration_ms,
    updated_at             = NOW()
  WHERE id = p_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.analysis_complete(TEXT, UUID, INTEGER, INTEGER, JSONB, INTEGER) TO anon, authenticated;

-- 8c. Mark analysis as failed
CREATE OR REPLACE FUNCTION public.analysis_fail(
  p_secret TEXT,
  p_id     UUID,
  p_error  TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_secret != 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.file_analyses
  SET
    status        = 'error',
    error_message = LEFT(p_error, 500),
    updated_at    = NOW()
  WHERE id = p_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.analysis_fail(TEXT, UUID, TEXT) TO anon, authenticated;

-- 8d. Batch insert analysis results
CREATE OR REPLACE FUNCTION public.analysis_insert_results(
  p_secret      TEXT,
  p_analysis_id UUID,
  p_results     JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_secret != 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO public.analysis_results (
    analysis_id, asin, ean, product_name, buy_price, sell_price,
    profit_fba, roi_fba, profit_fbm, roi_fbm,
    bsr, sales_monthly, fba_sellers, fbm_sellers,
    category, variations, alerts, commission_pct, fba_fee,
    country_code, amazon_url
  )
  SELECT
    p_analysis_id,
    r->>'asin',
    r->>'ean',
    r->>'product_name',
    (r->>'buy_price')::NUMERIC,
    (r->>'sell_price')::NUMERIC,
    (r->>'profit_fba')::NUMERIC,
    (r->>'roi_fba')::NUMERIC,
    (r->>'profit_fbm')::NUMERIC,
    (r->>'roi_fbm')::NUMERIC,
    (r->>'bsr')::INTEGER,
    (r->>'sales_monthly')::INTEGER,
    (r->>'fba_sellers')::INTEGER,
    (r->>'fbm_sellers')::INTEGER,
    r->>'category',
    (r->>'variations')::INTEGER,
    r->>'alerts',
    (r->>'commission_pct')::NUMERIC,
    (r->>'fba_fee')::NUMERIC,
    r->>'country_code',
    r->>'amazon_url'
  FROM jsonb_array_elements(p_results) AS r;
END;
$$;

GRANT EXECUTE ON FUNCTION public.analysis_insert_results(TEXT, UUID, JSONB) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 9. Cleanup old analyses (older than 30 days)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cleanup_old_analyses()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.file_analyses
  WHERE created_at < NOW() - INTERVAL '30 days'
    AND status IN ('completed', 'error');
END;
$$;

COMMENT ON FUNCTION public.cleanup_old_analyses()
  IS 'Removes file analyses older than 30 days. Call via pg_cron or edge function.';
