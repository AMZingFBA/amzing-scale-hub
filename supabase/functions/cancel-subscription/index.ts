import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CANCEL-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { code } = await req.json();
    
    // Vérifier le code de vérification
    logStep("Searching for verification code", { userId: user.id, code, type: 'cancel_subscription' });
    
    // First, get all codes for this user to debug
    const { data: allCodes } = await supabaseClient
      .from('verification_codes')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'cancel_subscription')
      .order('created_at', { ascending: false })
      .limit(5);
    
    logStep("All cancel_subscription codes for user", { codes: allCodes?.map(c => ({ code: c.code, used: c.used, expires_at: c.expires_at })) });
    
    const { data: verificationData, error: verificationError } = await supabaseClient
      .from('verification_codes')
      .select('*')
      .eq('user_id', user.id)
      .eq('code', code)
      .eq('type', 'cancel_subscription')
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .maybeSingle();
    
    logStep("Verification query result", { found: !!verificationData, error: verificationError?.message });

    if (verificationError || !verificationData) {
      logStep("Invalid verification code", { error: verificationError });
      return new Response(
        JSON.stringify({ error: "Code invalide ou expiré" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Marquer le code comme utilisé (on ne le supprime pas encore en cas d'erreur)
    await supabaseClient
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verificationData.id);

    // Récupérer l'abonnement actuel
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!subscription || subscription.plan_type !== 'vip') {
      logStep("No active VIP subscription found");
      return new Response(
        JSON.stringify({ error: "Aucun abonnement VIP actif" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    logStep("Subscription details", { 
      provider: subscription.payment_provider,
      stripeCustomerId: subscription.stripe_customer_id,
      stripeSubscriptionId: subscription.stripe_subscription_id,
      appleTransactionId: subscription.apple_transaction_id
    });

    // Annuler sur Stripe si applicable
    if (subscription.payment_provider === 'stripe') {
      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (!stripeKey) {
        logStep("WARNING: Stripe key not configured");
      } else {
        logStep("Attempting Stripe cancellation");
        const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
        
        try {
          // Utiliser les IDs stockés en priorité
          if (subscription.stripe_subscription_id) {
            logStep("Canceling using stored subscription ID", { subscriptionId: subscription.stripe_subscription_id });
            await stripe.subscriptions.update(subscription.stripe_subscription_id, {
              cancel_at_period_end: true
            });
            logStep("Stripe subscription canceled at period end via stored ID");
          } else {
            // Fallback: chercher par email
            const customers = await stripe.customers.list({ email: user.email, limit: 1 });
            
            if (customers.data.length > 0) {
              const customerId = customers.data[0].id;
              logStep("Found Stripe customer via email", { customerId });
              
              const subscriptions = await stripe.subscriptions.list({
                customer: customerId,
                status: "active",
                limit: 1,
              });
              
              if (subscriptions.data.length > 0) {
                const stripeSubscription = subscriptions.data[0];
                logStep("Canceling Stripe subscription", { subscriptionId: stripeSubscription.id });
                
                await stripe.subscriptions.update(stripeSubscription.id, {
                  cancel_at_period_end: true
                });
                
                logStep("Stripe subscription canceled at period end via email lookup");
              } else {
                logStep("WARNING: No active Stripe subscription found for customer");
              }
            } else {
              logStep("WARNING: No Stripe customer found with email", { email: user.email });
            }
          }
        } catch (stripeError) {
          const errorMessage = stripeError instanceof Error ? stripeError.message : String(stripeError);
          logStep("ERROR during Stripe cancellation", { error: errorMessage });
          throw new Error(`Échec de l'annulation Stripe: ${errorMessage}`);
        }
      }
    } 
    // Annuler sur Apple si applicable
    else if (subscription.payment_provider === 'apple') {
      logStep("Apple subscription detected - cancellation must be done by user in iOS settings");
      // Note: Apple ne permet pas l'annulation programmatique côté serveur
      // L'utilisateur doit annuler via les paramètres iOS
      // On marque juste le statut comme canceled dans notre BDD
    } else {
      logStep("Free or unknown subscription provider", { provider: subscription.payment_provider });
    }

    // Mettre à jour le statut dans la base de données
    // Le statut reste 'active' mais on marque que c'est annulé
    const { error: updateError } = await supabaseClient
      .from('subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      logStep("Error updating subscription", { error: updateError });
      throw updateError;
    }

    logStep("Subscription successfully canceled");

    // Supprimer le code de vérification maintenant que tout a réussi
    await supabaseClient
      .from('verification_codes')
      .delete()
      .eq('id', verificationData.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Votre abonnement a été résilié. Vous garderez l'accès VIP jusqu'au " + 
                 new Date(subscription.expires_at).toLocaleDateString('fr-FR')
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
