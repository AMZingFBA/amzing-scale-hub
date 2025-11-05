-- Update the admin email in the assign_admin_role function
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the new user has the admin email
  IF NEW.email = 'amzingfba25@gmail.com' THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Manually assign admin role to the correct email if user already exists
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the user_id for amzingfba25@gmail.com from auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'amzingfba25@gmail.com';
  
  -- If user exists, assign admin role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;