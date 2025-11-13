-- Ajouter une contrainte unique sur ean + timestamp pour éviter les doublons
ALTER TABLE qogita_products DROP CONSTRAINT IF EXISTS qogita_products_ean_timestamp_key;
ALTER TABLE qogita_products ADD CONSTRAINT qogita_products_ean_timestamp_key UNIQUE (ean, timestamp);

-- Permettre l'insertion depuis les edge functions
ALTER TABLE qogita_products ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre l'insertion depuis le service role
CREATE POLICY "Service role can insert products" ON qogita_products
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update products" ON qogita_products
  FOR UPDATE
  USING (true);
  
CREATE POLICY "Service role can delete products" ON qogita_products
  FOR DELETE
  USING (true);