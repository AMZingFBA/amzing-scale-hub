import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID');
const CONTACTS_TABLE = 'Contacts';

async function verifyAdmin(req: Request): Promise<string> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims) {
    throw new Error('Unauthorized');
  }

  const userId = data.claims.sub;

  // Check admin role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (!roleData) {
    throw new Error('Forbidden: admin role required');
  }

  return userId;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    await verifyAdmin(req);

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${CONTACTS_TABLE}`;
    const headers = {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const { action, data, recordId, view } = await req.json();
    console.log(`[Airtable Contacts] Action: ${action}`);

    let response;

    switch (action) {
      case 'fetch': {
        const fetchUrl = view 
          ? `${url}?view=${encodeURIComponent(view)}`
          : url;
        response = await fetch(fetchUrl, { headers });
        const records = await response.json();
        return new Response(JSON.stringify(records), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create': {
        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ records: [{ fields: data }] }),
        });
        const created = await response.json();
        return new Response(JSON.stringify(created), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update': {
        if (!recordId) throw new Error('recordId is required for update');
        response = await fetch(`${url}/${recordId}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ fields: data }),
        });
        const updated = await response.json();
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        if (!recordId) throw new Error('recordId is required for delete');
        response = await fetch(`${url}/${recordId}`, {
          method: 'DELETE',
          headers,
        });
        const deleted = await response.json();
        return new Response(JSON.stringify(deleted), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const status = errorMessage === 'Unauthorized' || errorMessage.startsWith('Forbidden') ? 401 : 400;
    console.error('[Airtable Contacts] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
