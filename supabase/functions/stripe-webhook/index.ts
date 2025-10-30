import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

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
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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
        .select("id")
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

      // Calculate expiry date (7 days trial + 30 days subscription)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 37); // 7 days trial + 30 days

      // Update subscription to VIP
      const { error: updateError } = await supabaseClient
        .from("subscriptions")
        .update({
          plan_type: "vip",
          status: "active",
          is_trial: true,
          expires_at: expiresAt.toISOString(),
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
        .select("id")
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
          })
          .eq("user_id", profile.id);
        
        logStep("Subscription activated", { userId: profile.id });
      } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
        await supabaseClient
          .from("subscriptions")
          .update({
            plan_type: "free",
            status: "expired",
            is_trial: false,
          })
          .eq("user_id", profile.id);
        
        logStep("Subscription cancelled", { userId: profile.id });
      }
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
