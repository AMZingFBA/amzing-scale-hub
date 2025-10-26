-- Fix infinite recursion in chat_room_members policies
-- Drop the problematic policies
DROP POLICY IF EXISTS "Marketplace room creators can add members" ON public.chat_room_members;
DROP POLICY IF EXISTS "Admins can add members to marketplace rooms" ON public.chat_room_members;

-- Create a security definer function to check if user created a marketplace room
CREATE OR REPLACE FUNCTION public.is_marketplace_room_creator(_room_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.chat_rooms
    WHERE id = _room_id
    AND type = 'marketplace'
    AND created_by = _user_id
  )
$$;

-- Create new policy using the security definer function
CREATE POLICY "Marketplace room creators can add members" 
ON public.chat_room_members 
FOR INSERT 
WITH CHECK (
  is_marketplace_room_creator(room_id, auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);