import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VALIDATE-APPLE-RECEIPT] ${step}${detailsStr}`);
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("User not authenticated");

    const user = userData.user;
    logStep("User authenticated", { userId: user.id });

    const { receipt, productId } = await req.json();
    if (!receipt) throw new Error("No receipt provided");

    logStep("Receipt received", { productId });

    // Valider le receipt avec Apple
    const appleResponse = await validateWithApple(receipt);
    
    if (!appleResponse.isValid) {
      throw new Error("Invalid receipt");
    }

    logStep("Receipt validated with Apple", { status: appleResponse.status });

    // Calculer la date d'expiration (7 jours gratuits + 1 mois)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 jours gratuits
    expiresAt.setMonth(expiresAt.getMonth() + 1); // + 1 mois d'abonnement

    // Mettre à jour l'abonnement dans Supabase
    const { error: updateError } = await supabaseClient
      .from('subscriptions')
      .update({
        plan_type: 'vip',
        status: 'active',
        expires_at: expiresAt.toISOString(),
        trial_used: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      logStep("Error updating subscription", { error: updateError });
      throw updateError;
    }

    logStep("Subscription updated successfully", { expiresAt });

    return new Response(
      JSON.stringify({ 
        success: true, 
        expiresAt: expiresAt.toISOString() 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

async function validateWithApple(receipt: string) {
  // URL de production Apple
  const appleUrl = "https://buy.itunes.apple.com/verifyReceipt";
  // URL de sandbox pour les tests
  const sandboxUrl = "https://sandbox.itunes.apple.com/verifyReceipt";

  try {
    // Essayer d'abord en production
    let response = await fetch(appleUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "receipt-data": receipt,
        "password": Deno.env.get("APPLE_SHARED_SECRET"), // À configurer
        "exclude-old-transactions": true
      })
    });

    let data = await response.json();

    // Si le status est 21007, c'est un receipt de sandbox
    if (data.status === 21007) {
      logStep("Trying sandbox environment");
      response = await fetch(sandboxUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "receipt-data": receipt,
          "password": Deno.env.get("APPLE_SHARED_SECRET"),
          "exclude-old-transactions": true
        })
      });
      data = await response.json();
    }

    logStep("Apple response", { status: data.status });

    return {
      isValid: data.status === 0,
      status: data.status,
      data
    };
  } catch (error: any) {
    logStep("Apple validation error", { error: error.message });
    return {
      isValid: false,
      status: -1,
      error: error.message
    };
  }
}
