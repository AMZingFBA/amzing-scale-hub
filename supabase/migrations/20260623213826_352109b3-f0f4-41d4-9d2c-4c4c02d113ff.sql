
-- Extend profiles with shipping, IPs, email history for complete client dossier
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS shipping_address_street text,
  ADD COLUMN IF NOT EXISTS shipping_address_zip text,
  ADD COLUMN IF NOT EXISTS shipping_address_city text,
  ADD COLUMN IF NOT EXISTS shipping_address_country text,
  ADD COLUMN IF NOT EXISTS shipping_same_as_billing boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS previous_emails text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS signup_ip text,
  ADD COLUMN IF NOT EXISTS signup_user_agent text,
  ADD COLUMN IF NOT EXISTS last_login_ip text,
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz,
  ADD COLUMN IF NOT EXISTS siret text,
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text;

-- Track email changes automatically
CREATE OR REPLACE FUNCTION public.track_profile_email_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email AND OLD.email IS NOT NULL AND OLD.email <> '' THEN
    NEW.previous_emails := array_append(COALESCE(OLD.previous_emails, ARRAY[]::text[]), OLD.email);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_track_profile_email_change ON public.profiles;
CREATE TRIGGER trg_track_profile_email_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.track_profile_email_change();

-- Client documents: contracts, invoices PDFs, screenshots, any proof
CREATE TABLE IF NOT EXISTS public.client_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type text NOT NULL, -- contract|invoice|cgv|psp_failure_proof|payment_screenshot|other
  title text,
  url text,
  storage_path text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_documents TO authenticated;
GRANT ALL ON public.client_documents TO service_role;

ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own documents"
ON public.client_documents FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert own documents"
ON public.client_documents FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage all documents"
ON public.client_documents FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_client_documents_updated_at
BEFORE UPDATE ON public.client_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_client_documents_user ON public.client_documents(user_id, doc_type);
