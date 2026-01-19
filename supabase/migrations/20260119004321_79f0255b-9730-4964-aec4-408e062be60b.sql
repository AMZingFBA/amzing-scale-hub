-- Delete duplicates using a different approach with DISTINCT ON
DELETE FROM public.qogita_products
WHERE id NOT IN (
  SELECT DISTINCT ON (ean) id
  FROM public.qogita_products
  ORDER BY ean, created_at DESC NULLS LAST
);

-- Now add the unique constraint
ALTER TABLE public.qogita_products ADD CONSTRAINT qogita_products_ean_unique UNIQUE (ean);