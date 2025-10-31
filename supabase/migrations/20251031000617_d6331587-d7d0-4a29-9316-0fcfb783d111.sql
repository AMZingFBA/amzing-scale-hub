-- Fix security issue: Remove VIP access to all profiles
-- Only admins should see all profiles, VIP users only see their own

-- Drop the overly permissive VIP policy
DROP POLICY IF EXISTS "VIP users can view all profiles" ON public.profiles;

-- The remaining policies are now:
-- 1. "Block unauthenticated access to profiles" - Blocks non-authenticated users
-- 2. "Users can view their own profile" - Users see only their own profile
-- 3. "Admins can view all profiles" - Only admins see all profiles
-- 4. "Users can update their own profile" - Users can update only their profile
-- 5. "Users can delete their own profile" - Users can delete only their profile

-- This ensures:
-- ✅ VIP users can only see their own profile (not others' emails/phones)
-- ✅ Regular users can only see their own profile
-- ✅ Only admins have access to all profiles (for moderation purposes)