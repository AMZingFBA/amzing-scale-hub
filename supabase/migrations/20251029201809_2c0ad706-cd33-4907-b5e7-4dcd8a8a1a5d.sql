-- Fix critical security issues

-- 1. Block unauthenticated access to profiles table
CREATE POLICY "Block unauthenticated access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- 2. Restrict chat_room_members access to only rooms user is member of
DROP POLICY IF EXISTS "Authenticated users can view members" ON public.chat_room_members;

CREATE POLICY "Users can view members of their rooms"
ON public.chat_room_members
FOR SELECT
TO authenticated
USING (
  is_room_member(room_id, auth.uid()) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- 3. Create a view for marketplace listings without exposing user_id
CREATE OR REPLACE VIEW public.marketplace_listings_public AS
SELECT 
  id,
  title,
  description,
  asin,
  ean,
  quantity,
  price,
  price_type,
  status,
  images,
  created_at,
  updated_at
FROM public.marketplace_listings
WHERE status = 'active';

-- Grant access to the view
GRANT SELECT ON public.marketplace_listings_public TO authenticated, anon;