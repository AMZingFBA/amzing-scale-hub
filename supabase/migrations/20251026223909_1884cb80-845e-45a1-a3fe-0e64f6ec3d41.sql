-- Modifier la contrainte pour autoriser le type 'questions'
ALTER TABLE public.chat_rooms 
DROP CONSTRAINT IF EXISTS chat_rooms_type_check;

ALTER TABLE public.chat_rooms 
ADD CONSTRAINT chat_rooms_type_check 
CHECK (type IN ('general', 'private', 'marketplace', 'success', 'sales', 'questions'));

-- Create questions room for product questions chat
INSERT INTO public.chat_rooms (type, name, created_by)
SELECT 'questions', 'Questions & Entraide Produits', 
  (SELECT user_id FROM public.user_roles WHERE role = 'admin' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM public.chat_rooms WHERE type = 'questions'
);