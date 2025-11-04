import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  alert_id: string;
  title: string;
  category: string;
  subcategory?: string;
}

// Fonction pour obtenir le titre de notification selon la catégorie et sous-catégorie
function getNotificationTitle(category: string, subcategory?: string): string {
  if (category === 'product') {
    return '🎯 Nouveau Produit Rentable !';
  }
  
  if (category === 'marketplace') {
    if (subcategory === 'buy') {
      return '🛒 Nouvelle Demande d\'Achat';
    } else if (subcategory === 'sell') {
      return '💰 Nouvelle Offre de Vente';
    }
    return '📦 Nouvelle Annonce Marketplace';
  }
  
  if (category === 'rules') {
    return '⚠️ Alerte Règles Amazon';
  }
  
  if (category === 'catalogue') {
    return '📚 Nouveau Catalogue';
  }
  
  if (category === 'informations') {
    if (subcategory === 'actualités') {
      return '📰 Nouvelle Actualité !';
    }
    return 'ℹ️ Nouvelle Information';
  }
  
  return '🔔 Nouvelle Alerte';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { alert_id, title, category, subcategory }: NotificationRequest = await req.json();

    const callId = Math.random().toString(36).substring(7);
    console.log(`🔵 [${callId}] START - Edge function appelée pour:`, { alert_id, title, category, subcategory });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Récupérer tous les utilisateurs VIP
    const { data: vipUsers, error: vipError } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('plan_type', 'vip')
      .eq('status', 'active');

    if (vipError) {
      console.error('Error fetching VIP users:', vipError);
      throw vipError;
    }

    if (!vipUsers || vipUsers.length === 0) {
      console.log('No VIP users found');
      return new Response(
        JSON.stringify({ message: 'No VIP users to notify' }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${vipUsers.length} VIP users`);

    // 2. Pour chaque utilisateur VIP, vérifier leurs préférences de notification
    const userIds = vipUsers.map(u => u.user_id);
    
    // Récupérer les préférences de notification
    let preferencesQuery = supabaseAdmin
      .from('notification_preferences')
      .select('user_id, enabled')
      .in('user_id', userIds)
      .eq('category', category);
    
    // Ajouter le filtre subcategory seulement si elle est définie
    if (subcategory) {
      preferencesQuery = preferencesQuery.eq('subcategory', subcategory);
    } else {
      preferencesQuery = preferencesQuery.is('subcategory', null);
    }
    
    const { data: preferences, error: prefError } = await preferencesQuery;

    if (prefError) {
      console.error('Error fetching notification preferences:', prefError);
    }

    // Créer un Set des user_ids qui ont désactivé les notifications
    const disabledUsers = new Set(
      (preferences || [])
        .filter(p => !p.enabled)
        .map(p => p.user_id)
    );

    // Filtrer les utilisateurs qui ont les notifications activées
    const usersToNotify = userIds.filter(userId => !disabledUsers.has(userId));

    console.log(`${usersToNotify.length} users will receive notification (${disabledUsers.size} disabled)`);

    if (usersToNotify.length === 0) {
      return new Response(
        JSON.stringify({ message: 'All users have disabled notifications for this category' }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Récupérer les tokens de notification push des utilisateurs
    const { data: tokens, error: tokensError } = await supabaseAdmin
      .from('push_notification_tokens')
      .select('token, platform, user_id')
      .in('user_id', usersToNotify);

    if (tokensError) {
      console.error('Error fetching push tokens:', tokensError);
      throw tokensError;
    }

    if (!tokens || tokens.length === 0) {
      console.log('No push tokens found for users');
      return new Response(
        JSON.stringify({ message: 'No push tokens registered' }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`🔵 [${callId}] Found ${tokens.length} push tokens to send to`);

    // 4. Générer un access token OAuth2 pour FCM v1 API
    const serviceAccountJson = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON");
    
    if (!serviceAccountJson) {
      console.error('FIREBASE_SERVICE_ACCOUNT_JSON not configured');
      return new Response(
        JSON.stringify({ error: 'FCM not configured' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceAccount = JSON.parse(serviceAccountJson);
    const accessToken = await getAccessToken(serviceAccount);

    // 5. Envoyer les notifications avec le vrai badge count
    const notificationPromises = tokens.map(async ({ token, platform, user_id }) => {
      try {
        // Tenter d'insérer dans l'historique pour déduplication
        const { error: historyError } = await supabaseAdmin
          .from('push_notification_history')
          .insert({ user_id, alert_id });
        
        // Si erreur de contrainte unique = déjà envoyé
        if (historyError?.code === '23505') {
          console.log(`⏭️ Skip: déjà envoyé à user ${user_id}`);
          return { skipped: true };
        }
        
        // Calculer le VRAI nombre total d'alertes non lues pour cet utilisateur
        const { data: unreadData } = await supabaseAdmin.rpc('get_all_notification_counts', {
          user_id_param: user_id
        });
        
        // Parser le résultat et compter le total
        let totalUnread = 0;
        if (unreadData) {
          for (const category of Object.values(unreadData)) {
            if (category && typeof category === 'object' && 'total' in category) {
              totalUnread += (category as any).total || 0;
            }
          }
        }
        
        // Badge = nombre réel d'alertes non lues (minimum 1 pour la nouvelle)
        const badgeCount = Math.max(totalUnread, 1);
        console.log(`📱 User ${user_id}: ${badgeCount} alertes non lues`);
        
        const fcmUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;
        
        const payload = {
          message: {
            token: token,
            notification: {
              title: getNotificationTitle(category, subcategory),
              body: `📢 ${title}`,
            },
            data: {
              alert_id,
              category,
              subcategory: subcategory || '',
              type: 'admin_alert',
            },
            android: {
              priority: 'high',
              notification: {
                sound: 'default',
              },
            },
            apns: {
              payload: {
                aps: {
                  sound: 'default',
                  badge: badgeCount,
                },
              },
            },
          },
        };
        
        console.log(`🔥 Payload FCM pour ${user_id}:`, JSON.stringify({
          badge: badgeCount,
          title: getNotificationTitle(category, subcategory),
          platform
        }));
        
        const response = await fetch(fcmUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        
        if (!response.ok) {
          console.error(`Failed to send to ${platform} token:`, result);
          
          // Si le token est invalide, le supprimer
          if (result.error?.details?.[0]?.errorCode === 'UNREGISTERED' || 
              result.error?.details?.[0]?.errorCode === 'INVALID_ARGUMENT') {
            await supabaseAdmin
              .from('push_notification_tokens')
              .delete()
              .eq('token', token);
            console.log('Deleted invalid token:', token);
          }
        } else {
          console.log(`Notification sent successfully to ${platform}`);
        }

        return result;
      } catch (error) {
        console.error(`Error sending notification to ${platform}:`, error);
        return { error };
      }
    });

    const results = await Promise.all(notificationPromises);
    const successCount = results.filter(r => !r.error && !r.skipped).length;
    const skippedCount = results.filter(r => r.skipped).length;

    console.log(`🔵 [${callId}] END - Sent ${successCount}/${tokens.length} notifications successfully (${skippedCount} duplicates skipped)`);

    return new Response(
      JSON.stringify({ 
        message: 'Notifications sent',
        sent: successCount,
        total: tokens.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-push-notifications:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

// Fonction pour générer un access token OAuth2 à partir du service account
async function getAccessToken(serviceAccount: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  // Créer le JWT manuellement
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  // Signer avec la clé privée
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(serviceAccount.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    encoder.encode(unsignedToken)
  );

  const encodedSignature = base64UrlEncode(signature);
  const jwt = `${unsignedToken}.${encodedSignature}`;

  // Échanger le JWT contre un access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

// Encoder en base64url
function base64UrlEncode(data: string | ArrayBuffer): string {
  let base64: string;
  
  if (typeof data === 'string') {
    base64 = btoa(data);
  } else {
    const bytes = new Uint8Array(data);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = btoa(binary);
  }
  
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Convertir PEM en ArrayBuffer
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const pemContents = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  
  const binaryString = atob(pemContents);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}

serve(handler);
