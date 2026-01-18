-- Table pour stocker les tokens d'impersonation éphémères (admin only)
CREATE TABLE public.admin_impersonation_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE
);

-- Index pour la recherche rapide par token
CREATE INDEX idx_admin_impersonation_tokens_token ON public.admin_impersonation_tokens(token);

-- Index pour nettoyer les tokens expirés
CREATE INDEX idx_admin_impersonation_tokens_expires_at ON public.admin_impersonation_tokens(expires_at);

-- Enable RLS
ALTER TABLE public.admin_impersonation_tokens ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent lire/écrire
CREATE POLICY "Admins can manage impersonation tokens"
ON public.admin_impersonation_tokens
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fonction pour nettoyer les tokens expirés (peut être appelée périodiquement)
CREATE OR REPLACE FUNCTION public.cleanup_expired_impersonation_tokens()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.admin_impersonation_tokens 
  WHERE expires_at < now();
$$;