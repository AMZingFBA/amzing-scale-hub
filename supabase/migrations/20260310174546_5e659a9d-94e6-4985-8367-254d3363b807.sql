
CREATE OR REPLACE FUNCTION public.get_all_notification_counts(user_id_param uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb := '{}'::jsonb;
  category_name text;
  subcategory_name text;
  unread_count integer;
  source_name text;
  max_count constant integer := 999;
BEGIN
  -- 1. Compter les messages non lus des tickets par catégorie/sous-catégorie (capped)
  FOR category_name, subcategory_name, unread_count IN
    SELECT 
      COALESCE(t.category, 'general') as cat,
      COALESCE(t.subcategory, 'general') as subcat,
      LEAST(COUNT(m.id)::integer, max_count) as cnt
    FROM tickets t
    INNER JOIN messages m ON m.ticket_id = t.id
    LEFT JOIN message_read_status mrs ON mrs.message_id = m.id AND mrs.user_id = user_id_param
    WHERE t.user_id = user_id_param
      AND t.status IN ('open', 'in_progress')
      AND m.user_id != user_id_param
      AND (mrs.is_read IS NULL OR mrs.is_read = false)
    GROUP BY t.category, t.subcategory
  LOOP
    IF result->category_name IS NULL THEN
      result := jsonb_set(result, ARRAY[category_name], '{"total": 0, "subcategories": {}}'::jsonb);
    END IF;
    
    result := jsonb_set(
      result, 
      ARRAY[category_name, 'total'],
      (LEAST((result->category_name->>'total')::integer + unread_count, max_count))::text::jsonb
    );
    
    result := jsonb_set(
      result,
      ARRAY[category_name, 'subcategories', subcategory_name],
      unread_count::text::jsonb
    );
  END LOOP;

  -- 2. Compter les alertes admin_alerts non lues par catégorie/sous-catégorie (capped)
  FOR category_name, subcategory_name, unread_count IN
    SELECT 
      a.category,
      COALESCE(a.subcategory, 'general') as subcat,
      LEAST(COUNT(a.id)::integer, max_count) as cnt
    FROM admin_alerts a
    LEFT JOIN alert_read_status ars ON ars.alert_id = a.id AND ars.user_id = user_id_param AND ars.is_read = true
    LEFT JOIN notification_preferences np ON np.user_id = user_id_param 
      AND np.category = a.category 
      AND (np.subcategory = a.subcategory OR (np.subcategory IS NULL AND a.subcategory IS NULL))
      AND np.enabled = false
    WHERE ars.id IS NULL
      AND np.id IS NULL
    GROUP BY a.category, a.subcategory
  LOOP
    IF result->category_name IS NULL THEN
      result := jsonb_set(result, ARRAY[category_name], '{"total": 0, "subcategories": {}}'::jsonb);
    END IF;
    
    result := jsonb_set(
      result, 
      ARRAY[category_name, 'total'],
      (LEAST(COALESCE((result->category_name->>'total')::integer, 0) + unread_count, max_count))::text::jsonb
    );
    
    result := jsonb_set(
      result,
      ARRAY[category_name, 'subcategories', subcategory_name],
      (LEAST(COALESCE((result->category_name->'subcategories'->>subcategory_name)::integer, 0) + unread_count, max_count))::text::jsonb
    );
  END LOOP;

  -- 3. Compter les product_find_alerts non lues par source_name (capped at max_count per source)
  FOR source_name, unread_count IN
    SELECT 
      LOWER(REPLACE(pfa.source_name, ' ', '-')) as src,
      LEAST(COUNT(pfa.id)::integer, max_count) as cnt
    FROM product_find_alerts pfa
    LEFT JOIN product_find_read_status pfrs ON pfrs.alert_id = pfa.id AND pfrs.user_id = user_id_param AND pfrs.is_read = true
    WHERE pfrs.id IS NULL
    GROUP BY pfa.source_name
  LOOP
    IF result->'produits' IS NULL THEN
      result := jsonb_set(result, ARRAY['produits'], '{"total": 0, "subcategories": {}}'::jsonb);
    END IF;
    
    result := jsonb_set(
      result, 
      ARRAY['produits', 'total'],
      (LEAST(COALESCE((result->'produits'->>'total')::integer, 0) + unread_count, max_count))::text::jsonb
    );
    
    result := jsonb_set(
      result,
      ARRAY['produits', 'subcategories', 'produits-' || source_name],
      (LEAST(COALESCE((result->'produits'->'subcategories'->>'produits-' || source_name)::integer, 0) + unread_count, max_count))::text::jsonb
    );
  END LOOP;

  RETURN result;
END;
$function$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_find_read_status_user_read ON product_find_read_status(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_product_find_alerts_source_name ON product_find_alerts(source_name);
CREATE INDEX IF NOT EXISTS idx_alert_read_status_user_read ON alert_read_status(user_id, is_read);
