-- Fix the chat_messages SELECT policy to use security definer function
DROP POLICY IF EXISTS "VIP and admins can view messages" ON public.chat_messages;

CREATE POLICY "VIP and admins can view messages" 
ON public.chat_messages 
FOR SELECT 
TO authenticated
USING (
  is_vip_user(auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);