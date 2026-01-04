import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-SUITE-PAYMENT] ${step}${detailsStr}`);
};

// Airtable configuration
const AIRTABLE_FORMA_TABLE = "Inscrits"; // Table in "Forma AMZing FBA Noah - Cyprien" base
const AIRTABLE_USERS_TABLE = "Users";

async function updateAirtableForma(email: string) {
  const airtableApiKey = Deno.env.get("AIRTABLE_API_KEY");
  // Use the specific Forma base ID (different from main base)
  const airtableBaseId = Deno.env.get("AIRTABLE_FORMA_BASE_ID");
  
  if (!airtableApiKey || !airtableBaseId) {
    logStep("Airtable Forma credentials missing, skipping VIP update");
    return;
  }
  
  try {
    const tableNameEncoded = encodeURIComponent(AIRTABLE_FORMA_TABLE);
    const url = `https://api.airtable.com/v0/${airtableBaseId}/${tableNameEncoded}`;
    
    // Find record by email
    const searchUrl = `${url}?filterByFormula={E-mail}="${email}"`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        "Authorization": `Bearer ${airtableApiKey}`,
        "Content-Type": "application/json",
      },
    });
    
    const searchData = await searchResponse.json();
    
    if (searchData.records && searchData.records.length > 0) {
      const recordId = searchData.records[0].id;
      
      // Update VIP to true
      const updateResponse = await fetch(`${url}/${recordId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "VIP": true,
          },
        }),
      });
      
      if (updateResponse.ok) {
        logStep("Successfully updated VIP=true in Forma Airtable", { email, recordId });
      } else {
        const errorData = await updateResponse.text();
        logStep("Failed to update VIP in Forma Airtable", { error: errorData });
      }
    } else {
      // Record doesn't exist, create it with VIP = true
      logStep("Record not found in Forma, creating new record with VIP=true", { email });
      
      const createResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "E-mail": email,
            "Date du paiement": new Date().toISOString().split('T')[0],
            "VIP": true,
          },
          typecast: true,
        }),
      });
      
      if (createResponse.ok) {
        logStep("Successfully created record with VIP=true in Forma Airtable", { email });
      } else {
        const errorData = await createResponse.text();
        logStep("Failed to create record in Forma Airtable", { error: errorData });
      }
    }
  } catch (error) {
    logStep("Error updating VIP in Forma Airtable", { error: String(error) });
  }
}

async function updateAirtableGeneral(email: string) {
  const airtableApiKey = Deno.env.get("AIRTABLE_API_KEY");
  // Use the main base ID for "AMZing FBA – Général"
  const airtableBaseId = Deno.env.get("AIRTABLE_BASE_ID");

  if (!airtableApiKey || !airtableBaseId) {
    logStep("Airtable General credentials missing, skipping update");
    return;
  }

  // Some Airtable fields use typographic apostrophes (’). We try both to avoid silent failures.
  const subscriptionFieldCandidates = ["Type d’abonnement", "Type d'abonnement"];
  const createdAtFieldCandidates = ["Date de création", "date de création"];
  const subscriptionValue = "1499,99";
  const dateValue = new Date().toISOString().split('T')[0];

  try {
    const tableNameEncoded = encodeURIComponent(AIRTABLE_USERS_TABLE);
    const url = `https://api.airtable.com/v0/${airtableBaseId}/${tableNameEncoded}`;

    // Find record by email
    const searchUrl = `${url}?filterByFormula={Email (principal)}="${email}"`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        "Authorization": `Bearer ${airtableApiKey}`,
        "Content-Type": "application/json",
      },
    });

    const searchData = await searchResponse.json();

    const patchSubscription = async (recordId: string, subscriptionField: string) => {
      return await fetch(`${url}/${recordId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            [subscriptionField]: subscriptionValue,
          },
          typecast: true,
        }),
      });
    };

    const createRecord = async (subscriptionField: string, createdAtField: string) => {
      return await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Email (principal)": email,
            [subscriptionField]: subscriptionValue,
            [createdAtField]: dateValue,
          },
          typecast: true,
        }),
      });
    };

    if (searchData.records && searchData.records.length > 0) {
      const recordId = searchData.records[0].id;

      for (const fieldName of subscriptionFieldCandidates) {
        const updateResponse = await patchSubscription(recordId, fieldName);

        if (updateResponse.ok) {
          logStep("Successfully updated General Airtable subscription", {
            email,
            recordId,
            field: fieldName,
            value: subscriptionValue,
          });
          return;
        }

        const errorText = await updateResponse.text();
        const isUnknownField = errorText.includes("UNKNOWN_FIELD_NAME");

        if (isUnknownField) {
          logStep("General Airtable field mismatch, trying alternative", {
            email,
            triedField: fieldName,
            error: errorText,
          });
          continue;
        }

        logStep("Failed to update subscription in General Airtable", { email, error: errorText });
        return;
      }

      logStep("Failed to update subscription in General Airtable (no matching field name)", { email });
      return;
    }

    // Record doesn't exist, create it
    logStep("Record not found in General, creating new record", { email });

    for (const subscriptionField of subscriptionFieldCandidates) {
      for (const createdAtField of createdAtFieldCandidates) {
        const createResponse = await createRecord(subscriptionField, createdAtField);

        if (createResponse.ok) {
          logStep("Successfully created record in General Airtable", {
            email,
            subscriptionField,
            createdAtField,
            value: subscriptionValue,
          });
          return;
        }

        const errorText = await createResponse.text();
        const isUnknownField = errorText.includes("UNKNOWN_FIELD_NAME");

        if (isUnknownField) {
          logStep("General Airtable create field mismatch, trying alternative", {
            email,
            subscriptionField,
            createdAtField,
            error: errorText,
          });
          continue;
        }

        logStep("Failed to create record in General Airtable", { email, error: errorText });
        return;
      }
    }

    logStep("Failed to create record in General Airtable (no matching field names)", { email });
  } catch (error) {
    logStep("Error updating subscription in General Airtable", { email, error: String(error) });
  }
}

async function grantLifetimeVIP(supabaseClient: any, email: string, sessionId: string, amount: number) {
  try {
    // 1. Record the suite purchase
    const { error: insertError } = await supabaseClient
      .from('suite_purchases')
      .upsert({
        email: email,
        amount: amount,
        stripe_session_id: sessionId,
      }, { onConflict: 'email' });
    
    if (insertError) {
      logStep("Error recording suite purchase", { error: insertError.message });
    } else {
      logStep("Suite purchase recorded", { email });
    }
    
    // 2. Check if user already has an account and give lifetime VIP
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (profile) {
      // User exists, update their subscription to lifetime VIP
      const { error: subError } = await supabaseClient
        .from('subscriptions')
        .update({
          plan_type: 'vip',
          status: 'active',
          expires_at: null, // No expiration = lifetime
          payment_provider: 'stripe_suite',
          is_trial: false,
        })
        .eq('user_id', profile.id);
      
      if (subError) {
        logStep("Error updating subscription to lifetime VIP", { error: subError.message });
      } else {
        logStep("Subscription updated to lifetime VIP", { userId: profile.id, email });
      }
    } else {
      logStep("User not found in profiles, VIP will be granted on account creation", { email });
    }
  } catch (error) {
    logStep("Error in grantLifetimeVIP", { error: String(error) });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client with service role for database operations
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const { session_id } = await req.json();
    
    if (!session_id) {
      logStep("No session_id provided");
      return new Response(JSON.stringify({ 
        paid: false, 
        error: "Session ID manquant" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Verifying session", { session_id });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    logStep("Session retrieved", { 
      status: session.payment_status,
      mode: session.mode,
      customer_email: session.customer_email,
      amount_total: session.amount_total
    });

    if (session.payment_status === "paid") {
      logStep("Payment confirmed");
      
      const customerEmail = session.customer_details?.email || session.customer_email || "";
      const amount = session.amount_total ? session.amount_total / 100 : 1499.99;
      
      // 1. Update VIP = true in "Forma AMZing FBA Noah - Cyprien" Airtable table
      await updateAirtableForma(customerEmail);
      
      // 2. Update "Type d'abonnement" = "1499,99" in "AMZing FBA – Général" Airtable table
      await updateAirtableGeneral(customerEmail);
      
      // 2. Grant lifetime VIP in Supabase (record purchase + update subscription if user exists)
      await grantLifetimeVIP(supabaseClient, customerEmail, session_id, amount);
      
      return new Response(JSON.stringify({ 
        paid: true,
        email: customerEmail,
        amount: amount,
        product: session.metadata?.product || "suite"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      logStep("Payment not completed", { status: session.payment_status });
      
      return new Response(JSON.stringify({ 
        paid: false,
        status: session.payment_status
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      paid: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
