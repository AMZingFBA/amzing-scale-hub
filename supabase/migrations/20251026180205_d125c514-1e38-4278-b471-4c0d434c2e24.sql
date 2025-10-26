-- Add category and subcategory columns to product_alerts table
ALTER TABLE public.product_alerts 
ADD COLUMN category TEXT,
ADD COLUMN subcategory TEXT;

-- Update the table name to be more generic
ALTER TABLE public.product_alerts RENAME TO admin_alerts;

-- Update RLS policies names
DROP POLICY "Admins can create alerts" ON public.admin_alerts;
DROP POLICY "Admins can update alerts" ON public.admin_alerts;
DROP POLICY "Admins can delete alerts" ON public.admin_alerts;
DROP POLICY "VIP users can view alerts" ON public.admin_alerts;

CREATE POLICY "Admins can create alerts"
ON public.admin_alerts
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update alerts"
ON public.admin_alerts
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete alerts"
ON public.admin_alerts
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "VIP users can view alerts"
ON public.admin_alerts
FOR SELECT
TO authenticated
USING (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));