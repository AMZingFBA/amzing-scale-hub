-- AMZing MP: SellerAmp-clone integrated product lookup system
-- Tables: mp_settings_profiles, mp_lookups, mp_lookup_results, mp_product_cache, mp_favorites
-- RPC: mp_claim_next, mp_complete, mp_fail

-- =============================================================================
-- 1. TABLES
-- =============================================================================

-- Settings profiles (per-user marketplace/VAT/prep config)
CREATE TABLE public.mp_settings_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Mon profil',
  country_code TEXT NOT NULL DEFAULT 'FR',
  vat_rate NUMERIC NOT NULL DEFAULT 1.20,
  prep_cost NUMERIC NOT NULL DEFAULT 0,
  inbound_cost NUMERIC NOT NULL DEFAULT 0,
  custom_margin NUMERIC NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mp_settings_profiles_user ON public.mp_settings_profiles(user_id);

-- Lookup queue (jobs)
CREATE TABLE public.mp_lookups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.mp_settings_profiles(id) ON DELETE SET NULL,
  query_type TEXT NOT NULL DEFAULT 'single' CHECK (query_type IN ('single', 'batch')),
  query_input TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'FR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  error_message TEXT,
  processing_ms INTEGER,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mp_lookups_user ON public.mp_lookups(user_id);
CREATE INDEX idx_mp_lookups_status ON public.mp_lookups(status);
CREATE INDEX idx_mp_lookups_created ON public.mp_lookups(created_at DESC);

-- Lookup results (one row per ASIN per lookup)
CREATE TABLE public.mp_lookup_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lookup_id UUID NOT NULL REFERENCES public.mp_lookups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asin TEXT NOT NULL,
  ean TEXT,
  product_name TEXT,
  image_url TEXT,
  category TEXT,
  bsr INTEGER,
  sales_monthly INTEGER,
  sell_price NUMERIC,
  amazon_price NUMERIC,
  fba_price NUMERIC,
  fba_fee NUMERIC,
  commission_pct NUMERIC,
  commission_eur NUMERIC,
  closing_fee NUMERIC,
  profit_fba NUMERIC,
  roi_fba NUMERIC,
  profit_fbm NUMERIC,
  roi_fbm NUMERIC,
  fba_sellers INTEGER,
  fbm_sellers INTEGER,
  variations INTEGER,
  alerts TEXT,
  buy_price NUMERIC,
  country_code TEXT NOT NULL,
  amazon_url TEXT,
  keepa_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mp_lookup_results_lookup ON public.mp_lookup_results(lookup_id);
CREATE INDEX idx_mp_lookup_results_user ON public.mp_lookup_results(user_id);

-- Product cache (shared across users, used by worker only)
CREATE TABLE public.mp_product_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asin TEXT NOT NULL,
  country_code TEXT NOT NULL,
  raw_data JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(asin, country_code)
);

CREATE INDEX idx_mp_product_cache_asin ON public.mp_product_cache(asin, country_code);
CREATE INDEX idx_mp_product_cache_fetched ON public.mp_product_cache(fetched_at);

-- Favorites
CREATE TABLE public.mp_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asin TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'FR',
  product_name TEXT,
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, asin, country_code)
);

CREATE INDEX idx_mp_favorites_user ON public.mp_favorites(user_id);

-- =============================================================================
-- 2. TRIGGERS (auto-update updated_at)
-- =============================================================================

CREATE TRIGGER update_mp_settings_profiles_updated_at
  BEFORE UPDATE ON public.mp_settings_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mp_lookups_updated_at
  BEFORE UPDATE ON public.mp_lookups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- 3. RLS POLICIES
-- =============================================================================

ALTER TABLE public.mp_settings_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profiles"
  ON public.mp_settings_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profiles"
  ON public.mp_settings_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles"
  ON public.mp_settings_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiles"
  ON public.mp_settings_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- mp_lookups
ALTER TABLE public.mp_lookups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lookups"
  ON public.mp_lookups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lookups"
  ON public.mp_lookups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lookups"
  ON public.mp_lookups FOR DELETE
  USING (auth.uid() = user_id);

-- mp_lookup_results
ALTER TABLE public.mp_lookup_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lookup results"
  ON public.mp_lookup_results FOR SELECT
  USING (auth.uid() = user_id);

-- mp_product_cache: NO RLS (worker-only via SECURITY DEFINER RPCs)
-- We do NOT enable RLS on mp_product_cache

-- mp_favorites
ALTER TABLE public.mp_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.mp_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.mp_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites"
  ON public.mp_favorites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.mp_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- 4. RPC FUNCTIONS (worker-side, SECURITY DEFINER)
-- =============================================================================

