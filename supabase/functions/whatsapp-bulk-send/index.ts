import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "amzingfba26@gmail.com";
const MAIN_SUPABASE_URL = "https://wvmfzlogijvqcsgablrb.supabase.co";
const MAIN_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bWZ6bG9naWp2cWNzZ2FibHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTI3MTYsImV4cCI6MjA3NjgyODcxNn0.4ciuBXzeLQB4RatGnJuXJemQ_w6xr5f8Bhm2SUOzdtY";

// Rate limit: 1 message per 6 seconds per recipient (Meta per-pair limit)
const DELAY_MS = 6500;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const mainSupabase = createClient(MAIN_SUPABASE_URL, MAIN_SUPABASE_ANON_KEY);
    const { data: { user }, error: authError } = await mainSupabase.auth.getUser(token);

    if (authError || !user || user.email !== ADMIN_EMAIL) {
      return new Response(JSON.stringify({ error: "Accès réservé à l'admin" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { contacts, template_name, template_language = "fr" } = await req.json();

    if (!contacts?.length || !template_name) {
      return new Response(
        JSON.stringify({ error: "contacts[] et template_name requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const whatsappToken = Deno.env.get("WHATSAPP_TOKEN");
    const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const results: { phone: string; company: string; success: boolean; error?: string; wamid?: string }[] = [];

    for (let i = 0; i < contacts.length; i++) {
      const { phone, company } = contacts[i];
      const cleanPhone = phone.replace(/[^0-9]/g, "");

      // Build template payload with {{1}} = company name
      const payload: Record<string, unknown> = {
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "template",
        template: {
          name: template_name,
          language: { code: template_language },
          components: company
            ? [{ type: "body", parameters: [{ type: "text", text: company }] }]
            : [],
        },
      };

      try {
        const res = await fetch(
          `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${whatsappToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        if (res.ok && data.messages?.[0]?.id) {
          const wamid = data.messages[0].id;

          // Store in DB
          await supabase.from("whatsapp_messages").insert({
            wamid,
            phone: cleanPhone,
            direction: "outgoing",
            message_type: "template",
            body: `[Template: ${template_name}] {{1}}=${company || ""}`,
            status: "sent",
          });

          results.push({ phone, company, success: true, wamid });
        } else {
          const errMsg = data.error?.message || "Erreur WhatsApp API";
          results.push({ phone, company, success: false, error: errMsg });
        }
      } catch (err) {
        results.push({
          phone,
          company,
          success: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }

      // Rate limit delay (except after last message)
      if (i < contacts.length - 1) {
        await sleep(DELAY_MS);
      }
    }

    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return new Response(
      JSON.stringify({ ok: true, total: contacts.length, sent, failed, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
