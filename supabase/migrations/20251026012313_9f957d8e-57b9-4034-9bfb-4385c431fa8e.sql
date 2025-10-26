-- Create table to track unread messages
CREATE TABLE public.message_read_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS
ALTER TABLE public.message_read_status ENABLE ROW LEVEL SECURITY;

-- Users can view their own read status
CREATE POLICY "Users can view their own read status"
ON public.message_read_status
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own read status
CREATE POLICY "Users can insert their own read status"
ON public.message_read_status
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own read status
CREATE POLICY "Users can update their own read status"
ON public.message_read_status
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all read statuses
CREATE POLICY "Admins can view all read statuses"
ON public.message_read_status
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert read statuses for anyone
CREATE POLICY "Admins can insert read statuses"
ON public.message_read_status
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update any read status
CREATE POLICY "Admins can update any read status"
ON public.message_read_status
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Create function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_ticket_messages_as_read(ticket_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update read status for all messages in the ticket
  INSERT INTO public.message_read_status (message_id, user_id, is_read)
  SELECT m.id, auth.uid(), true
  FROM public.messages m
  WHERE m.ticket_id = ticket_id_param
  ON CONFLICT (message_id, user_id) 
  DO UPDATE SET is_read = true;
END;
$$;

-- Create function to get unread message count for a ticket
CREATE OR REPLACE FUNCTION public.get_unread_count(ticket_id_param UUID, user_id_param UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.messages m
  WHERE m.ticket_id = ticket_id_param
    AND m.user_id != user_id_param
    AND NOT EXISTS (
      SELECT 1 
      FROM public.message_read_status mrs
      WHERE mrs.message_id = m.id
        AND mrs.user_id = user_id_param
        AND mrs.is_read = true
    );
$$;