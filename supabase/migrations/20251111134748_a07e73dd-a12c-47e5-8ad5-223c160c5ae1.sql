-- Add payment tracking fields to affiliate_referrals
ALTER TABLE public.affiliate_referrals 
ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'en attente',
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_month TEXT;

-- Add comment to explain payment_status values
COMMENT ON COLUMN public.affiliate_referrals.payment_status IS 'Status: en attente, payé';