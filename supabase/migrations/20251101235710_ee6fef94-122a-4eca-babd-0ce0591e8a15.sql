-- Table pour stocker les tokens de notification push des utilisateurs
CREATE TABLE IF NOT EXISTS public.push_notification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, token)
);

-- Enable RLS
ALTER TABLE public.push_notification_tokens ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres tokens
CREATE POLICY "Users can view their own tokens"
ON public.push_notification_tokens
FOR SELECT
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent insérer leurs propres tokens
CREATE POLICY "Users can insert their own tokens"
ON public.push_notification_tokens
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres tokens
CREATE POLICY "Users can delete their own tokens"
ON public.push_notification_tokens
FOR DELETE
USING (auth.uid() = user_id);

-- Les admins peuvent voir tous les tokens
CREATE POLICY "Admins can view all tokens"
ON public.push_notification_tokens
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_push_notification_tokens_updated_at
BEFORE UPDATE ON public.push_notification_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour notifier les membres VIP quand une alerte est créée
CREATE OR REPLACE FUNCTION public.notify_vip_members_on_alert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Appeler la fonction edge qui envoie les notifications push
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
  
  RETURN NEW;
END;
$$;

-- Trigger qui s'exécute après l'insertion d'une alerte
CREATE TRIGGER on_alert_created
AFTER INSERT ON public.admin_alerts
FOR EACH ROW
EXECUTE FUNCTION public.notify_vip_members_on_alert();