-- Drop existing constraint
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;

-- Add new constraint with 'unpaid' status
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_status_check 
CHECK (status = ANY (ARRAY['active'::text, 'expired'::text, 'canceled'::text, 'unpaid'::text]));