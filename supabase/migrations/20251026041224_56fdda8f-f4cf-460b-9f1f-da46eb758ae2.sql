-- Fix marketplace room creation for VIP users
-- Drop the restrictive admin-only policy
DROP POLICY IF EXISTS "VIP users can create marketplace rooms" ON public.chat_rooms;

-- Create a proper policy that allows VIP users OR admins to create marketplace rooms
CREATE POLICY "VIP and admins can create marketplace rooms" 
ON public.chat_rooms 
FOR INSERT 
WITH CHECK (
  (type = 'marketplace'::text) 
  AND 
  (
    (EXISTS ( SELECT 1
      FROM subscriptions
      WHERE ((subscriptions.user_id = auth.uid()) 
        AND (subscriptions.plan_type = 'vip'::text) 
        AND (subscriptions.status = 'active'::text))
    )) 
    OR 
    has_role(auth.uid(), 'admin'::app_role)
  )
);