-- Recréer les triggers pour la synchronisation automatique Airtable

-- Trigger sur les profils (connexion utilisateur)
DROP TRIGGER IF EXISTS sync_profile_to_airtable ON public.profiles;
CREATE TRIGGER sync_profile_to_airtable
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_to_airtable_realtime();

-- Trigger sur les abonnements (changement de status VIP)
DROP TRIGGER IF EXISTS sync_subscription_to_airtable ON public.subscriptions;
CREATE TRIGGER sync_subscription_to_airtable
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_to_airtable_realtime();