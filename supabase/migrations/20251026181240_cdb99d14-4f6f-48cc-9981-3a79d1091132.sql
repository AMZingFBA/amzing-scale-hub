-- Set default category for existing alerts that don't have one
UPDATE public.admin_alerts 
SET category = 'introduction' 
WHERE category IS NULL;

-- Add NOT NULL constraint to category column
ALTER TABLE public.admin_alerts 
ALTER COLUMN category SET DEFAULT 'introduction',
ALTER COLUMN category SET NOT NULL;