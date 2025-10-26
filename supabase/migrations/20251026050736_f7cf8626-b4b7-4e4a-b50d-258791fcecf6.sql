-- Simplify the INSERT policy for chat_rooms
DROP POLICY IF EXISTS "VIP and admins can create rooms" ON public.chat_rooms;

-- Split into two simpler policies for better debugging
CREATE POLICY "VIP users can create marketplace rooms" 
ON public.chat_rooms 
FOR INSERT 
TO authenticated
WITH CHECK (
  type = 'marketplace' 
  AND is_vip_user(auth.uid())
);

CREATE POLICY "Admins can create any room" 
ON public.chat_rooms 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "VIP users can create private rooms" 
ON public.chat_rooms 
FOR INSERT 
TO authenticated
WITH CHECK (
  type = 'private' 
  AND is_vip_user(auth.uid())
);