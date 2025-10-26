-- Update handle_new_user function to include nickname
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
  INSERT INTO public.subscriptions (user_id, status, plan_type)
  VALUES (NEW.id, 'active', 'free');
  
  RETURN NEW;
END;
$$;