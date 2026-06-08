
CREATE TYPE public.lead_status AS ENUM ('nouveau', 'contacte', 'interesse', 'non_interesse', 'client');

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  level TEXT,
  objective TEXT,
  budget TEXT,
  message TEXT,
  source_page TEXT,
  source TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  status public.lead_status NOT NULL DEFAULT 'nouveau',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a lead"
ON public.leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view leads"
ON public.leads FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leads"
ON public.leads FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads"
ON public.leads FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX idx_leads_status ON public.leads (status);
