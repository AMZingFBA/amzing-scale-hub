-- Simplify: anyone authenticated can create marketplace rooms
-- The business logic in the app controls who can click "Je veux acheter"
DROP POLICY IF EXISTS "VIP users can create marketplace rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "VIP users can create private rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "Admins can create any room" ON public.chat_rooms;

-- New simple policies
CREATE POLICY "Authenticated users can create marketplace rooms" 
ON public.chat_rooms 
FOR INSERT 
TO authenticated
WITH CHECK (
  type = 'marketplace'
);

CREATE POLICY "VIP users can create private rooms" 
ON public.chat_rooms 
FOR INSERT 
TO authenticated
WITH CHECK (
  type = 'private' 
  AND (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can create any room" 
ON public.chat_rooms 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);