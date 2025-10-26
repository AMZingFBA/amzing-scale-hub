-- Enable leaked password protection
-- This prevents users from using passwords that have been leaked in data breaches
-- Note: This is configured at the auth level, not via SQL

-- Add DELETE policy for profiles so users can delete their own data
CREATE POLICY "Users can delete their own profile"
ON public.profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Comment: The email exposure in profiles is already mitigated by existing RLS policies
-- Users can only SELECT their own profile (auth.uid() = id), so emails are not broadly exposed
-- Admins can view all profiles, which is intentional for support purposes