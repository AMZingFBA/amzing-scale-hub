-- Drop and recreate handle_new_user trigger to handle referrals
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved handle_new_user function with referral logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referral_code_param TEXT;
  affiliate_user_id UUID;
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
  INSERT INTO public.alert_read_status (alert_id, user_id, is_read)
  SELECT id, NEW.id, true
  FROM public.admin_alerts
  ON CONFLICT (alert_id, user_id) DO NOTHING;
  
  -- Check if user was referred by an affiliate
  referral_code_param := NEW.raw_user_meta_data->>'referral_code';
  
  IF referral_code_param IS NOT NULL THEN
    -- Find the affiliate user by referral code
    SELECT id INTO affiliate_user_id
    FROM public.affiliate_users
    WHERE referral_code = referral_code_param;
    
    -- If affiliate found, create referral
    IF affiliate_user_id IS NOT NULL THEN
      INSERT INTO public.affiliate_referrals (
        referrer_user_id,
        referred_email,
        referred_user_id
      )
      VALUES (
        affiliate_user_id,
        NEW.email,
        NEW.id
      )
      ON CONFLICT DO NOTHING;
      
      RAISE LOG 'Referral created for user % with affiliate %', NEW.id, affiliate_user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();