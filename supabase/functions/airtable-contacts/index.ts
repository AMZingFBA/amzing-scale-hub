import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID');
const CONTACTS_TABLE = 'Contacts';

interface AirtableContact {
  id?: string;
  fields: {
    Email: string;
    Prenom?: string;
    Tag?: string;
    Source?: string;
    TypeEmail?: string;
    StatutEnvoi?: string;
    DernierEnvoi?: string;
    IDMake?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${CONTACTS_TABLE}`;
    const headers = {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const { action, data, recordId, view } = await req.json();
    console.log(`[Airtable Contacts] Action: ${action}`, data);

    let response;

    switch (action) {
      case 'fetch': {
        // Fetch contacts with optional view filter
        const fetchUrl = view 
          ? `${url}?view=${encodeURIComponent(view)}`
          : url;
        response = await fetch(fetchUrl, { headers });
        const records = await response.json();
        console.log(`[Airtable Contacts] Fetched ${records.records?.length || 0} contacts`);
        return new Response(JSON.stringify(records), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create': {
        // Create new contact
        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            records: [{ fields: data }],
          }),
        });
        const created = await response.json();
        console.log(`[Airtable Contacts] Created contact:`, created);
        return new Response(JSON.stringify(created), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update': {
        // Update existing contact
        if (!recordId) {
          throw new Error('recordId is required for update');
        }
        response = await fetch(`${url}/${recordId}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ fields: data }),
        });
        const updated = await response.json();
        console.log(`[Airtable Contacts] Updated contact:`, updated);
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        // Delete contact
        if (!recordId) {
          throw new Error('recordId is required for delete');
        }
        response = await fetch(`${url}/${recordId}`, {
          method: 'DELETE',
          headers,
        });
        const deleted = await response.json();
        console.log(`[Airtable Contacts] Deleted contact:`, deleted);
        return new Response(JSON.stringify(deleted), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Airtable Contacts] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
