import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackClickRequest {
  referralCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { referralCode }: TrackClickRequest = await req.json();

    console.log("=== AFFILIATE CLICK TRACKING ===");
    console.log("Referral Code:", referralCode);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find referrer by code
    const { data: referrer, error: getReferrerError } = await supabaseAdmin
      .from("affiliate_users")
      .select("id")
      .eq("referral_code", referralCode)
      .single();

    if (getReferrerError || !referrer) {
      throw new Error("Code de parrainage invalide");
    }

    // Get user agent and IP
    const userAgent = req.headers.get("user-agent") || "unknown";
    const sourceIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    // Track click
    const { error: insertError } = await supabaseAdmin
      .from("affiliate_clicks")
      .insert({
        referrer_user_id: referrer.id,
        user_agent: userAgent,
        source_ip: sourceIp,
      });

    if (insertError) {
      console.error("Error tracking click:", insertError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        referrerId: referrer.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in affiliate-track-click:", error);
    
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
