import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const NOTIFY_TO = "noazaghdoun55555@gmail.com";
const LEVELS = new Set(["Débutant", "Déjà vendeur Amazon", "E-commerçant hors Amazon", "Autre"]);
const OBJECTIVES = new Set(["Me former", "Être accompagné", "Trouver des produits", "Structurer mon activité", "Autre"]);
const BUDGETS = new Set(["Moins de 500 €", "500 à 1 500 €", "1 500 à 5 000 €", "Plus de 5 000 €"]);
const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      first_name, last_name, email, phone,
      level, objective, budget, message,
      source_page, source, consent,
    } = body ?? {};

    // Basic validation
    const errors: string[] = [];
    const str = (v: unknown, max = 500) =>
      typeof v === "string" && v.trim().length > 0 && v.length <= max;
    if (!str(first_name, 100)) errors.push("first_name");
    if (!str(last_name, 100)) errors.push("last_name");
    if (!str(email, 255) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email");
    if (!str(phone, 40)) errors.push("phone");
    if (!str(level, 80) || !LEVELS.has(level.trim())) errors.push("level");
    if (!str(objective, 80) || !OBJECTIVES.has(objective.trim())) errors.push("objective");
    if (!str(budget, 80) || !BUDGETS.has(budget.trim())) errors.push("budget");
    if (typeof message === "string" && message.length > 2000) errors.push("message");
    if (consent !== true) errors.push("consent");
    if (errors.length) {
      return new Response(JSON.stringify({ error: "Invalid fields", fields: errors }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: lead, error: insErr } = await supabase
      .from("leads")
      .insert({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        level: level.trim(),
        objective: objective.trim(),
        budget: budget.trim(),
        message: typeof message === "string" && message.trim().length > 0 ? message.trim() : null,
        source_page: source_page ?? null,
        source: source ?? "google_ads",
        consent: true,
      })
      .select()
      .single();

    if (insErr) {
      console.error("Lead insert error", insErr);
      return new Response(JSON.stringify({ error: "DB error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send notification email via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      try {
        const safeFullName = escapeHtml(`${lead.first_name} ${lead.last_name}`);
        const safeEmail = escapeHtml(lead.email);
        const safePhone = escapeHtml(lead.phone);
        const safeLevel = escapeHtml(lead.level ?? "-");
        const safeObjective = escapeHtml(lead.objective ?? "-");
        const safeBudget = escapeHtml(lead.budget ?? "-");
        const safePage = escapeHtml(lead.source_page ?? "-");
        const safeMessage = escapeHtml(lead.message ?? "").replace(/\n/g, "<br/>");
        const html = `
          <h2>Nouveau lead AMZing FBA</h2>
          <p><strong>Date :</strong> ${new Date(lead.created_at).toLocaleString("fr-FR")}</p>
          <p><strong>Page source :</strong> ${safePage}</p>
          <hr/>
          <p><strong>Nom :</strong> ${safeFullName}</p>
          <p><strong>Email :</strong> ${safeEmail}</p>
          <p><strong>Téléphone :</strong> ${safePhone}</p>
          <p><strong>Niveau :</strong> ${safeLevel}</p>
          <p><strong>Objectif :</strong> ${safeObjective}</p>
          <p><strong>Budget :</strong> ${safeBudget}</p>
          <hr/>
          <p><strong>Message :</strong></p>
          <p>${safeMessage}</p>
        `;
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "AMZing FBA Leads <onboarding@resend.dev>",
            to: [NOTIFY_TO],
            reply_to: lead.email,
            subject: `[Lead] ${lead.first_name} ${lead.last_name} — ${lead.objective ?? "demande"}`,
            html,
          }),
        });
        if (!r.ok) console.error("Resend error", await r.text());
      } catch (e) {
        console.error("Email send failed", e);
      }
    }

    return new Response(JSON.stringify({ ok: true, id: lead.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("submit-lead error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
