-- Add email_signup to verification_codes type check constraint
-- Include all existing types
ALTER TABLE public.verification_codes 
DROP CONSTRAINT IF EXISTS verification_codes_type_check;

ALTER TABLE public.verification_codes 
ADD CONSTRAINT verification_codes_type_check 
CHECK (type IN ('password_reset', 'password_change', 'phone_change', 'email_change', 'email_signup'));