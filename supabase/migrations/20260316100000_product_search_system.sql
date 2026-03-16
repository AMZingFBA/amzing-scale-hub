-- =============================================================================
-- Migration: Product Search System
-- Created: 2026-03-16
-- Description: Creates tables, RLS policies, indexes, triggers, and helper
--              functions for the product search system including result caching
--              and saved filter presets.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Ensure the updated_at trigger function exists
--    (Already created in 20251024030314, but CREATE OR REPLACE is idempotent)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 1. Table: product_searches  (stores search requests – minimal storage)
-- ---------------------------------------------------------------------------
CREATE TABLE public.product_searches (
  id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  TEXT        NOT NULL,
  filters               JSONB       NOT NULL DEFAULT '{}',
  filters_hash          TEXT        NOT NULL,
  status                TEXT        NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending', 'processing', 'completed', 'error', 'cached')),
  provider              TEXT        NOT NULL DEFAULT 'mock',
  results_count         INTEGER     DEFAULT 0,
  cache_hit             BOOLEAN     DEFAULT FALSE,
  processing_duration_ms INTEGER,
  error_message         TEXT,
  results_summary       JSONB,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  expires_at            TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour')
);

COMMENT ON TABLE public.product_searches IS 'Stores product search requests and their execution metadata.';

-- ---------------------------------------------------------------------------
-- 2. Table: search_presets  (saved filter presets per user)
-- ---------------------------------------------------------------------------
CREATE TABLE public.search_presets (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  filters     JSONB       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.search_presets IS 'User-saved filter presets for quick reuse.';

-- ---------------------------------------------------------------------------
-- 3. Table: search_results_cache  (temporary cache keyed by filters_hash)
-- ---------------------------------------------------------------------------
CREATE TABLE public.search_results_cache (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  filters_hash  TEXT        NOT NULL UNIQUE,
  results       JSONB       NOT NULL DEFAULT '[]',
  provider      TEXT        NOT NULL DEFAULT 'mock',
  results_count INTEGER     DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour')
);

COMMENT ON TABLE public.search_results_cache IS 'Short-lived cache of search results, keyed by a deterministic hash of the filter set.';

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------

-- Enable RLS on all three tables
ALTER TABLE public.product_searches      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_presets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_results_cache  ENABLE ROW LEVEL SECURITY;

-- product_searches: strict per-user isolation (all CRUD)
CREATE POLICY "Users can view own searches"
  ON public.product_searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own searches"
  ON public.product_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own searches"
  ON public.product_searches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own searches"
  ON public.product_searches FOR DELETE
  USING (auth.uid() = user_id);

-- search_presets: strict per-user isolation (all CRUD)
CREATE POLICY "Users can view own presets"
  ON public.search_presets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own presets"
  ON public.search_presets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presets"
  ON public.search_presets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own presets"
  ON public.search_presets FOR DELETE
  USING (auth.uid() = user_id);

-- search_results_cache: service-role manages writes; authenticated users can
-- read for fast cache-hit lookups (actual writes happen via edge functions).
CREATE POLICY "Users can read cache"
  ON public.search_results_cache FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- 5. Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX idx_product_searches_user_id      ON public.product_searches(user_id);
CREATE INDEX idx_product_searches_filters_hash ON public.product_searches(filters_hash);
CREATE INDEX idx_product_searches_status       ON public.product_searches(status);
CREATE INDEX idx_product_searches_created_at   ON public.product_searches(created_at DESC);

CREATE INDEX idx_search_results_cache_hash     ON public.search_results_cache(filters_hash);
CREATE INDEX idx_search_results_cache_expires  ON public.search_results_cache(expires_at);

CREATE INDEX idx_search_presets_user_id        ON public.search_presets(user_id);

-- ---------------------------------------------------------------------------
-- 6. Auto-update triggers for updated_at columns
-- ---------------------------------------------------------------------------
CREATE TRIGGER update_product_searches_updated_at
  BEFORE UPDATE ON public.product_searches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_search_presets_updated_at
  BEFORE UPDATE ON public.search_presets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 7. Realtime – allow frontend subscriptions on product_searches
-- ---------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_searches;

-- ---------------------------------------------------------------------------
-- 8. Cleanup function for expired cache and terminal searches
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cleanup_expired_search_cache()
RETURNS void AS $$
BEGIN
  -- Remove expired cache entries
  DELETE FROM public.search_results_cache
  WHERE expires_at < NOW();

  -- Remove expired searches that reached a terminal state
  DELETE FROM public.product_searches
  WHERE expires_at < NOW()
    AND status IN ('completed', 'cached', 'error');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.cleanup_expired_search_cache()
  IS 'Removes expired rows from search_results_cache and terminal product_searches. Should be called periodically via pg_cron or an edge function.';
