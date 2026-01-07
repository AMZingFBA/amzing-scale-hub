-- Add systeme_io to payment_provider check constraint
ALTER TABLE public.subscriptions DROP CONSTRAINT subscriptions_payment_provider_check;

ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_payment_provider_check 
  CHECK (payment_provider = ANY (ARRAY['stripe'::text, 'apple'::text, 'free'::text, 'stripe_suite'::text, 'systeme_io'::text]));