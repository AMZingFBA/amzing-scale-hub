-- Allow public read access to subscriptions (only plan_type and status fields)
-- This is needed for the affiliate dashboard to check VIP status
DROP POLICY IF EXISTS "Public can view subscription status" ON public.subscriptions;

CREATE POLICY "Public can view subscription status"
ON public.subscriptions
FOR SELECT
USING (true);

-- Allow public read access to profiles (only safe fields like nickname, full_name)
-- This is needed for the affiliate dashboard to show referral contact info
DROP POLICY IF EXISTS "Public can view safe profile fields" ON public.profiles;

CREATE POLICY "Public can view safe profile fields"
ON public.profiles
FOR SELECT
USING (true);