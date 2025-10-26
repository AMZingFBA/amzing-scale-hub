-- Mettre à jour la policy pour permettre l'accès à la room 'questions'
DROP POLICY IF EXISTS "VIP and admins can view all rooms" ON public.chat_rooms;

CREATE POLICY "VIP and admins can view all rooms" 
ON public.chat_rooms 
FOR SELECT 
USING (
  (type = ANY (ARRAY['general'::text, 'success'::text, 'sales'::text, 'questions'::text])) 
  OR 
  ((type = 'private'::text) AND (
    (EXISTS ( SELECT 1
     FROM subscriptions
    WHERE ((subscriptions.user_id = auth.uid()) AND (subscriptions.plan_type = 'vip'::text) AND (subscriptions.status = 'active'::text)))) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )) 
  OR 
  ((type = 'marketplace'::text) AND (
    (EXISTS ( SELECT 1
     FROM chat_room_members
    WHERE ((chat_room_members.room_id = chat_rooms.id) AND (chat_room_members.user_id = auth.uid())))) 
    OR has_role(auth.uid(), 'admin'::app_role)
  ))
);