import { useState, useEffect } from 'react';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
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
        console.log('Initializing push notifications...');

        // Demander la permission
        console.log('🔐 Requesting push notification permissions...');
        const permStatus = await PushNotifications.requestPermissions();
        console.log('📋 Permission status received:', JSON.stringify(permStatus));
        console.log('📋 Receive permission:', permStatus.receive);
        
        if (permStatus.receive === 'granted' || permStatus.receive === 'prompt-with-rationale') {
          console.log('✅ Push notification permission granted');

          // Enregistrer pour recevoir des notifications
          await PushNotifications.register();

          // Écouter l'enregistrement réussi
          await PushNotifications.addListener('registration', async (token: Token) => {
            console.log('🔔 Push registration success!');
            console.log('📱 Token:', token.value);
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
                  token: token.value,
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
          });

          // Écouter les erreurs d'enregistrement
          await PushNotifications.addListener('registrationError', (error: any) => {
            console.error('❌ Push registration error:', error);
          });

          // Écouter les notifications reçues
          await PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push notification received:', notification);
            
            // Afficher un toast quand l'app est ouverte
            toast.info(notification.title || 'Nouvelle notification', {
              description: notification.body,
            });
          });

          // Écouter les actions sur les notifications
          await PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
            console.log('Push notification action performed:', notification);
            
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

          setIsInitialized(true);
          console.log('Push notifications initialized successfully');
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
