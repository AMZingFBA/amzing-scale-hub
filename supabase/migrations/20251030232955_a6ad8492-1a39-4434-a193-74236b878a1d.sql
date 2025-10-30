-- Drop the existing unique constraint on phone
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_phone_unique;

-- Create a partial unique constraint that excludes the admin phone number
CREATE UNIQUE INDEX profiles_phone_unique 
ON public.profiles (phone) 
WHERE phone IS NOT NULL AND phone != '0601148619';