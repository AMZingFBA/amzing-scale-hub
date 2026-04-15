
-- Fix qogita_products RLS: restrict write to admins only
DROP POLICY IF EXISTS "Service role can insert products" ON public.qogita_products;
DROP POLICY IF EXISTS "Service role can update products" ON public.qogita_products;
DROP POLICY IF EXISTS "Service role can delete products" ON public.qogita_products;

CREATE POLICY "Admins can insert qogita products"
ON public.qogita_products FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update qogita products"
ON public.qogita_products FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete qogita products"
ON public.qogita_products FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix search_path on all affected functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.analysis_fail(text, uuid, text) SET search_path = public;
ALTER FUNCTION public.analysis_complete(text, uuid, integer, integer, jsonb, integer) SET search_path = public;
ALTER FUNCTION public.analysis_insert_results(text, uuid, jsonb) SET search_path = public;
ALTER FUNCTION public.analysis_claim_next(text) SET search_path = public;
ALTER FUNCTION public.mp_claim_next(text) SET search_path = public;
ALTER FUNCTION public.mp_fail(text, uuid, text) SET search_path = public;
ALTER FUNCTION public.mp_upsert_cache(text, text, text, jsonb) SET search_path = public;
ALTER FUNCTION public.mp_get_cache(text, text, text, integer) SET search_path = public;
ALTER FUNCTION public.mp_complete(text, uuid, jsonb, integer) SET search_path = public;
ALTER FUNCTION public.bridge_fail_search(text, uuid, text) SET search_path = public;
ALTER FUNCTION public.bridge_complete_search(text, uuid, integer, jsonb, integer) SET search_path = public;
ALTER FUNCTION public.bridge_upsert_cache(text, text, jsonb, integer, timestamptz) SET search_path = public;
ALTER FUNCTION public.bridge_claim_next_search(text) SET search_path = public;
ALTER FUNCTION public.check_subscription_expiry() SET search_path = public;
