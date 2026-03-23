-- Add new fee columns to mp_lookup_results
ALTER TABLE mp_lookup_results ADD COLUMN IF NOT EXISTS dst_fee NUMERIC;
ALTER TABLE mp_lookup_results ADD COLUMN IF NOT EXISTS total_fees_fba NUMERIC;
ALTER TABLE mp_lookup_results ADD COLUMN IF NOT EXISTS total_fees_fbm NUMERIC;
ALTER TABLE mp_lookup_results ADD COLUMN IF NOT EXISTS weight_g INTEGER;
ALTER TABLE mp_lookup_results ADD COLUMN IF NOT EXISTS height_mm INTEGER;
ALTER TABLE mp_lookup_results ADD COLUMN IF NOT EXISTS length_mm INTEGER;
ALTER TABLE mp_lookup_results ADD COLUMN IF NOT EXISTS width_mm INTEGER;

-- Invalidate old cached data so fee table is used on next lookup
DELETE FROM mp_product_cache;
