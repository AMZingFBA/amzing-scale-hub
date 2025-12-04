-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Function to sync user to Airtable in real-time
CREATE OR REPLACE FUNCTION public.sync_user_to_airtable_realtime()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  user_email TEXT;
  user_name TEXT;
  sub_status TEXT;
  sub_type TEXT;
  stripe_id TEXT;
  started TEXT;
  airtable_api_key TEXT;
  airtable_base_id TEXT;
  request_body JSONB;
BEGIN
  -- Get secrets
  SELECT decrypted_secret INTO airtable_api_key FROM vault.decrypted_secrets WHERE name = 'AIRTABLE_API_KEY' LIMIT 1;
  SELECT decrypted_secret INTO airtable_base_id FROM vault.decrypted_secrets WHERE name = 'AIRTABLE_BASE_ID' LIMIT 1;
  
  -- Get user data based on trigger source
  IF TG_TABLE_NAME = 'profiles' THEN
    user_email := NEW.email;
    user_name := COALESCE(NEW.full_name, '');
    
    -- Get subscription data
    SELECT 
      COALESCE(s.status, 'inactive'),
      COALESCE(s.plan_type, 'free'),
      COALESCE(s.stripe_customer_id, ''),
      COALESCE(to_char(s.started_at, 'YYYY-MM-DD'), '')
    INTO sub_status, sub_type, stripe_id, started
    FROM subscriptions s WHERE s.user_id = NEW.id;
    
  ELSIF TG_TABLE_NAME = 'subscriptions' THEN
    -- Get profile data
    SELECT p.email, COALESCE(p.full_name, '')
    INTO user_email, user_name
    FROM profiles p WHERE p.id = NEW.user_id;
    
    sub_status := COALESCE(NEW.status, 'inactive');
    sub_type := COALESCE(NEW.plan_type, 'free');
    stripe_id := COALESCE(NEW.stripe_customer_id, '');
    started := COALESCE(to_char(NEW.started_at, 'YYYY-MM-DD'), '');
  END IF;
  
  -- Skip if no email
  IF user_email IS NULL OR user_email = '' THEN
    RETURN NEW;
  END IF;
  
  -- Build request body
  request_body := jsonb_build_object(
    'user', jsonb_build_object(
      'email', user_email,
      'full_name', user_name,
      'plan_type', sub_type,
      'status', sub_status,
      'stripe_customer_id', stripe_id,
      'started_at', started
    )
  );
  
  -- Make async HTTP call to edge function
  PERFORM extensions.http_post(
    url := 'https://wvmfzlogijvqcsgablrb.supabase.co/functions/v1/sync-user-to-airtable',
    body := request_body::text,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bWZ6bG9naWp2cWNzZ2FibHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTI3MTYsImV4cCI6MjA3NjgyODcxNn0.4ciuBXzeLQB4RatGnJuXJemQ_w6xr5f8Bhm2SUOzdtY'
    )::jsonb
  );
  
  RETURN NEW;
END;
$function$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS sync_profile_to_airtable ON public.profiles;
CREATE TRIGGER sync_profile_to_airtable
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_to_airtable_realtime();

-- Create trigger on subscriptions table  
DROP TRIGGER IF EXISTS sync_subscription_to_airtable ON public.subscriptions;
CREATE TRIGGER sync_subscription_to_airtable
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_to_airtable_realtime();