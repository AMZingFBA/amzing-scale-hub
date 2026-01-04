import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-SUITE-PAYMENT] ${step}${detailsStr}`);
};

// Airtable configuration for "Forma AMZing FBA Noah - Cyprien" table
const AIRTABLE_FORMA_TABLE = "Forma AMZing FBA Noah - Cyprien";

async function syncToAirtableForma(email: string, phone: string | null, name: string | null, paymentDate: string) {
  const airtableApiKey = Deno.env.get("AIRTABLE_API_KEY");
  const airtableBaseId = Deno.env.get("AIRTABLE_BASE_ID");
  
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
    
    // Create new record
    const fields: Record<string, string> = {
      "E-mail": email,
      "Date": paymentDate,
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
      logStep("Successfully synced to Forma Airtable table", { email });
    } else {
      const errorData = await createResponse.text();
      logStep("Failed to sync to Forma Airtable", { error: errorData });
    }
  } catch (error) {
    logStep("Error syncing to Forma Airtable", { error: String(error) });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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
      const customerName = session.customer_details?.name || null;
      const customerPhone = session.customer_details?.phone || null;
      const paymentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      // Sync to "Forma AMZing FBA Noah - Cyprien" Airtable table
      await syncToAirtableForma(customerEmail, customerPhone, customerName, paymentDate);
      
      return new Response(JSON.stringify({ 
        paid: true,
        email: customerEmail,
        amount: session.amount_total ? session.amount_total / 100 : 0,
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
