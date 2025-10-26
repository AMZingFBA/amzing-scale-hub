-- Fix the marketplace room members insertion policy
-- The creator of a marketplace room should be able to add ANY members to that room

DROP POLICY IF EXISTS "Marketplace room creators can add members" ON public.chat_room_members;

-- New policy: if you created the marketplace room, you can add anyone to it
CREATE POLICY "Marketplace room creators can add members" 
ON public.chat_room_members 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.chat_rooms
    WHERE id = room_id
    AND type = 'marketplace'
    AND created_by = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);