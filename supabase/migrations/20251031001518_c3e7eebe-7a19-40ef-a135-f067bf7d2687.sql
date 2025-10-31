-- Remove the fragile RESTRICTIVE policy that provides false sense of security
-- The other policies already handle authentication correctly

DROP POLICY IF EXISTS "Block unauthenticated access to profiles" ON public.profiles;

-- Current security after this change:
-- ✅ Unauthenticated users: No access (no policy matches)
-- ✅ Regular users: See only their own profile (policy: "Users can view their own profile")
-- ✅ Admins: See all profiles (policy: "Admins can view all profiles")
-- ✅ Simpler and more secure (no misleading RESTRICTIVE policy)