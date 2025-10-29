-- Mettre à jour la politique de vue pour inclure sales et success
DROP POLICY IF EXISTS "Authenticated users can view all rooms" ON public.chat_rooms;

CREATE POLICY "Authenticated users can view all rooms"
ON public.chat_rooms
FOR SELECT
TO authenticated
USING (
  (type = ANY (ARRAY['general', 'products', 'sales', 'success', 'questions'])) 
  OR ((type = 'private' OR type = 'group') AND (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin')))
  OR ((type = 'marketplace') AND (
    (EXISTS (
      SELECT 1
      FROM chat_room_members
      WHERE chat_room_members.room_id = chat_rooms.id 
      AND chat_room_members.user_id = auth.uid()
    )) 
    OR has_role(auth.uid(), 'admin')
  ))
  OR ((type = 'group') AND (
    (EXISTS (
      SELECT 1
      FROM chat_room_members
      WHERE chat_room_members.room_id = chat_rooms.id 
      AND chat_room_members.user_id = auth.uid()
    ))
    OR has_role(auth.uid(), 'admin')
  ))
);