-- Remove the security definer view as it's flagged as a security risk
DROP VIEW IF EXISTS public.public_profiles;

-- The function get_public_profile() is kept as it's needed for specific lookups
-- Applications should use this function when they need to display other users' basic info