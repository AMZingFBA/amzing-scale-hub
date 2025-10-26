-- Fix the role for chat_rooms INSERT policy
DROP POLICY IF EXISTS "VIP and admins can create rooms" ON public.chat_rooms;

-- Create policy with correct role: authenticated (not public)
CREATE POLICY "VIP and admins can create rooms" 
ON public.chat_rooms 
FOR INSERT 
TO authenticated
WITH CHECK (
  (
    -- For private rooms
    (type = 'private' AND (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role)))
    OR
    -- For marketplace rooms  
    (type = 'marketplace' AND (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role)))
  )
);