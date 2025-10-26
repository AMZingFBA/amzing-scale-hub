-- Ensure chat-files bucket is public for audio playback
UPDATE storage.buckets 
SET public = true 
WHERE id = 'chat-files';