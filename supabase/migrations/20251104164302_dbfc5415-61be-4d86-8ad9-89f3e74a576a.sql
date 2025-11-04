-- Modifier la fonction is_vip_user pour permettre l'accès aux abonnements résiliés jusqu'à expiration
CREATE OR REPLACE FUNCTION public.is_vip_user(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = _user_id
    AND plan_type = 'vip'
    AND status IN ('active', 'canceled')
    AND (expires_at IS NULL OR expires_at > now())
  )
$function$;

-- Modifier check_subscription_expiry pour gérer les abonnements canceled
CREATE OR REPLACE FUNCTION public.check_subscription_expiry()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Si l'abonnement est expiré (actif ou annulé), le mettre à jour
  IF NEW.plan_type = 'vip' 
     AND NEW.status IN ('active', 'canceled')
     AND NEW.expires_at IS NOT NULL 
     AND NEW.expires_at < now() THEN
    
    NEW.plan_type := 'free';
    NEW.status := 'expired';
    NEW.is_trial := false;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Modifier check_and_expire_subscriptions pour gérer les abonnements canceled
CREATE OR REPLACE FUNCTION public.check_and_expire_subscriptions()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Mettre à jour les abonnements VIP expirés (actifs ou annulés)
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
END;
$function$;