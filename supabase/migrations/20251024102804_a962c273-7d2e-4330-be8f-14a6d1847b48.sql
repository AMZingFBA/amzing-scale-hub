-- Add is_trial column to distinguish trial from paid subscriptions
ALTER TABLE public.subscriptions
ADD COLUMN is_trial boolean DEFAULT false;

-- Create function to automatically expire subscriptions
CREATE OR REPLACE FUNCTION public.check_and_expire_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update expired VIP subscriptions back to free
  UPDATE public.subscriptions
  SET 
    plan_type = 'free',
    status = 'expired',
    is_trial = false
  WHERE 
    plan_type = 'vip'
    AND status = 'active'
    AND expires_at IS NOT NULL
    AND expires_at < now();
END;
$$;

-- Create a trigger function to check expiration on read
CREATE OR REPLACE FUNCTION public.check_subscription_expiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If subscription is expired, update it
  IF NEW.plan_type = 'vip' 
     AND NEW.status = 'active' 
     AND NEW.expires_at IS NOT NULL 
     AND NEW.expires_at < now() THEN
    
    NEW.plan_type := 'free';
    NEW.status := 'expired';
    NEW.is_trial := false;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to check expiration before select
CREATE TRIGGER check_expiry_before_update
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.check_subscription_expiry();