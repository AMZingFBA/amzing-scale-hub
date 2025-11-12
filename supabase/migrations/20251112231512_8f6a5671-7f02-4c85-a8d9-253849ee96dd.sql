-- Table pour stocker les alertes Qogita
CREATE TABLE IF NOT EXISTS public.qogita_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_qogita_alerts_created_at ON public.qogita_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qogita_alerts_category ON public.qogita_alerts(category);

-- RLS policies - accessible aux VIP et admin
ALTER TABLE public.qogita_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VIP et admin peuvent voir les alertes Qogita"
  ON public.qogita_alerts
  FOR SELECT
  TO authenticated
  USING (is_vip_user(auth.uid()) OR has_role(auth.uid(), 'admin'));

-- Activer realtime pour cette table
ALTER PUBLICATION supabase_realtime ADD TABLE public.qogita_alerts;

-- Utiliser REPLICA IDENTITY FULL pour le realtime complet
ALTER TABLE public.qogita_alerts REPLICA IDENTITY FULL;

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_qogita_alerts_updated_at
  BEFORE UPDATE ON public.qogita_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();