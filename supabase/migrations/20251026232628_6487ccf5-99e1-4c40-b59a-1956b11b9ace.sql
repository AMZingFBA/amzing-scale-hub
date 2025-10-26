-- Remove the overly permissive policy that exposes all user data
DROP POLICY IF EXISTS "Authenticated users can view other profiles" ON public.profiles;

-- Create a secure view that only exposes non-sensitive profile data
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  nickname,
  avatar_url,
  full_name
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO authenticated;

-- Update the policy to only allow users to see their own full profile data
CREATE POLICY "Users can view their own complete profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create function to get public profile info (for mentions, DM, etc)
CREATE OR REPLACE FUNCTION public.get_public_profile(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  nickname TEXT,
  avatar_url TEXT,
  full_name TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, nickname, avatar_url, full_name
  FROM public.profiles
  WHERE id = user_id_param;
$$;