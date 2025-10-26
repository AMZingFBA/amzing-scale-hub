-- Add marketplace as valid room type
-- Drop the old constraint if it exists
ALTER TABLE public.chat_rooms DROP CONSTRAINT IF EXISTS chat_rooms_type_check;

-- Add new constraint that includes marketplace
ALTER TABLE public.chat_rooms 
ADD CONSTRAINT chat_rooms_type_check 
CHECK (type IN ('general', 'private', 'success', 'sales', 'marketplace'));