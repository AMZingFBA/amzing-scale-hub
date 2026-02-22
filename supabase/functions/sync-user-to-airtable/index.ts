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
  payment_provider?: string; // stripe, systeme_io, apple
  subscription_type?: string; // Mensuel, Annuel
}

// Format phone number to international format (+33 for French numbers)
function formatPhoneNumber(phone: string | undefined): string {
  if (!phone || phone.trim() === '') return '';
  
  // Remove spaces, dashes, parentheses
  let formatted = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // Convert French local format to international
  if (formatted.startsWith('0') && formatted.length === 10) {
    formatted = '+33' + formatted.substring(1);
  } else if (formatted.startsWith('33') && !formatted.startsWith('+')) {
    formatted = '+' + formatted;
  } else if (!formatted.startsWith('+')) {
    // Assume French if no prefix
    formatted = '+33' + formatted;
  }
  
  return formatted;
}

// Helper function to add a small random delay to prevent race conditions
function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Normalize emails to prevent duplicates caused by casing/spacing differences
function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

// Helper function to search for user in Airtable (case-insensitive)
async function searchUserInAirtable(email: string): Promise<{ records: Array<{ id: string; fields: Record<string, unknown> }> }> {
  const normalized = normalizeEmail(email);
  const formula = `LOWER({Email (principal)})="${normalized}"`;
  const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}?filterByFormula=${encodeURIComponent(formula)}`;

  const searchResponse = await fetch(searchUrl, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    },
  });
  return searchResponse.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user } = await req.json() as { user: UserData };

    // Normalize email early to prevent duplicates caused by casing/spaces
    const normalizedEmail = normalizeEmail(user.email);
    user.email = normalizedEmail;

    // Format phone number
    const formattedPhone = formatPhoneNumber(user.phone);
    console.log(`[Sync User to Airtable] Syncing user:`, user.email, `phone: ${formattedPhone}, plan_type: ${user.plan_type}, status: ${user.status}`);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Add a small random delay (100-500ms) to reduce race conditions when 
    // multiple sync calls happen at the same time (e.g., trigger + frontend)
    await randomDelay(100, 500);

    // Check if user already exists in Airtable by email
    let searchData = await searchUserInAirtable(normalizedEmail);
    console.log(`[Sync User to Airtable] First search result:`, searchData);

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
    // Priority: explicit subscription_type > payment_provider detection > existing record > default
    let typeAbonnement = 'Gratuit';
    if (isCurrentlyVip) {
      // If subscription_type is explicitly passed (from systeme.io), use it
      if (user.subscription_type === 'Annuel') {
        typeAbonnement = 'Annuel';
      } else if (user.subscription_type === 'Mensuel') {
        typeAbonnement = 'Mensuel';
      } else if (user.payment_provider === 'systeme_io') {
        // systeme.io without explicit type = default to Annuel (one-shot payment)
        typeAbonnement = 'Annuel';
      } else {
        // Stripe or other = Mensuel (recurring)
        typeAbonnement = 'Mensuel';
      }
    } else if (isCanceledVip) {
      // User just canceled - they're now "Ancien VIP"
      typeAbonnement = 'Ancien VIP';
    } else if (wasVip || hadDateActivation || hadStripeCustomer) {
      // User was VIP before but not anymore -> Ancien VIP
      typeAbonnement = 'Ancien VIP';
    }

    console.log(`[Sync User to Airtable] Type abonnement: ${typeAbonnement}, subscription_type: ${user.subscription_type}, payment_provider: ${user.payment_provider}, wasVip: ${wasVip}, isCanceledVip: ${isCanceledVip}, hadStripeCustomer: ${hadStripeCustomer}, plan_type: ${user.plan_type}, status: ${user.status}`);

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
      "telephone": formattedPhone,
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

    // Airtable headers for reuse
    const airtableHeaders = {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    // True if no record existed at the time of the first read (useful for downstream logic)
    const isNewUserInAirtable = !(searchData.records && searchData.records.length > 0);

    // === USERS TABLE (idempotent upsert) ===
    // If duplicates exist for this email, delete extras first to allow upsert
    if (searchData.records && searchData.records.length > 1) {
      console.log(`[Sync User to Airtable] Found ${searchData.records.length} duplicates for ${user.email}, cleaning up...`);
      // Keep the first record (oldest), delete the rest
      const duplicates = searchData.records.slice(1);
      for (const dup of duplicates) {
        const delRes = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(USERS_TABLE)}/${dup.id}`,
          { method: 'DELETE', headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` } }
        );
        if (delRes.ok) {
          console.log(`[Sync User to Airtable] Deleted duplicate record: ${dup.id}`);
        } else {
          console.error(`[Sync User to Airtable] Failed to delete duplicate:`, await delRes.text());
        }
      }
    }

    console.log(`[Sync User to Airtable] Upserting into "${USERS_TABLE}" (new=${isNewUserInAirtable})`);

    const upsertResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(USERS_TABLE)}`, {
      method: 'PATCH',
      headers: airtableHeaders,
      body: JSON.stringify({
        records: [{ fields }],
        performUpsert: { fieldsToMergeOn: ["Email (principal)"] },
      }),
    });

    const result = await upsertResponse.json();
    console.log(`[Sync User to Airtable] Result:`, result);

    if (!upsertResponse.ok || result?.error) {
      throw new Error(result?.error?.message || `Airtable error (${upsertResponse.status})`);
    }

    // === HANDLE "VIP" TABLE ===
    const isVipUser = user.plan_type === 'vip' && (user.status === 'active' || user.status === 'canceled');

    if (isVipUser) {
      console.log(`[Sync User to Airtable] Upserting into "VIP" table`);

      const vipFields: Record<string, unknown> = {
        "Email": user.email,
      };

      const vipUpsertResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/VIP`, {
        method: 'PATCH',
        headers: airtableHeaders,
        body: JSON.stringify({
          records: [{ fields: vipFields }],
          performUpsert: { fieldsToMergeOn: ["Email"] },
        }),
      });

      const vipResult = await vipUpsertResponse.json();

      if (!vipUpsertResponse.ok || vipResult?.error) {
        console.error(`[Sync User to Airtable] VIP upsert error:`, vipResult?.error || vipResult);
      } else {
        console.log(`[Sync User to Airtable] VIP upsert OK (automation triggered if configured)`);
      }
    }

    // === HANDLE "Amazon to airable" TABLE ===

    // If user becomes VIP, REMOVE them from "Amazon to airable" table (delete ALL matches)
    if (isCurrentlyVip) {
      console.log(`[Sync User to Airtable] User is now VIP, removing from Amazon to airable (if present)`);

      const formula = `LOWER({Email})="${user.email}"`;
      const amazonSearchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AMAZON_TO_AIRTABLE_TABLE)}?filterByFormula=${encodeURIComponent(formula)}`;
      const amazonSearchResponse = await fetch(amazonSearchUrl, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
      });
      const amazonSearchData = await amazonSearchResponse.json();

      const records: Array<{ id: string }> = amazonSearchData.records || [];
      for (const rec of records) {
        const deleteResponse = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AMAZON_TO_AIRTABLE_TABLE)}/${rec.id}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
          }
        );

        if (deleteResponse.ok) {
          console.log(`[Sync User to Airtable] Removed from Amazon to airable: ${rec.id}`);
        } else {
          console.error(`[Sync User to Airtable] Failed to delete from Amazon to airable:`, await deleteResponse.text());
        }
      }
    }

    // Only ADD/UPDATE "Amazon to airable" for users who have NEVER been VIP
    const neverBeenVip = !wasVip && !hadStripeCustomer && !hadDateActivation;
    const isFreeUser = !isCurrentlyVip && !isCanceledVip && typeAbonnement === 'Gratuit' && neverBeenVip;

    if (isFreeUser) {
      console.log(`[Sync User to Airtable] Upserting into Amazon to airable (free + never VIP)`);

      const amazonFields: Record<string, unknown> = {
        "Email": user.email,
        "Nom": user.full_name || user.nickname || '',
        "Numéro de téléphone": formattedPhone,
        "Pays": "France",
        "inscrit mais non VIP": true,
      };

      const amazonUpsertResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AMAZON_TO_AIRTABLE_TABLE)}`, {
        method: 'PATCH',
        headers: airtableHeaders,
        body: JSON.stringify({
          records: [{ fields: amazonFields }],
          performUpsert: { fieldsToMergeOn: ["Email"] },
        }),
      });

      const amazonResult = await amazonUpsertResponse.json();
      console.log(`[Sync User to Airtable] Amazon to airable upsert result:`, amazonResult);

      if (!amazonUpsertResponse.ok || amazonResult?.error) {
        console.error(`[Sync User to Airtable] Amazon to airable upsert error:`, amazonResult?.error || amazonResult);
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