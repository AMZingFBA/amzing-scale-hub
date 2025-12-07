import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID');
const USERS_TABLE = 'Users';
const AMAZON_TO_AIRTABLE_TABLE = 'Amazon to airable';

interface UserData {
  email: string;
  full_name?: string;
  nickname?: string;
  phone?: string;
  user_id?: string;
  subscription_status?: string;
  plan_type?: string;
  status?: string;
  started_at?: string;
  expires_at?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  platform?: string; // iOS, Android, or Web
  registration_source?: string; // site, App, Referral, Instagram, TikTok
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user } = await req.json() as { user: UserData };
    console.log(`[Sync User to Airtable] Syncing user:`, user.email, `plan_type: ${user.plan_type}, status: ${user.status}`);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

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
    let existingResiliationDate = null;
    let existingMotifResiliation = null;
    if (searchData.records && searchData.records.length > 0) {
      const existingRecord = searchData.records[0].fields;
      // Check both apostrophe variants (Unicode U+2019 and ASCII)
      wasVip = existingRecord["Type d'abonnement"] === "Mensuel" || 
               existingRecord["Type d'abonnement"] === "Ancien VIP" ||
               existingRecord["Type d\u2019abonnement"] === "Mensuel" || 
               existingRecord["Type d\u2019abonnement"] === "Ancien VIP";
      hadDateActivation = existingRecord["date activation vip"] != null;
      existingResiliationDate = existingRecord["Dernière résiliation vip"];
      existingMotifResiliation = existingRecord["Motif résiliation"];
    }

    // Check if user has stripe_customer_id (was a paying customer at some point)
    const hadStripeCustomer = user.stripe_customer_id != null && user.stripe_customer_id !== '';

    // Count successful payments from Stripe
    let successfulPayments = 0;
    let totalRevenue = 0;
    
    if (hadStripeCustomer && user.stripe_customer_id) {
      try {
        const paymentIntents = await stripe.paymentIntents.list({
          customer: user.stripe_customer_id,
          limit: 100,
        });
        
        for (const pi of paymentIntents.data) {
          if (pi.status === 'succeeded') {
            successfulPayments++;
            totalRevenue += pi.amount / 100;
          }
        }
        
        console.log(`[Sync User to Airtable] ${user.email} - Stripe payments: ${successfulPayments} succeeded, total: ${totalRevenue}€`);
      } catch (stripeErr) {
        console.error(`[Sync User to Airtable] ${user.email} - Stripe error:`, stripeErr);
      }
    }

    // Determine if user is currently VIP (active subscription, not canceled)
    // VIP is ONLY when plan_type is vip AND status is active (not canceled, not expired, not unpaid)
    const isCurrentlyVip = user.plan_type === 'vip' && user.status === 'active';
    
    // User has canceled VIP subscription (still VIP but subscription will end)
    const isCanceledVip = user.plan_type === 'vip' && user.status === 'canceled';

    // Determine subscription type
    let typeAbonnement = 'Gratuit';
    if (isCurrentlyVip) {
      typeAbonnement = 'Mensuel';
    } else if (isCanceledVip) {
      // User just canceled - they're now "Ancien VIP"
      typeAbonnement = 'Ancien VIP';
    } else if (wasVip || hadDateActivation || hadStripeCustomer) {
      // User was VIP before but not anymore -> Ancien VIP
      typeAbonnement = 'Ancien VIP';
    }

    console.log(`[Sync User to Airtable] Type abonnement: ${typeAbonnement}, wasVip: ${wasVip}, isCanceledVip: ${isCanceledVip}, hadStripeCustomer: ${hadStripeCustomer}, plan_type: ${user.plan_type}, status: ${user.status}`);

    // Format activation date if available
    let dateActivation = null;
    if (user.started_at && (isCurrentlyVip || isCanceledVip)) {
      // Current or canceled VIP: use started_at
      dateActivation = new Date(user.started_at).toISOString().split('T')[0];
    } else if (typeAbonnement === 'Ancien VIP' && !hadDateActivation) {
      // Ancien VIP without activation date: estimate from expires_at - 30 days
      if (user.expires_at) {
        const activationDate = new Date(user.expires_at);
        activationDate.setDate(activationDate.getDate() - 30);
        dateActivation = activationDate.toISOString().split('T')[0];
      } else if (user.started_at) {
        // Fallback to started_at
        dateActivation = new Date(user.started_at).toISOString().split('T')[0];
      }
    }

    // Determine resiliation date
    let resiliationDate = existingResiliationDate;
    if (isCanceledVip && !existingResiliationDate) {
      // User just cancelled - set today as resiliation date
      resiliationDate = new Date().toISOString().split('T')[0];
      console.log(`[Sync User to Airtable] Setting resiliation date to today: ${resiliationDate}`);
    } else if (user.expires_at && typeAbonnement === 'Ancien VIP' && !existingResiliationDate) {
      // Use expires_at if available for cancelled subscriptions
      resiliationDate = new Date(user.expires_at).toISOString().split('T')[0];
    }

    // Determine motif résiliation
    let motifResiliation = existingMotifResiliation;
    if (typeAbonnement === 'Ancien VIP' && !existingMotifResiliation) {
      // Determine reason: payment failure or voluntary cancellation
      if (user.status === 'unpaid') {
        motifResiliation = "Échec de paiement";
      } else if (isCanceledVip || user.status === 'canceled') {
        motifResiliation = "Résiliation volontaire";
      } else {
        motifResiliation = "Résiliation volontaire";
      }
      console.log(`[Sync User to Airtable] Setting motif résiliation: ${motifResiliation}`);
    }

    // Determine platform - prioritize passed platform, fallback to Web
    const outilPrincipal = user.platform === 'ios' ? 'iOS' : user.platform === 'android' ? 'Android' : 'Web';

    // Determine registration source - prioritize passed source, or detect from platform
    let sourceInscription = user.registration_source || 'site';
    if (!user.registration_source && user.platform) {
      sourceInscription = 'App';
    }

    const fields: Record<string, unknown> = {
      "Email (principal)": user.email,
      "Nom": user.full_name || user.nickname || '',
      "Abonnement actif": isCurrentlyVip, // false when canceled
      "Type d\u2019abonnement": typeAbonnement,
      "ID Stripe / RevenueCat": user.stripe_customer_id || user.stripe_subscription_id || '',
      "Dernière connexion": new Date().toISOString().split('T')[0],
      "Nombre paiements réussis": successfulPayments,
      "Outil principal": outilPrincipal,
      "Source d\u2019inscription": sourceInscription,
    };

    // Add date activation only if available
    if (dateActivation) {
      fields["date activation vip"] = dateActivation;
    }

    // Add resiliation date if user is Ancien VIP
    if (resiliationDate && typeAbonnement === 'Ancien VIP') {
      fields["Dernière résiliation vip"] = resiliationDate;
    }

    // Add motif résiliation for Ancien VIP users
    if (motifResiliation && typeAbonnement === 'Ancien VIP') {
      fields["Motif résiliation"] = motifResiliation;
    }

    // Remove undefined values
    Object.keys(fields).forEach(key => {
      if (fields[key] === undefined) delete fields[key];
    });

    console.log(`[Sync User to Airtable] Fields to sync:`, JSON.stringify(fields));

    let response;
    let isNewUserInAirtable = false;
    
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
      // Create new record - this is a truly new user
      console.log(`[Sync User to Airtable] Creating new record`);
      isNewUserInAirtable = true;
      
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

    // === HANDLE "Amazon to airable" TABLE ===
    
    // If user becomes VIP, REMOVE them from "Amazon to airable" table
    if (isCurrentlyVip) {
      console.log(`[Sync User to Airtable] User is now VIP, checking if they need to be removed from Amazon to airable`);
      
      const amazonSearchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AMAZON_TO_AIRTABLE_TABLE)}?filterByFormula={Email}="${user.email}"`;
      const amazonSearchResponse = await fetch(amazonSearchUrl, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
      });
      const amazonSearchData = await amazonSearchResponse.json();
      
      if (amazonSearchData.records && amazonSearchData.records.length > 0) {
        // User exists in Amazon to airable - DELETE them
        const recordId = amazonSearchData.records[0].id;
        console.log(`[Sync User to Airtable] Deleting VIP user from Amazon to airable, record ID: ${recordId}`);
        
        const deleteResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AMAZON_TO_AIRTABLE_TABLE)}/${recordId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
        });
        
        if (deleteResponse.ok) {
          console.log(`[Sync User to Airtable] Successfully removed VIP user from Amazon to airable`);
        } else {
          console.error(`[Sync User to Airtable] Failed to delete from Amazon to airable:`, await deleteResponse.text());
        }
      }
    }
    
    // Only ADD to "Amazon to airable" for NEW users who have NEVER been VIP
    const neverBeenVip = !wasVip && !hadStripeCustomer && !hadDateActivation;
    const isTrulyNewFreeUser = isNewUserInAirtable && !isCurrentlyVip && !isCanceledVip && typeAbonnement === 'Gratuit' && neverBeenVip;
    
    if (isTrulyNewFreeUser) {
      console.log(`[Sync User to Airtable] User is NEW and never been VIP, syncing to Amazon to airable table`);
      
      // Check if user already exists in Amazon to airable table (shouldn't, but double check)
      const amazonSearchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AMAZON_TO_AIRTABLE_TABLE)}?filterByFormula={Email}="${user.email}"`;
      const amazonSearchResponse = await fetch(amazonSearchUrl, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
      });
      const amazonSearchData = await amazonSearchResponse.json();
      
      if (amazonSearchData.records && amazonSearchData.records.length > 0) {
        console.log(`[Sync User to Airtable] User already exists in Amazon to airable, skipping`);
      } else {
        // Create new record
        const amazonFields: Record<string, unknown> = {
          "Email": user.email,
          "Nom": user.full_name || user.nickname || '',
          "Numéro de téléphone": user.phone || '',
          "Pays": "France",
          "inscrit mais non VIP": true,
        };
        
        console.log(`[Sync User to Airtable] Creating new Amazon to airable record:`, JSON.stringify(amazonFields));
        
        const amazonResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AMAZON_TO_AIRTABLE_TABLE)}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ records: [{ fields: amazonFields }] }),
        });
        
        const amazonResult = await amazonResponse.json();
        console.log(`[Sync User to Airtable] Amazon to airable result:`, amazonResult);
        
        if (amazonResult.error) {
          console.error(`[Sync User to Airtable] Amazon to airable error:`, amazonResult.error);
        }
      }
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