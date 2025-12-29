import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Tradedoubler server-side tracking
async function trackTradedoublerConversion(data: {
  transactionId: string;
  orderValue: number;
  voucher?: string;
  currency?: string;
}) {
  try {
    // Tradedoubler Grow tracking pixel URL
    // event=469662, organization=2458850
    const params = new URLSearchParams({
      organization: '2458850',
      event: '469662',
      orderNumber: data.transactionId,
      orderValue: data.orderValue.toString(),
      currency: data.currency || 'EUR',
    });
    
    if (data.voucher) {
      params.append('voucher', data.voucher);
    }

    const trackingUrl = `https://tbs.tradedoubler.com/report?${params.toString()}`;
    
    logStep("Sending Tradedoubler conversion", { 
      transactionId: data.transactionId, 
      orderValue: data.orderValue,
      url: trackingUrl 
    });

    const response = await fetch(trackingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'AmzingFBA-Webhook/1.0',
      },
    });

    if (response.ok) {
      logStep("Tradedoubler conversion tracked successfully", { 
        transactionId: data.transactionId,
        status: response.status 
      });
    } else {
      logStep("Tradedoubler tracking response", { 
        status: response.status,
        statusText: response.statusText 
      });
    }
  } catch (error) {
    logStep("Tradedoubler tracking error", { 
      error: error instanceof Error ? error.message : 'Unknown',
      transactionId: data.transactionId 
    });
  }
}

