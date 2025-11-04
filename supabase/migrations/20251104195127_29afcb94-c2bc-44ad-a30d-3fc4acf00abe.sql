-- Ajouter une contrainte unique pour éviter les tokens en double
ALTER TABLE push_notification_tokens 
ADD CONSTRAINT unique_user_token UNIQUE (user_id, token);

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_notification_tokens(user_id);