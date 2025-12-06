-- Disable the problematic trigger on subscriptions table
DROP TRIGGER IF EXISTS sync_subscription_to_airtable ON public.subscriptions;