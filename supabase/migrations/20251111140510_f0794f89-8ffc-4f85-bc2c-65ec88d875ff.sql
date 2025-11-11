-- Drop the restrictive policy that requires auth
DROP POLICY IF EXISTS "Admin can view all affiliate users" ON public.affiliate_users;

-- Create a more permissive policy for service-level queries
-- This allows the application to read affiliate user data when needed for admin operations
CREATE POLICY "Allow reading affiliate users for admin operations"
ON public.affiliate_users
FOR SELECT
TO authenticated, anon
USING (true);