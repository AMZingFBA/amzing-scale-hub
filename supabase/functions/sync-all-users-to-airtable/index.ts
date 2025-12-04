import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID');
const USERS_TABLE = 'Users';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[Sync All Users] Starting automatic sync...');

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get all profiles with their subscriptions
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, email, full_name, nickname');

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    const { data: subscriptions, error: subsError } = await supabaseClient
      .from('subscriptions')
      .select('user_id, plan_type, status, started_at, stripe_customer_id');

    if (subsError) {
      throw new Error(`Failed to fetch subscriptions: ${subsError.message}`);
    }

    // Create subscription map
    const subsMap = new Map(subscriptions?.map(s => [s.user_id, s]) || []);

    let synced = 0;
    let errors = 0;

    for (const profile of profiles || []) {
      try {
        const subscription = subsMap.get(profile.id);
        const planType = subscription?.plan_type || 'free';
        const isVip = planType === 'vip' && subscription?.status === 'active';

        // Search for existing record in Airtable
        const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}?filterByFormula={Email (principal)}="${profile.email}"`;
        const searchResponse = await fetch(searchUrl, {
          headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
        });
        const searchData = await searchResponse.json();

        // Check if user was previously VIP
        let wasVip = false;
        let existingDateActivation = null;
        if (searchData.records && searchData.records.length > 0) {
          const existingRecord = searchData.records[0].fields;
          wasVip = existingRecord["Type d'abonnement"] === "Mensuel" || 
                   existingRecord["Type d'abonnement"] === "Ancien VIP";
          existingDateActivation = existingRecord["date activation"];
        }

        // Check if user has stripe_customer_id (was a paying customer)
        const hadStripeCustomer = subscription?.stripe_customer_id != null && subscription?.stripe_customer_id !== '';

        // Determine subscription type with "Ancien VIP" logic
        let typeAbonnement = 'Gratuit';
        if (isVip) {
          typeAbonnement = 'Mensuel';
        } else if (wasVip || existingDateActivation || hadStripeCustomer) {
          typeAbonnement = 'Ancien VIP';
        }

        // Prepare fields
        const fields: Record<string, unknown> = {
          "Email (principal)": profile.email,
          "Nom": profile.full_name || profile.nickname || '',
          "Abonnement actif": isVip,
          "Type d'abonnement": typeAbonnement,
          "ID Stripe / RevenueCat": subscription?.stripe_customer_id || '',
          "Dernière connexion": new Date().toISOString().split('T')[0],
        };

        // Add date activation only if VIP and has started_at
        if (isVip && subscription?.started_at) {
          fields["date activation"] = new Date(subscription.started_at).toISOString().split('T')[0];
        }

        if (searchData.records && searchData.records.length > 0) {
          // Update existing record
          const recordId = searchData.records[0].id;
          await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}/${recordId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fields }),
          });
        } else {
          // Create new record
          await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ records: [{ fields }] }),
          });
        }

        synced++;
      } catch (err) {
        console.error(`[Sync All Users] Error syncing ${profile.email}:`, err);
        errors++;
      }

      // Small delay to avoid Airtable rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`[Sync All Users] Completed: ${synced} synced, ${errors} errors`);

    return new Response(JSON.stringify({ 
      success: true, 
      synced, 
      errors,
      total: profiles?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Sync All Users] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
