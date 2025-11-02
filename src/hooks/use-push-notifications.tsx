import { useState, useEffect } from 'react';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
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
        console.log('Initializing Firebase push notifications...');

        // Demander la permission
        console.log('🔐 Requesting push notification permissions...');
        const permStatus = await FirebaseMessaging.requestPermissions();
        console.log('📋 Permission status received:', JSON.stringify(permStatus));
        console.log('📋 Receive permission:', permStatus.receive);
        
        if (permStatus.receive === 'granted') {
          console.log('✅ Push notification permission granted');

          // Obtenir le token FCM
          console.log('📱 Getting FCM token...');
          const result = await FirebaseMessaging.getToken();
          console.log('🔔 FCM Token received!');
          console.log('📱 Token:', result.token);
          console.log('👤 User ID:', user.id);
          
          // Déterminer la plateforme
          const platform = (window as any).Capacitor.getPlatform();
          console.log('🖥️ Platform:', platform);
          
          // Sauvegarder le token dans la base de données
          try {
            console.log('💾 Attempting to save token to database...');
            
            const { data, error } = await supabase
              .from('push_notification_tokens')
              .upsert({
                user_id: user.id,
                token: result.token,
                platform: platform,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id,token'
              })
              .select();

            if (error) {
              console.error('❌ Error saving push token:', error);
            } else {
              console.log('✅ Push token saved successfully!', data);
            }
          } catch (error) {
            console.error('❌ Exception saving push token:', error);
          }

          // Écouter les notifications reçues
          await FirebaseMessaging.addListener('notificationReceived', (event) => {
            console.log('📬 Push notification received:', event.notification);
          });

          // Écouter les actions sur les notifications
          await FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
            console.log('Push notification action performed:', event);
            
            // Rediriger selon le type de notification
            const data = event.notification.data as any;
            if (data?.type === 'admin_alert' && data?.category) {
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

          setIsInitialized(true);
          console.log('✅ Firebase push notifications initialized successfully');
        } else {
          console.log('Push notification permission denied');
        }
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      }
    };

    initializePushNotifications();

    // Cleanup
    return () => {
      if (isInitialized) {
        FirebaseMessaging.removeAllListeners();
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
