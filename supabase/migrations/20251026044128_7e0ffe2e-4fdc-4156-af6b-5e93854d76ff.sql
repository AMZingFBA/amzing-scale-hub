-- Clean up conflicting INSERT policies for chat_rooms
DROP POLICY IF EXISTS "VIP users can create private rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "VIP and admins can create marketplace rooms" ON public.chat_rooms;

-- Create a single, clear policy for VIP users and admins to create rooms
CREATE POLICY "VIP and admins can create rooms" 
ON public.chat_rooms 
FOR INSERT 
WITH CHECK (
  (
    -- For private rooms
    (type = 'private' AND (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role)))
    OR
    -- For marketplace rooms  
    (type = 'marketplace' AND (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role)))
  )
);