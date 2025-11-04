-- Fonction optimisée pour récupérer tous les compteurs de notifications en une seule requête
CREATE OR REPLACE FUNCTION public.get_all_notification_counts(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result jsonb := '{}'::jsonb;
  ticket_counts jsonb;
  alert_counts jsonb;
  category_name text;
  subcategory_name text;
  unread_count integer;
BEGIN
  -- 1. Compter les messages non lus des tickets par catégorie/sous-catégorie
  FOR category_name, subcategory_name, unread_count IN
    SELECT 
      COALESCE(t.category, 'general') as cat,
      COALESCE(t.subcategory, 'general') as subcat,
      COUNT(m.id)::integer as cnt
    FROM tickets t
    INNER JOIN messages m ON m.ticket_id = t.id
    LEFT JOIN message_read_status mrs ON mrs.message_id = m.id AND mrs.user_id = user_id_param
    WHERE t.user_id = user_id_param
      AND t.status IN ('open', 'in_progress')
      AND m.user_id != user_id_param
      AND (mrs.is_read IS NULL OR mrs.is_read = false)
    GROUP BY t.category, t.subcategory
  LOOP
    -- Initialiser la catégorie si elle n'existe pas
    IF result->category_name IS NULL THEN
      result := jsonb_set(result, ARRAY[category_name], '{"total": 0, "subcategories": {}}'::jsonb);
    END IF;
    
    -- Ajouter au total de la catégorie
    result := jsonb_set(
      result, 
      ARRAY[category_name, 'total'],
      ((result->category_name->>'total')::integer + unread_count)::text::jsonb
    );
    
    -- Ajouter à la sous-catégorie
    result := jsonb_set(
      result,
      ARRAY[category_name, 'subcategories', subcategory_name],
      unread_count::text::jsonb
    );
  END LOOP;

  -- 2. Compter les alertes non lues par catégorie/sous-catégorie
  FOR category_name, subcategory_name, unread_count IN
    SELECT 
      a.category,
      COALESCE(a.subcategory, 'general') as subcat,
      COUNT(a.id)::integer as cnt
    FROM admin_alerts a
    LEFT JOIN alert_read_status ars ON ars.alert_id = a.id AND ars.user_id = user_id_param AND ars.is_read = true
    LEFT JOIN notification_preferences np ON np.user_id = user_id_param 
      AND np.category = a.category 
      AND (np.subcategory = a.subcategory OR (np.subcategory IS NULL AND a.subcategory IS NULL))
      AND np.enabled = false
    WHERE ars.id IS NULL  -- Pas encore lu
      AND np.id IS NULL   -- Pas désactivé dans les préférences
    GROUP BY a.category, a.subcategory
  LOOP
    -- Initialiser la catégorie si elle n'existe pas
    IF result->category_name IS NULL THEN
      result := jsonb_set(result, ARRAY[category_name], '{"total": 0, "subcategories": {}}'::jsonb);
    END IF;
    
    -- Ajouter au total de la catégorie
    result := jsonb_set(
      result, 
      ARRAY[category_name, 'total'],
      (COALESCE((result->category_name->>'total')::integer, 0) + unread_count)::text::jsonb
    );
    
    -- Ajouter/incrémenter la sous-catégorie
    result := jsonb_set(
      result,
      ARRAY[category_name, 'subcategories', subcategory_name],
      (COALESCE((result->category_name->'subcategories'->>subcategory_name)::integer, 0) + unread_count)::text::jsonb
    );
  END LOOP;

  RETURN result;
END;
$$;