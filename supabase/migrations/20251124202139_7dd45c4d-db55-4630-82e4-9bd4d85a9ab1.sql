-- Mettre à jour la fonction is_vip_user pour exclure les statuts unpaid et expired
CREATE OR REPLACE FUNCTION public.is_vip_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = _user_id
    AND plan_type = 'vip'
    AND status = 'active'  -- Seulement 'active', pas 'canceled', 'unpaid' ou 'expired'
    AND (expires_at IS NULL OR expires_at > now())
  ) OR has_role(_user_id, 'admin')
$$;