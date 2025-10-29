-- Drop the old policy that only allows marketplace room creators
DROP POLICY IF EXISTS "Room creators and admins can add members" ON public.chat_room_members;

-- Create a new policy that allows group creators to add members too
CREATE POLICY "Room creators and admins can add members" 
ON public.chat_room_members 
FOR INSERT 
WITH CHECK (
  -- Allow if user is admin
  has_role(auth.uid(), 'admin'::app_role)
  OR
  -- Allow if user is the creator of a marketplace room
  is_marketplace_room_creator(room_id, auth.uid())
  OR
  -- Allow if user is the creator of a group room
  EXISTS (
    SELECT 1 
    FROM public.chat_rooms 
    WHERE id = chat_room_members.room_id 
      AND type = 'group' 
      AND created_by = auth.uid()
  )
);