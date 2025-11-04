-- Create table to track sent push notifications
CREATE TABLE IF NOT EXISTS public.push_notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  alert_id UUID NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, alert_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_notification_history_user_alert 
ON public.push_notification_history(user_id, alert_id);

-- RLS policies
ALTER TABLE public.push_notification_history ENABLE ROW LEVEL SECURITY;

-- Admins can view all history
CREATE POLICY "Admins can view notification history"
ON public.push_notification_history
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert (edge functions)
CREATE POLICY "Service role can insert notification history"
ON public.push_notification_history
FOR INSERT
TO service_role
WITH CHECK (true);