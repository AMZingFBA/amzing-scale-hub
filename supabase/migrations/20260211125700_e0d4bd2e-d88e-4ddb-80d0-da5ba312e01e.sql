
CREATE TABLE public.subscription_engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  engagement_months INTEGER NOT NULL DEFAULT 12,
  custom_monthly_amount NUMERIC DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage engagements"
ON public.subscription_engagements
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_subscription_engagements_updated_at
BEFORE UPDATE ON public.subscription_engagements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
