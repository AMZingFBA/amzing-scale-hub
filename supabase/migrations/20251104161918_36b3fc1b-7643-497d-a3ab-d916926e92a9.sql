-- Update verification_codes table to support cancel_subscription and delete_account types
ALTER TABLE verification_codes DROP CONSTRAINT IF EXISTS verification_codes_type_check;

ALTER TABLE verification_codes ADD CONSTRAINT verification_codes_type_check 
CHECK (type IN ('email_change', 'password_change', 'phone_change', 'password_reset', 'email_signup', 'cancel_subscription', 'delete_account'));