import { useState, useEffect } from 'react';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useNavigate } from 'react-router-dom';

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

  // Register FCM token listener AND check for existing token
  useEffect(() => {
    if (!isNativePlatform()) return;

    // Check if token was already set by native before React loaded
    const existingToken = (window as any).__FCM_TOKEN__;
    if (existingToken && !pendingToken) {
      console.log('🔥 Found existing FCM token from native (before React loaded):', existingToken);
      setPendingToken(existingToken);
      delete (window as any).__FCM_TOKEN__; // Clean up
    }

    const handleFCMToken = (event: any) => {
      const fcmToken = event.detail.token;
      console.log('🔥 FCM Token received from native event:', fcmToken);
      setPendingToken(fcmToken);
    };

    window.addEventListener('fcmTokenReceived', handleFCMToken);

    return () => {
      window.removeEventListener('fcmTokenReceived', handleFCMToken);
    };
  }, []);

  // Save token when we have both user and pending token
  useEffect(() => {
    if (!user || !pendingToken || !isNativePlatform()) return;

    console.log('💾 Saving FCM token...');
    console.log('👤 User ID:', user.id);
    
    const platform = (window as any).Capacitor.getPlatform();
    console.log('🖥️ Platform:', platform);

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
        } else {
          console.log('✅ FCM token saved successfully!', data);
          setPendingToken(null);
        }
      } catch (error) {
        console.error('❌ Exception saving FCM token:', error);
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
          await PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('📬 Push notification received:', notification);
            console.log('📬 Title:', notification.title);
            console.log('📬 Body:', notification.body);
          });

          // Écouter les actions sur les notifications
          await PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
            console.log('👆 Push notification action performed:', notification);
            
            // Rediriger selon le type de notification
            const data = notification.notification.data;
            if (data.type === 'admin_alert' && data.category) {
              // Rediriger vers la page d'alertes appropriée
              if (data.category === 'introduction') {
                navigate('/actualite');
              } else if (data.category === 'products') {
                navigate('/notification-alerts/products');
              } else if (data.category === 'rules') {
                navigate('/notification-alerts/rules');
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
