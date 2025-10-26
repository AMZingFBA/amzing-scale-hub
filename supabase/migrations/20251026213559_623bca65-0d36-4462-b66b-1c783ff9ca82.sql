-- Create a dedicated table for the professional catalogue
CREATE TABLE public.catalogue_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  asin TEXT,
  ean TEXT,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}'::TEXT[],
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL,
  price_type TEXT NOT NULL DEFAULT 'TTC',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.catalogue_products ENABLE ROW LEVEL SECURITY;

-- Create policies for catalogue_products
-- Only admins can insert products
CREATE POLICY "Admins can insert catalogue products" 
ON public.catalogue_products 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update products
CREATE POLICY "Admins can update catalogue products" 
ON public.catalogue_products 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete products
CREATE POLICY "Admins can delete catalogue products" 
ON public.catalogue_products 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- VIP users and admins can view active products
CREATE POLICY "VIP users can view active catalogue products" 
ON public.catalogue_products 
FOR SELECT 
USING (
  (status = 'active' AND (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role)))
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_catalogue_products_updated_at
BEFORE UPDATE ON public.catalogue_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_catalogue_products_status ON public.catalogue_products(status);
CREATE INDEX idx_catalogue_products_created_at ON public.catalogue_products(created_at DESC);