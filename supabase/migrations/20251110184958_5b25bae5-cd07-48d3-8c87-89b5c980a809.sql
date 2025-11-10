-- Supprimer la contrainte de clé étrangère incorrecte
ALTER TABLE public.affiliate_referrals
DROP CONSTRAINT IF EXISTS affiliate_referrals_referred_user_id_fkey;

-- Ajouter une nouvelle contrainte qui référence la table profiles
ALTER TABLE public.affiliate_referrals
ADD CONSTRAINT affiliate_referrals_referred_user_id_fkey
FOREIGN KEY (referred_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;