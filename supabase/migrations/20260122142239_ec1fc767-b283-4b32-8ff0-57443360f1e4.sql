-- Create vibraforce_catalogue table (identical to eany_catalogue)
CREATE TABLE public.vibraforce_catalogue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ean TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  price_ht NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vibraforce_catalogue ENABLE ROW LEVEL SECURITY;

-- RLS policies for VIP users and admins
CREATE POLICY "VIP users can view vibraforce catalogue"
ON public.vibraforce_catalogue
FOR SELECT
USING (public.is_vip_user(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- Admin can manage the catalogue
CREATE POLICY "Admins can manage vibraforce catalogue"
ON public.vibraforce_catalogue
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for faster brand filtering
CREATE INDEX idx_vibraforce_catalogue_brand ON public.vibraforce_catalogue(brand);
CREATE INDEX idx_vibraforce_catalogue_ean ON public.vibraforce_catalogue(ean);

-- Create function to get unique brands for vibraforce
CREATE OR REPLACE FUNCTION public.get_vibraforce_brands()
RETURNS TABLE(brand TEXT)
LANGUAGE SQL
STABLE
AS $$
  SELECT DISTINCT brand 
  FROM public.vibraforce_catalogue 
  WHERE brand IS NOT NULL AND brand != ''
  ORDER BY brand;
$$;