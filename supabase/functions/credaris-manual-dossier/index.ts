// Manual or automatic Credaris dossier creation.
// - Builds the full payload from profile/subscription/failed_payments/payment_attempts
// - Delegates the signed POST to the notify-credaris function
// Body: { user_id: string, event?: string, external_id?: string, test?: boolean }
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const log = (s: string, d?: unknown) =>
  console.log(`[CREDARIS-MANUAL] ${s}${d ? " - " + JSON.stringify(d) : ""}`);

async function callNotify(supabaseUrl: string, serviceKey: string, body: unknown) {
  return await fetch(`${supabaseUrl}/functions/v1/notify-credaris`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
    },
    body: JSON.stringify(body),
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  try {
    // Admin-only auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: u, error: uErr } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (uErr || !u.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const userId = body.user_id as string | undefined;
    const event = (body.event as string | undefined) || "dossier.create_manual";
    const isTest = !!body.test;
    const externalId =
      (body.external_id as string | undefined) ||
      (isTest ? `test_${Date.now()}` : `evt_amzing_${crypto.randomUUID()}`);

    if (!userId && !isTest) {
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Test mode: send a minimal dossier with a fake client to validate the integration
    if (isTest && !userId) {
      const testPayload = {
        client: {
          ref: "AMZ-CL-TEST01",
          nom: "TEST",
          prenom: "Credaris",
          societe: "Amzing FBA Test",
          email: "test@amzingfba.com",
          telephone: "+33600000000",
          adresse: "",
          adresse_facturation: "",
          adresse_livraison: "",
          cree_le: new Date().toISOString(),
          statut: "actif",
        },
        abonnement: {
          offre: "Test Pack",
          date_souscription: new Date().toISOString().slice(0, 10),
          duree_mois: 12,
          prix_mensuel_eur: 0,
          total_engagement_eur: 0,
          stripe_customer_id: "cus_test",
          stripe_subscription_id: "sub_test",
          payment_link_url: "",
          cgv_version: "test",
          cgv_acceptees_le: new Date().toISOString(),
          cgv_ip: "127.0.0.1",
          cgv_user_agent: "test",
        },
        payment: {},
        documents: [],
      };
      const r = await callNotify(supabaseUrl, serviceKey, {
        event,
        external_id: externalId,
        payload: testPayload,
      });
      const txt = await r.text();
      return new Response(txt, {
        status: r.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build payload from DB
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, phone, phone_e164, siren, company_name, legal_form, client_ref, billing_address_street, billing_address_zip, billing_address_city, billing_address_country, cgv_version, cgv_accepted_at, cgv_ip, cgv_user_agent, created_at",
      )
      .eq("id", userId!)
      .maybeSingle();
    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId!)
      .maybeSingle();

    const { data: lastFail } = await supabase
      .from("failed_payments")
      .select("*")
      .eq("user_id", userId!)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: lastAttempt } = await supabase
      .from("payment_attempts")
      .select("*")
      .eq("user_id", userId!)
      .order("attempted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const [prenom, ...rest] = (profile.full_name || "").trim().split(/\s+/);
    const nom = rest.join(" ");
    const fullAddress = [
      profile.billing_address_street,
      profile.billing_address_zip,
      profile.billing_address_city,
      profile.billing_address_country,
    ]
      .filter(Boolean)
      .join(", ");

    const payload = {
      client: {
        ref: profile.client_ref || `AMZ-CL-${userId!.slice(0, 8).toUpperCase()}`,
        nom: nom || profile.full_name || "",
        prenom: prenom || "",
        societe: profile.company_name || "",
        email: profile.email || "",
        telephone: profile.phone_e164 || profile.phone || "",
        siret: profile.siren || "",
        forme_juridique: profile.legal_form || "",
        adresse: fullAddress,
        adresse_facturation: fullAddress,
        adresse_livraison: fullAddress,
        cree_le: profile.created_at,
        statut:
          sub?.status === "active"
            ? "actif"
            : sub?.status === "unpaid" || sub?.status === "past_due"
            ? "suspendu"
            : sub?.status === "canceled" || sub?.status === "expired"
            ? "resilie"
            : "actif",
      },
      abonnement: {
        offre: sub?.offer_label || sub?.plan_type || "VIP Annuel",
        date_souscription: sub?.started_at?.slice(0, 10) || null,
        duree_mois: sub?.commitment_months || 12,
        prix_mensuel_eur: sub?.price_monthly_eur || null,
        total_engagement_eur:
          sub?.price_monthly_eur && sub?.commitment_months
            ? Number(sub.price_monthly_eur) * Number(sub.commitment_months)
            : null,
        stripe_customer_id: sub?.stripe_customer_id || "",
        stripe_subscription_id: sub?.stripe_subscription_id || "",
        payment_link_url: sub?.payment_link_url || "",
        cgv_version: sub?.cgv_version || profile.cgv_version || "",
        cgv_acceptees_le: sub?.cgv_accepted_at || profile.cgv_accepted_at || null,
        cgv_ip: sub?.cgv_ip || profile.cgv_ip || "",
        cgv_user_agent: sub?.cgv_user_agent || profile.cgv_user_agent || "",
      },
      payment: lastFail || lastAttempt
        ? {
            transaction_id: lastAttempt?.transaction_id || lastFail?.stripe_invoice_id || "",
            montant_eur: lastFail?.amount || lastAttempt?.amount_eur || null,
            moyen: lastAttempt?.method || "card",
            message_erreur:
              lastFail?.failure_reason || lastAttempt?.error_message || "",
            numero_echeance:
              lastAttempt?.installment_number || sub?.consecutive_failed_count || null,
            date_echec:
              lastFail?.created_at || lastAttempt?.attempted_at || null,
          }
        : {},
      documents: [],
    };

    log("Sending dossier", { userId, externalId, event });
    const r = await callNotify(supabaseUrl, serviceKey, {
      event,
      external_id: externalId,
      user_id: userId,
      payload,
    });
    const txt = await r.text();
    return new Response(txt, {
      status: r.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log("ERROR", { msg });
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
