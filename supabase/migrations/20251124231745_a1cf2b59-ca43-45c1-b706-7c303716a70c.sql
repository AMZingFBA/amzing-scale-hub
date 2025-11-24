-- Corriger les anciens comptes avec abonnements VIP expirés ou impayés
-- Mettre à jour tous les abonnements VIP dont la date d'expiration est passée
UPDATE public.subscriptions
SET 
  plan_type = 'free',
  status = 'expired',
  is_trial = false
WHERE 
  plan_type = 'vip'
  AND status IN ('active', 'canceled')
  AND expires_at IS NOT NULL
  AND expires_at < now();

-- Log pour voir combien de comptes ont été affectés
DO $$
DECLARE
  affected_count INTEGER;
BEGIN
  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RAISE NOTICE 'Nombre d''abonnements expirés corrigés: %', affected_count;
END $$;