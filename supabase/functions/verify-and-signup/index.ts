import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupRequest {
  code: string;
  email: string;
  password: string;
  fullName: string;
  nickname: string;
  phone: string;
  referralCode?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, email, password, fullName, nickname, phone, referralCode }: SignupRequest = await req.json();

    console.log("=== SIGNUP VERIFICATION REQUEST ===");
    console.log("Email:", email);
    console.log("Code reçu:", code);
    console.log("Referral Code:", referralCode);

    // Use service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if email already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const emailExists = existingUsers?.users.some(u => u.email === email.toLowerCase());
    
    if (emailExists) {
      throw new Error("Un compte existe déjà avec cet email");
    }

    // Verify code - look for codes without user_id (signup codes)
    const { data: verificationData, error: verifyError } = await supabaseAdmin
      .from("verification_codes")
      .select("*")
      .eq("code", code)
      .eq("type", "email_signup")
      .eq("new_value", email.toLowerCase())
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log("Résultat de la vérification:", { verificationData, verifyError });

    if (verifyError) {
      console.error("Error verifying code:", verifyError);
      throw verifyError;
    }

    if (!verificationData) {
      throw new Error("Code invalide ou expiré");
    }

    // Create user account
    const { data: authData, error: signupError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true, // Auto-confirm email since we verified with code
      user_metadata: {
        full_name: fullName,
        nickname,
        phone,
      },
    });

    if (signupError) {
      console.error("Error creating user:", signupError);
      
      // Handle specific error for duplicate phone
      if (signupError.message?.includes("duplicate") || signupError.message?.includes("unique")) {
        throw new Error("Ce numéro de téléphone est déjà utilisé");
      }
      
      throw new Error("Impossible de créer le compte");
    }

    if (!authData.user) {
      throw new Error("Échec de la création du compte");
    }

    // Mark code as used
    await supabaseAdmin
      .from("verification_codes")
      .update({ used: true, user_id: authData.user.id })
      .eq("id", verificationData.id);

    // If there's a referral code, create referral relationship
    if (referralCode) {
      console.log("Processing referral code:", referralCode);
      
      // Find the affiliate user by referral code
      const { data: affiliateUser, error: affiliateError } = await supabaseAdmin
        .from("affiliate_users")
        .select("id")
        .eq("referral_code", referralCode)
        .single();
      
      if (affiliateUser && !affiliateError) {
        console.log("Creating referral for affiliate:", affiliateUser.id);
        
        // Create referral record
        const { error: referralError } = await supabaseAdmin
          .from("affiliate_referrals")
          .insert({
            referrer_user_id: affiliateUser.id,
            referred_email: email.toLowerCase(),
            referred_user_id: authData.user.id,
          });
        
        if (referralError) {
          console.error("Error creating referral:", referralError);
        } else {
          console.log("Referral created successfully");
        }
      } else {
        console.log("Affiliate user not found for code:", referralCode);
      }
    }

    console.log("User created successfully:", authData.user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Compte créé avec succès",
        user: {
          id: authData.user.id,
          email: authData.user.email,
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-and-signup:", error);
    
    // Determine if this is a user error (400) or server error (500)
    const isUserError = error.message?.includes("Code invalide") ||
                        error.message?.includes("existe déjà") ||
                        error.message?.includes("déjà utilisé");
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: isUserError ? 400 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
