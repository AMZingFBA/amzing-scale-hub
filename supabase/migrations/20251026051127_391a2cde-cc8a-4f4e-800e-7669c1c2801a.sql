-- Create security definer functions to avoid RLS recursion issues

-- Check if user is a member of a specific room
CREATE OR REPLACE FUNCTION public.is_room_member(_room_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.chat_room_members
    WHERE room_id = _room_id
      AND user_id = _user_id
  )
$$;

-- Check if a room is a marketplace room
CREATE OR REPLACE FUNCTION public.is_marketplace_room(_room_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.chat_rooms
    WHERE id = _room_id
      AND type = 'marketplace'
  )
$$;

-- Now update the chat_messages policies to use these functions
DROP POLICY IF EXISTS "Users can send messages in their rooms" ON public.chat_messages;

CREATE POLICY "Users can send messages in their rooms" 
ON public.chat_messages 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    -- If it's a marketplace room, just check membership
    (is_marketplace_room(room_id) AND is_room_member(room_id, auth.uid()))
    OR
    -- For other room types, check VIP or admin
    (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
  )
);

DROP POLICY IF EXISTS "Users can view messages in their rooms" ON public.chat_messages;

CREATE POLICY "Users can view messages in their rooms" 
ON public.chat_messages 
FOR SELECT 
TO authenticated
USING (
  -- If it's a marketplace room, just check membership
  (is_marketplace_room(room_id) AND is_room_member(room_id, auth.uid()))
  OR
  -- For other room types, check VIP or admin
  (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
);