import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackReferralRequest {
  userId: string;
  email: string;
  referralCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email, referralCode }: TrackReferralRequest = await req.json();

    console.log("=== TRACK REFERRAL LOGIN ===");
    console.log("User ID:", userId);
    console.log("Email:", email);
    console.log("Referral Code:", referralCode);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Vérifier si l'utilisateur a déjà un referral
    const { data: existingReferral } = await supabaseAdmin
      .from("affiliate_referrals")
      .select("id")
      .eq("referred_user_id", userId)
      .single();

    if (existingReferral) {
      console.log("User already has a referral, skipping");
      return new Response(
        JSON.stringify({ message: "User already referred" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Trouver l'affilié par code de parrainage
    const { data: affiliateUser, error: affiliateError } = await supabaseAdmin
      .from("affiliate_users")
      .select("id")
      .eq("referral_code", referralCode)
      .single();

    if (!affiliateUser || affiliateError) {
      console.log("Affiliate user not found for code:", referralCode);
      return new Response(
        JSON.stringify({ error: "Affiliate not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Creating referral for affiliate:", affiliateUser.id);

    // Créer le referral
    const { error: referralError } = await supabaseAdmin
      .from("affiliate_referrals")
      .insert({
        referrer_user_id: affiliateUser.id,
        referred_email: email.toLowerCase(),
        referred_user_id: userId,
      });

    if (referralError) {
      console.error("Error creating referral:", referralError);
      throw referralError;
    }

    console.log("Referral created successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Referral tracked successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in track-referral-login:", error);
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
