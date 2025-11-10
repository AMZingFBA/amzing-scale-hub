import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("=== UPDATE REFERRAL PAYMENTS ===");

    // Get all referrals with "en attente" status
    const { data: pendingReferrals, error: referralsError } = await supabaseAdmin
      .from("affiliate_referrals")
      .select("id, referred_user_id, referred_email")
      .eq("payment_status", "en attente");

    if (referralsError) {
      console.error("Error fetching referrals:", referralsError);
      throw referralsError;
    }

    console.log(`Found ${pendingReferrals?.length || 0} pending referrals`);

    let updatedCount = 0;

    // Check each referral's subscription status
    for (const referral of pendingReferrals || []) {
      const { data: subscription } = await supabaseAdmin
        .from("subscriptions")
        .select("plan_type, status")
        .eq("user_id", referral.referred_user_id)
        .single();

      // If user has VIP subscription, mark as paid
      if (subscription?.plan_type === "vip" && subscription?.status === "active") {
        const { error: updateError } = await supabaseAdmin
          .from("affiliate_referrals")
          .update({
            payment_status: "payé",
            payment_month: new Date().toISOString().slice(0, 7) // YYYY-MM
          })
          .eq("id", referral.id);

        if (!updateError) {
          updatedCount++;
          console.log(`Updated referral for ${referral.referred_email}`);
        }
      }
    }

    console.log(`Updated ${updatedCount} referrals`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Updated ${updatedCount} referrals`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in update-referral-payments:", error);
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
