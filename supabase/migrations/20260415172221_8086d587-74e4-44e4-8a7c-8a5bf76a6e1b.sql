
-- Create admin deletion logs table
CREATE TABLE public.admin_deletion_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deleted_user_id UUID NOT NULL,
  deleted_user_email TEXT NOT NULL,
  deleted_user_name TEXT,
  deleted_user_phone TEXT,
  deleted_user_plan TEXT,
  deleted_user_stripe_customer_id TEXT,
  admin_id UUID NOT NULL,
  admin_email TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_deletion_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view deletion logs
CREATE POLICY "Only admins can view deletion logs"
ON public.admin_deletion_logs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert deletion logs
CREATE POLICY "Only admins can insert deletion logs"
ON public.admin_deletion_logs FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
