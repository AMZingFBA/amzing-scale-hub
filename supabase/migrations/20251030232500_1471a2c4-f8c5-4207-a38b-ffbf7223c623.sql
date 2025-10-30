-- First, set NULL to duplicate phone numbers (keeping the most recent one)
WITH duplicates AS (
  SELECT phone, MIN(created_at) as first_created
  FROM public.profiles
  WHERE phone IS NOT NULL
  GROUP BY phone
  HAVING COUNT(*) > 1
)
UPDATE public.profiles p
SET phone = NULL
WHERE p.phone IN (SELECT phone FROM duplicates)
AND p.created_at > (
  SELECT first_created 
  FROM duplicates d 
  WHERE d.phone = p.phone
);

-- Add unique constraint on phone in profiles table
ALTER TABLE public.profiles ADD CONSTRAINT profiles_phone_unique UNIQUE (phone);

-- Add a flag to track if user has used their trial
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS trial_used boolean NOT NULL DEFAULT false;

-- Update existing VIP subscriptions to mark trial as used
UPDATE public.subscriptions 
SET trial_used = true 
WHERE is_trial = true AND plan_type = 'vip';

-- Create a function to check if user has already used trial
CREATE OR REPLACE FUNCTION public.has_used_trial(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = _user_id
    AND trial_used = true
  )
$$;

-- Update the handle_new_user function to include email verification requirement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with nickname
  INSERT INTO public.profiles (id, email, full_name, nickname)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'nickname', '')
  );
  
  -- Insert free subscription by default
  INSERT INTO public.subscriptions (user_id, status, plan_type, trial_used)
  VALUES (NEW.id, 'active', 'free', false);
  
  RETURN NEW;
END;
$$;