-- Table pour les alertes produits (sous-catégorie de produits eany)
CREATE TABLE public.product_find_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  source_name TEXT NOT NULL, -- ex: "Leclerc"
  product_title TEXT NOT NULL,
  ean TEXT NOT NULL,
  original_price NUMERIC,
  current_price NUMERIC NOT NULL,
  bsr TEXT,
  bsr_percent TEXT,
  cost_price NUMERIC,
  sale_price NUMERIC,
  monthly_sales TEXT,
  fulfillment_type TEXT, -- "FBM" ou "FBA"
  profit NUMERIC,
  roi NUMERIC,
  fba_profit NUMERIC,
  fba_roi NUMERIC,
  private_label TEXT,
  product_size TEXT,
  meltable TEXT,
  variations TEXT,
  sellers TEXT,
  amazon_url TEXT,
  sas_url TEXT,
  source_url TEXT,
  raw_message TEXT, -- message brut pour référence
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_find_alerts ENABLE ROW LEVEL SECURITY;

-- Admins can manage alerts
CREATE POLICY "Admins can manage product find alerts"
ON public.product_find_alerts
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- VIP users can view alerts
CREATE POLICY "VIP users can view product find alerts"
ON public.product_find_alerts
FOR SELECT
USING (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_find_alerts;