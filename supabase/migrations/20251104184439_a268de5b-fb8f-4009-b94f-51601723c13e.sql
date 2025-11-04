-- Table pour stocker le compteur de badge par utilisateur
CREATE TABLE IF NOT EXISTS public.user_badge_counts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_badge_counts ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir et modifier leur propre compteur
CREATE POLICY "Users can view own badge count"
  ON public.user_badge_counts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own badge count"
  ON public.user_badge_counts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badge count"
  ON public.user_badge_counts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Fonction pour réinitialiser le badge d'un utilisateur
CREATE OR REPLACE FUNCTION reset_user_badge(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_badge_counts (user_id, badge_count, updated_at)
  VALUES (user_id_param, 0, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET badge_count = 0, updated_at = NOW();
END;
$$;

-- Fonction pour incrémenter le badge d'un utilisateur
CREATE OR REPLACE FUNCTION increment_user_badge(user_id_param UUID)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO public.user_badge_counts (user_id, badge_count, updated_at)
  VALUES (user_id_param, 1, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET 
    badge_count = user_badge_counts.badge_count + 1,
    updated_at = NOW()
  RETURNING badge_count INTO new_count;
  
  RETURN new_count;
END;
$$;