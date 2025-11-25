-- 🔒 CORRECTION SÉCURITÉ : Supprimer les accès publics dangereux

-- ============================================
-- TABLE: profiles - Supprimer l'accès public
-- ============================================

-- Supprimer la politique qui expose les emails/téléphones publiquement
DROP POLICY IF EXISTS "Public can view safe profile fields" ON public.profiles;

-- ============================================
-- TABLE: affiliate_users - Restreindre aux admins UNIQUEMENT
-- ============================================

-- Supprimer la politique dangereuse (true = tout le monde)
DROP POLICY IF EXISTS "Allow reading affiliate users for admin operations" ON public.affiliate_users;

-- Recréer avec restriction admin uniquement
CREATE POLICY "Only admins can view all affiliate users"
ON public.affiliate_users
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));