-- Claim next pending lookup
CREATE OR REPLACE FUNCTION public.mp_claim_next(p_secret TEXT)
RETURNS SETOF public.mp_lookups
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF p_secret IS DISTINCT FROM current_setting('app.settings.worker_secret', true) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  UPDATE public.mp_lookups
  SET status = 'processing', updated_at = NOW()
  WHERE id = (
    SELECT id FROM public.mp_lookups
    WHERE status = 'pending'
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END;
$$;

-- Complete a lookup with results
CREATE OR REPLACE FUNCTION public.mp_complete(
  p_secret TEXT,
  p_id UUID,
  p_results JSONB,
  p_processing_ms INTEGER
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
  v_count INTEGER := 0;
BEGIN
  IF p_secret IS DISTINCT FROM current_setting('app.settings.worker_secret', true) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Insert each result
  FOR v_result IN SELECT * FROM jsonb_array_elements(p_results)
  LOOP
    INSERT INTO public.mp_lookup_results (
      lookup_id, user_id, asin, ean, product_name, image_url, category,
      bsr, sales_monthly, sell_price, amazon_price, fba_price,
      fba_fee, commission_pct, commission_eur, closing_fee,
      profit_fba, roi_fba, profit_fbm, roi_fbm,
      fba_sellers, fbm_sellers, variations, alerts,
      buy_price, country_code, amazon_url, keepa_data
    ) VALUES (
      p_id,
      (v_result->>'user_id')::UUID,
      v_result->>'asin',
      v_result->>'ean',
      v_result->>'product_name',
      v_result->>'image_url',
      v_result->>'category',
      (v_result->>'bsr')::INTEGER,
      (v_result->>'sales_monthly')::INTEGER,
      (v_result->>'sell_price')::NUMERIC,
      (v_result->>'amazon_price')::NUMERIC,
      (v_result->>'fba_price')::NUMERIC,
      (v_result->>'fba_fee')::NUMERIC,
      (v_result->>'commission_pct')::NUMERIC,
      (v_result->>'commission_eur')::NUMERIC,
      (v_result->>'closing_fee')::NUMERIC,
      (v_result->>'profit_fba')::NUMERIC,
      (v_result->>'roi_fba')::NUMERIC,
      (v_result->>'profit_fbm')::NUMERIC,
      (v_result->>'roi_fbm')::NUMERIC,
      (v_result->>'fba_sellers')::INTEGER,
      (v_result->>'fbm_sellers')::INTEGER,
      (v_result->>'variations')::INTEGER,
      v_result->>'alerts',
      (v_result->>'buy_price')::NUMERIC,
      v_result->>'country_code',
      v_result->>'amazon_url',
      v_result->'keepa_data'
    );
    v_count := v_count + 1;
  END LOOP;

  -- Mark completed
  UPDATE public.mp_lookups
  SET status = 'completed',
      results_count = v_count,
      processing_ms = p_processing_ms,
      updated_at = NOW()
  WHERE id = p_id;
END;
$$;

-- Fail a lookup
CREATE OR REPLACE FUNCTION public.mp_fail(
  p_secret TEXT,
  p_id UUID,
  p_error TEXT
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF p_secret IS DISTINCT FROM current_setting('app.settings.worker_secret', true) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.mp_lookups
  SET status = 'error',
      error_message = p_error,
      updated_at = NOW()
  WHERE id = p_id;
END;
$$;

-- Upsert product cache (worker-only)
CREATE OR REPLACE FUNCTION public.mp_upsert_cache(
  p_secret TEXT,
  p_asin TEXT,
  p_country_code TEXT,
  p_raw_data JSONB
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF p_secret IS DISTINCT FROM current_setting('app.settings.worker_secret', true) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO public.mp_product_cache (asin, country_code, raw_data, fetched_at)
  VALUES (p_asin, p_country_code, p_raw_data, NOW())
  ON CONFLICT (asin, country_code)
  DO UPDATE SET raw_data = p_raw_data, fetched_at = NOW();
END;
$$;

-- Read product cache (worker-only)
CREATE OR REPLACE FUNCTION public.mp_get_cache(
  p_secret TEXT,
  p_asin TEXT,
  p_country_code TEXT,
  p_max_age_hours INTEGER DEFAULT 24
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_data JSONB;
BEGIN
  IF p_secret IS DISTINCT FROM current_setting('app.settings.worker_secret', true) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT raw_data INTO v_data
  FROM public.mp_product_cache
  WHERE asin = p_asin
    AND country_code = p_country_code
    AND fetched_at > NOW() - (p_max_age_hours || ' hours')::INTERVAL;

  RETURN v_data;
END;
$$;

-- =============================================================================
-- 5. REALTIME
-- =============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.mp_lookups;
