import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID');
const USERS_TABLE = 'Utilisateurs';

interface AirtableUser {
  id?: string;
  fields: {
    Email: string;
    Nom?: string;
    AbonnementActif?: boolean;
    TypeAbonnement?: string;
    DateActivation?: string;
    IDStripe?: string;
    IDRevenueCat?: string;
    Permissions?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}`;
    const headers = {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const { action, data, recordId, email } = await req.json();
    console.log(`[Airtable Users] Action: ${action}`, { email, recordId });

    let response;

    switch (action) {
      case 'fetch': {
        // Fetch all users
        response = await fetch(url, { headers });
        const records = await response.json();
        console.log(`[Airtable Users] Fetched ${records.records?.length || 0} users`);
        return new Response(JSON.stringify(records), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'fetchByEmail': {
        // Fetch user by email
        if (!email) {
          throw new Error('email is required for fetchByEmail');
        }
        const filterUrl = `${url}?filterByFormula=${encodeURIComponent(`{Email}="${email}"`)}`;
        response = await fetch(filterUrl, { headers });
        const filtered = await response.json();
        console.log(`[Airtable Users] Found user by email:`, filtered.records?.length > 0);
        return new Response(JSON.stringify(filtered), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create': {
        // Create new user
        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            records: [{ fields: data }],
          }),
        });
        const created = await response.json();
        console.log(`[Airtable Users] Created user:`, created);
        return new Response(JSON.stringify(created), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update': {
        // Update existing user
        if (!recordId) {
          throw new Error('recordId is required for update');
        }
        response = await fetch(`${url}/${recordId}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ fields: data }),
        });
        const updated = await response.json();
        console.log(`[Airtable Users] Updated user:`, updated);
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'updateSubscription': {
        // Update subscription by email
        if (!email) {
          throw new Error('email is required for updateSubscription');
        }
        
        // First find the user by email
        const filterUrl = `${url}?filterByFormula=${encodeURIComponent(`{Email}="${email}"`)}`;
        response = await fetch(filterUrl, { headers });
        const found = await response.json();
        
        if (!found.records || found.records.length === 0) {
          throw new Error(`User not found with email: ${email}`);
        }
        
        const userRecordId = found.records[0].id;
        
        // Update the subscription fields
        response = await fetch(`${url}/${userRecordId}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ fields: data }),
        });
        const updated = await response.json();
        console.log(`[Airtable Users] Updated subscription for ${email}:`, updated);
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Airtable Users] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
