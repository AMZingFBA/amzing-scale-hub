-- Add phone number to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add index for phone lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);