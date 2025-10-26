-- Add subcategory column to tickets table to differentiate between buy and sell marketplace tickets
ALTER TABLE public.tickets 
ADD COLUMN subcategory text;

-- Add a comment explaining the column
COMMENT ON COLUMN public.tickets.subcategory IS 'Subcategory for marketplace tickets: buy or sell';