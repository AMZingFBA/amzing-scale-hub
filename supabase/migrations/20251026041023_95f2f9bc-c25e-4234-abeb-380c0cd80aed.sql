-- Allow adding members to marketplace rooms
-- The creator of a marketplace room should be able to add other members

-- Add new policy for marketplace room creators to add members
CREATE POLICY "Marketplace room creators can add members" 
ON public.chat_room_members 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_rooms
    WHERE chat_rooms.id = chat_room_members.room_id
    AND chat_rooms.type = 'marketplace'
    AND chat_rooms.created_by = auth.uid()
  )
);

-- Also allow admins to add anyone to marketplace rooms
CREATE POLICY "Admins can add members to marketplace rooms" 
ON public.chat_room_members 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.chat_rooms
    WHERE chat_rooms.id = chat_room_members.room_id
    AND chat_rooms.type = 'marketplace'
  )
);