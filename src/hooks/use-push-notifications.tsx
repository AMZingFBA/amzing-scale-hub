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
  const { user } = useAuth();
  const navigate = useNavigate();

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
          // Écouter l'enregistrement réussi - on va recevoir le token APNs mais on va aussi
          // écouter les paramètres d'URL pour le token FCM
          await PushNotifications.addListener('registration', async (token: Token) => {
            console.log('🔔 Push registration success!');
            console.log('📱 APNs Token received:', token.value);
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

          // Écouter les messages personnalisés du native (pour le token FCM)
          window.addEventListener('fcmTokenReceived', async (event: any) => {
            const fcmToken = event.detail;
            console.log('🔥 FCM Token received from native:', fcmToken);
            console.log('👤 User ID:', user.id);
            
            // Déterminer la plateforme
            const platform = (window as any).Capacitor.getPlatform();
            console.log('🖥️ Platform:', platform);
            
            // Sauvegarder le token FCM dans la base de données
            try {
              console.log('💾 Attempting to save FCM token to database...');
              
              const { data, error } = await supabase
                .from('push_notification_tokens')
                .upsert({
                  user_id: user.id,
                  token: fcmToken,
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
              }
            } catch (error) {
              console.error('❌ Exception saving FCM token:', error);
            }
          });

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
        window.removeEventListener('fcmTokenReceived', () => {});
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
