-- Add URL columns to qogita_products table
ALTER TABLE public.qogita_products 
ADD COLUMN IF NOT EXISTS qogita_url TEXT,
ADD COLUMN IF NOT EXISTS selleramp_url TEXT,
ADD COLUMN IF NOT EXISTS amazon_url TEXT;