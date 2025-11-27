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

  // Récupérer le FCM token via le plugin natif (iOS uniquement)
  useEffect(() => {
    if (!isNativePlatform()) {
      return;
    }

    const platform = Capacitor.getPlatform();
    
    // iOS uniquement - utilise FCMTokenBridge
    if (platform === 'ios') {
      console.log('🎧 iOS: Récupération FCM token via FCMTokenBridge...');
      
      const fetchTokenFromNative = async () => {
        try {
          // Attendre un peu que Firebase génère le token
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log('🔍 Appel FCMTokenBridge.getToken()...');
          const { FCMTokenBridge } = (window as any).Capacitor.Plugins;
          
          if (!FCMTokenBridge) {
            console.error('❌ Plugin FCMTokenBridge introuvable');
            return;
          }
          
          const result = await FCMTokenBridge.getToken();
          const token = result?.token;
          
          console.log('📱 Token iOS reçu du plugin:', token?.substring(0, 30) + '...');
          
          if (token && typeof token === 'string' && token.includes(':')) {
            console.log('✅ Format FCM valide (contient :)');
            setPendingToken(token);
          } else {
            console.warn('⚠️ Token invalide (pas de :):', token);
            // Retry après délai
            setTimeout(fetchTokenFromNative, 2000);
          }
        } catch (error) {
          console.error('❌ Erreur récupération token iOS:', error);
          // Retry après délai
          setTimeout(fetchTokenFromNative, 2000);
        }
      };

      fetchTokenFromNative();
    } else {
      console.log('📱 Android: Le token FCM sera capturé via le listener registration');
    }
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
    
    const devicePlatform = (window as any).Capacitor?.getPlatform?.() || 'unknown';
    console.log('📱 Platform:', devicePlatform);

    const saveToken = async () => {
      try {
        const { data, error } = await supabase
          .from('push_notification_tokens')
          .upsert({
            user_id: user.id,
            token: pendingToken,
            platform: devicePlatform,
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

          // Android: utiliser le listener registration pour capturer le FCM token
          // iOS: ignorer (utilise FCMTokenBridge à la place)
          await PushNotifications.addListener('registration', async (token: Token) => {
            const platform = Capacitor.getPlatform();
            
            if (platform === 'android') {
              console.log('📱 Android: Token FCM reçu via registration:', token.value?.substring(0, 30) + '...');
              
              // Valider le format FCM (doit contenir :)
              if (token.value && typeof token.value === 'string' && token.value.includes(':')) {
                console.log('✅ Android: Format FCM valide (contient :)');
                setPendingToken(token.value);
              } else {
                console.warn('⚠️ Android: Token invalide (pas de :):', token.value);
              }
            } else {
              console.log('⚠️ iOS: Event Capacitor registration IGNORÉ (utilise FCMTokenBridge)');
            }
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
