-- Drop the old constraint
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_payment_provider_check;

-- Add the new constraint with 'stripe_suite' included
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_payment_provider_check 
CHECK (payment_provider = ANY (ARRAY['stripe'::text, 'apple'::text, 'free'::text, 'stripe_suite'::text]));