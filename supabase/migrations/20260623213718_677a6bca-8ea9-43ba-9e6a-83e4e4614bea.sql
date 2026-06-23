
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS vat_number text;
