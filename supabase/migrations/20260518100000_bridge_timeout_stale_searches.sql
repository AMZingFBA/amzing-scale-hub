-- =============================================================================
-- Migration: Auto-timeout stale product searches
-- If a search stays in 'pending' or 'processing' for more than 15 minutes,
-- it is automatically marked as 'error' with an appropriate message.
-- This handles cases where the bridge server is down or unreachable.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.bridge_timeout_stale_searches()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE public.product_searches
  SET
    status        = 'error',
    error_message = 'Le serveur de recherche ne répond pas. Réessayez dans quelques minutes.',
    updated_at    = NOW()
  WHERE status IN ('pending', 'processing')
    AND created_at < NOW() - INTERVAL '15 minutes';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- Allow any authenticated user to call this (safe: only fails their own old searches
-- because product_searches has RLS filtering on user_id for SELECT, but this
-- function uses SECURITY DEFINER to update all stale rows globally — which is
-- acceptable since it only transitions stuck states to error).
GRANT EXECUTE ON FUNCTION public.bridge_timeout_stale_searches() TO authenticated, anon;

COMMENT ON FUNCTION public.bridge_timeout_stale_searches()
  IS 'Marks pending/processing product_searches older than 15 min as error. Call from frontend on page load to surface stuck searches to users.';
