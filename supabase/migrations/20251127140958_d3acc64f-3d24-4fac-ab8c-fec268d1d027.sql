-- Supprimer l'ancienne contrainte unique qui bloque les multi-appareils
ALTER TABLE push_notification_history DROP CONSTRAINT IF EXISTS push_notification_history_user_id_alert_id_key;

-- Ajouter une colonne pour identifier l'appareil
ALTER TABLE push_notification_history ADD COLUMN IF NOT EXISTS platform text;

-- Créer une nouvelle contrainte unique qui permet un envoi par appareil
-- Un utilisateur peut recevoir la même alerte sur iOS ET Android
ALTER TABLE push_notification_history 
ADD CONSTRAINT push_notification_history_user_alert_platform_unique 
UNIQUE (user_id, alert_id, platform);