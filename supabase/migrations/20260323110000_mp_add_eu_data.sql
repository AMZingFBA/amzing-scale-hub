-- Add eu_data and offers JSONB columns
ALTER TABLE mp_lookup_results ADD COLUMN IF NOT EXISTS eu_data JSONB;
ALTER TABLE mp_lookup_results ADD COLUMN IF NOT EXISTS offers JSONB;

-- Recreate mp_complete with ALL columns including new ones
CREATE OR REPLACE FUNCTION public.mp_complete(
  p_secret TEXT,
  p_id UUID,
  p_results JSONB,
  p_processing_ms INTEGER
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
  v_count INTEGER := 0;
BEGIN
  IF p_secret IS DISTINCT FROM current_setting('app.settings.worker_secret', true) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Insert each result
  FOR v_result IN SELECT * FROM jsonb_array_elements(p_results)
  LOOP
    INSERT INTO public.mp_lookup_results (
      lookup_id, user_id, asin, ean, product_name, image_url, category,
      bsr, sales_monthly, sell_price, amazon_price, fba_price,
      fba_fee, commission_pct, commission_eur, closing_fee,
      dst_fee, total_fees_fba, total_fees_fbm,
      profit_fba, roi_fba, profit_fbm, roi_fbm,
      fba_sellers, fbm_sellers, variations, alerts,
      buy_price, country_code, amazon_url, keepa_data,
      weight_g, height_mm, length_mm, width_mm,
      eu_data, offers
    ) VALUES (
      p_id,
      (v_result->>'user_id')::UUID,
      v_result->>'asin',
      v_result->>'ean',
      v_result->>'product_name',
      v_result->>'image_url',
      v_result->>'category',
      (v_result->>'bsr')::INTEGER,
      (v_result->>'sales_monthly')::INTEGER,
      (v_result->>'sell_price')::NUMERIC,
      (v_result->>'amazon_price')::NUMERIC,
      (v_result->>'fba_price')::NUMERIC,
      (v_result->>'fba_fee')::NUMERIC,
      (v_result->>'commission_pct')::NUMERIC,
      (v_result->>'commission_eur')::NUMERIC,
      (v_result->>'closing_fee')::NUMERIC,
      (v_result->>'dst_fee')::NUMERIC,
      (v_result->>'total_fees_fba')::NUMERIC,
      (v_result->>'total_fees_fbm')::NUMERIC,
      (v_result->>'profit_fba')::NUMERIC,
      (v_result->>'roi_fba')::NUMERIC,
      (v_result->>'profit_fbm')::NUMERIC,
      (v_result->>'roi_fbm')::NUMERIC,
      (v_result->>'fba_sellers')::INTEGER,
      (v_result->>'fbm_sellers')::INTEGER,
      (v_result->>'variations')::INTEGER,
      v_result->>'alerts',
      (v_result->>'buy_price')::NUMERIC,
      v_result->>'country_code',
      v_result->>'amazon_url',
      v_result->'keepa_data',
      (v_result->>'weight_g')::INTEGER,
      (v_result->>'height_mm')::INTEGER,
      (v_result->>'length_mm')::INTEGER,
      (v_result->>'width_mm')::INTEGER,
      v_result->'eu_data',
      v_result->'offers'
    );
    v_count := v_count + 1;
  END LOOP;

  -- Mark completed
  UPDATE public.mp_lookups
  SET status = 'completed',
      results_count = v_count,
      processing_ms = p_processing_ms,
      updated_at = NOW()
  WHERE id = p_id;
END;
$$;
