-- Create a security definer function to check VIP status
-- This avoids RLS issues when checking subscription status
CREATE OR REPLACE FUNCTION public.is_vip_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = _user_id
    AND plan_type = 'vip'
    AND status = 'active'
  )
$$;

-- Update the marketplace rooms creation policy to use the security definer function
DROP POLICY IF EXISTS "VIP and admins can create marketplace rooms" ON public.chat_rooms;

CREATE POLICY "VIP and admins can create marketplace rooms" 
ON public.chat_rooms 
FOR INSERT 
WITH CHECK (
  (type = 'marketplace') 
  AND (
    is_vip_user(auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);