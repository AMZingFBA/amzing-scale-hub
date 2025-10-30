import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  code: string;
  type: 'email_change' | 'password_change' | 'phone_change' | 'password_reset';
  newPassword?: string;
  email?: string; // For password_reset when user is not authenticated
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, type, newPassword, email }: VerifyRequest = await req.json();

    console.log("=== VERIFICATION REQUEST ===");
    console.log("Code reçu:", code);
    console.log("Type:", type);

    // Use service role key for all database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let userId: string;

    // For password_reset, get user by email instead of from auth token
    if (type === 'password_reset') {
      if (!email) {
        throw new Error("Email requis pour la réinitialisation");
      }

      const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (userError) {
        throw new Error("Unable to find user");
      }

      const foundUser = users.users.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Code invalide ou expiré");
      }

      userId = foundUser.id;
      console.log("User ID (from email):", userId);
    } else {
      // For other types, require authentication
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("No authorization header");
      }

      const token = authHeader.replace("Bearer ", "");

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(token);

      if (userError || !user) {
        throw new Error("Unauthorized");
      }

      userId = user.id;
      console.log("User ID (from auth):", userId);
    }

    // Verify code
    const { data: verificationData, error: verifyError } = await supabaseAdmin
      .from("verification_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("code", code)
      .eq("type", type)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log("Résultat de la requête:", { verificationData, verifyError });
    console.log("Date actuelle:", new Date().toISOString());

    if (verifyError) {
      console.error("Error verifying code:", verifyError);
      throw verifyError;
    }

    if (!verificationData) {
      // Check if code exists but is expired or used
      const { data: allCodes } = await supabaseAdmin
        .from("verification_codes")
        .select("*")
        .eq("user_id", userId)
        .eq("code", code)
        .eq("type", type)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      console.log("Code trouvé dans la DB:", allCodes);
      throw new Error("Code invalide ou expiré");
    }

    // Update based on type
    if (type === 'password_change' || type === 'password_reset') {
      if (!newPassword) {
        throw new Error("Nouveau mot de passe requis");
      }

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password: newPassword }
      );

      if (updateError) {
        console.error("Error updating password:", updateError);
        throw new Error("Impossible de mettre à jour le mot de passe");
      }
    } else if (type === 'email_change') {
      if (!verificationData.new_value) {
        throw new Error("Nouvel email requis");
      }

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email: verificationData.new_value }
      );

      if (updateError) {
        console.error("Error updating email:", updateError);
        throw new Error("Impossible de mettre à jour l'email");
      }

      // Update profile email
      await supabaseAdmin
        .from("profiles")
        .update({ email: verificationData.new_value })
        .eq("id", userId);
    } else if (type === 'phone_change') {
      if (!verificationData.new_value) {
        throw new Error("Nouveau téléphone requis");
      }

      // Update profile phone
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ phone: verificationData.new_value })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating phone:", updateError);
        throw new Error("Impossible de mettre à jour le téléphone");
      }
    }

    // Mark code as used
    await supabaseAdmin
      .from("verification_codes")
      .update({ used: true })
      .eq("id", verificationData.id);

    return new Response(
      JSON.stringify({ success: true, message: "Modification effectuée avec succès" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-and-update:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
