-- Create table for Eany catalogue
CREATE TABLE public.eany_catalogue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ean TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  price_ht NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.eany_catalogue ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read
CREATE POLICY "Anyone can read eany catalogue"
ON public.eany_catalogue
FOR SELECT
USING (true);

-- Policy: Only admins can insert/update/delete
CREATE POLICY "Admins can manage eany catalogue"
ON public.eany_catalogue
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create index for faster searches
CREATE INDEX idx_eany_catalogue_ean ON public.eany_catalogue(ean);
CREATE INDEX idx_eany_catalogue_brand ON public.eany_catalogue(brand);

-- Create function to get distinct brands
CREATE OR REPLACE FUNCTION public.get_eany_brands()
RETURNS TABLE(brand TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT brand FROM public.eany_catalogue WHERE brand != '' ORDER BY brand;
$$;