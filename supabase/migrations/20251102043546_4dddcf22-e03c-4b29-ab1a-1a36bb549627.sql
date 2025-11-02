-- Modifier la fonction pour gérer les erreurs et ne pas bloquer l'insertion
CREATE OR REPLACE FUNCTION public.notify_vip_members_on_alert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Appeler la fonction edge de manière asynchrone et gérer les erreurs
  BEGIN
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/send-push-notifications',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'alert_id', NEW.id,
        'title', NEW.title,
        'category', NEW.category,
        'subcategory', NEW.subcategory
      )
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Logger l'erreur mais ne pas bloquer l'insertion
      RAISE WARNING 'Failed to send push notifications for alert %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;