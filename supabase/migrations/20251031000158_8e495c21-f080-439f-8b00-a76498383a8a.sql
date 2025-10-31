-- Update handle_new_user function to mark all existing alerts as read for new users
-- This prevents new VIP members from having thousands of unread notifications

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with nickname
  INSERT INTO public.profiles (id, email, full_name, nickname)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'nickname', '')
  );
  
  -- Insert free subscription by default
  INSERT INTO public.subscriptions (user_id, status, plan_type, trial_used)
  VALUES (NEW.id, 'active', 'free', false);
  
  -- Mark all existing alerts as read for the new user
  -- This prevents new members from having thousands of old notifications
  INSERT INTO public.alert_read_status (alert_id, user_id, is_read)
  SELECT id, NEW.id, true
  FROM public.admin_alerts
  ON CONFLICT (alert_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;