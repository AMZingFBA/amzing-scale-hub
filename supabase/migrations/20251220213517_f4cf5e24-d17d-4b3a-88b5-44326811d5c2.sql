-- Create table for Android test requests
CREATE TABLE public.android_test_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  prenom TEXT,
  page TEXT DEFAULT 'home',
  source TEXT DEFAULT 'footer_android_button',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.android_test_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (no auth required for this form)
CREATE POLICY "Anyone can submit android test request" 
ON public.android_test_requests 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view requests
CREATE POLICY "Only admins can view android test requests" 
ON public.android_test_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Only admins can delete android test requests" 
ON public.android_test_requests 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));