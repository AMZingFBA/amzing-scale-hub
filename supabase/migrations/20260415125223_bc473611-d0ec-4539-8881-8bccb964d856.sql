
CREATE TABLE public.failed_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  stripe_customer_id TEXT,
  stripe_invoice_id TEXT,
  stripe_subscription_id TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  failure_reason TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  rubypayeur_submitted BOOLEAN NOT NULL DEFAULT false,
  rubypayeur_submitted_at TIMESTAMP WITH TIME ZONE,
  rubypayeur_ref TEXT,
  rubypayeur_status TEXT DEFAULT 'pending',
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.failed_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view failed payments"
ON public.failed_payments FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update failed payments"
ON public.failed_payments FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete failed payments"
ON public.failed_payments FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_failed_payments_updated_at
BEFORE UPDATE ON public.failed_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_failed_payments_user_id ON public.failed_payments(user_id);
CREATE INDEX idx_failed_payments_email ON public.failed_payments(email);
CREATE INDEX idx_failed_payments_resolved ON public.failed_payments(resolved);
CREATE INDEX idx_failed_payments_rubypayeur_ref ON public.failed_payments(rubypayeur_ref);
