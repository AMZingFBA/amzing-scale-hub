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

    // Determine subscription type
    let typeAbonnement = 'Gratuit';
    if (user.plan_type === 'vip') {
      typeAbonnement = 'Mensuel'; // Default to Mensuel for VIP
    }

    // Format activation date if available
    let dateActivation = null;
    if (user.started_at && user.plan_type === 'vip') {
      dateActivation = new Date(user.started_at).toISOString().split('T')[0];
    }

    const fields: Record<string, unknown> = {
      "Email (principal)": user.email,
      "Nom": user.full_name || user.nickname || '',
      "Abonnement actif": user.plan_type === 'vip',
      "Type d\u2019abonnement": typeAbonnement,
      "ID Stripe / RevenueCat": user.stripe_customer_id || user.stripe_subscription_id || '',
      "Dernière connexion": new Date().toISOString().split('T')[0],
    };

    // Add Date activation only if available
    if (dateActivation) {
      fields["Date activation"] = dateActivation;
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
