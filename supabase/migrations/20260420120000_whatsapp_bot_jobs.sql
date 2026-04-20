-- Table for WhatsApp bot Selenium jobs
CREATE TABLE IF NOT EXISTS whatsapp_bot_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  contacts JSONB NOT NULL DEFAULT '[]',
  message_template TEXT NOT NULL,
  account_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  progress JSONB NOT NULL DEFAULT '{"sent": 0, "failed": 0, "total": 0, "current_contact": ""}',
  results JSONB NOT NULL DEFAULT '[]'
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_whatsapp_bot_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER whatsapp_bot_jobs_updated_at
  BEFORE UPDATE ON whatsapp_bot_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_bot_jobs_updated_at();

-- RLS
ALTER TABLE whatsapp_bot_jobs ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins full access on whatsapp_bot_jobs"
  ON whatsapp_bot_jobs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
  );

-- Service role (worker) bypasses RLS automatically

-- RPC: claim next pending job (atomic)
CREATE OR REPLACE FUNCTION whatsapp_bot_claim_next()
RETURNS SETOF whatsapp_bot_jobs
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE whatsapp_bot_jobs
  SET status = 'running', updated_at = now()
  WHERE id = (
    SELECT id FROM whatsapp_bot_jobs
    WHERE status = 'pending'
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
$$;

-- Enable realtime for live progress updates
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_bot_jobs;
