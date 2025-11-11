import { useState, useEffect } from 'react';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@capawesome/capacitor-badge';
import { Capacitor } from '@capacitor/core';

const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

export const usePushNotifications = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [savedTokens, setSavedTokens] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();

  // Listen for FCM token - AVEC DEBUG
  useEffect(() => {
    console.log('🎧 FCM listener setup...');
    console.log('🔍 window.__FCM_TOKEN__ au démarrage:', (window as any).__FCM_TOKEN__);
    
    if (!isNativePlatform()) {
      return;
    }

    const handleFCMToken = (event: any) => {
      console.log('📨 FCM token event complet:', event);
      const fcmToken = event.detail?.token || event.detail;
      console.log('📨 FCM token extrait:', fcmToken);
      
      if (fcmToken && typeof fcmToken === 'string') {
        console.log('✅ Token valide, sauvegarde...:', fcmToken.substring(0, 30) + '...');
        setPendingToken(fcmToken);
      } else {
        console.error('❌ Token invalide ou manquant');
      }
    };

    // Écouter l'événement custom
    window.addEventListener('fcmTokenReceived', handleFCMToken);
    console.log('✅ Event listener ajouté');
    
    // Vérifier si token déjà disponible (NE PAS supprimer pour permettre les retry)
    const existingToken = (window as any).__FCM_TOKEN__;
    if (existingToken) {
      console.log('🔥 Token déjà présent dans window:', existingToken.substring(0, 30) + '...');
      setPendingToken(existingToken);
    } else {
      console.log('⏳ Aucun token pré-existant, attente de l\'événement...');
    }

    return () => {
      window.removeEventListener('fcmTokenReceived', handleFCMToken);
      console.log('🧹 Listener nettoyé');
    };
  }, []);

  // Save token to database when we have both user and token - AVEC RETRY ET DEDUPLICATION
  useEffect(() => {
    if (!isNativePlatform()) {
      console.log('⚠️ Not native platform, skipping token save');
      return;
    }

    if (!pendingToken) {
      console.log('⚠️ No pending token to save');
      return;
    }

    if (!user) {
      console.log('⚠️ User not yet authenticated, will retry when user is available');
      return;
    }

    // Vérifier si on a déjà sauvegardé ce token pour cet utilisateur
    const tokenKey = `${user.id}:${pendingToken}`;
    if (savedTokens.has(tokenKey)) {
      console.log('✅ Token already saved for this user, skipping duplicate save');
      setPendingToken(null);
      // Supprimer window.__FCM_TOKEN__ maintenant qu'il est sauvegardé
      delete (window as any).__FCM_TOKEN__;
      return;
    }

    console.log('💾 Attempting to save FCM token to database...');
    console.log('👤 User ID:', user.id);
    console.log('🎫 Token:', pendingToken.substring(0, 20) + '...');
    
    const platform = (window as any).Capacitor?.getPlatform?.() || 'unknown';
    console.log('📱 Platform:', platform);

    const saveToken = async () => {
      try {
        const { data, error } = await supabase
          .from('push_notification_tokens')
          .upsert({
            user_id: user.id,
            token: pendingToken,
            platform: platform,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,token'
          })
          .select();

        if (error) {
          console.error('❌ Error saving FCM token:', error);
          console.error('❌ Error details:', JSON.stringify(error));
          // Ne pas clear le token en cas d'erreur pour retry
        } else {
          console.log('✅ FCM token saved successfully to database!', data);
          // Marquer ce token comme sauvegardé
          setSavedTokens(prev => new Set([...prev, tokenKey]));
          setPendingToken(null); // Clear seulement si succès
          // Supprimer window.__FCM_TOKEN__ maintenant qu'il est sauvegardé
          delete (window as any).__FCM_TOKEN__;
        }
      } catch (error) {
        console.error('❌ Exception while saving FCM token:', error);
      }
    };

    saveToken();
  }, [user, pendingToken, savedTokens]);


  useEffect(() => {
    // Ne rien faire sur le web
    if (!isNativePlatform()) {
      console.log('⚠️ Push notifications not available on web - skipping initialization');
      return;
    }
    
    if (!user || isInitialized) return;

    const initializePushNotifications = async () => {
      try {
        console.log('🚀 Initializing push notifications...');

        // Demander la permission
        console.log('🔐 Requesting push notification permissions...');
        const permStatus = await PushNotifications.requestPermissions();
        console.log('📋 Permission status received:', JSON.stringify(permStatus));
        console.log('📋 Receive permission:', permStatus.receive);
        
        if (permStatus.receive === 'granted' || permStatus.receive === 'prompt-with-rationale') {
          console.log('✅ Push notification permission granted');

          // Ajouter les listeners AVANT d'enregistrer
          // Écouter l'enregistrement réussi - on reçoit le token APNs (DEBUG ONLY)
          await PushNotifications.addListener('registration', async (token: Token) => {
            console.log('📱 APNs Token received (DEBUG ONLY, NOT SAVED):', token.value);
          });

          // Écouter les erreurs d'enregistrement
          await PushNotifications.addListener('registrationError', (error: any) => {
            console.error('❌ Push registration error:', error);
          });

          // Écouter les notifications reçues (quand l'app est au premier plan)
          await PushNotifications.addListener('pushNotificationReceived', async (notification) => {
            console.log('📬 Push notification received (foreground):', notification);
            console.log('📬 Title:', notification.title);
            console.log('📬 Body:', notification.body);
            // Note: Le badge est géré par APNs pour les notifications en arrière-plan
          });

          // Écouter les actions sur les notifications
          await PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {
            console.log('👆 Notification tapée - RESET COMPLET du badge');
            
            try {
              // 1. RESET en base AVANT tout
              const { error: dbError } = await supabase.rpc('reset_user_badge', {
                user_id_param: user.id
              });
              
              if (dbError) {
                console.error('❌ Erreur reset DB:', dbError);
              } else {
                console.log('✅ Compteur DB remis à 0');
              }

              // 2. Reset badge iOS
              await Badge.set({ count: 0 });
              console.log('✅ Badge iOS remis à 0');
              
              console.log('✅ RESET COMPLET - Prochaine notification = 1');
            } catch (error) {
              console.error('❌ Erreur reset:', error);
            }
            
            // Rediriger selon le type de notification
            const data = notification.notification.data;
            if (data.type === 'admin_alert' && data.category) {
              console.log('🎯 Navigating to category:', data.category, 'subcategory:', data.subcategory);
              
              // Rediriger directement vers la bonne page/sous-catégorie
              if (data.category === 'produits') {
                // Redirection vers la sous-catégorie spécifique de produits
                if (data.subcategory === 'produits-find') {
                  navigate('/produits-find');
                } else if (data.subcategory === 'produits-qogita') {
                  navigate('/produits-qogita');
                } else if (data.subcategory === 'produits-eany') {
                  navigate('/produits-eany');
                } else if (data.subcategory === 'grossistes') {
                  navigate('/grossistes');
                } else if (data.subcategory === 'promotions') {
                  navigate('/promotions');
                } else if (data.subcategory === 'sitelist') {
                  navigate('/sitelist');
                } else {
                  navigate('/produits-rentables');
                }
              } else if (data.category === 'marketplace') {
                // Redirection directe vers la bonne sous-catégorie
                if (data.subcategory === 'buy') {
                  navigate('/veux-acheter');
                } else if (data.subcategory === 'sell') {
                  navigate('/veux-vendre');
                } else {
                  navigate('/marketplace');
                }
              } else if (data.category === 'rules') {
                navigate('/avis');
              } else if (data.category === 'catalogue') {
                navigate('/catalogue');
              } else if (data.category === 'informations' && data.subcategory === 'actualités') {
                navigate('/actualite');
              }
            }
          });

          // Enregistrer pour recevoir des notifications APRÈS avoir ajouté les listeners
          console.log('📱 Registering for push notifications...');
          await PushNotifications.register();

          setIsInitialized(true);
          console.log('✅ Push notifications initialized successfully');
        } else {
          console.log('❌ Push notification permission denied');
        }
      } catch (error) {
        console.error('💥 Error initializing push notifications:', error);
      }
    };

    initializePushNotifications();

    // Cleanup
    return () => {
      if (isInitialized) {
        PushNotifications.removeAllListeners();
      }
    };
  }, [user, isInitialized, navigate]);

  const removePushToken = async () => {
    if (!user || !isNativePlatform()) return;

    try {
      // Supprimer tous les tokens de l'utilisateur
      const { error } = await supabase
        .from('push_notification_tokens')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing push tokens:', error);
      } else {
        console.log('Push tokens removed successfully');
      }
    } catch (error) {
      console.error('Error removing push tokens:', error);
    }
  };

  return {
    isInitialized,
    removePushToken,
  };
};
