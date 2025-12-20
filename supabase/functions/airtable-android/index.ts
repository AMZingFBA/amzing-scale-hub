import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID');
const ANDROID_TABLE = 'app android';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(ANDROID_TABLE)}`;
    const headers = {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const { email } = await req.json();
    console.log(`[Airtable Android] Adding email: ${email}`);

    if (!email) {
      throw new Error('Email is required');
    }

    // Create new record with Email field
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        records: [{
          fields: {
            Email: email,
          }
        }],
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      console.error('[Airtable Android] Airtable error:', result.error);
      throw new Error(result.error.message || 'Airtable error');
    }

    console.log(`[Airtable Android] Successfully added email: ${email}`);
    
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Airtable Android] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
