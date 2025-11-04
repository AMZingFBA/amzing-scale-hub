import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[DELETE-ACCOUNT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { code } = await req.json();
    
    // Vérifier le code de vérification
    const { data: verificationData, error: verificationError } = await supabaseClient
      .from('verification_codes')
      .select('*')
      .eq('user_id', user.id)
      .eq('code', code)
      .eq('type', 'delete_account')
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (verificationError || !verificationData) {
      logStep("Invalid verification code", { error: verificationError });
      return new Response(
        JSON.stringify({ error: "Code invalide ou expiré" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    logStep("Verification code validated, proceeding with account deletion");

    // Marquer le code comme utilisé (on le supprimera avec les autres à la fin)
    await supabaseClient
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verificationData.id);

    // Supprimer toutes les données associées à l'utilisateur
    // Note: Certaines suppressions sont automatiques via ON DELETE CASCADE
    
    // Supprimer les préférences de notifications
    await supabaseClient
      .from('notification_preferences')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted notification preferences");

    // Supprimer les tokens de push notifications
    await supabaseClient
      .from('push_notification_tokens')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted push notification tokens");

    // Supprimer les statuts de lecture d'alertes
    await supabaseClient
      .from('alert_read_status')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted alert read status");

    // Supprimer les statuts de lecture de messages
    await supabaseClient
      .from('message_read_status')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted message read status");

    // Supprimer les épingles de salons
    await supabaseClient
      .from('chat_room_pins')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted chat room pins");

    // Supprimer la visibilité des conversations directes
    await supabaseClient
      .from('direct_conversation_visibility')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted direct conversation visibility");

    // Supprimer la visibilité des salons
    await supabaseClient
      .from('chat_room_visibility')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted chat room visibility");

    // Supprimer les annonces marketplace
    await supabaseClient
      .from('marketplace_listings')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted marketplace listings");

    await supabaseClient
      .from('marketplace_buy_requests')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted marketplace buy requests");

    // Supprimer les messages de chat
    await supabaseClient
      .from('chat_messages')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted chat messages");

    // Supprimer les messages directs
    await supabaseClient
      .from('direct_messages')
      .delete()
      .eq('sender_id', user.id);
    logStep("Deleted direct messages");

    // Supprimer les membres de salons
    await supabaseClient
      .from('chat_room_members')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted chat room members");

    // Supprimer les salons créés par l'utilisateur (marketplace et group)
    await supabaseClient
      .from('chat_rooms')
      .delete()
      .eq('created_by', user.id)
      .in('type', ['marketplace', 'group', 'private']);
    logStep("Deleted user-created chat rooms");

    // Supprimer les conversations directes
    await supabaseClient
      .from('direct_conversations')
      .delete()
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
    logStep("Deleted direct conversations");

    // Supprimer les messages de tickets
    await supabaseClient
      .from('messages')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted ticket messages");

    // Supprimer les tickets
    await supabaseClient
      .from('tickets')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted tickets");

    // Supprimer l'abonnement
    await supabaseClient
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted subscription");

    // Supprimer le profil
    await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', user.id);
    logStep("Deleted profile");

    // Supprimer tous les codes de vérification restants
    await supabaseClient
      .from('verification_codes')
      .delete()
      .eq('user_id', user.id);
    logStep("Deleted remaining verification codes");

    // Supprimer l'utilisateur de l'authentification
    const { error: deleteUserError } = await supabaseClient.auth.admin.deleteUser(user.id);
    
    if (deleteUserError) {
      logStep("Error deleting user from auth", { error: deleteUserError });
      throw deleteUserError;
    }

    logStep("Account successfully deleted");

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Votre compte a été supprimé définitivement"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
