-- CORRECTIF SÉCURITÉ : Supprimer la politique RLS redondante sur profiles
-- Cette politique "Block public access to profiles" avec USING: false ne sert à rien
-- car elle est écrasée par les autres politiques (évaluation OR logique en PostgreSQL)

DROP POLICY IF EXISTS "Block public access to profiles" ON public.profiles;

-- Vérification : Les politiques restantes assurent une sécurité correcte
-- ✅ "Users can view only their own profile" - USING (auth.uid() = id)
-- ✅ "Admins can view all profiles" - USING (has_role(auth.uid(), 'admin'))

-- Résultat : Seuls les utilisateurs authentifiés voient leur propre profil, et les admins voient tout
-- Le public ne peut rien voir (aucune politique ne s'applique pour eux)