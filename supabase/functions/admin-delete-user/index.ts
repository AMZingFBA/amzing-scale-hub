import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-DELETE-USER] ${step}${detailsStr}`);
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

    // Vérifier que l'utilisateur est admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const adminUser = userData.user;
    if (!adminUser) throw new Error("User not authenticated");
    
    // Vérifier le rôle admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', adminUser.id)
      .eq('role', 'admin')
      .single();
    
    if (roleError || !roleData) {
      logStep("Not authorized - admin role required");
      return new Response(
        JSON.stringify({ error: "Non autorisé - rôle administrateur requis" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    logStep("Admin authenticated", { adminId: adminUser.id });

    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error("userId requis");
    }

    // Vérifier que l'utilisateur à supprimer existe
    const { data: targetUser, error: targetUserError } = await supabaseClient.auth.admin.getUserById(userId);
    
    if (targetUserError || !targetUser) {
      throw new Error("Utilisateur introuvable");
    }

    logStep("Target user found", { userId, email: targetUser.user.email });

    // Supprimer toutes les données associées à l'utilisateur
    
    // Supprimer les préférences de notifications
    await supabaseClient
      .from('notification_preferences')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted notification preferences");

    // Supprimer les tokens de push notifications
    await supabaseClient
      .from('push_notification_tokens')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted push notification tokens");

    // Supprimer les statuts de lecture d'alertes
    await supabaseClient
      .from('alert_read_status')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted alert read status");

    // Supprimer les statuts de lecture de messages
    await supabaseClient
      .from('message_read_status')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted message read status");

    // Supprimer les épingles de salons
    await supabaseClient
      .from('chat_room_pins')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted chat room pins");

    // Supprimer la visibilité des conversations directes
    await supabaseClient
      .from('direct_conversation_visibility')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted direct conversation visibility");

    // Supprimer la visibilité des salons
    await supabaseClient
      .from('chat_room_visibility')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted chat room visibility");

    // Supprimer les annonces marketplace
    await supabaseClient
      .from('marketplace_listings')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted marketplace listings");

    await supabaseClient
      .from('marketplace_buy_requests')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted marketplace buy requests");

    // Supprimer les messages de chat
    await supabaseClient
      .from('chat_messages')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted chat messages");

    // Supprimer les messages directs
    await supabaseClient
      .from('direct_messages')
      .delete()
      .eq('sender_id', userId);
    logStep("Deleted direct messages");

    // Supprimer les membres de salons
    await supabaseClient
      .from('chat_room_members')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted chat room members");

    // Supprimer les salons créés par l'utilisateur
    await supabaseClient
      .from('chat_rooms')
      .delete()
      .eq('created_by', userId)
      .in('type', ['marketplace', 'group', 'private']);
    logStep("Deleted user-created chat rooms");

    // Supprimer les conversations directes
    await supabaseClient
      .from('direct_conversations')
      .delete()
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
    logStep("Deleted direct conversations");

    // Supprimer les messages de tickets
    await supabaseClient
      .from('messages')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted ticket messages");

    // Supprimer les tickets
    await supabaseClient
      .from('tickets')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted tickets");

    // Supprimer l'abonnement
    await supabaseClient
      .from('subscriptions')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted subscription");

    // Supprimer les rôles utilisateur
    await supabaseClient
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted user roles");

    // Supprimer le profil
    await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', userId);
    logStep("Deleted profile");

    // Supprimer tous les codes de vérification
    await supabaseClient
      .from('verification_codes')
      .delete()
      .eq('user_id', userId);
    logStep("Deleted verification codes");

    // Supprimer l'utilisateur de l'authentification
    const { error: deleteUserError } = await supabaseClient.auth.admin.deleteUser(userId);
    
    if (deleteUserError) {
      logStep("Error deleting user from auth", { error: deleteUserError });
      throw deleteUserError;
    }

    logStep("User successfully deleted by admin");

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Utilisateur supprimé avec succès"
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
