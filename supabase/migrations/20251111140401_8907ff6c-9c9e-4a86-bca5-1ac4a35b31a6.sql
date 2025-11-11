-- Allow admin (amzingfba26@gmail.com) to view all affiliate users
-- First, create a function to check if email is admin
CREATE OR REPLACE FUNCTION public.is_affiliate_admin(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _email = 'amzingfba26@gmail.com'
$$;

-- Add policy for admin to view all affiliate users
CREATE POLICY "Admin can view all affiliate users"
ON public.affiliate_users
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'amzingfba26@gmail.com'
  )
);