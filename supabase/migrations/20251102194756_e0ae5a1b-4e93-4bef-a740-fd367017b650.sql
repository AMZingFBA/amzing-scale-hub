-- Supprimer le trigger qui ne fonctionne pas (pg_net non disponible)
DROP TRIGGER IF EXISTS on_admin_alert_created ON public.admin_alerts CASCADE;
DROP FUNCTION IF EXISTS public.notify_vip_members_on_alert() CASCADE;