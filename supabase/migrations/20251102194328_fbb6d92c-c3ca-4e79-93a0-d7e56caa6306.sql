-- Supprimer l'ancien trigger et fonction avec CASCADE
DROP TRIGGER IF EXISTS on_admin_alert_created ON public.admin_alerts CASCADE;
DROP TRIGGER IF EXISTS on_alert_created ON public.admin_alerts CASCADE;
DROP FUNCTION IF EXISTS public.notify_vip_members_on_alert() CASCADE;

-- Créer un nouveau trigger qui utilise pg_net (extension Supabase)
CREATE OR REPLACE FUNCTION public.notify_vip_members_on_alert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
  supabase_url text;
  service_role_key text;
BEGIN
  -- Récupérer les variables d'environnement
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);
  
  -- Si les variables ne sont pas configurées, utiliser les valeurs par défaut
  IF supabase_url IS NULL THEN
    supabase_url := 'https://wvmfzlogijvqcsgablrb.supabase.co';
  END IF;
  
  -- Appeler la fonction edge de manière asynchrone avec pg_net
  SELECT net.http_post(
    url := supabase_url || '/functions/v1/send-push-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(service_role_key, '')
    ),
    body := jsonb_build_object(
      'alert_id', NEW.id,
      'title', NEW.title,
      'category', NEW.category,
      'subcategory', NEW.subcategory
    )
  ) INTO request_id;
  
  RAISE LOG 'Push notification request sent with ID: %', request_id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Logger l'erreur mais ne pas bloquer l'insertion
    RAISE WARNING 'Failed to send push notifications for alert %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Créer le trigger
CREATE TRIGGER on_admin_alert_created
  AFTER INSERT ON public.admin_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_vip_members_on_alert();