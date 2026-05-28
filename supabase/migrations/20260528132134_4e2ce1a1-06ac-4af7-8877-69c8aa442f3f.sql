
-- 1. Storage: remove anon access to private file-uploads bucket
DROP POLICY IF EXISTS "Anon reads all analysis files" ON storage.objects;
DROP POLICY IF EXISTS "Anon can see file-uploads bucket" ON storage.objects;

-- 2. imessage_jobs: lock to admins only
DROP POLICY IF EXISTS "Open access imessage_jobs" ON public.imessage_jobs;
ALTER TABLE public.imessage_jobs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.imessage_jobs FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.imessage_jobs TO authenticated;
GRANT ALL ON public.imessage_jobs TO service_role;
CREATE POLICY "Admins manage imessage_jobs"
  ON public.imessage_jobs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. whatsapp_bot_jobs: enable RLS, admin or owner
DROP POLICY IF EXISTS "Allow authenticated users" ON public.whatsapp_bot_jobs;
DROP POLICY IF EXISTS "Service access on whatsapp_bot_jobs" ON public.whatsapp_bot_jobs;
ALTER TABLE public.whatsapp_bot_jobs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.whatsapp_bot_jobs FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_bot_jobs TO authenticated;
GRANT ALL ON public.whatsapp_bot_jobs TO service_role;
CREATE POLICY "Admins manage whatsapp_bot_jobs"
  ON public.whatsapp_bot_jobs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners read their whatsapp_bot_jobs"
  ON public.whatsapp_bot_jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- 4. mp_product_cache: enable RLS, service-role only writes, VIPs can read
ALTER TABLE public.mp_product_cache ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mp_product_cache FROM anon;
GRANT SELECT ON public.mp_product_cache TO authenticated;
GRANT ALL ON public.mp_product_cache TO service_role;
CREATE POLICY "Authenticated read mp_product_cache"
  ON public.mp_product_cache FOR SELECT
  TO authenticated
  USING (true);

-- 5. subscriptions: remove user-side INSERT escalation
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscriptions;

-- 6. supplier_survey_responses: users see only their own
DROP POLICY IF EXISTS "Users can view all survey responses" ON public.supplier_survey_responses;
CREATE POLICY "Users view their own survey response"
  ON public.supplier_survey_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. fix mutable search_path on trigger function
CREATE OR REPLACE FUNCTION public.update_whatsapp_bot_jobs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
