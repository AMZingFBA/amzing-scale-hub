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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");

    // Check admin role
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) throw new Error("Not authorized - admin only");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get all subscriptions with profiles
    const { data: subscriptions, error: subsError } = await supabaseAdmin
      .from("subscriptions")
      .select("*");
    if (subsError) throw subsError;

    const { data: profiles, error: profError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, phone, created_at");
    if (profError) throw profError;

    const profileMap = new Map(profiles.map((p: any) => [p.id, p]));

    // Process each VIP/active subscription
    const members: any[] = [];

    for (const sub of subscriptions) {
      const profile = profileMap.get(sub.user_id);
      if (!profile) continue;

      // Only include members who are or were VIP
      if (sub.plan_type === "free" && !sub.stripe_customer_id && sub.payment_provider === "free") {
        continue;
      }

      let stripePayments: any[] = [];
      let stripeSubscription: any = null;
      let upcomingInvoice: any = null;
      let totalPaid = 0;
      let paymentCount = 0;

      if (sub.stripe_customer_id) {
        try {
          // Get payment history from Stripe
          const invoices = await stripe.invoices.list({
            customer: sub.stripe_customer_id,
            limit: 100,
            status: "paid",
          });

          stripePayments = invoices.data.map((inv: any) => ({
            id: inv.id,
            amount: inv.amount_paid / 100,
            date: new Date(inv.created * 1000).toISOString(),
            status: inv.status,
            period_start: inv.period_start ? new Date(inv.period_start * 1000).toISOString() : null,
            period_end: inv.period_end ? new Date(inv.period_end * 1000).toISOString() : null,
          })).filter((p: any) => !isNaN(new Date(p.date).getTime()));

          totalPaid = stripePayments.reduce((sum: number, p: any) => sum + p.amount, 0);
          paymentCount = stripePayments.length;

          // Get active Stripe subscription
          const stripeSubs = await stripe.subscriptions.list({
            customer: sub.stripe_customer_id,
            limit: 1,
          });

          if (stripeSubs.data.length > 0) {
            const ss = stripeSubs.data[0];
            stripeSubscription = {
              id: ss.id,
              status: ss.status,
              current_period_start: new Date(ss.current_period_start * 1000).toISOString(),
              current_period_end: new Date(ss.current_period_end * 1000).toISOString(),
              cancel_at_period_end: ss.cancel_at_period_end,
              created: new Date(ss.created * 1000).toISOString(),
            };

            // Try to get upcoming invoice
            if (ss.status === "active") {
              try {
                const upcoming = await stripe.invoices.retrieveUpcoming({
                  customer: sub.stripe_customer_id,
                });
                upcomingInvoice = {
                  amount: upcoming.amount_due / 100,
                  date: upcoming.next_payment_attempt
                    ? new Date(upcoming.next_payment_attempt * 1000).toISOString()
                    : new Date(upcoming.period_end * 1000).toISOString(),
                };
              } catch (_e) {
                // No upcoming invoice
              }
            }
          }
        } catch (stripeErr) {
          console.error(`Stripe error for ${profile.email}:`, stripeErr);
        }
      }

      // Also check successful payment intents if no invoices found
      if (paymentCount === 0 && sub.stripe_customer_id) {
        try {
          const paymentIntents = await stripe.paymentIntents.list({
            customer: sub.stripe_customer_id,
            limit: 100,
          });

          const successfulPayments = paymentIntents.data.filter(
            (pi: any) => pi.status === "succeeded"
          );

          if (successfulPayments.length > 0) {
            stripePayments = successfulPayments.map((pi: any) => ({
              id: pi.id,
              amount: pi.amount / 100,
              date: new Date(pi.created * 1000).toISOString(),
              status: "paid",
              period_start: null,
              period_end: null,
            }));
            totalPaid = stripePayments.reduce((sum: number, p: any) => sum + p.amount, 0);
            paymentCount = stripePayments.length;
          }
        } catch (_e) {
          // Ignore
        }
      }

      members.push({
        user_id: sub.user_id,
        email: profile.email,
        full_name: profile.full_name,
        phone: profile.phone,
        registered_at: profile.created_at,
        subscription: {
          status: sub.status,
          plan_type: sub.plan_type,
          payment_provider: sub.payment_provider,
          stripe_customer_id: sub.stripe_customer_id,
          stripe_subscription_id: sub.stripe_subscription_id,
          started_at: sub.started_at,
          expires_at: sub.expires_at,
          is_trial: sub.is_trial,
        },
        stripe: {
          payments: stripePayments,
          total_paid: totalPaid,
          payment_count: paymentCount,
          active_subscription: stripeSubscription,
          upcoming_invoice: upcomingInvoice,
        },
      });
    }

    // Sort by most recent first
    members.sort((a: any, b: any) => {
      const dateA = a.stripe.payments[0]?.date || a.registered_at;
      const dateB = b.stripe.payments[0]?.date || b.registered_at;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    // Calculate summary
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    let revenueThisMonth = 0;
    let activeVipCount = 0;
    const monthlyForecast: Record<string, { amount: number; members: string[] }> = {};

    for (const member of members) {
      // Count active VIP
      if (member.subscription.plan_type === "vip" && member.subscription.status === "active") {
        activeVipCount++;
      }

      // Revenue this month
      for (const payment of member.stripe.payments) {
        const paymentMonth = payment.date.substring(0, 7);
        if (paymentMonth === currentMonth) {
          revenueThisMonth += payment.amount;
        }
      }

      // Build forecast for next 12 months
      if (member.stripe.upcoming_invoice) {
        const nextDate = new Date(member.stripe.upcoming_invoice.date);
        const monthlyAmount = member.stripe.upcoming_invoice.amount;

        for (let i = 0; i < 12; i++) {
          const forecastDate = new Date(nextDate);
          forecastDate.setMonth(forecastDate.getMonth() + i);
          const monthKey = `${forecastDate.getFullYear()}-${String(forecastDate.getMonth() + 1).padStart(2, "0")}`;

          if (!monthlyForecast[monthKey]) {
            monthlyForecast[monthKey] = { amount: 0, members: [] };
          }
          monthlyForecast[monthKey].amount += monthlyAmount;
          monthlyForecast[monthKey].members.push(member.email);
        }
      }
    }

    return new Response(
      JSON.stringify({
        members,
        summary: {
          total_members: members.length,
          active_vip: activeVipCount,
          revenue_this_month: revenueThisMonth,
          total_revenue: members.reduce((sum: number, m: any) => sum + m.stripe.total_paid, 0),
          monthly_forecast: monthlyForecast,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[ADMIN-SUBS] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
