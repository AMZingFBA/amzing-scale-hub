
-- ============================================================
-- 1. PROFILES: capture CGV + adresse détaillée + ref client
-- ============================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cgv_version text,
  ADD COLUMN IF NOT EXISTS cgv_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS cgv_ip text,
  ADD COLUMN IF NOT EXISTS cgv_user_agent text,
  ADD COLUMN IF NOT EXISTS billing_address_street text,
  ADD COLUMN IF NOT EXISTS billing_address_zip text,
  ADD COLUMN IF NOT EXISTS billing_address_city text,
  ADD COLUMN IF NOT EXISTS billing_address_country text,
  ADD COLUMN IF NOT EXISTS phone_e164 text,
  ADD COLUMN IF NOT EXISTS legal_form text,
  ADD COLUMN IF NOT EXISTS client_ref text;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_client_ref_unique
  ON public.profiles (client_ref) WHERE client_ref IS NOT NULL;

-- Auto-générer un client_ref AMZ-CL-XXXXXX si vide
CREATE OR REPLACE FUNCTION public.ensure_profile_client_ref()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  candidate text;
  exists_already boolean;
BEGIN
  IF NEW.client_ref IS NULL OR NEW.client_ref = '' THEN
    LOOP
      candidate := 'AMZ-CL-' || lpad((floor(random() * 1000000))::int::text, 6, '0');
      SELECT EXISTS(SELECT 1 FROM public.profiles WHERE client_ref = candidate) INTO exists_already;
      EXIT WHEN NOT exists_already;
    END LOOP;
    NEW.client_ref := candidate;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_ensure_client_ref ON public.profiles;
CREATE TRIGGER profiles_ensure_client_ref
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.ensure_profile_client_ref();

-- Backfill pour les profils existants
UPDATE public.profiles SET client_ref = NULL WHERE client_ref = '';
UPDATE public.profiles
SET client_ref = 'AMZ-CL-' || lpad((floor(random() * 1000000))::int::text, 6, '0')
WHERE client_ref IS NULL;

-- ============================================================
-- 2. SUBSCRIPTIONS: compteur échecs + snapshot CGV + tarifs
-- ============================================================
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS consecutive_failed_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_failure_at timestamptz,
  ADD COLUMN IF NOT EXISTS cgv_version text,
  ADD COLUMN IF NOT EXISTS cgv_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS cgv_ip text,
  ADD COLUMN IF NOT EXISTS cgv_user_agent text,
  ADD COLUMN IF NOT EXISTS price_monthly_eur numeric(10,2),
  ADD COLUMN IF NOT EXISTS commitment_months integer,
  ADD COLUMN IF NOT EXISTS offer_label text,
  ADD COLUMN IF NOT EXISTS payment_link_url text;

-- ============================================================
-- 3. TABLE cgv_versions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cgv_versions (
  version text PRIMARY KEY,
  pdf_url text NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  is_current boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cgv_versions TO anon, authenticated;
GRANT ALL ON public.cgv_versions TO service_role;

ALTER TABLE public.cgv_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read CGV versions" ON public.cgv_versions;
CREATE POLICY "Anyone can read CGV versions"
  ON public.cgv_versions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Une seule version courante
CREATE UNIQUE INDEX IF NOT EXISTS cgv_versions_only_one_current
  ON public.cgv_versions ((true)) WHERE is_current;

-- ============================================================
-- 4. TABLE payment_attempts
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text,
  stripe_event_id text UNIQUE,
  stripe_invoice_id text,
  stripe_subscription_id text,
  stripe_customer_id text,
  transaction_id text,
  amount_eur numeric(10,2),
  currency text DEFAULT 'EUR',
  method text,
  status text NOT NULL CHECK (status IN ('failed','succeeded','pending')),
  error_code text,
  error_message text,
  raw_psp_response jsonb,
  installment_number integer,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payment_attempts_user_idx ON public.payment_attempts (user_id, attempted_at DESC);
CREATE INDEX IF NOT EXISTS payment_attempts_status_idx ON public.payment_attempts (status, attempted_at DESC);

GRANT SELECT ON public.payment_attempts TO authenticated;
GRANT ALL ON public.payment_attempts TO service_role;

ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read payment_attempts" ON public.payment_attempts;
CREATE POLICY "Admins read payment_attempts"
  ON public.payment_attempts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 5. TABLE credaris_sync_log
-- ============================================================
CREATE TABLE IF NOT EXISTS public.credaris_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  external_id text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','success','failed','retrying')),
  http_status integer,
  response_body text,
  retry_count integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz,
  next_retry_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS credaris_sync_log_status_idx ON public.credaris_sync_log (status, next_retry_at);
CREATE INDEX IF NOT EXISTS credaris_sync_log_created_idx ON public.credaris_sync_log (created_at DESC);
CREATE INDEX IF NOT EXISTS credaris_sync_log_user_idx ON public.credaris_sync_log (user_id, created_at DESC);

GRANT SELECT ON public.credaris_sync_log TO authenticated;
GRANT ALL ON public.credaris_sync_log TO service_role;

ALTER TABLE public.credaris_sync_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read credaris_sync_log" ON public.credaris_sync_log;
CREATE POLICY "Admins read credaris_sync_log"
  ON public.credaris_sync_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS credaris_sync_log_updated_at ON public.credaris_sync_log;
CREATE TRIGGER credaris_sync_log_updated_at
  BEFORE UPDATE ON public.credaris_sync_log
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
