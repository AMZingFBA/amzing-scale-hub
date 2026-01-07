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
    const firstName = payload.customer?.fields?.first_name ||
                      payload.contact?.first_name ||
                      payload.buyer?.first_name ||
                      payload.first_name ||
                      null;
    
    const lastName = payload.customer?.fields?.surname ||
                     payload.contact?.last_name ||
                     payload.buyer?.last_name ||
                     payload.last_name ||
                     null;
    
    const name = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null;

    // Récupérer le téléphone
    const phone = payload.customer?.fields?.phone_number ||
                  payload.contact?.phone ||
                  payload.buyer?.phone ||
                  payload.phone ||
                  null;

    // Déterminer le type de paiement (Mensuel vs Annuel)
    // systeme.io pricePlan.type: "one_shot" = paiement unique (annuel), "subscription" = récurrent (mensuel)
    const pricePlanType = payload.pricePlan?.type;
    const hasRecurring = payload.pricePlan?.recurringOptions != null;
    const pricePlanName = (payload.pricePlan?.name || '').toLowerCase();
    
    // Si c'est un paiement unique (one_shot) ou si le nom contient "annuel"/"annual", c'est annuel
    // Sinon si c'est subscription ou récurrent, c'est mensuel
    let subscriptionType = 'Annuel'; // Par défaut annuel pour systeme.io
    if (pricePlanType === 'subscription' || hasRecurring) {
      subscriptionType = 'Mensuel';
    } else if (pricePlanName.includes('mensuel') || pricePlanName.includes('monthly')) {
      subscriptionType = 'Mensuel';
    }
    
    logStep("Payment type detected", { 
      pricePlanType, 
      hasRecurring, 
      pricePlanName,
      subscriptionType 
    });

    // Calculer la date d'expiration
    // Pour annuel: 1 an à partir d'aujourd'hui
    // Pour mensuel: null (récurrent via systeme.io)
    let expiresAt: string | null = null;
    if (subscriptionType === 'Annuel') {
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + 1);
      expiresAt = expireDate.toISOString();
      logStep("Expiration date set", { expiresAt });
    }

    // Récupérer le montant
    const amount = payload.pricePlan?.amount ? payload.pricePlan.amount / 100 : 
                   payload.order?.totalPrice || 
                   payload.amount || 
                   payload.price || 
                   770;

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
          amount: amount,
          stripe_session_id: `systeme_io_${subscriptionType}_${Date.now()}`
        });

      if (purchaseError) {
        logStep("Error saving pending purchase", { error: purchaseError.message });
      } else {
        logStep("Pending purchase saved - will activate VIP when user registers", { subscriptionType });
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Payment recorded, VIP will be activated when user registers",
          email: normalizedEmail,
          subscriptionType
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
        payment_provider: "systeme_io",
        expires_at: expiresAt,
        started_at: new Date().toISOString(),
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

    logStep("VIP activated successfully", { subscriptionType, expiresAt });

    // Enregistrer l'achat
    const { error: purchaseError } = await supabaseClient
      .from("suite_purchases")
      .insert({
        email: normalizedEmail,
        amount: amount,
        stripe_session_id: `systeme_io_${subscriptionType}_${Date.now()}`
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
              user: {
                email: normalizedEmail,
                full_name: profile.full_name || name,
                phone: profile.phone || phone,
                plan_type: "vip",
                status: "active",
                payment_provider: "systeme_io",
                subscription_type: subscriptionType, // Mensuel ou Annuel
                expires_at: expiresAt,
                started_at: new Date().toISOString()
              }
            })
          }
        );
        logStep("Airtable sync triggered", { status: syncResponse.status, subscriptionType });
      }
    } catch (airtableError) {
      logStep("Airtable sync error (non-blocking)", { error: String(airtableError) });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "VIP activated successfully",
        email: normalizedEmail,
        userId: profile.id,
        subscriptionType,
        expiresAt
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
