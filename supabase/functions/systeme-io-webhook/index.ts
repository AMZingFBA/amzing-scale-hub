import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYSTEME-IO-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received", { method: req.method });

    // Parse the webhook payload
    const payload = await req.json();
    logStep("Payload received", payload);

    // systeme.io envoie les données dans différents formats selon le type d'événement
    // On cherche l'email dans les champs possibles
    const email = payload.email || 
                  payload.contact?.email || 
                  payload.buyer?.email ||
                  payload.customer?.email ||
                  payload.data?.email ||
                  payload.data?.contact?.email;

    if (!email) {
      logStep("ERROR: No email found in payload");
      return new Response(
        JSON.stringify({ error: "No email found in webhook payload" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    logStep("Email extracted", { email: normalizedEmail });

    // Récupérer le nom si disponible
    const name = payload.name ||
                 payload.contact?.name ||
                 payload.buyer?.name ||
                 payload.customer?.name ||
                 payload.data?.name ||
                 payload.first_name ||
                 payload.contact?.first_name ||
                 null;

    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Chercher l'utilisateur par email
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("id, email, full_name, phone")
      .eq("email", normalizedEmail)
      .single();

    if (profileError || !profile) {
      logStep("User not found in database", { email: normalizedEmail, error: profileError?.message });
      
      // L'utilisateur n'existe pas encore - on enregistre le paiement pour l'activer plus tard
      const { error: purchaseError } = await supabaseClient
        .from("suite_purchases")
        .insert({
          email: normalizedEmail,
          amount: payload.amount || payload.price || 770,
          stripe_session_id: `systeme_io_${Date.now()}`
        });

      if (purchaseError) {
        logStep("Error saving pending purchase", { error: purchaseError.message });
      } else {
        logStep("Pending purchase saved - will activate VIP when user registers");
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Payment recorded, VIP will be activated when user registers",
          email: normalizedEmail
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    logStep("User found", { userId: profile.id, email: profile.email });

    // Activer le VIP
    const { error: subscriptionError } = await supabaseClient
      .from("subscriptions")
      .update({
        plan_type: "vip",
        status: "active",
        expires_at: null, // VIP à vie pour la formation
        updated_at: new Date().toISOString()
      })
      .eq("user_id", profile.id);

    if (subscriptionError) {
      logStep("Error updating subscription", { error: subscriptionError.message });
      return new Response(
        JSON.stringify({ error: "Failed to activate VIP" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    logStep("VIP activated successfully");

    // Enregistrer l'achat
    const { error: purchaseError } = await supabaseClient
      .from("suite_purchases")
      .insert({
        email: normalizedEmail,
        amount: payload.amount || payload.price || 770,
        stripe_session_id: `systeme_io_${Date.now()}`
      });

    if (purchaseError) {
      logStep("Error saving purchase record", { error: purchaseError.message });
    } else {
      logStep("Purchase recorded");
    }

    // Sync to Airtable
    try {
      const airtableApiKey = Deno.env.get("AIRTABLE_API_KEY");
      const airtableBaseId = Deno.env.get("AIRTABLE_BASE_ID");
      
      if (airtableApiKey && airtableBaseId) {
        // Sync user to Airtable via edge function
        const syncResponse = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/functions/v1/sync-user-to-airtable`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
            },
            body: JSON.stringify({
              email: normalizedEmail,
              full_name: profile.full_name || name,
              phone: profile.phone,
              plan_type: "vip",
              status: "active",
              payment_provider: "systeme_io"
            })
          }
        );
        logStep("Airtable sync triggered", { status: syncResponse.status });
      }
    } catch (airtableError) {
      logStep("Airtable sync error (non-blocking)", { error: String(airtableError) });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "VIP activated successfully",
        email: normalizedEmail,
        userId: profile.id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
