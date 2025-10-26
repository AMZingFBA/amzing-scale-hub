-- Add nickname field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nickname text;

-- Update profiles to use nickname in display
COMMENT ON COLUMN public.profiles.nickname IS 'User chosen display name for chat and support';