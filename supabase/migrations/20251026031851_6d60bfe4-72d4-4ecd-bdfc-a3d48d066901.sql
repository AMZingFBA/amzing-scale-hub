-- Create buy requests table for marketplace
CREATE TABLE IF NOT EXISTS public.marketplace_buy_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asin TEXT,
  ean TEXT,
  title TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  max_price NUMERIC,
  price_type TEXT NOT NULL DEFAULT 'TTC',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_buy_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for buy requests
CREATE POLICY "Anyone can view active buy requests"
  ON public.marketplace_buy_requests
  FOR SELECT
  USING (status = 'active' OR user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own buy requests"
  ON public.marketplace_buy_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buy requests"
  ON public.marketplace_buy_requests
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any buy request"
  ON public.marketplace_buy_requests
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete any buy request"
  ON public.marketplace_buy_requests
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_marketplace_buy_requests_updated_at
  BEFORE UPDATE ON public.marketplace_buy_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();