-- Remove the security definer view and use a different approach
DROP VIEW IF EXISTS public.marketplace_listings_public;

-- The marketplace_listings table already has good RLS policies
-- The issue is that user_id is exposed, but this is actually necessary
-- for users to manage their own listings and for creating marketplace rooms
-- The current RLS policies are appropriate:
-- - Anyone can view active listings (necessary for marketplace functionality)
-- - Users can only update/create their own listings
-- - Admins have full access

-- No changes needed - the existing RLS policies are secure and functional