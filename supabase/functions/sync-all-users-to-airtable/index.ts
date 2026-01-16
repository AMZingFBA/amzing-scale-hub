import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

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

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get all profiles with their subscriptions
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, email, full_name, nickname, phone, created_at, registration_source');

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    const { data: subscriptions, error: subsError } = await supabaseClient
      .from('subscriptions')
      .select('user_id, plan_type, status, started_at, expires_at, stripe_customer_id');

    if (subsError) {
      throw new Error(`Failed to fetch subscriptions: ${subsError.message}`);
    }

    // Get all push notification tokens to determine platform
    const { data: pushTokens, error: tokensError } = await supabaseClient
      .from('push_notification_tokens')
      .select('user_id, platform');

    if (tokensError) {
      console.error(`[Sync] Failed to fetch push tokens: ${tokensError.message}`);
    }

    // Get all affiliate referrals to determine registration source
    const { data: referrals, error: referralsError } = await supabaseClient
      .from('affiliate_referrals')
      .select('referred_user_id');

    if (referralsError) {
      console.error(`[Sync] Failed to fetch referrals: ${referralsError.message}`);
    }

    // Create referral set for quick lookup
    const referredUsers = new Set((referrals || []).map(r => r.referred_user_id).filter(Boolean));

    // Create token platform map - prefer iOS > Android > Web
    const platformMap = new Map<string, string>();
    for (const token of pushTokens || []) {
      const current = platformMap.get(token.user_id);
      if (!current) {
        platformMap.set(token.user_id, token.platform === 'ios' ? 'iOS' : token.platform === 'android' ? 'Android' : 'Web');
      } else if (token.platform === 'ios' && current !== 'iOS') {
        platformMap.set(token.user_id, 'iOS');
      } else if (token.platform === 'android' && current === 'Web') {
        platformMap.set(token.user_id, 'Android');
      }
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
        let existingResiliationDate = null;
        if (searchData.records && searchData.records.length > 0) {
          const existingRecord = searchData.records[0].fields;
          // Check both apostrophe variants (Unicode U+2019 and ASCII)
          wasVip = existingRecord["Type d'abonnement"] === "Mensuel" || 
                   existingRecord["Type d'abonnement"] === "Ancien VIP" ||
                   existingRecord["Type d\u2019abonnement"] === "Mensuel" || 
                   existingRecord["Type d\u2019abonnement"] === "Ancien VIP";
          existingDateActivation = existingRecord["date activation"];
          existingResiliationDate = existingRecord["Dernière résiliation vip"];
          console.log(`[Sync] ${profile.email} - existing type: ${existingRecord["Type d'abonnement"] || existingRecord["Type d\u2019abonnement"]}`);
        }

        // Check if user has stripe_customer_id (was a paying customer)
        const hadStripeCustomer = subscription?.stripe_customer_id != null && subscription?.stripe_customer_id !== '';

        // Count successful payments from Stripe
        let successfulPayments = 0;
        let totalRevenue = 0;
        
        if (hadStripeCustomer && subscription?.stripe_customer_id) {
          try {
            // Get all payment intents for this customer
            const paymentIntents = await stripe.paymentIntents.list({
              customer: subscription.stripe_customer_id,
              limit: 100,
            });
            
            // Count only succeeded payments
            for (const pi of paymentIntents.data) {
              if (pi.status === 'succeeded') {
                successfulPayments++;
                totalRevenue += pi.amount / 100;
              }
            }
            
            console.log(`[Sync] ${profile.email} - Stripe payments: ${successfulPayments} succeeded, total: ${totalRevenue}€`);
          } catch (stripeErr) {
            console.error(`[Sync] ${profile.email} - Stripe error:`, stripeErr);
          }
        }

        // Determine subscription type with "Ancien VIP" logic
        let typeAbonnement = 'Gratuit';
        if (isVip) {
          typeAbonnement = 'Mensuel';
        } else if (wasVip || existingDateActivation || hadStripeCustomer) {
          typeAbonnement = 'Ancien VIP';
        }

        // Determine resiliation date for Ancien VIP users
        let resiliationDate = existingResiliationDate;
        if (!isVip && (wasVip || hadStripeCustomer || existingDateActivation) && !existingResiliationDate) {
          // Use expires_at as resiliation date if available
          if (subscription?.expires_at) {
            resiliationDate = new Date(subscription.expires_at).toISOString().split('T')[0];
          } else if (subscription?.started_at) {
            // Fallback: use started_at + 30 days as estimated resiliation
            const startDate = new Date(subscription.started_at);
            startDate.setDate(startDate.getDate() + 30);
            resiliationDate = startDate.toISOString().split('T')[0];
          }
        }

        // Determine user's main platform
        const outilPrincipal = platformMap.get(profile.id) || 'Web';

        // Determine registration source - prioritize database value, then referral, then platform
        let sourceInscription = profile.registration_source || 'site';
        if (referredUsers.has(profile.id)) {
          sourceInscription = 'Referral';
        } else if (sourceInscription === 'site' && platformMap.has(profile.id)) {
          // Only use App if no explicit source was stored
          sourceInscription = 'App';
        }

        // Format phone number to international format
        const formatPhone = (phone: string | null | undefined): string => {
          if (!phone || phone.trim() === '') return '';
          let formatted = phone.replace(/[\s\-\(\)\.]/g, '');
          if (formatted.startsWith('0') && formatted.length === 10) {
            formatted = '+33' + formatted.substring(1);
          } else if (formatted.startsWith('33') && !formatted.startsWith('+')) {
            formatted = '+' + formatted;
          } else if (!formatted.startsWith('+')) {
            formatted = '+33' + formatted;
          }
          return formatted;
        };

        const formattedPhone = formatPhone(profile.phone);

        // Prepare fields - use Unicode apostrophe (U+2019) for Airtable field name
        // DON'T update "Dernière connexion" during bulk sync - only update when user actually logs in
        const fields: Record<string, unknown> = {
          "Email (principal)": profile.email,
          "Nom": profile.full_name || profile.nickname || '',
          "telephone": formattedPhone,
          "Abonnement actif": isVip,
          "Type d\u2019abonnement": typeAbonnement,
          "ID Stripe / RevenueCat": subscription?.stripe_customer_id || '',
          "Création compte": profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : '',
          "Nombre paiements réussis": successfulPayments,
          "Outil principal": outilPrincipal,
          "Source d\u2019inscription": sourceInscription,
        };

        console.log(`[Sync] ${profile.email} - platform: ${outilPrincipal}, source: ${sourceInscription}, dbSource: ${profile.registration_source}`);

        // Add date activation vip for VIP and Ancien VIP users
        // For Ancien VIP: calculate from expires_at - 30 days if no existing date
        if (subscription?.started_at) {
          if (isVip) {
            // Current VIP: use started_at
            fields["date activation vip"] = new Date(subscription.started_at).toISOString().split('T')[0];
          } else if (typeAbonnement === 'Ancien VIP' && !existingDateActivation) {
            // Ancien VIP without activation date: estimate from expires_at - 30 days
            if (subscription?.expires_at) {
              const activationDate = new Date(subscription.expires_at);
              activationDate.setDate(activationDate.getDate() - 30);
              fields["date activation vip"] = activationDate.toISOString().split('T')[0];
            } else {
              // Fallback to started_at
              fields["date activation vip"] = new Date(subscription.started_at).toISOString().split('T')[0];
            }
          }
        }

        // Add resiliation date for Ancien VIP users
        if (resiliationDate && typeAbonnement === 'Ancien VIP') {
          fields["Dernière résiliation vip"] = resiliationDate;
        }

        // Add motif résiliation for Ancien VIP users
        if (typeAbonnement === 'Ancien VIP') {
          // Determine reason: payment failure or voluntary cancellation
          if (subscription?.status === 'unpaid') {
            fields["Motif résiliation"] = "Échec de paiement";
          } else {
            fields["Motif résiliation"] = "Résiliation volontaire";
          }
        }

        if (searchData.records && searchData.records.length > 0) {
          // Update existing record
          const recordId = searchData.records[0].id;
          const updateResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}/${recordId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fields }),
          });
          const updateResult = await updateResponse.json();
          if (updateResult.error) {
            console.error(`[Sync] ${profile.email} - Airtable error:`, updateResult.error);
          }
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
