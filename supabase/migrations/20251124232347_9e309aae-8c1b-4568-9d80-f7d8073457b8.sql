-- Corriger tous les comptes avec status canceled/unpaid mais date d'expiration future
UPDATE public.subscriptions
SET 
  plan_type = 'free',
  status = 'expired',
  is_trial = false,
  expires_at = now()
WHERE 
  plan_type = 'vip'
  AND status IN ('canceled', 'unpaid', 'past_due')
  AND expires_at > now();