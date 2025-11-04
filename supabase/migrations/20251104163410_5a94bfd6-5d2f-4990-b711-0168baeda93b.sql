-- Add payment provider tracking columns to subscriptions
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS payment_provider text CHECK (payment_provider IN ('stripe', 'apple', 'free')) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
ADD COLUMN IF NOT EXISTS apple_transaction_id text;