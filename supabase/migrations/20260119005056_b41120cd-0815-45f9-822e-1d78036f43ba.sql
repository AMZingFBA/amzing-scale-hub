-- Rendre qogita_stock nullable
ALTER TABLE public.qogita_products ALTER COLUMN qogita_stock DROP NOT NULL;