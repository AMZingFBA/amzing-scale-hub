-- Update the admin email back to amzingfba26@gmail.com
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the new user has the admin email
  IF NEW.email = 'amzingfba26@gmail.com' THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Remove admin role from amzingfba25@gmail.com if exists
DO $$
DECLARE
  old_admin_id uuid;
BEGIN
  SELECT id INTO old_admin_id
  FROM auth.users
  WHERE email = 'amzingfba25@gmail.com';
  
  IF old_admin_id IS NOT NULL THEN
    DELETE FROM public.user_roles
    WHERE user_id = old_admin_id AND role = 'admin';
  END IF;
END;
$$;

-- Assign admin role to amzingfba26@gmail.com
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'amzingfba26@gmail.com';
  
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;