-- Add UPDATE policy for push_notification_tokens
CREATE POLICY "Users can update their own tokens"
ON public.push_notification_tokens
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);