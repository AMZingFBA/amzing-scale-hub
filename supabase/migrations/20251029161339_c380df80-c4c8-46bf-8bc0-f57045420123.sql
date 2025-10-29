-- Update chat_rooms type constraint to include product subcategories
ALTER TABLE public.chat_rooms DROP CONSTRAINT IF EXISTS chat_rooms_type_check;

ALTER TABLE public.chat_rooms 
ADD CONSTRAINT chat_rooms_type_check 
CHECK (type = ANY (ARRAY['general'::text, 'private'::text, 'marketplace'::text, 'success'::text, 'sales'::text, 'questions'::text, 'products'::text]));

-- Create dedicated chat rooms for each product subcategory
INSERT INTO public.chat_rooms (id, name, type, created_at)
VALUES 
  (gen_random_uuid(), 'Product Find', 'products', now()),
  (gen_random_uuid(), 'Produits Qogita', 'products', now()),
  (gen_random_uuid(), 'Produits Eany', 'products', now()),
  (gen_random_uuid(), 'Grossistes', 'products', now()),
  (gen_random_uuid(), 'Promotions', 'products', now()),
  (gen_random_uuid(), 'Sitelist', 'products', now())
ON CONFLICT DO NOTHING;