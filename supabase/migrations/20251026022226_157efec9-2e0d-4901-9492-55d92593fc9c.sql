-- Drop existing policies if they exist
DROP POLICY IF EXISTS "VIP users can upload chat files" ON storage.objects;
DROP POLICY IF EXISTS "VIP users can read chat files" ON storage.objects;

-- Create RLS policies for chat-files bucket to allow audio uploads
CREATE POLICY "VIP users can upload chat files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-files' 
  AND (
    EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE user_id = auth.uid() 
      AND plan_type = 'vip' 
      AND status = 'active'
    ) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "VIP users can read chat files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-files' 
  AND (
    EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE user_id = auth.uid() 
      AND plan_type = 'vip' 
      AND status = 'active'
    ) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Allow admins to update room names
CREATE POLICY "Room creators can update their rooms"
ON public.chat_rooms FOR UPDATE
TO authenticated
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));