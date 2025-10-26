-- Drop existing check constraint
ALTER TABLE public.chat_rooms DROP CONSTRAINT IF EXISTS chat_rooms_type_check;

-- Add new check constraint that includes 'success' type
ALTER TABLE public.chat_rooms ADD CONSTRAINT chat_rooms_type_check 
CHECK (type IN ('general', 'private', 'success'));

-- Create success room if it doesn't exist
INSERT INTO public.chat_rooms (name, type, created_at)
SELECT 'Succès & Résultats', 'success', now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.chat_rooms WHERE type = 'success'
);