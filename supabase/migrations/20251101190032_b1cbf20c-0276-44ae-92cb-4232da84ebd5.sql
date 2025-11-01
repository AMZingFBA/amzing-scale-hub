-- Fix security issues for profiles, verification_codes, and chat_messages tables

-- 1. Fix profiles table security
-- Drop existing policies that might be too permissive
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create more restrictive policies for profiles
-- Only allow users to see their own profile data
CREATE POLICY "Users can view only their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix verification_codes table security
-- These codes should NEVER be readable by users via the API
-- Drop the SELECT policy that allows users to view their codes
DROP POLICY IF EXISTS "Users can view their own codes" ON public.verification_codes;

-- Verification codes should only be accessible by backend functions
-- Users should NOT be able to SELECT their verification codes for security
-- The verification is done server-side via edge functions

-- 3. Strengthen chat_messages security
-- Add additional check to ensure only legitimate room members can access messages
DROP POLICY IF EXISTS "Users can view messages in their rooms" ON public.chat_messages;

-- Recreate with stronger validation
CREATE POLICY "Users can view messages in their rooms"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  -- Admins can view all
  has_role(auth.uid(), 'admin'::app_role)
  OR
  -- For marketplace rooms, must be a member
  (is_marketplace_room(room_id) AND is_room_member(room_id, auth.uid()))
  OR
  -- For general/category rooms, must be VIP or admin
  (
    EXISTS (
      SELECT 1 FROM chat_rooms cr 
      WHERE cr.id = chat_messages.room_id 
      AND cr.type IN ('general', 'products', 'sales', 'success', 'questions')
    ) 
    AND (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
  )
  OR
  -- For group rooms, must be a member
  (
    EXISTS (
      SELECT 1 FROM chat_rooms cr 
      WHERE cr.id = chat_messages.room_id 
      AND cr.type = 'group'
      AND is_room_member(chat_messages.room_id, auth.uid())
    )
  )
);

-- 4. Add policy to prevent public access to profiles sensitive data
-- Ensure no unauthenticated access is possible
CREATE POLICY "Block public access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- 5. Add policy to prevent any public access to verification codes
CREATE POLICY "Block all public access to verification codes"
ON public.verification_codes
FOR ALL
TO anon
USING (false);

-- 6. Ensure verification codes are not selectable even by authenticated users
-- Only backend (service role) should access these
CREATE POLICY "Block authenticated user SELECT on verification codes"
ON public.verification_codes
FOR SELECT
TO authenticated
USING (false);