// Function to sync user to Airtable
async function syncUserToAirtable(userData: {
  email: string;
  full_name?: string;
  plan_type: string;
  started_at?: string;
  stripe_customer_id?: string;
}) {
  const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
  const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID');
  
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    logStep("Airtable not configured, skipping sync");
    return;
  }

  try {
    // Search for existing record
    const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?filterByFormula={Email (principal)}="${userData.email}"`;
    const searchResponse = await fetch(searchUrl, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
    });
    const searchData = await searchResponse.json();

    // Prepare fields
    const fields: Record<string, unknown> = {
      "Email (principal)": userData.email,
      "Nom": userData.full_name || '',
      "Abonnement actif": userData.plan_type === 'vip',
      "Type d\u2019abonnement": userData.plan_type === 'vip' ? 'Mensuel' : 'Gratuit',
      "ID Stripe / RevenueCat": userData.stripe_customer_id || '',
      "Dernière connexion": new Date().toISOString().split('T')[0],
    };

    if (userData.started_at && userData.plan_type === 'vip') {
      fields["date activation"] = new Date(userData.started_at).toISOString().split('T')[0];
    }

    if (searchData.records && searchData.records.length > 0) {
      // Update existing record
      const recordId = searchData.records[0].id;
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      });
      logStep("Airtable user updated", { email: userData.email });
    } else {
      // Create new record
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: [{ fields }] }),
      });
      logStep("Airtable user created", { email: userData.email });
    }
  } catch (error) {
    logStep("Airtable sync error", { error: error instanceof Error ? error.message : 'Unknown' });
  }
}

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const body = await req.text();
    
    // Verify webhook signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      logStep("WARNING: No webhook secret configured, skipping signature verification");
    }

    let event: Stripe.Event;
    
    if (webhookSecret) {
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        logStep("Signature verified");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        logStep("Signature verification failed", { error: errorMsg });
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      event = JSON.parse(body);
    }

    logStep("Event type", { type: event.type });

    // Initialize Supabase client with service role key for admin access
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Checkout completed", { sessionId: session.id });

      const customerEmail = session.customer_email || session.customer_details?.email;
      if (!customerEmail) {
        logStep("ERROR: No customer email found");
        return new Response(JSON.stringify({ error: "No customer email" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      logStep("Customer email", { email: customerEmail });

      // Find user by email
      const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("id, full_name")
        .eq("email", customerEmail)
        .single();

      if (profileError || !profile) {
        logStep("ERROR: User not found", { email: customerEmail, error: profileError });
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      logStep("User found", { userId: profile.id });

      // Calculate expiry date (30 days subscription, no trial)
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 30 days subscription
      const startedAt = new Date().toISOString();

      // Update subscription to VIP
      const { error: updateError } = await supabaseClient
        .from("subscriptions")
        .update({
          plan_type: "vip",
          status: "active",
          is_trial: false,
          trial_used: true,
          expires_at: expiresAt.toISOString(),
          started_at: startedAt,
          stripe_customer_id: session.customer as string,
          payment_provider: "stripe",
        })
        .eq("user_id", profile.id);

      if (updateError) {
        logStep("ERROR: Failed to update subscription", { error: updateError });
        return new Response(JSON.stringify({ error: "Failed to update subscription" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      logStep("Subscription updated successfully", { userId: profile.id, expiresAt });

      // Track conversion with Tradedoubler (server-side)
      const orderValue = session.amount_total ? session.amount_total / 100 : 0;
      
      // Get voucher code if any discount was applied
      let voucher = "";
      if (session.total_details?.breakdown?.discounts && session.total_details.breakdown.discounts.length > 0) {
        const discount = session.total_details.breakdown.discounts[0];
        if (discount.discount?.coupon?.name) {
          voucher = discount.discount.coupon.name;
        }
      }

      await trackTradedoublerConversion({
        transactionId: session.id,
        orderValue: orderValue,
        voucher: voucher || undefined,
        currency: session.currency?.toUpperCase() || 'EUR',
      });

      // Sync to Airtable
      await syncUserToAirtable({
        email: customerEmail,
        full_name: profile.full_name || '',
        plan_type: "vip",
        started_at: startedAt,
        stripe_customer_id: session.customer as string,
      });

      // Update referral payment status if this user was referred
      const { data: referral } = await supabaseClient
        .from("affiliate_referrals")
        .select("id")
        .eq("referred_user_id", profile.id)
        .eq("payment_status", "en attente")
        .single();

      if (referral) {
        await supabaseClient
          .from("affiliate_referrals")
          .update({
            payment_status: "payé",
            payment_month: new Date().toISOString().slice(0, 7) // YYYY-MM
          })
          .eq("id", referral.id);
        
        logStep("Referral payment status updated", { referralId: referral.id });
      }
    }

    // Handle subscription events
    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      logStep("Subscription event", { subscriptionId: subscription.id, status: subscription.status });

      const customer = await stripe.customers.retrieve(subscription.customer as string);
      if (customer.deleted) {
        logStep("Customer was deleted");
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const customerEmail = customer.email;
      if (!customerEmail) {
        logStep("No customer email found");
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("id, full_name")
        .eq("email", customerEmail)
        .single();

      if (!profile) {
        logStep("User not found for email", { email: customerEmail });
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Update based on subscription status
      if (subscription.status === "active") {
        const expiresAt = new Date(subscription.current_period_end * 1000);
        await supabaseClient
          .from("subscriptions")
          .update({
            plan_type: "vip",
            status: "active",
            expires_at: expiresAt.toISOString(),
            stripe_customer_id: subscription.customer as string,
            payment_provider: "stripe",
          })
          .eq("user_id", profile.id);
        
        logStep("Subscription activated", { userId: profile.id });

        // Sync to Airtable
        await syncUserToAirtable({
          email: customerEmail,
          full_name: profile.full_name || '',
          plan_type: "vip",
          stripe_customer_id: subscription.customer as string,
        });

        // Update referral payment status if this user was referred
        const { data: referral } = await supabaseClient
          .from("affiliate_referrals")
          .select("id")
          .eq("referred_user_id", profile.id)
          .eq("payment_status", "en attente")
          .single();

        if (referral) {
          await supabaseClient
            .from("affiliate_referrals")
            .update({
              payment_status: "payé",
              payment_month: new Date().toISOString().slice(0, 7) // YYYY-MM
            })
            .eq("id", referral.id);
          
          logStep("Referral payment status updated", { referralId: referral.id });
        }
      } else if (subscription.status === "canceled" || subscription.status === "unpaid" || subscription.status === "past_due") {
        await supabaseClient
          .from("subscriptions")
          .update({
            plan_type: "free",
            status: "expired",
            is_trial: false,
            expires_at: new Date().toISOString(),
          })
          .eq("user_id", profile.id);
        
        logStep("Subscription cancelled/unpaid", { userId: profile.id, status: subscription.status });

        // Sync to Airtable
        await syncUserToAirtable({
          email: customerEmail,
          full_name: profile.full_name || '',
          plan_type: "free",
        });
      }
    }

    // Handle invoice payment failed - suspend access immediately
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      logStep("Invoice payment failed", { invoiceId: invoice.id });

      const customer = await stripe.customers.retrieve(invoice.customer as string);
      if (customer.deleted) {
        logStep("Customer was deleted");
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const customerEmail = customer.email;
      if (!customerEmail) {
        logStep("No customer email found");
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("id, full_name")
        .eq("email", customerEmail)
        .single();

      if (!profile) {
        logStep("User not found for email", { email: customerEmail });
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Immediately suspend VIP access when payment fails
      await supabaseClient
        .from("subscriptions")
        .update({
          plan_type: "free",
          status: "unpaid",
          is_trial: false,
          expires_at: new Date().toISOString(),
        })
        .eq("user_id", profile.id);
      
      logStep("VIP access suspended due to payment failure", { userId: profile.id });

      // Sync to Airtable
      await syncUserToAirtable({
        email: customerEmail,
        full_name: profile.full_name || '',
        plan_type: "free",
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
