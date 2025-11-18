-- Créer la table eany_products (identique à qogita_products)
CREATE TABLE IF NOT EXISTS public.eany_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ean TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  qogita_price_ht NUMERIC,
  qogita_price_ttc NUMERIC,
  qogita_stock INTEGER,
  qogita_url TEXT,
  selleramp_bsr TEXT,
  selleramp_sale_price NUMERIC,
  selleramp_sales TEXT,
  selleramp_sellers TEXT,
  selleramp_variations TEXT,
  selleramp_url TEXT,
  fbm_profit NUMERIC,
  fbm_roi NUMERIC,
  fba_profit NUMERIC,
  fba_roi NUMERIC,
  alerts TEXT[],
  amazon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.eany_products ENABLE ROW LEVEL SECURITY;

-- Politique pour les utilisateurs VIP
CREATE POLICY "VIP users can view eany products"
ON public.eany_products
FOR SELECT
USING (is_vip_user(auth.uid()));

-- Index pour améliorer les performances
CREATE INDEX idx_eany_products_ean ON public.eany_products(ean);
CREATE INDEX idx_eany_products_timestamp ON public.eany_products(timestamp DESC);
CREATE INDEX idx_eany_products_fba_profit ON public.eany_products(fba_profit DESC);
CREATE INDEX idx_eany_products_fba_roi ON public.eany_products(fba_roi DESC);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_eany_products_updated_at
BEFORE UPDATE ON public.eany_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.eany_products;