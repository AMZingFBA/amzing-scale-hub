-- Add category column to tickets table
ALTER TABLE public.tickets 
ADD COLUMN category text DEFAULT 'general';

-- Add a comment to explain the column
COMMENT ON COLUMN public.tickets.category IS 'Category of the ticket: general, facture_autorisation, gestion_produit, marketplace, etc.';