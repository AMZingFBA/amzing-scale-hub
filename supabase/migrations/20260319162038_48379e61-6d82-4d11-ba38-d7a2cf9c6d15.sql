-- Allow admin manual VIP overrides in subscriptions.payment_provider
ALTER TABLE public.subscriptions
DROP CONSTRAINT IF EXISTS subscriptions_payment_provider_check;

ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_payment_provider_check
CHECK (
  payment_provider = ANY (
    ARRAY[
      'stripe'::text,
      'apple'::text,
      'free'::text,
      'stripe_suite'::text,
      'systeme_io'::text,
      'manual_admin'::text
    ]
  )
);