-- Fix the infinite recursion in chat_room_members policies
-- The problem: policies check chat_rooms which check chat_room_members = infinite loop

-- Create a simple security definer function to check if user created a marketplace room
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

-- Simplify chat_room_members policies to avoid recursion
DROP POLICY IF EXISTS "Marketplace room creators can add members" ON public.chat_room_members;
DROP POLICY IF EXISTS "VIP and admins can view members" ON public.chat_room_members;
DROP POLICY IF EXISTS "VIP users can join rooms" ON public.chat_room_members;

-- Simple policy: room creator can add members OR admin
CREATE POLICY "Room creators and admins can add members" 
ON public.chat_room_members 
FOR INSERT 
TO authenticated
WITH CHECK (
  is_marketplace_room_creator(room_id, auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Anyone authenticated can view members (needed for chat functionality)
CREATE POLICY "Authenticated users can view members" 
ON public.chat_room_members 
FOR SELECT 
TO authenticated
USING (true);