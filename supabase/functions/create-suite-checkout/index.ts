import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SUITE-CHECKOUT] ${step}${detailsStr}`);
};

// Prix ID pour le logiciel AMZing FBA à 1499,99€ (one-time)
const SUITE_PRICE_ID = "price_1SkC0hFkU3SeqY00nzOi55xI";

// Airtable configuration for "Forma AMZing FBA Noah - Cyprien" table
const AIRTABLE_FORMA_TABLE = "Forma AMZing FBA Noah - Cyprien";

async function addToAirtableForma(email: string, name: string | null, phone: string | null) {
  const airtableApiKey = Deno.env.get("AIRTABLE_API_KEY");
  // Use the specific Forma base ID (different from main base)
  const airtableBaseId = Deno.env.get("AIRTABLE_FORMA_BASE_ID");
  
  if (!airtableApiKey || !airtableBaseId) {
    logStep("Airtable credentials missing, skipping sync");
    return;
  }
  
  try {
    const tableNameEncoded = encodeURIComponent(AIRTABLE_FORMA_TABLE);
    const url = `https://api.airtable.com/v0/${airtableBaseId}/${tableNameEncoded}`;
    
    // Check if email already exists
    const searchUrl = `${url}?filterByFormula={E-mail}="${email}"`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        "Authorization": `Bearer ${airtableApiKey}`,
        "Content-Type": "application/json",
      },
    });
    
    const searchData = await searchResponse.json();
    
    if (searchData.records && searchData.records.length > 0) {
      logStep("User already exists in Forma table", { email });
      return;
    }
    
    // Create new record with VIP = false (not paid yet)
    const fields: Record<string, any> = {
      "E-mail": email,
      "Date": new Date().toISOString().split('T')[0],
      "VIP": false, // Not paid yet
    };
    
    if (phone) {
      fields["Numéro de téléphone"] = phone;
    }
    
    if (name) {
      fields["Nom"] = name;
    }
    
    const createResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${airtableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields,
        typecast: true,
      }),
    });
    
    if (createResponse.ok) {
      logStep("Successfully added to Forma Airtable table with VIP=false", { email });
    } else {
      const errorData = await createResponse.text();
      logStep("Failed to add to Forma Airtable", { error: errorData });
    }
  } catch (error) {
    logStep("Error adding to Forma Airtable", { error: String(error) });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError) {
      logStep("Auth error", { error: authError.message });
      return new Response(JSON.stringify({ 
        error: "Session expirée ou invalide. Veuillez vous reconnecter.",
        code: "AUTH_SESSION_INVALID" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    
    if (!user?.email) {
      logStep("No user or email found");
      return new Response(JSON.stringify({ 
        error: "Session expirée. Veuillez vous reconnecter.",
        code: "AUTH_SESSION_MISSING" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user profile for name and phone
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .single();

    // Add to Airtable Forma table with VIP = false (before payment)
    await addToAirtableForma(user.email, profile?.full_name || null, profile?.phone || null);

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("No existing customer found");
    }

    // Create checkout session for one-time payment
    const origin = req.headers.get("origin") || "https://amzingfba.com";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: SUITE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card", "klarna"],
      success_url: `${origin}/suite-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/suite#pricing`,
      metadata: {
        user_id: user.id,
        product: "suite",
      },
      custom_text: {
        after_submit: {
          message: "Bienvenue dans AMZing FBA Suite ! Vous allez recevoir un email de confirmation avec vos accès.",
        },
      },
    });

    logStep("Suite checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
