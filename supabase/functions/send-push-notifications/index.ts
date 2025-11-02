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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { alert_id, title, category, subcategory }: NotificationRequest = await req.json();

    console.log('Sending push notifications for alert:', { alert_id, title, category, subcategory });

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

    console.log(`Found ${tokens.length} push tokens to send to`);

    // 4. Envoyer les notifications via Firebase Cloud Messaging (FCM)
    const fcmServerKey = Deno.env.get("FCM_SERVER_KEY");
    
    if (!fcmServerKey) {
      console.error('FCM_SERVER_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'FCM not configured' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Envoyer les notifications par batch
    const notificationPromises = tokens.map(async ({ token, platform }) => {
      try {
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Authorization': `key=${fcmServerKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: token,
            notification: {
              title: '🔔 Nouvelle alerte AMZing FBA',
              body: title,
              sound: 'default',
              badge: '1',
            },
            data: {
              alert_id,
              category,
              subcategory: subcategory || '',
              type: 'admin_alert',
            },
            priority: 'high',
          }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          console.error(`Failed to send to ${platform} token:`, result);
          
          // Si le token est invalide, le supprimer
          if (result.error === 'InvalidRegistration' || result.error === 'NotRegistered') {
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
    const successCount = results.filter(r => !r.error).length;

    console.log(`Sent ${successCount}/${tokens.length} notifications successfully`);

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

serve(handler);
