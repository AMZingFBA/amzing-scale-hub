-- Allow user_id to be nullable for email_signup verification codes
ALTER TABLE public.verification_codes ALTER COLUMN user_id DROP NOT NULL;