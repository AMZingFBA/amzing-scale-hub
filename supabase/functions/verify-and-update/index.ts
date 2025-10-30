import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  code: string;
  type: 'email_change' | 'password_change';
  newPassword?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Extract JWT token from "Bearer <token>"
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

    const { code, type, newPassword }: VerifyRequest = await req.json();

    // Use service role key for all database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify code
    const { data: verificationData, error: verifyError } = await supabaseAdmin
      .from("verification_codes")
      .select("*")
      .eq("user_id", user.id)
      .eq("code", code)
      .eq("type", type)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (verifyError) {
      console.error("Error verifying code:", verifyError);
      throw verifyError;
    }

    if (!verificationData) {
      throw new Error("Code invalide ou expiré");
    }

    // Update based on type
    if (type === 'password_change') {
      if (!newPassword) {
        throw new Error("Nouveau mot de passe requis");
      }

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
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
        user.id,
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
        .eq("id", user.id);
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
