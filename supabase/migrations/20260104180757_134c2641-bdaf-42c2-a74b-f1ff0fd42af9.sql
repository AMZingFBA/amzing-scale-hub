-- Table pour stocker les achats Suite (formation 1499,99€)
CREATE TABLE public.suite_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  amount NUMERIC(10,2) NOT NULL DEFAULT 1499.99,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.suite_purchases ENABLE ROW LEVEL SECURITY;

-- Only service role can insert/read (edge functions)
CREATE POLICY "Service role can manage suite_purchases"
ON public.suite_purchases
FOR ALL
USING (false)
WITH CHECK (false);

-- Index for email lookup
CREATE INDEX idx_suite_purchases_email ON public.suite_purchases(email);

-- Update handle_new_user to give lifetime VIP to Suite purchasers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  referral_code_param TEXT;
  affiliate_user_id UUID;
  has_suite_purchase BOOLEAN;
BEGIN
  -- Insert profile with nickname, phone and registration_source
  INSERT INTO public.profiles (id, email, full_name, nickname, phone, registration_source)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'nickname', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'registration_source', 'site')
  );
  
  -- Check if user purchased Suite (lifetime VIP)
  SELECT EXISTS(SELECT 1 FROM public.suite_purchases WHERE email = NEW.email) INTO has_suite_purchase;
  
  IF has_suite_purchase THEN
    -- Suite purchaser: lifetime VIP (no expires_at)
    INSERT INTO public.subscriptions (user_id, status, plan_type, trial_used, payment_provider)
    VALUES (NEW.id, 'active', 'vip', true, 'stripe_suite');
  ELSE
    -- Regular user: free plan
    INSERT INTO public.subscriptions (user_id, status, plan_type, trial_used)
    VALUES (NEW.id, 'active', 'free', false);
  END IF;
  
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