-- Table des jobs iMessage (architecture sans tunnel)
CREATE TABLE IF NOT EXISTS imessage_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  message TEXT NOT NULL,
  contacts JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'paused', 'done', 'stopped')),
  total INT NOT NULL DEFAULT 0,
  sent INT NOT NULL DEFAULT 0,
  failed INT NOT NULL DEFAULT 0,
  current_recipient TEXT,
  results JSONB NOT NULL DEFAULT '[]'
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_imessage_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER imessage_jobs_updated_at
  BEFORE UPDATE ON imessage_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_imessage_jobs_updated_at();

-- RLS ouvert (page protégée par auth admin côté frontend + Mac backend local)
ALTER TABLE imessage_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Open access imessage_jobs"
  ON imessage_jobs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Realtime pour updates live
ALTER PUBLICATION supabase_realtime ADD TABLE imessage_jobs;
