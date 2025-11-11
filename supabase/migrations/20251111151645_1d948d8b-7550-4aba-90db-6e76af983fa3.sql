-- Modifier la fonction is_vip_user pour que les admins soient toujours VIP
CREATE OR REPLACE FUNCTION public.is_vip_user(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = _user_id
    AND plan_type = 'vip'
    AND status IN ('active', 'canceled')
    AND (expires_at IS NULL OR expires_at > now())
  ) OR has_role(_user_id, 'admin')
$$;