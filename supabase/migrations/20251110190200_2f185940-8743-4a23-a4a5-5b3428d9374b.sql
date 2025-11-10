-- Drop old RLS policies on affiliate_referrals
DROP POLICY IF EXISTS "Users can view their own referrals" ON public.affiliate_referrals;
DROP POLICY IF EXISTS "System can insert referrals" ON public.affiliate_referrals;

-- Create new RLS policies that allow public read access
-- Since affiliate system uses localStorage auth, not Supabase auth
CREATE POLICY "Anyone can view referrals"
ON public.affiliate_referrals
FOR SELECT
USING (true);

CREATE POLICY "System can insert referrals"
ON public.affiliate_referrals
FOR INSERT
WITH CHECK (true);