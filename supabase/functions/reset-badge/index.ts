import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResetBadgeRequest {
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id }: ResetBadgeRequest = await req.json();

    console.log('🔄 RESET BADGE pour user:', user_id);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Reset le badge en DB à 0
    const { error: resetError } = await supabaseAdmin.rpc('reset_user_badge', {
      user_id_param: user_id
    });

    if (resetError) {
      console.error('❌ Erreur reset DB:', resetError);
      throw resetError;
    }

    console.log('✅ Badge DB → 0');

    // 2. Récupérer TOUS les tokens (iOS ET Android) pour cet utilisateur
    const { data: tokens, error: tokensError } = await supabaseAdmin
      .from('push_notification_tokens')
      .select('token, platform')
      .eq('user_id', user_id);

    if (tokensError) {
      console.error('❌ Erreur tokens:', tokensError);
      throw tokensError;
    }

    if (!tokens || tokens.length === 0) {
      console.log('⚠️ Pas de tokens pour user:', user_id);
      return new Response(
        JSON.stringify({ message: 'Badge DB reset, pas de tokens' }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`📱 ${tokens.length} token(s) trouvé(s) pour user ${user_id} (${tokens.filter(t => t.platform === 'ios').length} iOS, ${tokens.filter(t => t.platform === 'android').length} Android)`);

    // 3. Générer access token OAuth2 pour FCM
    const serviceAccountJson = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON");
    
    if (!serviceAccountJson) {
      console.error('❌ FIREBASE_SERVICE_ACCOUNT_JSON manquant');
      return new Response(
        JSON.stringify({ error: 'FCM non configuré' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceAccount = JSON.parse(serviceAccountJson);
    const accessToken = await getAccessToken(serviceAccount);

    console.log('✅ Access token FCM généré');

    // 4. Envoyer notification SILENCIEUSE avec badge=0 pour CHAQUE token (iOS ET Android)
    const results = await Promise.all(
      tokens.map(async ({ token, platform }) => {
        try {
          const fcmUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;
          
          // Payload différent selon la plateforme
          let payload: any = {
            message: {
              token: token,
            },
          };

          if (platform === 'ios') {
            // iOS: utiliser APNS avec content-available et badge
            payload.message.apns = {
              headers: {
                'apns-priority': '5',
              },
              payload: {
                aps: {
                  'content-available': 1,
                  badge: 0,
                },
              },
            };
          } else if (platform === 'android') {
            // Android: utiliser data message pour mettre à jour le badge
            payload.message.data = {
              type: 'badge_reset',
              badge: '0',
            };
          }
          
          console.log(`📤 Envoi notification silencieuse badge=0 vers ${platform}...`);
          
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
            console.error(`❌ Échec envoi ${platform}:`, result);
            return { success: false, error: result, platform };
          }
          
          console.log(`✅ Notification silencieuse envoyée vers ${platform}`);
          return { success: true, platform };
        } catch (error) {
          console.error(`❌ Erreur ${platform}:`, error);
          return { success: false, error, platform };
        }
      })
    );

    const successCount = results.filter(r => r.success).length;
    const iosCount = results.filter(r => r.success && r.platform === 'ios').length;
    const androidCount = results.filter(r => r.success && r.platform === 'android').length;

    return new Response(
      JSON.stringify({ 
        message: 'Badge reset effectué pour user ' + user_id,
        db_reset: true,
        silent_notifications_sent: successCount,
        ios_notified: iosCount,
        android_notified: androidCount,
        total_tokens: tokens.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ ERREUR:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

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

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

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
