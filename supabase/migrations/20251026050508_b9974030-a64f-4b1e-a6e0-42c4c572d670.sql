-- Fix the chat_messages INSERT policy to use security definer function
DROP POLICY IF EXISTS "VIP users can send messages" ON public.chat_messages;

CREATE POLICY "VIP users can send messages" 
ON public.chat_messages 
FOR INSERT 
TO authenticated
WITH CHECK (
  (user_id = auth.uid()) 
  AND (
    is_vip_user(auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);