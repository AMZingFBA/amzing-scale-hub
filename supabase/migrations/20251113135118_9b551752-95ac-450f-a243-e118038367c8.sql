-- Create table for Qogita products monitoring
CREATE TABLE IF NOT EXISTS public.qogita_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ean text NOT NULL,
  timestamp timestamp with time zone NOT NULL,
  qogita_price_ht numeric NOT NULL,
  qogita_price_ttc numeric NOT NULL,
  qogita_stock integer NOT NULL,
  selleramp_bsr text,
  selleramp_sale_price numeric,
  selleramp_sales text,
  selleramp_sellers text,
  selleramp_variations text,
  fbm_profit numeric,
  fbm_roi numeric,
  fba_profit numeric,
  fba_roi numeric,
  alerts text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.qogita_products ENABLE ROW LEVEL SECURITY;

-- VIP users can view products
CREATE POLICY "VIP users can view qogita products"
ON public.qogita_products
FOR SELECT
TO authenticated
USING (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.qogita_products;

-- Create index for better performance
CREATE INDEX idx_qogita_products_ean ON public.qogita_products(ean);
CREATE INDEX idx_qogita_products_timestamp ON public.qogita_products(timestamp DESC);
CREATE INDEX idx_qogita_products_fbm_profit ON public.qogita_products(fbm_profit);
CREATE INDEX idx_qogita_products_fbm_roi ON public.qogita_products(fbm_roi);