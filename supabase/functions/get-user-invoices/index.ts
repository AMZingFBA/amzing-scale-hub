import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Anon client for auth only
  const anonClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  // Service role client for DB queries (bypasses RLS)
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await anonClient.auth.getUser(token);
    if (!user) throw new Error("Non authentifié");

    // Get user's subscription to find stripe_customer_id
    const { data: subscription, error: subError } = await adminClient
      .from("subscriptions")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("user_id", user.id)
      .maybeSingle();

    console.log("User:", user.email, "Subscription:", JSON.stringify(subscription), "Error:", subError);

    if (!subscription?.stripe_customer_id) {
      return new Response(JSON.stringify({ invoices: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get user profile for invoice details
    const { data: profile } = await adminClient
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", user.id)
      .single();

    // Get Stripe customer billing details
    const stripeCustomer = await stripe.customers.retrieve(subscription.stripe_customer_id);
    const billingAddress = (stripeCustomer as any).address;
    const billingName = (stripeCustomer as any).name;
    
    console.log("Stripe customer billing:", JSON.stringify({ name: billingName, address: billingAddress }));

    // Fetch all successful charges for this customer
    const charges = await stripe.charges.list({
      customer: subscription.stripe_customer_id,
      limit: 100,
    });

    console.log("Charges found:", charges.data.length, "for customer:", subscription.stripe_customer_id);

    // Also fetch invoices from Stripe if they exist (for subscription payments)
    let stripeInvoices: any[] = [];
    try {
      const invoicesResult = await stripe.invoices.list({
        customer: subscription.stripe_customer_id,
        limit: 100,
        status: 'paid',
      });
      stripeInvoices = invoicesResult.data;
      console.log("Stripe invoices found:", stripeInvoices.length);
    } catch (e) {
      console.log("No Stripe invoices found:", e);
    }

    // Build invoice data from charges
    const invoices = charges.data
      .filter(c => c.status === 'succeeded' && c.paid)
      .map((charge, index, arr) => {
        // Find matching Stripe invoice for more details
        const matchingInvoice = stripeInvoices.find(inv => inv.charge === charge.id);
        
        const amountTTC = charge.amount / 100;
        
        // Check for discount/coupon from the Stripe invoice
        let discount = 0;
        let discountDescription = '';
        if (matchingInvoice?.discount) {
          const coupon = matchingInvoice.discount.coupon;
          if (coupon.percent_off) {
            discount = amountTTC * (coupon.percent_off / 100);
            discountDescription = `Réduction ${coupon.percent_off}%`;
          } else if (coupon.amount_off) {
            discount = coupon.amount_off / 100;
            discountDescription = `Réduction ${discount.toFixed(2)} €`;
          }
        }

        const paymentDate = new Date(charge.created * 1000);
        const year = paymentDate.getFullYear();
        const invoiceNumber = arr.length - index;

        let description = charge.description || 'AMZing FBA - Abonnement VIP';
        if (matchingInvoice?.lines?.data?.[0]?.description) {
          description = matchingInvoice.lines.data[0].description;
        }

        return {
          id: charge.id,
          invoiceNumber: `F-${year}-${String(invoiceNumber).padStart(3, '0')}`,
          date: paymentDate.toISOString(),
          amountTTC,
          amountHT: amountTTC,
          tva: 0,
          description,
          discount,
          discountDescription,
          customerName: billingName || profile?.full_name || user.email,
          customerEmail: profile?.email || user.email,
          customerAddress: billingAddress ? [
            billingAddress.line1,
            billingAddress.line2,
            [billingAddress.postal_code, billingAddress.city].filter(Boolean).join(' '),
            billingAddress.country,
          ].filter(Boolean).join(', ') : '',
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log("Invoices generated:", invoices.length);

    return new Response(JSON.stringify({ invoices }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
