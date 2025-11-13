-- Activer l'extension pg_cron pour les tâches planifiées
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Activer l'extension pg_net pour les requêtes HTTP
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;