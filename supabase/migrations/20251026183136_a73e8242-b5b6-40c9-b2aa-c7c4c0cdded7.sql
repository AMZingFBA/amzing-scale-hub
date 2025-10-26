-- Add DELETE policy for direct_conversations
CREATE POLICY "Users can delete their own conversations"
  ON public.direct_conversations FOR DELETE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id OR has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for direct_conversation_visibility
CREATE POLICY "Users can delete their own visibility settings"
  ON public.direct_conversation_visibility FOR DELETE
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));