-- Drop the function that closes old tickets with CASCADE to drop dependent trigger
DROP FUNCTION IF EXISTS public.close_old_tickets() CASCADE;