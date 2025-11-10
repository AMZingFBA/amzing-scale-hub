-- Create affiliate users table
CREATE TABLE public.affiliate_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  verification_code TEXT,
  password_hash TEXT NOT NULL,
  company_type TEXT NOT NULL,
  company_name TEXT,
  siret TEXT,
  billing_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  iban TEXT NOT NULL,
  bic TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals tracking table
CREATE TABLE public.affiliate_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES public.affiliate_users(id),
  referrer_user_id UUID NOT NULL REFERENCES public.affiliate_users(id),
  signup_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payment_status TEXT NOT NULL DEFAULT 'en attente',
  payment_month TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clicks tracking table (optional but useful)
CREATE TABLE public.affiliate_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL REFERENCES public.affiliate_users(id),
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source_ip TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.affiliate_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliate_users
CREATE POLICY "Users can view their own profile"
  ON public.affiliate_users
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.affiliate_users
  FOR UPDATE
  USING (id = auth.uid());

-- RLS Policies for affiliate_referrals
CREATE POLICY "Users can view their own referrals"
  ON public.affiliate_referrals
  FOR SELECT
  USING (referrer_user_id = auth.uid());

CREATE POLICY "System can insert referrals"
  ON public.affiliate_referrals
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for affiliate_clicks
CREATE POLICY "Users can view their own clicks"
  ON public.affiliate_clicks
  FOR SELECT
  USING (referrer_user_id = auth.uid());

CREATE POLICY "System can insert clicks"
  ON public.affiliate_clicks
  FOR INSERT
  WITH CHECK (true);

-- Create function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_affiliate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  code TEXT;
  exists_code BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 8-character alphanumeric code
    code := 'AFF-' || upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.affiliate_users WHERE referral_code = code) INTO exists_code;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT exists_code;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_affiliate_users_email ON public.affiliate_users(email);
CREATE INDEX idx_affiliate_users_referral_code ON public.affiliate_users(referral_code);
CREATE INDEX idx_affiliate_referrals_referrer ON public.affiliate_referrals(referrer_user_id);
CREATE INDEX idx_affiliate_referrals_referred ON public.affiliate_referrals(referred_email);