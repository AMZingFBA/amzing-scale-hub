-- Revert bucket to private
UPDATE storage.buckets 
SET public = false 
WHERE name = 'ticket-attachments';

-- Create RLS policies for secure access to ticket attachments
-- Users can view files from their own tickets
CREATE POLICY "Users can view attachments from their tickets"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'ticket-attachments' 
  AND (
    -- User owns the file
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    -- User has access to the ticket (through messages table)
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.tickets t ON t.id = m.ticket_id
      WHERE m.file_url LIKE '%' || (storage.foldername(name))[1] || '%'
        AND t.user_id = auth.uid()
    )
  )
);

-- Admins can view all attachments
CREATE POLICY "Admins can view all attachments"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'ticket-attachments'
  AND has_role(auth.uid(), 'admin')
);

-- Users can upload their own attachments
CREATE POLICY "Users can upload their own attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'ticket-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own attachments
CREATE POLICY "Users can delete their own attachments"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'ticket-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can delete any attachment
CREATE POLICY "Admins can delete any attachment"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'ticket-attachments'
  AND has_role(auth.uid(), 'admin')
);