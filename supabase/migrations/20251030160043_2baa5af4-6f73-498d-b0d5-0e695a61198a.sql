-- Add 'password_reset' to the verification_codes type check constraint
ALTER TABLE verification_codes 
DROP CONSTRAINT IF EXISTS verification_codes_type_check;

ALTER TABLE verification_codes 
ADD CONSTRAINT verification_codes_type_check 
CHECK (type IN ('email_change', 'password_change', 'phone_change', 'password_reset'));