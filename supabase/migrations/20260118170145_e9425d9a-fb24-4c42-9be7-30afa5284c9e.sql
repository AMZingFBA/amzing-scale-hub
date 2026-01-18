-- Create a function to get distinct brands efficiently
CREATE OR REPLACE FUNCTION public.get_qogita_brands()
RETURNS TABLE(brand TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT brand FROM public.qogita_catalogue ORDER BY brand;
$$;