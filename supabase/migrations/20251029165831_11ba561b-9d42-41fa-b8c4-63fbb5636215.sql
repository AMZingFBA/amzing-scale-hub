-- Mettre à jour la contrainte pour autoriser les types sales et success
ALTER TABLE public.chat_rooms 
DROP CONSTRAINT IF EXISTS chat_rooms_type_check;

ALTER TABLE public.chat_rooms
ADD CONSTRAINT chat_rooms_type_check 
CHECK (type IN ('general', 'private', 'marketplace', 'products', 'group', 'sales', 'success', 'questions'));

-- Recréer les salons Ventes et Succès & Résultats
INSERT INTO chat_rooms (type, name) VALUES
  ('sales', 'Ventes'),
  ('success', 'Succès & Résultats')
ON CONFLICT DO NOTHING;