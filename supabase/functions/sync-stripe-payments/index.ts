import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[SYNC-STRIPE] Starting payment synchronization");
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get all profiles with their subscriptions
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name");

    if (profilesError) throw profilesError;
    
    // Get all subscriptions separately
    const { data: userSubscriptions, error: subsError } = await supabaseAdmin
      .from("subscriptions")
      .select("*");
      
    if (subsError) throw subsError;

    console.log(`[SYNC-STRIPE] Found ${profiles.length} profiles to check`);

    const results = {
      checked: 0,
      updated: 0,
      failed_payments: [] as any[],
      errors: [] as any[]
    };

    for (const profile of profiles) {
      try {
        results.checked++;
        console.log(`[SYNC-STRIPE] Checking profile: ${profile.email} (id: ${profile.id})`);
        
        // Find subscription for this profile
        const userSubscription = userSubscriptions?.find((s: any) => s.user_id === profile.id);
        
        if (!userSubscription) {
          console.log(`[SYNC-STRIPE] No subscription found for ${profile.email}, skipping`);
          continue;
        }
        
        console.log(`[SYNC-STRIPE] Current subscription for ${profile.email}:`, {
          status: userSubscription.status,
          plan_type: userSubscription.plan_type,
          stripe_customer_id: userSubscription.stripe_customer_id
        });
        
        // Search for customer in Stripe by email
        const customers = await stripe.customers.list({
          email: profile.email,
          limit: 1
        });

        if (customers.data.length === 0) {
          console.log(`[SYNC-STRIPE] No Stripe customer for ${profile.email}`);
          continue;
        }

        const customer = customers.data[0];

        // Get recent payment intents for this customer
        const paymentIntents = await stripe.paymentIntents.list({
          customer: customer.id,
          limit: 10
        });

        // Check for failed payments
        const failedPayments = paymentIntents.data.filter(
          (pi: Stripe.PaymentIntent) => pi.status === "requires_payment_method" || 
                pi.status === "canceled" ||
                (pi.last_payment_error !== null)
        );

        if (failedPayments.length > 0) {
          console.log(`[SYNC-STRIPE] Found ${failedPayments.length} failed payments for ${profile.email}`);
          results.failed_payments.push({
            email: profile.email,
            customer_id: customer.id,
            failed_count: failedPayments.length,
            last_failed: failedPayments[0]
          });
        }

        // Get active subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          limit: 10
        });

        const activeSubscription = subscriptions.data.find(
          (sub: Stripe.Subscription) => sub.status === "active"
        );

        const hasUnpaidSubscription = subscriptions.data.some(
          (sub: Stripe.Subscription) => sub.status === "unpaid" || sub.status === "past_due"
        );

        // Determine correct status
        let newStatus = userSubscription.status || "active";
        let newPlanType = userSubscription.plan_type || "free";

        console.log(`[SYNC-STRIPE] Stripe data for ${profile.email}:`, {
          activeSubscription: !!activeSubscription,
          hasUnpaidSubscription,
          failedPaymentsCount: failedPayments.length,
          totalSubscriptions: subscriptions.data.length
        });

        if (activeSubscription) {
          newStatus = "active";
          newPlanType = "vip";
          console.log(`[SYNC-STRIPE] ${profile.email}: Active subscription found`);
        } else if (hasUnpaidSubscription || failedPayments.length > 0) {
          newStatus = "unpaid";
          newPlanType = "free";
          console.log(`[SYNC-STRIPE] ${profile.email}: Unpaid/failed payment detected`);
        } else if (subscriptions.data.length > 0) {
          const lastSub = subscriptions.data[0];
          if (lastSub.status === "canceled" || lastSub.status === "incomplete_expired") {
            newStatus = lastSub.status === "canceled" ? "canceled" : "expired";
            newPlanType = "free";
            console.log(`[SYNC-STRIPE] ${profile.email}: Subscription ${newStatus}`);
          }
        }

        console.log(`[SYNC-STRIPE] Determined status for ${profile.email}:`, {
          newStatus,
          newPlanType
        });

        // Update subscription in database if needed
        const needsUpdate = 
          userSubscription.stripe_customer_id !== customer.id ||
          userSubscription.status !== newStatus ||
          userSubscription.plan_type !== newPlanType;

        console.log(`[SYNC-STRIPE] Update check for ${profile.email}:`, {
          needsUpdate,
          currentCustomerId: userSubscription.stripe_customer_id,
          newCustomerId: customer.id,
          currentStatus: userSubscription.status,
          newStatus,
          currentPlanType: userSubscription.plan_type,
          newPlanType
        });

        if (needsUpdate) {
          const updateData: any = {
            stripe_customer_id: customer.id,
            status: newStatus,
            plan_type: newPlanType,
            payment_provider: "stripe",
            updated_at: new Date().toISOString()
          };

          // Update expires_at for unpaid/canceled
          if (newStatus === "unpaid" || newStatus === "canceled" || newStatus === "expired") {
            if (subscriptions.data.length > 0) {
              const lastSub = subscriptions.data[0];
              if (lastSub.current_period_end) {
                updateData.expires_at = new Date(lastSub.current_period_end * 1000).toISOString();
              }
            }
          }

          if (activeSubscription && activeSubscription.current_period_end) {
            updateData.stripe_subscription_id = activeSubscription.id;
            updateData.expires_at = new Date(activeSubscription.current_period_end * 1000).toISOString();
          }

            const { error: updateError } = await supabaseAdmin
              .from("subscriptions")
              .update(updateData)
              .eq("user_id", profile.id);

            if (updateError) {
              console.error(`[SYNC-STRIPE] Error updating ${profile.email}:`, updateError);
              results.errors.push({ email: profile.email, error: updateError.message });
            } else {
              console.log(`[SYNC-STRIPE] Updated ${profile.email}: ${newStatus}, ${newPlanType}`);
              results.updated++;
              
              // Send email if payment failed and status changed to unpaid
              if (newStatus === "unpaid" && userSubscription.status !== "unpaid") {
                console.log(`[SYNC-STRIPE] Sending payment failed email to ${profile.email}`);
                try {
                  const emailResponse = await fetch(
                    `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-payment-failed-email`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`
                      },
                      body: JSON.stringify({
                        email: profile.email,
                        full_name: profile.full_name || "utilisateur",
                        expires_at: updateData.expires_at || new Date().toISOString()
                      })
                    }
                  );
                  
                  if (!emailResponse.ok) {
                    const errorData = await emailResponse.json();
                    console.error(`[SYNC-STRIPE] Failed to send email to ${profile.email}:`, errorData);
                  } else {
                    const successData = await emailResponse.json();
                    console.log(`[SYNC-STRIPE] Email sent successfully to ${profile.email}:`, successData);
                  }
                } catch (emailError) {
                  console.error(`[SYNC-STRIPE] Error sending email to ${profile.email}:`, emailError);
                }
              }
            }
          }
      } catch (error) {
        console.error(`[SYNC-STRIPE] Error processing ${profile.email}:`, error);
        results.errors.push({ 
          email: profile.email, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    console.log("[SYNC-STRIPE] Synchronization complete:", results);

    return new Response(JSON.stringify({
      success: true,
      summary: {
        profiles_checked: results.checked,
        subscriptions_updated: results.updated,
        failed_payments_found: results.failed_payments.length
      },
      failed_payments: results.failed_payments,
      errors: results.errors
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[SYNC-STRIPE] Fatal error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : String(error)
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
