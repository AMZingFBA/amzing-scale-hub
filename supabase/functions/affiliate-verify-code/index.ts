import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  email: string;
  code: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: VerifyRequest = await req.json();

    console.log("=== AFFILIATE CODE VERIFICATION ===");
    console.log("Email:", email);
    console.log("Code:", code);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user with verification code
    const { data: user, error: getUserError } = await supabaseAdmin
      .from("affiliate_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    console.log("User found:", user ? "Yes" : "No");
    console.log("User ID:", user?.id);
    console.log("Email verified:", user?.email_verified);
    console.log("Stored code:", user?.verification_code);
    console.log("Received code:", code);
    console.log("Codes match:", user?.verification_code === code);

    if (getUserError || !user) {
      console.error("Get user error:", getUserError);
      throw new Error("Utilisateur non trouvé");
    }

    if (user.email_verified) {
      console.log("Email already verified");
      return new Response(
        JSON.stringify({ 
          error: "Email déjà vérifié",
          errorType: "already_verified"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!user.verification_code) {
      console.log("No verification code in database");
      return new Response(
        JSON.stringify({ 
          error: "Code de vérification expiré",
          errorType: "expired"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (user.verification_code !== code) {
      console.log("Code mismatch - Invalid code");
      return new Response(
        JSON.stringify({ 
          error: "Code de vérification invalide",
          errorType: "invalid"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update user to mark email as verified
    const { error: updateError } = await supabaseAdmin
      .from("affiliate_users")
      .update({ 
        email_verified: true,
        verification_code: null,
      })
      .eq("id", user.id);

    if (updateError) {
      throw new Error("Erreur lors de la vérification");
    }

    // Create auth user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: Math.random().toString(36).slice(-12), // Random password
      email_confirm: true,
      user_metadata: {
        affiliate_user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      throw new Error("Erreur lors de la création de la session");
    }

    console.log("User verified successfully:", user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email vérifié avec succès",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          referralCode: user.referral_code,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in affiliate-verify-code:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
