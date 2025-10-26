-- Fix profiles table: Allow authenticated users to view basic profile info of other users
CREATE POLICY "Authenticated users can view other profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Fix chat_rooms: Add authentication requirement for viewing public rooms
DROP POLICY IF EXISTS "VIP and admins can view all rooms" ON public.chat_rooms;

CREATE POLICY "Authenticated users can view all rooms"
ON public.chat_rooms
FOR SELECT
TO authenticated
USING (
  (type = ANY (ARRAY['general'::text, 'success'::text, 'sales'::text, 'questions'::text]))
  OR ((type = 'private'::text) AND (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role)))
  OR ((type = 'marketplace'::text) AND ((EXISTS (SELECT 1 FROM chat_room_members WHERE room_id = chat_rooms.id AND user_id = auth.uid())) OR has_role(auth.uid(), 'admin'::app_role)))
);

-- Note: For marketplace listings user_id exposure, this is working as intended 
-- since buyers need to contact sellers. The exposure is acceptable for the business logic.