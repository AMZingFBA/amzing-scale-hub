import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

declare global {
  interface Window {
    CdvPurchase?: any;
  }
}

// Fonction pour détecter si on est sur une app mobile Capacitor
const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

// ID du produit IAP (à configurer dans App Store Connect)
const APPLE_SUBSCRIPTION_ID = 'com.amzing.vip.monthly';

export const useTrial = () => {
  const [isStarting, setIsStarting] = useState(false);
  const [isStoreReady, setIsStoreReady] = useState(false);
  const { user, refreshSubscription } = useAuth();
  const navigate = useNavigate();

  // Initialiser StoreKit au chargement du hook
  useEffect(() => {
    if (isNativePlatform()) {
      initializeStore();
    }
  }, []);

  const initializeStore = async () => {
    try {
      console.log('Initializing Apple StoreKit...');
      
      const { CdvPurchase } = window;
      if (!CdvPurchase) {
        console.error('CdvPurchase not available');
        return;
      }

      const store = CdvPurchase.store;
      
      // Enregistrer le produit
      store.register([{
        id: APPLE_SUBSCRIPTION_ID,
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        platform: CdvPurchase.Platform.APPLE_APPSTORE
      }]);

      console.log('Product registered:', APPLE_SUBSCRIPTION_ID);

      // Écouter les événements d'approbation d'achat
      store.when()
        .productUpdated((product: any) => {
          console.log('Product updated:', product);
          if (product.id === APPLE_SUBSCRIPTION_ID && product.canPurchase) {
            setIsStoreReady(true);
          }
        })
        .approved((transaction: any) => {
          console.log('Purchase approved:', transaction);
          handlePurchaseSuccess(transaction);
        })
        .finished((transaction: any) => {
          console.log('Purchase finished:', transaction);
        })
        .error((error: any) => {
          console.error('Purchase error:', error);
          toast.error('Erreur lors du paiement');
          setIsStarting(false);
        });

      // Initialiser le store
      await store.initialize([CdvPurchase.Platform.APPLE_APPSTORE]);
      console.log('Store initialized');
      
    } catch (error: any) {
      console.error('Error initializing store:', error);
    }
  };

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
      console.log('handleAppleIAP called');
      console.log('Capacitor.isNativePlatform():', Capacitor.isNativePlatform());
      console.log('window.CdvPurchase available:', !!window.CdvPurchase);

      const { CdvPurchase } = window;
      if (!CdvPurchase) {
        console.error('CdvPurchase not available - plugin may not be installed');
        toast.error('Fonctionnalité disponible uniquement dans l\'app iOS');
        setIsStarting(false);
        return;
      }

      const store = CdvPurchase.store;
      console.log('Store object:', store);

      // Toujours réinitialiser le store pour s'assurer qu'il est prêt
      console.log('Initializing store...');
      toast.info('Préparation du paiement...');
      await initializeStore();
      
      // Attendre que le store soit complètement initialisé
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('Starting Apple IAP purchase...');
      toast.info('Ouverture du paiement Apple...');

      // Récupérer le produit
      const product = store.get(APPLE_SUBSCRIPTION_ID);
      console.log('Product retrieved:', product);
      
      if (!product) {
        console.error('Product not found:', APPLE_SUBSCRIPTION_ID);
        toast.error('Produit non trouvé. Veuillez réessayer.');
        setIsStarting(false);
        return;
      }

      console.log('Product details:', {
        id: product.id,
        title: product.title,
        canPurchase: product.canPurchase
      });

      if (!product.canPurchase) {
        console.error('Product cannot be purchased');
        toast.error('Produit non disponible à l\'achat');
        setIsStarting(false);
        return;
      }

      // Déclencher l'achat du produit
      const offer = product.getOffer();
      console.log('Offer retrieved:', offer);
      
      if (offer) {
        console.log('Ordering product...');
        await offer.order();
        console.log('Purchase initiated for:', APPLE_SUBSCRIPTION_ID);
      } else {
        throw new Error('No offer available for product');
      }

    } catch (error: any) {
      console.error('Apple IAP Error:', error);
      toast.error('Erreur lors du paiement: ' + (error.message || 'Erreur inconnue'));
      setIsStarting(false);
    }
  };

  const handlePurchaseSuccess = async (transaction: any) => {
    try {
      console.log('✅ Paiement validé par Apple, mise à jour de l\'abonnement...');
      
      if (!user) {
        console.error('No user found');
        return;
      }

      // Mettre à jour la base de données - Abonnement mensuel avec 7 jours d'essai
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 jours d'essai
      expiresAt.setMonth(expiresAt.getMonth() + 1); // + 1 mois d'abonnement payant

      console.log('Mise à jour pour user_id:', user.id);
      
      // Utiliser upsert pour s'assurer que la ligne existe
      const { data: updateData, error: updateError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan_type: 'vip',
          status: 'active',
          expires_at: expiresAt.toISOString(),
          is_trial: true,
          trial_used: true,
          updated_at: new Date().toISOString(),
          started_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour de l\'abonnement:', updateError);
        toast.error('Erreur lors de la mise à jour de l\'abonnement');
        return;
      }

      console.log('✅ Abonnement mis à jour dans la base de données:', updateData);

      // Finaliser la transaction
      const { CdvPurchase } = window;
      if (CdvPurchase) {
        transaction.finish();
        console.log('Transaction finished');
      }

      // Rafraîchir l'état de l'abonnement dans l'app
      console.log('🔄 Rafraîchissement de l\'état...');
      await refreshSubscription();
      
      console.log('✅ État de l\'abonnement rafraîchi');

      toast.success('Abonnement VIP activé avec succès ! 🎉');
      setIsStarting(false);
      
      // Rediriger vers le dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);

    } catch (error: any) {
      console.error('Error handling purchase success:', error);
      toast.error('Erreur lors de la finalisation');
      setIsStarting(false);
    }
  };

  return {
    startFreeTrial,
    isStarting,
  };
};
