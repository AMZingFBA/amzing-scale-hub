-- Permettre aux utilisateurs VIP et admins de voir tous les profils (pour la recherche de membres)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own complete profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "VIP users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'));

-- Modifier les policies des conversations directes pour permettre aux admins de voir toutes les conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.direct_conversations;

CREATE POLICY "Users can view their own conversations"
ON public.direct_conversations
FOR SELECT
TO authenticated
USING ((auth.uid() = user1_id) OR (auth.uid() = user2_id) OR has_role(auth.uid(), 'admin'));

-- Modifier les policies des messages directs pour permettre aux admins de voir tous les messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.direct_messages;

CREATE POLICY "Users can view messages in their conversations"
ON public.direct_messages
FOR SELECT
TO authenticated
USING (
  (EXISTS (
    SELECT 1
    FROM direct_conversations dc
    WHERE dc.id = direct_messages.conversation_id 
    AND ((dc.user1_id = auth.uid()) OR (dc.user2_id = auth.uid()))
  )) 
  OR has_role(auth.uid(), 'admin')
);

-- Ajouter un type de salon 'group' pour les groupes
ALTER TABLE public.chat_rooms 
DROP CONSTRAINT IF EXISTS chat_rooms_type_check;

ALTER TABLE public.chat_rooms
ADD CONSTRAINT chat_rooms_type_check 
CHECK (type IN ('general', 'private', 'marketplace', 'products', 'group'));

-- Permettre la création de groupes par les utilisateurs VIP
DROP POLICY IF EXISTS "VIP users can create private rooms" ON public.chat_rooms;

CREATE POLICY "VIP users can create private and group rooms"
ON public.chat_rooms
FOR INSERT
TO authenticated
WITH CHECK (
  ((type = 'private' OR type = 'group') AND (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin')))
);

-- Modifier la politique de vue des salons pour inclure les groupes et l'accès admin
DROP POLICY IF EXISTS "Authenticated users can view all rooms" ON public.chat_rooms;

CREATE POLICY "Authenticated users can view all rooms"
ON public.chat_rooms
FOR SELECT
TO authenticated
USING (
  (type = ANY (ARRAY['general', 'products'])) 
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

-- Permettre aux utilisateurs de supprimer leurs groupes
DROP POLICY IF EXISTS "Users can delete their own private and marketplace rooms" ON public.chat_rooms;

CREATE POLICY "Users can delete their own private, marketplace and group rooms"
ON public.chat_rooms
FOR DELETE
TO authenticated
USING (
  (((type = 'private') OR (type = 'marketplace') OR (type = 'group')) AND (created_by = auth.uid())) 
  OR has_role(auth.uid(), 'admin')
);

-- Permettre aux admins de voir tous les messages même dans les salons dont ils ne sont pas membres
DROP POLICY IF EXISTS "Users can view messages in their rooms" ON public.chat_messages;

CREATE POLICY "Users can view messages in their rooms"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin')
  OR (is_marketplace_room(room_id) AND is_room_member(room_id, auth.uid()))
  OR (is_vip_user(auth.uid()) AND NOT is_marketplace_room(room_id))
  OR (EXISTS (
    SELECT 1 FROM chat_rooms cr 
    WHERE cr.id = room_id 
    AND cr.type = 'group' 
    AND is_room_member(room_id, auth.uid())
  ))
);

-- Permettre l'envoi de messages dans les groupes
DROP POLICY IF EXISTS "Users can send messages in their rooms" ON public.chat_messages;

CREATE POLICY "Users can send messages in their rooms"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  (user_id = auth.uid()) 
  AND (
    has_role(auth.uid(), 'admin')
    OR (is_marketplace_room(room_id) AND is_room_member(room_id, auth.uid()))
    OR (is_vip_user(auth.uid()) AND NOT is_marketplace_room(room_id))
    OR (EXISTS (
      SELECT 1 FROM chat_rooms cr 
      WHERE cr.id = room_id 
      AND cr.type = 'group' 
      AND is_room_member(room_id, auth.uid())
    ))
  )
);