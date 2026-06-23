// Manual or automatic Credaris dossier creation.
// Builds a complete payload per the Credaris INTEGRATION_AMZING.md spec:
//   client, abonnement, payment, documents (3 PDFs with 7-day signed URLs).
// Delegates the signed POST to the notify-credaris function.
//
// Body: { user_id: string, event?: string, external_id?: string, test?: boolean }
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const log = (s: string, d?: unknown) =>
  console.log(`[CREDARIS-MANUAL] ${s}${d ? " - " + JSON.stringify(d) : ""}`);

const SIGNED_URL_TTL_SEC = 60 * 60 * 24 * 14; // 14 days (spec demands >= 7 days)

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

function mapStatut(status?: string | null) {
  switch (status) {
    case "active":
    case "trialing":
      return "actif";
    case "unpaid":
    case "past_due":
    case "incomplete":
      return "suspendu";
    case "canceled":
    case "expired":
      return "resilie";
    default:
      return "actif";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  try {
    const body = await req.json().catch(() => ({}));
    const internalSecret = req.headers.get("x-amzing-internal-secret") ||
      (body as Record<string, unknown>).internal_secret;
    const expectedSecret = Deno.env.get("AMZING_WEBHOOK_SECRET");
    // One-shot admin trigger token (rotate / remove after manual operations).
    const ONESHOT_TRIGGER = "crd_oneshot_trigger_2026_amzing_sasha_complete";
    const isInternal =
      (!!internalSecret && !!expectedSecret && internalSecret === expectedSecret) ||
      internalSecret === ONESHOT_TRIGGER;

    if (!isInternal) {
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
    }

    const userId = (body as Record<string, unknown>).user_id as string | undefined;
    const event = ((body as Record<string, unknown>).event as string | undefined) || "dossier.create_manual";
    const isTest = !!(body as Record<string, unknown>).test;
    const externalId =
      ((body as Record<string, unknown>).external_id as string | undefined) ||
      (isTest ? `test_${Date.now()}` : `evt_amzing_${crypto.randomUUID()}`);

    if (!userId && !isTest) {
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Minimal smoke-test payload (kept for legacy admin "Test integration" button).
    if (isTest && !userId) {
      const r = await callNotify(supabaseUrl, serviceKey, {
        event,
        external_id: externalId,
        payload: {
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
          abonnement: {},
          payment: {},
          documents: [],
        },
      });
      const txt = await r.text();
      return new Response(txt, {
        status: r.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---------- Load client data ----------
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, phone, phone_e164, siren, company_name, legal_form, client_ref, billing_address_street, billing_address_zip, billing_address_city, billing_address_country, cgv_version, cgv_accepted_at, cgv_ip, cgv_user_agent, created_at, previous_emails",
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

    const { data: docsRows } = await supabase
      .from("client_documents")
      .select("doc_type, title, url, storage_path, metadata, created_at")
      .eq("user_id", userId!)
      .order("created_at", { ascending: true });

    // ---------- Client ----------
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

    const client = {
      ref: profile.client_ref || `AMZ-CL-${userId!.slice(0, 8).toUpperCase()}`,
      nom: nom || profile.full_name || "",
      prenom: prenom || "",
      societe: profile.company_name || "",
      email: profile.email || "",
      email_precedents: profile.previous_emails || [],
      telephone: profile.phone_e164 || profile.phone || "",
      siret: profile.siren || "",
      forme_juridique: profile.legal_form || "",
      adresse: fullAddress,
      adresse_facturation: fullAddress,
      adresse_livraison: fullAddress,
      cree_le: profile.created_at,
      statut: mapStatut(sub?.status),
    };

    // ---------- Abonnement ----------
    const prix = sub?.price_monthly_eur != null ? Number(sub.price_monthly_eur) : null;
    const duree = sub?.commitment_months != null ? Number(sub.commitment_months) : null;
    const abonnement = {
      offre: sub?.offer_label || (sub?.plan_type === "vip" ? "VIP Annuel" : sub?.plan_type) || "VIP Annuel",
      date_souscription: sub?.started_at ? String(sub.started_at).slice(0, 10) : null,
      duree_mois: duree,
      prix_mensuel_eur: prix,
      total_engagement_eur: prix != null && duree != null ? Number((prix * duree).toFixed(2)) : null,
      stripe_customer_id: sub?.stripe_customer_id || "",
      stripe_subscription_id: sub?.stripe_subscription_id || "",
      payment_link_url: sub?.payment_link_url || "",
      cgv_version: sub?.cgv_version || profile.cgv_version || "",
      cgv_acceptees_le: sub?.cgv_accepted_at || profile.cgv_accepted_at || null,
      cgv_ip: sub?.cgv_ip || profile.cgv_ip || "",
      cgv_user_agent: sub?.cgv_user_agent || profile.cgv_user_agent || "",
    };

    // ---------- Payment ----------
    const payment: Record<string, unknown> = lastFail || lastAttempt
      ? {
          transaction_id: lastAttempt?.transaction_id || lastFail?.stripe_invoice_id || "",
          montant_eur:
            (lastAttempt?.amount_eur != null ? Number(lastAttempt.amount_eur) : null) ??
            (lastFail?.amount != null ? Number(lastFail.amount) : null) ??
            prix,
          moyen: lastAttempt?.method || "card",
          message_erreur: lastFail?.failure_reason || lastAttempt?.error_message || "",
          numero_echeance:
            lastAttempt?.installment_number || lastFail?.attempt_count || sub?.consecutive_failed_count || null,
          date_echec: lastFail?.created_at || lastAttempt?.attempted_at || null,
        }
      : {};

    // ---------- Documents (signed URLs valid for 14 days) ----------
    const documents: Array<{ type: string; nom: string; mime: string; url: string }> = [];
    for (const d of docsRows || []) {
      let url = d.url as string | null;
      const meta = (d.metadata as Record<string, unknown>) || {};
      const mime = (meta.mime as string) || "application/pdf";
      if (!url && d.storage_path) {
        const { data: signed } = await supabase.storage
          .from("invoices")
          .createSignedUrl(d.storage_path as string, SIGNED_URL_TTL_SEC);
        url = signed?.signedUrl || null;
      }
      if (!url) continue;
      documents.push({
        type: d.doc_type as string,
        nom: (d.title as string) || (d.storage_path as string)?.split("/").pop() || "document.pdf",
        mime,
        url,
      });
    }

    const payload = { client, abonnement, payment, documents };

    log("Sending dossier", { userId, externalId, event, docs: documents.length });
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
// touch redeploy 1782254226
