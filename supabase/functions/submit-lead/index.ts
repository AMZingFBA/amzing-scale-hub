import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const NOTIFY_TO = "noazaghdoun55555@gmail.com";

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
        level: level ?? null,
        objective: objective ?? null,
        budget: budget ?? null,
        message: message ?? null,
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
        const html = `
          <h2>Nouveau lead AMZing FBA</h2>
          <p><strong>Date :</strong> ${new Date(lead.created_at).toLocaleString("fr-FR")}</p>
          <p><strong>Page source :</strong> ${lead.source_page ?? "-"}</p>
          <hr/>
          <p><strong>Nom :</strong> ${lead.first_name} ${lead.last_name}</p>
          <p><strong>Email :</strong> ${lead.email}</p>
          <p><strong>Téléphone :</strong> ${lead.phone}</p>
          <p><strong>Niveau :</strong> ${lead.level ?? "-"}</p>
          <p><strong>Objectif :</strong> ${lead.objective ?? "-"}</p>
          <p><strong>Budget :</strong> ${lead.budget ?? "-"}</p>
          <hr/>
          <p><strong>Message :</strong></p>
          <p>${(lead.message ?? "").replace(/\n/g, "<br/>")}</p>
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
