-- Fix chat_messages policies to allow marketplace room members to send messages
-- without checking VIP status again (they're already authorized if they're members)

DROP POLICY IF EXISTS "VIP users can send messages" ON public.chat_messages;

-- Allow sending messages if:
-- 1. You're a member of a marketplace room, OR
-- 2. You're VIP for other room types, OR
-- 3. You're admin
CREATE POLICY "Users can send messages in their rooms" 
ON public.chat_messages 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    -- If it's a marketplace room, just check membership
    EXISTS (
      SELECT 1 
      FROM chat_rooms cr
      JOIN chat_room_members crm ON cr.id = crm.room_id
      WHERE crm.room_id = room_id
        AND crm.user_id = auth.uid()
        AND cr.type = 'marketplace'
    )
    OR
    -- For other room types, check VIP or admin
    (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- Same for viewing messages
DROP POLICY IF EXISTS "VIP and admins can view messages" ON public.chat_messages;

CREATE POLICY "Users can view messages in their rooms" 
ON public.chat_messages 
FOR SELECT 
TO authenticated
USING (
  -- If it's a marketplace room, just check membership
  EXISTS (
    SELECT 1 
    FROM chat_rooms cr
    JOIN chat_room_members crm ON cr.id = crm.room_id
    WHERE crm.room_id = room_id
      AND crm.user_id = auth.uid()
      AND cr.type = 'marketplace'
  )
  OR
  -- For other room types, check VIP or admin
  (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
);