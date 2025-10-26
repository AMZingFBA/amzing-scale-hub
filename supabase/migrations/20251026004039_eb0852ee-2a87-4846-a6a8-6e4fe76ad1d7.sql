-- Function to check if user has open tickets
CREATE OR REPLACE FUNCTION public.has_open_ticket(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tickets
    WHERE user_id = _user_id
      AND status IN ('open', 'in_progress')
  )
$$;

-- Function to auto-close old tickets when creating new one
CREATE OR REPLACE FUNCTION public.close_old_tickets()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Close all open/in_progress tickets for this user
  UPDATE public.tickets
  SET 
    status = 'closed',
    closed_at = now()
  WHERE 
    user_id = NEW.user_id
    AND status IN ('open', 'in_progress')
    AND id != NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-close old tickets
DROP TRIGGER IF EXISTS close_old_tickets_on_new ON public.tickets;
CREATE TRIGGER close_old_tickets_on_new
AFTER INSERT ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.close_old_tickets();