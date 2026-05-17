import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VALID_COUNTRIES = ['FR', 'UK', 'DE', 'ES', 'IT'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error: userError } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    ).auth.getUser(authHeader.replace('Bearer ', ''));

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { queryInput, countryCode = 'FR', profileId } = body;

    if (!queryInput) {
      return new Response(JSON.stringify({ error: 'queryInput is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!VALID_COUNTRIES.includes(countryCode)) {
      return new Response(JSON.stringify({ error: `Unknown country: ${countryCode}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const items = queryInput
      .split(/[,\n]/)
      .map((s: string) => s.trim())
      .filter(Boolean);
    const queryType = items.length > 1 ? 'batch' : 'single';

    // Enqueue job — the Hetzner mp-worker will do the actual SellerAmp lookup
    const { data: lookup, error: lookupErr } = await supabaseAdmin
      .from('mp_lookups')
      .insert({
        user_id: user.id,
        profile_id: profileId || null,
        query_type: queryType,
        query_input: queryInput.trim(),
        country_code: countryCode,
        status: 'pending',
      })
      .select()
      .single();

    if (lookupErr) throw new Error(`Failed to create lookup: ${lookupErr.message}`);

    console.log(`[OK] Job ${lookup.id} enqueued for mp-worker`);

    return new Response(
      JSON.stringify({ success: true, lookup_id: lookup.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: any) {
    console.error('mp-lookup error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
