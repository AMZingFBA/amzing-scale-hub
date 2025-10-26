-- Add DELETE policy for chat_rooms (only for private rooms created by the user)
CREATE POLICY "Users can delete their own private rooms"
  ON public.chat_rooms FOR DELETE
  USING (
    (type = 'private' AND created_by = auth.uid()) 
    OR has_role(auth.uid(), 'admin'::app_role)
  );