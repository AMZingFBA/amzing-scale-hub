-- Add foreign key from subscriptions to profiles if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'subscriptions_user_id_fkey' 
    AND table_name = 'subscriptions'
  ) THEN
    ALTER TABLE public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;