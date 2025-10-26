-- Update RLS policies to allow success room access for VIP and admins
DROP POLICY IF EXISTS "VIP and admins can view all rooms" ON public.chat_rooms;

CREATE POLICY "VIP and admins can view all rooms"
ON public.chat_rooms FOR SELECT
TO authenticated
USING (
  type IN ('general', 'success') 
  OR (
    type = 'private' 
    AND (
      EXISTS (
        SELECT 1 FROM subscriptions 
        WHERE user_id = auth.uid() 
        AND plan_type = 'vip' 
        AND status = 'active'
      ) 
      OR has_role(auth.uid(), 'admin'::app_role)
    )
  )
);