-- Make ticket-attachments bucket public so images can be displayed
UPDATE storage.buckets 
SET public = true 
WHERE name = 'ticket-attachments';