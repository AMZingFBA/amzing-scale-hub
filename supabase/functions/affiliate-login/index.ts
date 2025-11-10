import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { verify } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LoginRequest {
  email: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password }: LoginRequest = await req.json();

    console.log("=== AFFILIATE LOGIN REQUEST ===");
    console.log("Email:", email);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user
    const { data: user, error: getUserError } = await supabaseAdmin
      .from("affiliate_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (getUserError || !user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    if (!user.email_verified) {
      throw new Error("Email non vérifié. Veuillez vérifier votre email.");
    }

    // Verify password
    const isPasswordValid = await verify(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Get or create auth user
    let authUser;
    const { data: existingAuthUser } = await supabaseAdmin.auth.admin.getUserById(user.id);
    
    if (existingAuthUser) {
      authUser = existingAuthUser;
    } else {
      const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email.toLowerCase(),
        password: Math.random().toString(36).slice(-12),
        email_confirm: true,
        user_metadata: {
          affiliate_user_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });

      if (authError) {
        throw new Error("Erreur lors de la connexion");
      }
      
      authUser = newAuthUser;
    }

    console.log("Login successful:", user.id);

    return new Response(
      JSON.stringify({ 
        success: true,
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
    console.error("Error in affiliate-login:", error);
    
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
