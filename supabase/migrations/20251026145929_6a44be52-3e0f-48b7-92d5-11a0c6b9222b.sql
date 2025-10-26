-- Add images column to marketplace_buy_requests table
ALTER TABLE public.marketplace_buy_requests
ADD COLUMN images text[] DEFAULT '{}';

COMMENT ON COLUMN public.marketplace_buy_requests.images IS 'Array of image URLs for the buy request';