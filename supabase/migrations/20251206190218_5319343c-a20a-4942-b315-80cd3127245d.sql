-- Fix is_vip_user to allow 'canceled' status until expires_at
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
    AND status IN ('active', 'canceled')  -- Canceled users keep VIP until expires_at
    AND (expires_at IS NULL OR expires_at > now())
  ) OR has_role(_user_id, 'admin')
$function$;