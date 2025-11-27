-- CORRECTIF CRITIQUE SÉCURITÉ : Supprimer l'accès public aux données d'abonnement
-- Cette politique permet à N'IMPORTE QUI (même non authentifié) de voir TOUTES les données d'abonnement
-- y compris les statuts VIP, IDs clients Stripe, providers de paiement, etc.

DROP POLICY IF EXISTS "Public can view subscription status" ON public.subscriptions;

-- Vérification : Les politiques restantes sont sécurisées
-- ✅ "Users can view their own subscription" - USING (auth.uid() = user_id)
-- ✅ "Users can insert their own subscription" - WITH CHECK (auth.uid() = user_id)  
-- ✅ "Users can update their own subscription" - USING (auth.uid() = user_id)

-- Ces 3 politiques garantissent que chaque utilisateur ne voit que ses propres données d'abonnement