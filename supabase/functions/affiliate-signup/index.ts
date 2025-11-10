import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { hash } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyType: string;
  companyName?: string;
  siret?: string;
  billingAddress: string;
  phone: string;
  iban: string;
  bic: string;
  referralCode?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: SignupRequest = await req.json();

    console.log("=== AFFILIATE SIGNUP REQUEST ===");
    console.log("Email:", data.email);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if email already exists
    const { data: existingUser } = await supabaseAdmin
      .from("affiliate_users")
      .select("id")
      .eq("email", data.email.toLowerCase())
      .single();

    if (existingUser) {
      throw new Error("Un compte existe déjà avec cet email");
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate unique referral code
    const { data: referralCodeData, error: referralCodeError } = await supabaseAdmin
      .rpc("generate_affiliate_referral_code");

    if (referralCodeError) {
      throw new Error("Erreur lors de la génération du code de parrainage");
    }

    // Hash password
    const passwordHash = await hash(data.password);

    // Create user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from("affiliate_users")
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email.toLowerCase(),
        password_hash: passwordHash,
        verification_code: verificationCode,
        company_type: data.companyType,
        company_name: data.companyName,
        siret: data.siret,
        billing_address: data.billingAddress,
        phone: data.phone,
        iban: data.iban,
        bic: data.bic,
        referral_code: referralCodeData,
        email_verified: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Erreur lors de la création du compte");
    }

    // If user came from a referral link, create the referral relationship
    if (data.referralCode) {
      const { data: referrer } = await supabaseAdmin
        .from("affiliate_users")
        .select("id")
        .eq("referral_code", data.referralCode)
        .single();

      if (referrer) {
        await supabaseAdmin.from("affiliate_referrals").insert({
          referred_email: data.email.toLowerCase(),
          referred_user_id: newUser.id,
          referrer_user_id: referrer.id,
          payment_status: "en attente",
        });
      }
    }

    // Send verification email
    const emailResponse = await resend.emails.send({
      from: "AMZing FBA Affiliate <onboarding@resend.dev>",
      to: [data.email],
      subject: "Code de vérification - AMZing FBA Affiliate",
      html: `
        <h1>Bienvenue sur AMZing FBA Affiliate !</h1>
        <p>Votre code de vérification est :</p>
        <h2 style="font-size: 32px; font-weight: bold; color: #2563eb;">${verificationCode}</h2>
        <p>Ce code est valable pendant 10 minutes.</p>
        <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
      `,
    });

    console.log("Email sent:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Code de vérification envoyé par email",
        userId: newUser.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in affiliate-signup:", error);
    
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
