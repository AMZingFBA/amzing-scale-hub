import { useState } from 'react';
import { useAuth } from './use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Purchases } from '@revenuecat/purchases-capacitor';

// Fonction pour détecter si on est sur une app mobile Capacitor
const isNativePlatform = () => {
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    return (window as any).Capacitor.isNativePlatform();
  }
  return false;
};

// ID du produit IAP (à configurer dans App Store Connect)
const APPLE_SUBSCRIPTION_ID = 'com.amzing.vip.monthly';

export const useTrial = () => {
  const [isStarting, setIsStarting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const startFreeTrial = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsStarting(true);
    try {
      // Check if user has already used their trial
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('trial_used')
        .eq('user_id', user.id)
        .single();

      if (subscription?.trial_used) {
        toast.error('Vous avez déjà un abonnement actif');
        setIsStarting(false);
        return;
      }

      // Si c'est l'app mobile, utiliser Apple IAP
      if (isNativePlatform()) {
        await handleAppleIAP();
        return;
      }

      // Sur le web, créer une session de paiement Stripe
      console.log('Creating Stripe checkout session...');
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        window.open(data.url, '_blank');
        toast.success('Redirection vers le paiement sécurisé Stripe...');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error starting trial:', error);
      toast.error('Erreur lors de la redirection vers le paiement');
    } finally {
      setIsStarting(false);
    }
  };

  const handleAppleIAP = async () => {
    try {
      console.log('Initializing Apple IAP with RevenueCat...');
      
      // Initialiser RevenueCat avec votre API key iOS
      await Purchases.configure({
        apiKey: 'appl_UkTXpjsXWtjIplSVBRXeCXGdALQ',
      });

      // Identifier l'utilisateur
      if (user?.id) {
        await Purchases.logIn({ appUserID: user.id });
      }

      toast.info('Chargement des produits...');

      // Récupérer les offres disponibles
      const offerings = await Purchases.getOfferings();
      
      if (!offerings.current?.availablePackages || offerings.current.availablePackages.length === 0) {
        throw new Error('Aucun produit d\'abonnement disponible');
      }

      const package_to_purchase = offerings.current.availablePackages[0];
      console.log('Package found:', package_to_purchase);
      
      toast.info('Ouverture du paiement Apple...');

      // Effectuer l'achat
      const purchaseResult = await Purchases.purchasePackage({ 
        aPackage: package_to_purchase 
      });

      console.log('Purchase successful:', purchaseResult);

      // Vérifier que l'achat est actif
      if (purchaseResult.customerInfo.entitlements.active['AMZing FBA VIP']) {
        // Mettre à jour la base de données - Abonnement mensuel direct (pas d'essai gratuit)
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 mois d'abonnement payant

        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            plan_type: 'vip',
            status: 'active',
            expires_at: expiresAt.toISOString(),
            is_trial: false,
            trial_used: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating subscription:', updateError);
          toast.error('Erreur lors de la mise à jour de l\'abonnement');
          return;
        }

        toast.success('Abonnement VIP activé avec succès ! 🎉');
        navigate('/dashboard');
      } else {
        throw new Error('L\'abonnement n\'est pas actif après l\'achat');
      }

    } catch (error: any) {
      console.error('Apple IAP Error:', error);
      
      // Gérer les erreurs spécifiques
      if (error.code === '1') {
        toast.error('Achat annulé');
      } else {
        toast.error('Erreur lors du paiement: ' + error.message);
      }
    } finally {
      setIsStarting(false);
    }
  };

  return {
    startFreeTrial,
    isStarting,
  };
};
