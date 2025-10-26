-- Update DELETE policy for chat_rooms to include marketplace rooms
DROP POLICY IF EXISTS "Users can delete their own private rooms" ON public.chat_rooms;

CREATE POLICY "Users can delete their own private and marketplace rooms"
  ON public.chat_rooms FOR DELETE
  USING (
    ((type = 'private' OR type = 'marketplace') AND created_by = auth.uid()) 
    OR has_role(auth.uid(), 'admin'::app_role)
  );