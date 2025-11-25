-- Correction des 3 erreurs de sécurité critiques

-- ===== ERREUR 1 & 3 : Table affiliate_referrals =====
-- Supprimer les policies dangereuses
DROP POLICY IF EXISTS "Anyone can view referrals" ON public.affiliate_referrals;
DROP POLICY IF EXISTS "Allow updating affiliate referrals for admin operations" ON public.affiliate_referrals;

-- Créer des policies sécurisées pour les admins uniquement
CREATE POLICY "Only admins can view referrals"
ON public.affiliate_referrals
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update referrals"
ON public.affiliate_referrals
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ===== ERREUR 2 : Table affiliate_users =====
-- Supprimer la policy permettant aux utilisateurs de voir leurs propres données bancaires
DROP POLICY IF EXISTS "Users can view their own profile" ON public.affiliate_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.affiliate_users;

-- L'accès admin existe déjà avec "Only admins can view all affiliate users"
-- Ajouter une policy UPDATE pour les admins
CREATE POLICY "Only admins can update affiliate users"
ON public.affiliate_users
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));