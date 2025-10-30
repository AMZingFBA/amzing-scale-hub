-- Create table for verification codes
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email_change', 'password_change')),
  new_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  used BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Users can only view their own codes
CREATE POLICY "Users can view their own codes"
  ON public.verification_codes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own codes
CREATE POLICY "Users can insert their own codes"
  ON public.verification_codes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own codes
CREATE POLICY "Users can update their own codes"
  ON public.verification_codes
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_verification_codes_user_id ON public.verification_codes(user_id);
CREATE INDEX idx_verification_codes_expires_at ON public.verification_codes(expires_at);