-- =============================================================================
-- Migration: Bridge RPC functions
-- Allows the actorio-bridge (running on owner's Mac) to claim and complete
-- product_searches without needing the service_role key.
-- Functions use SECURITY DEFINER to bypass RLS, protected by a shared secret.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Claim the next pending search (mark it as 'processing' and return it)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bridge_claim_next_search(p_secret TEXT)
RETURNS SETOF public.product_searches
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
  v_row public.product_searches;
BEGIN
  IF p_secret != '71cdeef5fdd0ff033eb2cc361f4a005786f2579e68c5a490' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Atomically pick the oldest pending search
  SELECT id INTO v_id
  FROM public.product_searches
  WHERE status = 'pending'
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.product_searches
  SET status = 'processing', updated_at = NOW()
  WHERE id = v_id
  RETURNING * INTO v_row;

  RETURN NEXT v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.bridge_claim_next_search(TEXT) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Upsert results into search_results_cache
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bridge_upsert_cache(
  p_secret       TEXT,
  p_filters_hash TEXT,
  p_results      JSONB,
  p_count        INTEGER,
  p_expires_at   TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_secret != '71cdeef5fdd0ff033eb2cc361f4a005786f2579e68c5a490' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO public.search_results_cache
    (filters_hash, results, provider, results_count, expires_at)
  VALUES
    (p_filters_hash, p_results, 'actorio', p_count, p_expires_at)
  ON CONFLICT (filters_hash) DO UPDATE
    SET results       = EXCLUDED.results,
        results_count = EXCLUDED.results_count,
        expires_at    = EXCLUDED.expires_at,
        created_at    = NOW();
END;
$$;

GRANT EXECUTE ON FUNCTION public.bridge_upsert_cache(TEXT, TEXT, JSONB, INTEGER, TIMESTAMPTZ) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Mark a search as completed
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bridge_complete_search(
  p_secret      TEXT,
  p_id          UUID,
  p_count       INTEGER,
  p_summary     JSONB,
  p_duration_ms INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_secret != '71cdeef5fdd0ff033eb2cc361f4a005786f2579e68c5a490' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.product_searches
  SET
    status                 = 'completed',
    provider               = 'actorio',
    results_count          = p_count,
    results_summary        = p_summary,
    processing_duration_ms = p_duration_ms,
    cache_hit              = FALSE,
    updated_at             = NOW()
  WHERE id = p_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.bridge_complete_search(TEXT, UUID, INTEGER, JSONB, INTEGER) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Mark a search as failed
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bridge_fail_search(
  p_secret TEXT,
  p_id     UUID,
  p_error  TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_secret != '71cdeef5fdd0ff033eb2cc361f4a005786f2579e68c5a490' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.product_searches
  SET
    status        = 'error',
    error_message = LEFT(p_error, 500),
    updated_at    = NOW()
  WHERE id = p_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.bridge_fail_search(TEXT, UUID, TEXT) TO anon, authenticated;
