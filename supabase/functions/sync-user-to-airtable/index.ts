import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID');
const USERS_TABLE = 'Users';

interface UserData {
  email: string;
  full_name?: string;
  nickname?: string;
  phone?: string;
  user_id?: string;
  subscription_status?: string;
  plan_type?: string;
  started_at?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user } = await req.json();
    console.log(`[Sync User to Airtable] Syncing user:`, user.email);

    // Check if user already exists in Airtable by email
    const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}?filterByFormula={Email (principal)}="${user.email}"`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });
    
    const searchData = await searchResponse.json();
    console.log(`[Sync User to Airtable] Search result:`, searchData);

    // Check if user was previously VIP (from existing Airtable record)
    let wasVip = false;
    let hadDateActivation = false;
    if (searchData.records && searchData.records.length > 0) {
      const existingRecord = searchData.records[0].fields;
      // Check both apostrophe variants (Unicode U+2019 and ASCII)
      wasVip = existingRecord["Type d'abonnement"] === "Mensuel" || 
               existingRecord["Type d'abonnement"] === "Ancien VIP" ||
               existingRecord["Type d\u2019abonnement"] === "Mensuel" || 
               existingRecord["Type d\u2019abonnement"] === "Ancien VIP";
      hadDateActivation = existingRecord["date activation"] != null;
    }

    // Check if user has stripe_customer_id (was a paying customer at some point)
    const hadStripeCustomer = user.stripe_customer_id != null && user.stripe_customer_id !== '';

    // Determine subscription type
    let typeAbonnement = 'Gratuit';
    if (user.plan_type === 'vip' && user.status === 'active') {
      typeAbonnement = 'Mensuel';
    } else if (wasVip || hadDateActivation || hadStripeCustomer) {
      // User was VIP before but not anymore -> Ancien VIP
      typeAbonnement = 'Ancien VIP';
    }

    console.log(`[Sync User to Airtable] Type abonnement: ${typeAbonnement}, wasVip: ${wasVip}, hadStripeCustomer: ${hadStripeCustomer}, plan_type: ${user.plan_type}, status: ${user.status}`);

    // Format activation date if available
    let dateActivation = null;
    if (user.started_at && user.plan_type === 'vip') {
      dateActivation = new Date(user.started_at).toISOString().split('T')[0];
    }

    const fields: Record<string, unknown> = {
      "Email (principal)": user.email,
      "Nom": user.full_name || user.nickname || '',
      "Abonnement actif": user.plan_type === 'vip' && user.status === 'active',
      "Type d\u2019abonnement": typeAbonnement,
      "ID Stripe / RevenueCat": user.stripe_customer_id || user.stripe_subscription_id || '',
      "Dernière connexion": new Date().toISOString().split('T')[0],
    };

    // Add date activation only if available
    if (dateActivation) {
      fields["date activation"] = dateActivation;
    }

    // Remove undefined values
    Object.keys(fields).forEach(key => {
      if (fields[key] === undefined) delete fields[key];
    });

    let response;
    
    if (searchData.records && searchData.records.length > 0) {
      // Update existing record
      const recordId = searchData.records[0].id;
      console.log(`[Sync User to Airtable] Updating existing record:`, recordId);
      
      response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      });
    } else {
      // Create new record
      console.log(`[Sync User to Airtable] Creating new record`);
      
      response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: [{ fields }] }),
      });
    }

    const result = await response.json();
    console.log(`[Sync User to Airtable] Result:`, result);

    if (result.error) {
      throw new Error(result.error.message || 'Airtable error');
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Sync User to Airtable] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
