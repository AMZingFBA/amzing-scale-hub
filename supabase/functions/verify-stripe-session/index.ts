import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-STRIPE-SESSION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    // Get session_id from request body or query params
    let sessionId: string | null = null;
    
    if (req.method === "POST") {
      const body = await req.json();
      sessionId = body.session_id;
    } else {
      const url = new URL(req.url);
      sessionId = url.searchParams.get("session_id");
    }

    if (!sessionId) {
      logStep("Missing session_id");
      return new Response(JSON.stringify({ 
        paid: false, 
        error: "Missing session_id parameter" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Session ID received", { sessionId: sessionId.substring(0, 20) + "..." });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer']
    });

    logStep("Session retrieved", { 
      paymentStatus: session.payment_status,
      status: session.status,
      amountTotal: session.amount_total
    });

    // Check if payment was successful
    const isPaid = session.payment_status === "paid" && session.status === "complete";

    if (!isPaid) {
      logStep("Payment not confirmed", { paymentStatus: session.payment_status });
      return new Response(JSON.stringify({ 
        paid: false,
        payment_status: session.payment_status,
        session_status: session.status
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Calculate amount in euros (Stripe returns cents)
    const amountInEuros = session.amount_total ? session.amount_total / 100 : 0;
    
    // Get voucher/discount code if any
    let voucher = "";
    if (session.total_details?.breakdown?.discounts && session.total_details.breakdown.discounts.length > 0) {
      const discount = session.total_details.breakdown.discounts[0];
      if (discount.discount?.coupon?.name) {
        voucher = discount.discount.coupon.name;
      }
    }

    const response = {
      paid: true,
      amount: amountInEuros,
      currency: session.currency?.toUpperCase() || "EUR",
      voucher: voucher,
      customer_email: session.customer_email || (session.customer as any)?.email || null,
      session_id: sessionId
    };

    logStep("Payment verified successfully", { 
      amount: amountInEuros, 
      currency: response.currency,
      voucher: voucher || "(none)"
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      paid: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
