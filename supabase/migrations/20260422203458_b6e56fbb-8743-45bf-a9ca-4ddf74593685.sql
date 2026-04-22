CREATE OR REPLACE FUNCTION public.sync_user_to_airtable_realtime()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_email TEXT;
  user_name TEXT;
  user_phone TEXT;
  user_siren TEXT;
  user_company TEXT;
  sub_status TEXT;
  sub_type TEXT;
  stripe_id TEXT;
  started TEXT;
  expires TEXT;
  request_body JSONB;
BEGIN
  IF TG_TABLE_NAME = 'profiles' THEN
    user_email := NEW.email;
    user_name := COALESCE(NEW.full_name, '');
    user_phone := COALESCE(NEW.phone, '');
    user_siren := COALESCE(NEW.siren, '');
    user_company := COALESCE(NEW.company_name, '');
    
    SELECT 
      COALESCE(s.status, 'inactive'),
      COALESCE(s.plan_type, 'free'),
      COALESCE(s.stripe_customer_id, ''),
      COALESCE(to_char(s.started_at, 'YYYY-MM-DD'), ''),
      COALESCE(to_char(s.expires_at, 'YYYY-MM-DD'), '')
    INTO sub_status, sub_type, stripe_id, started, expires
    FROM subscriptions s WHERE s.user_id = NEW.id;
    
  ELSIF TG_TABLE_NAME = 'subscriptions' THEN
    SELECT p.email, COALESCE(p.full_name, ''), COALESCE(p.phone, ''), COALESCE(p.siren, ''), COALESCE(p.company_name, '')
    INTO user_email, user_name, user_phone, user_siren, user_company
    FROM profiles p WHERE p.id = NEW.user_id;
    
    sub_status := COALESCE(NEW.status, 'inactive');
    sub_type := COALESCE(NEW.plan_type, 'free');
    stripe_id := COALESCE(NEW.stripe_customer_id, '');
    started := COALESCE(to_char(NEW.started_at, 'YYYY-MM-DD'), '');
    expires := COALESCE(to_char(NEW.expires_at, 'YYYY-MM-DD'), '');
  END IF;
  
  IF user_email IS NULL OR user_email = '' THEN
    RETURN NEW;
  END IF;
  
  request_body := jsonb_build_object(
    'user', jsonb_build_object(
      'email', user_email,
      'full_name', user_name,
      'phone', user_phone,
      'siren', user_siren,
      'company_name', user_company,
      'plan_type', sub_type,
      'status', sub_status,
      'stripe_customer_id', stripe_id,
      'started_at', started,
      'expires_at', expires
    )
  );
  
  PERFORM net.http_post(
    url := 'https://wvmfzlogijvqcsgablrb.supabase.co/functions/v1/sync-user-to-airtable',
    body := request_body,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bWZ6bG9naWp2cWNzZ2FibHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTI3MTYsImV4cCI6MjA3NjgyODcxNn0.4ciuBXzeLQB4RatGnJuXJemQ_w6xr5f8Bhm2SUOzdtY'
    )
  );
  
  RETURN NEW;
END;
$function$;