-- Create table for Qogita catalogue (290k products)
CREATE TABLE public.qogita_catalogue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ean TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  price_ht NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.qogita_catalogue ENABLE ROW LEVEL SECURITY;

-- Public read access for authenticated users
CREATE POLICY "Authenticated users can view qogita catalogue"
ON public.qogita_catalogue
FOR SELECT
TO authenticated
USING (true);

-- Admin can manage catalogue via service role (edge function)
CREATE POLICY "Service role can manage qogita catalogue"
ON public.qogita_catalogue
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');

-- Create indexes for fast search
CREATE INDEX idx_qogita_catalogue_ean ON public.qogita_catalogue(ean);
CREATE INDEX idx_qogita_catalogue_brand ON public.qogita_catalogue(brand);

-- Trigger for updated_at
CREATE TRIGGER update_qogita_catalogue_updated_at
BEFORE UPDATE ON public.qogita_catalogue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();