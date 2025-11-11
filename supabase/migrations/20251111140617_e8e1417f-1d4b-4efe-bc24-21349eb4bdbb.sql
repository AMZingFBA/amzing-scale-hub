-- Allow updating payment status for affiliate referrals
CREATE POLICY "Allow updating affiliate referrals for admin operations"
ON public.affiliate_referrals
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);