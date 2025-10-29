-- Create a table to track which alerts have been read by which users
CREATE TABLE public.alert_read_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id UUID NOT NULL REFERENCES public.admin_alerts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(alert_id, user_id)
);

-- Enable RLS
ALTER TABLE public.alert_read_status ENABLE ROW LEVEL SECURITY;

-- Users can view their own read status
CREATE POLICY "Users can view their own read status"
ON public.alert_read_status
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own read status
CREATE POLICY "Users can insert their own read status"
ON public.alert_read_status
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own read status
CREATE POLICY "Users can update their own read status"
ON public.alert_read_status
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all read statuses
CREATE POLICY "Admins can view all read statuses"
ON public.alert_read_status
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better performance
CREATE INDEX idx_alert_read_status_user_id ON public.alert_read_status(user_id);
CREATE INDEX idx_alert_read_status_alert_id ON public.alert_read_status(alert_id);

-- Create a function to get unread alerts count for a category/subcategory
CREATE OR REPLACE FUNCTION public.get_unread_alerts_count(
  user_id_param UUID,
  category_param TEXT,
  subcategory_param TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.admin_alerts a
  WHERE a.category = category_param
    AND (subcategory_param IS NULL OR a.subcategory = subcategory_param)
    AND NOT EXISTS (
      SELECT 1 
      FROM public.alert_read_status ars
      WHERE ars.alert_id = a.id
        AND ars.user_id = user_id_param
        AND ars.is_read = true
    );
$$;

-- Create a function to mark all alerts in a category/subcategory as read
CREATE OR REPLACE FUNCTION public.mark_alerts_as_read(
  category_param TEXT,
  subcategory_param TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.alert_read_status (alert_id, user_id, is_read)
  SELECT a.id, auth.uid(), true
  FROM public.admin_alerts a
  WHERE a.category = category_param
    AND (subcategory_param IS NULL OR a.subcategory = subcategory_param)
  ON CONFLICT (alert_id, user_id) 
  DO UPDATE SET is_read = true;
END;
$$;