-- Table pour tracker les product_find_alerts lues par utilisateur
CREATE TABLE IF NOT EXISTS public.product_find_read_status (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id uuid NOT NULL REFERENCES product_find_alerts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(alert_id, user_id)
);

-- Enable RLS
ALTER TABLE public.product_find_read_status ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own read status" 
ON public.product_find_read_status 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own read status" 
ON public.product_find_read_status 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own read status" 
ON public.product_find_read_status 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Mettre à jour la fonction get_all_notification_counts pour inclure product_find_alerts par source
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
  source_name text;
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
    IF result->category_name IS NULL THEN
      result := jsonb_set(result, ARRAY[category_name], '{"total": 0, "subcategories": {}}'::jsonb);
    END IF;
    
    result := jsonb_set(
      result, 
      ARRAY[category_name, 'total'],
      ((result->category_name->>'total')::integer + unread_count)::text::jsonb
    );
    
    result := jsonb_set(
      result,
      ARRAY[category_name, 'subcategories', subcategory_name],
      unread_count::text::jsonb
    );
  END LOOP;

  -- 2. Compter les alertes admin_alerts non lues par catégorie/sous-catégorie
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
      (COALESCE((result->category_name->>'total')::integer, 0) + unread_count)::text::jsonb
    );
    
    result := jsonb_set(
      result,
      ARRAY[category_name, 'subcategories', subcategory_name],
      (COALESCE((result->category_name->'subcategories'->>subcategory_name)::integer, 0) + unread_count)::text::jsonb
    );
  END LOOP;

  -- 3. Compter les product_find_alerts non lues par source_name
  FOR source_name, unread_count IN
    SELECT 
      LOWER(REPLACE(pfa.source_name, ' ', '-')) as src,
      COUNT(pfa.id)::integer as cnt
    FROM product_find_alerts pfa
    LEFT JOIN product_find_read_status pfrs ON pfrs.alert_id = pfa.id AND pfrs.user_id = user_id_param AND pfrs.is_read = true
    WHERE pfrs.id IS NULL
    GROUP BY pfa.source_name
  LOOP
    -- Ajouter à la catégorie 'produits'
    IF result->'produits' IS NULL THEN
      result := jsonb_set(result, ARRAY['produits'], '{"total": 0, "subcategories": {}}'::jsonb);
    END IF;
    
    -- Ajouter au total de produits
    result := jsonb_set(
      result, 
      ARRAY['produits', 'total'],
      (COALESCE((result->'produits'->>'total')::integer, 0) + unread_count)::text::jsonb
    );
    
    -- Ajouter à la sous-catégorie basée sur le source_name (ex: 'produits-leclerc')
    result := jsonb_set(
      result,
      ARRAY['produits', 'subcategories', 'produits-' || source_name],
      (COALESCE((result->'produits'->'subcategories'->>'produits-' || source_name)::integer, 0) + unread_count)::text::jsonb
    );
  END LOOP;

  RETURN result;
END;
$$;

-- Fonction pour marquer les product_find_alerts comme lues par source
CREATE OR REPLACE FUNCTION public.mark_product_find_alerts_as_read(source_filter text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO product_find_read_status (alert_id, user_id, is_read)
  SELECT pfa.id, auth.uid(), true
  FROM product_find_alerts pfa
  WHERE (source_filter IS NULL OR LOWER(pfa.source_name) LIKE '%' || LOWER(source_filter) || '%')
    AND NOT EXISTS (
      SELECT 1 FROM product_find_read_status pfrs 
      WHERE pfrs.alert_id = pfa.id AND pfrs.user_id = auth.uid()
    )
  ON CONFLICT (alert_id, user_id) DO UPDATE SET is_read = true;
END;
$$;