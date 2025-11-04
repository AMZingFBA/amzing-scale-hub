import { useState, useEffect } from 'react';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@capawesome/capacitor-badge';

const isNativePlatform = () => {
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    return (window as any).Capacitor.isNativePlatform();
  }
  return false;
};

export const usePushNotifications = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Listen for FCM token - MUST run on every mount
  useEffect(() => {
    console.log('🎧 FCM listener effect running...');
    console.log('🎧 Is native platform?', isNativePlatform());
    
    if (!isNativePlatform()) {
      console.log('⚠️ Not a native platform, skipping FCM setup');
      return;
    }

    console.log('✅ Setting up FCM token listener...');

    // Check if token already exists from before React loaded
    const existingToken = (window as any).__FCM_TOKEN__;
    console.log('🔍 Checking for existing token:', existingToken ? 'FOUND' : 'NOT FOUND');
    
    if (existingToken) {
      console.log('🔥 Found existing FCM token from native:', existingToken);
      setPendingToken(existingToken);
      delete (window as any).__FCM_TOKEN__;
    }

    const handleFCMToken = (event: any) => {
      console.log('📨 FCM token event received!', event);
      const fcmToken = event.detail?.token;
      if (fcmToken) {
        console.log('🔥 FCM Token from event:', fcmToken);
        setPendingToken(fcmToken);
      } else {
        console.error('❌ No token in event detail');
      }
    };

    window.addEventListener('fcmTokenReceived', handleFCMToken);
    console.log('✅ FCM token listener registered');

    return () => {
      window.removeEventListener('fcmTokenReceived', handleFCMToken);
      console.log('🧹 FCM token listener cleaned up');
    };
  }, []);

  // Save token to database when we have both user and token - AVEC RETRY
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
          setPendingToken(null); // Clear seulement si succès
        }
      } catch (error) {
        console.error('❌ Exception while saving FCM token:', error);
      }
    };

    saveToken();
  }, [user, pendingToken]);


  useEffect(() => {
    if (!user || !isNativePlatform() || isInitialized) return;

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

          // Écouter les notifications reçues
          await PushNotifications.addListener('pushNotificationReceived', async (notification) => {
            console.log('📬 Push notification received:', notification);
            console.log('📬 Title:', notification.title);
            console.log('📬 Body:', notification.body);
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
