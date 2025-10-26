-- Create marketplace_listings table
CREATE TABLE public.marketplace_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asin TEXT,
  ean TEXT,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  price_type TEXT NOT NULL DEFAULT 'TTC' CHECK (price_type IN ('TTC', 'HT')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Everyone can view active listings
CREATE POLICY "Anyone can view active listings"
ON public.marketplace_listings
FOR SELECT
USING (status = 'active' OR user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Users can create their own listings
CREATE POLICY "Users can create their own listings"
ON public.marketplace_listings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update their own listings"
ON public.marketplace_listings
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can update any listing
CREATE POLICY "Admins can update any listing"
ON public.marketplace_listings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete any listing
CREATE POLICY "Admins can delete any listing"
ON public.marketplace_listings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_marketplace_listings_updated_at
BEFORE UPDATE ON public.marketplace_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for marketplace images
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace-images', 'marketplace-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for marketplace images
CREATE POLICY "Anyone can view marketplace images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'marketplace-images');

CREATE POLICY "Users can upload marketplace images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'marketplace-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their marketplace images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'marketplace-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their marketplace images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'marketplace-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);