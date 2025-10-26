-- Create table for product alerts
CREATE TABLE public.product_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  link_url TEXT,
  file_type TEXT CHECK (file_type IN ('image', 'video', 'audio', 'document')),
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_alerts ENABLE ROW LEVEL SECURITY;

-- Admins can create alerts
CREATE POLICY "Admins can create alerts"
ON public.product_alerts
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update their own alerts
CREATE POLICY "Admins can update alerts"
ON public.product_alerts
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete alerts
CREATE POLICY "Admins can delete alerts"
ON public.product_alerts
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- VIP users and admins can view alerts
CREATE POLICY "VIP users can view alerts"
ON public.product_alerts
FOR SELECT
TO authenticated
USING (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_product_alerts_updated_at
BEFORE UPDATE ON public.product_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for alert files
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-alerts', 'product-alerts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product-alerts bucket
CREATE POLICY "Admins can upload alert files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-alerts' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update alert files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-alerts'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete alert files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-alerts'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "VIP users can view alert files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'product-alerts'
  AND (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
);