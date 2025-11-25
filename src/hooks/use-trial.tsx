import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import 'cordova-plugin-purchase';

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
  const [showCGVModal, setShowCGVModal] = useState(false);
  const [acceptedCGV, setAcceptedCGV] = useState(false);
  const { user, refreshSubscription } = useAuth();
  const navigate = useNavigate();

  // Écouter les événements d'achat
  useEffect(() => {
    if (!isNativePlatform()) return;
    
    const { CdvPurchase } = window;
    if (!CdvPurchase) return;

    const store = CdvPurchase.store;
    
    console.log('🎧 [useTrial] Setting up purchase listeners...');
    
    // Enregistrer le listener pour les transactions approuvées
    store.when().approved(async (transaction: any) => {
      console.log('✅ [useTrial] Purchase approved:', transaction);
      await handlePurchaseSuccess(transaction);
    });

    // Enregistrer le listener pour les erreurs (syntaxe différente)
    store.error((error: any) => {
      console.error('❌ [useTrial] Purchase error:', error);
      toast.error('Erreur lors du paiement: ' + (error.message || 'Erreur inconnue'));
      setIsStarting(false);
    });

    console.log('✅ [useTrial] Purchase listeners registered');

    return () => {
      console.log('🧹 [useTrial] Cleaning up purchase listeners');
    };
  }, [user]);


  const startFreeTrial = async () => {
    console.log('🚀 [startFreeTrial] Button clicked!');
    
    if (!user) {
      console.log('❌ [startFreeTrial] No user, redirecting to signup');
      navigate('/auth?tab=signup');
      return;
    }

    console.log('✅ [startFreeTrial] User found:', user.id);
    setIsStarting(true);
    
    try {
      console.log('🔍 [startFreeTrial] Checking subscription status...');
      
      // Vérifier si l'utilisateur a déjà un abonnement ACTIF
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_type, status, expires_at')
        .eq('user_id', user.id)
        .single();

      console.log('📋 [startFreeTrial] Subscription data:', subscription);

      // Vérifier si abonnement actif ET non expiré
      const hasActiveSubscription = subscription?.plan_type === 'vip' && 
        subscription?.status === 'active' &&
        (!subscription?.expires_at || new Date(subscription.expires_at) > new Date());

      if (hasActiveSubscription) {
        console.log('⚠️ [startFreeTrial] User already has active subscription');
        toast.error('Vous avez déjà un abonnement actif');
        setIsStarting(false);
        return;
      }

      console.log('✅ [startFreeTrial] No active subscription, proceeding to payment...');
      console.log('📱 [startFreeTrial] Is native platform?', isNativePlatform());
      console.log('📱 [startFreeTrial] Platform:', Capacitor.getPlatform());

      // Si c'est Android, rediriger vers la page de paiement Android
      if (isNativePlatform() && Capacitor.getPlatform() === 'android') {
        console.log('🤖 [startFreeTrial] Android platform, redirecting to payment page...');
        navigate('/android-payment');
        setIsStarting(false);
        return;
      }

      // Si c'est iOS, utiliser Apple IAP
      if (isNativePlatform() && Capacitor.getPlatform() === 'ios') {
        console.log('🍎 [startFreeTrial] iOS platform, using Apple IAP...');
        await handleAppleIAP();
        return;
      }

      console.log('🌐 [startFreeTrial] Web platform, showing CGV modal...');
      
      // Afficher la modale d'acceptation des CGV
      setShowCGVModal(true);
      setIsStarting(false);
    } catch (error: any) {
      console.error('Error starting trial:', error);
      toast.error('Erreur lors de la redirection vers le paiement');
    } finally {
      setIsStarting(false);
    }
  };

  const handleAppleIAP = async () => {
    try {
      console.log('🛒 [useTrial] handleAppleIAP called');

      const { CdvPurchase } = window;
      if (!CdvPurchase) {
        console.error('❌ [useTrial] CdvPurchase not available');
        toast.error('Abonnement temporairement indisponible. Veuillez réessayer plus tard.');
        setIsStarting(false);
        return;
      }

      const store = CdvPurchase.store;
      console.log('✅ [useTrial] Store object available');

      toast.info('Chargement du produit...');
      
      // Attendre que le produit soit chargé (le StoreProvider l'a déjà initialisé)
      let product = store.get(APPLE_SUBSCRIPTION_ID);
      let attempts = 0;
      
      while (!product && attempts < 10) {
        console.log(`🔄 [useTrial] Waiting for product... (attempt ${attempts + 1})`);
        await new Promise(resolve => setTimeout(resolve, 500));
        product = store.get(APPLE_SUBSCRIPTION_ID);
        attempts++;
      }
      
      console.log('📦 [useTrial] Product retrieved:', product);
      
      if (!product) {
        console.error('❌ [useTrial] Product not found:', APPLE_SUBSCRIPTION_ID);
        console.error('⚠️ [useTrial] Vérifications nécessaires:');
        console.error('  1. Bundle ID doit être: com.amzing.app');
        console.error('  2. Produit doit exister dans App Store Connect:', APPLE_SUBSCRIPTION_ID);
        console.error('  3. Certificats et provisioning corrects');
        console.error('  4. Compte de test sandbox sur l\'appareil');
        
        // Afficher tous les produits disponibles pour debug
        const allProducts = store.products;
        console.log('📦 [useTrial] All available products:', allProducts);
        
        toast.error('Abonnement temporairement indisponible. Contactez le support.');
        setIsStarting(false);
        return;
      }

      console.log('📦 [useTrial] Product details:', {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.pricing?.price,
        canPurchase: product.canPurchase,
        state: product.state,
        owned: product.owned
      });

      // Si l'abonnement est déjà possédé, vérifier si l'utilisateur a vraiment un abonnement actif
      if (product.owned) {
        console.log('⚠️ [useTrial] Product shows as owned, checking database...');
        
        // Vérifier dans la base de données si l'utilisateur a vraiment un abonnement
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('plan_type, status, expires_at')
          .eq('user_id', user.id)
          .single();
        
        const hasActiveSubscription = subscription?.plan_type === 'vip' && 
          subscription?.status === 'active' &&
          (!subscription?.expires_at || new Date(subscription.expires_at) > new Date());
        
        if (hasActiveSubscription) {
          console.log('✅ [useTrial] User has active subscription in database');
          toast.error('Vous avez déjà un abonnement actif.');
          setIsStarting(false);
          return;
        }
        
        // Si pas d'abonnement actif en base, on peut continuer l'achat
        console.log('⚠️ [useTrial] Product owned but no active subscription in DB, allowing purchase...');
        toast.info('Finalisation des transactions en attente...');
        
        // Attendre un peu que le StoreProvider finisse les transactions
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!product.canPurchase) {
        console.error('❌ [useTrial] Product cannot be purchased. State:', product.state);
        console.error('❌ [useTrial] Possible reasons:');
        console.error('  - Product not approved in App Store Connect');
        console.error('  - Wrong bundle ID');
        console.error('  - Not logged in with sandbox account');
        toast.error('Abonnement temporairement indisponible. Veuillez réessayer.');
        setIsStarting(false);
        return;
      }

      // Déclencher l'achat du produit
      const offer = product.getOffer();
      console.log('💰 [useTrial] Offer retrieved:', offer);
      
      if (!offer) {
        console.error('❌ [useTrial] No offer available for product');
        toast.error('Impossible de récupérer les informations d\'achat.');
        setIsStarting(false);
        return;
      }

      console.log('🚀 [useTrial] Ordering product...');
      toast.info('Ouverture du paiement Apple...');
      
      const orderResult = await offer.order();
      console.log('✅ [useTrial] Order result:', orderResult);
      
      // Si l'ordre est annulé ou échoue, on affiche un message
      if (orderResult?.state === 'cancelled' || orderResult === null) {
        console.log('❌ [useTrial] Order cancelled by user');
        toast.error('Paiement annulé');
        setIsStarting(false);
        return;
      }
      
      // Si l'ordre est réussi, le listener handlePurchaseSuccess sera appelé automatiquement
      console.log('✅ [useTrial] Order initiated, waiting for Apple approval...');
      toast.info('En attente de la confirmation Apple...');

    } catch (error: any) {
      console.error('❌ [useTrial] Apple IAP Error:', error);
      toast.error('Erreur lors du paiement: ' + (error.message || 'Erreur inconnue'));
      setIsStarting(false);
    }
  };

  const handleConfirmPayment = useCallback(async () => {
    if (!acceptedCGV) {
      return;
    }

    setShowCGVModal(false);
    setIsStarting(true);

    try {
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
      console.error('Error starting payment:', error);
      toast.error('Erreur lors de la redirection vers le paiement');
    } finally {
      setIsStarting(false);
    }
  }, [acceptedCGV]);

  const handlePurchaseSuccess = async (transaction: any) => {
    try {
      console.log('✅ Paiement validé par Apple, mise à jour de l\'abonnement...');
      
      // Vérifier que c'est bien notre produit
      const hasOurProduct = transaction.products?.some((p: any) => p.id === APPLE_SUBSCRIPTION_ID);
      if (!hasOurProduct) {
        console.log('⚠️ Transaction ignorée, pas notre produit:', transaction.products);
        // Finaliser quand même la transaction pour la supprimer
        const { CdvPurchase } = window;
        if (CdvPurchase) {
          transaction.finish();
        }
        return;
      }
      
      if (!user) {
        console.error('❌ No user found, transaction will be retried later');
        // Ne pas finaliser la transaction si pas d'utilisateur
        // Elle sera retraitée au prochain lancement
        return;
      }

      // Mettre à jour la base de données - Abonnement mensuel sans essai
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 mois d'abonnement

      console.log('📝 Mise à jour pour user_id:', user.id);
      
      // Utiliser upsert pour s'assurer que la ligne existe
      const { data: updateData, error: updateError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan_type: 'vip',
          status: 'active',
          expires_at: expiresAt.toISOString(),
          is_trial: false,
          trial_used: true,
          updated_at: new Date().toISOString(),
          started_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour:', updateError);
        toast.error('Erreur lors de la mise à jour de l\'abonnement');
        return;
      }

      console.log('✅ Abonnement mis à jour:', updateData);

      // Finaliser la transaction
      const { CdvPurchase } = window;
      if (CdvPurchase) {
        transaction.finish();
        console.log('✅ Transaction finished');
      }

      // Rafraîchir l'état de l'abonnement
      console.log('🔄 Rafraîchissement de l\'état...');
      await refreshSubscription();
      
      toast.success('Abonnement VIP activé avec succès ! 🎉');
      setIsStarting(false);
      
      // Rediriger vers le dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);

    } catch (error: any) {
      console.error('❌ Error handling purchase:', error);
      toast.error('Erreur lors de la finalisation');
      setIsStarting(false);
    }
  };

  return {
    startFreeTrial,
    isStarting,
    showCGVModal,
    setShowCGVModal,
    acceptedCGV,
    setAcceptedCGV,
    handleConfirmPayment,
  };
};
