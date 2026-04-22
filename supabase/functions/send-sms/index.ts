import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Lovable Supabase project (données campagnes, contacts, logs)
const LOVABLE_URL = "https://wvmfzlogijvqcsgablrb.supabase.co";
const LOVABLE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bWZ6bG9naWp2cWNzZ2FibHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTI3MTYsImV4cCI6MjA3NjgyODcxNn0.4ciuBXzeLQB4RatGnJuXJemQ_w6xr5f8Bhm2SUOzdtY";

const ONOFF_API_V4 = "https://production-server.onoffapp.net/mobile/v4";
const ONOFF_API_V5 = "https://production-server.onoffapp.net/mobile/v5";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(): number {
  return Math.floor(Math.random() * 2000) + 1000; // 1-3s
}

function personalizeMessage(template: string, name: string): string {
  if (name) {
    return template.replace(/Bonjour \{nom\},/gi, `Bonjour ${name},`).replace(/{nom}/gi, name);
  }
  return template.replace(/Bonjour \{nom\},/gi, "Bonjour,").replace(/{nom}/gi, "");
}

function formatPhone(phone: string): string {
  let p = phone.replace(/\s+/g, "").replace(/[^\d+]/g, "");
  if (p.startsWith("0")) p = "+33" + p.slice(1);
  if (!p.startsWith("+")) p = "+" + p;
  return p;
}

async function onoffRequest(
  url: string,
  method: string,
  body: Record<string, unknown> | null,
  config: { auth_token: string; instance_id: string }
): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      Authorization: `Basic ${config.auth_token}`,
      "x-instance-id": config.instance_id,
      "x-user-agent": "onoff-web/4.74.0",
      "Origin": "https://phone.onoff.app",
    };
    const opts: RequestInit = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { data = text; }
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}` };
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function getThreadId(
  phone: string,
  config: { auth_token: string; instance_id: string; sender_number: string }
): Promise<{ ok: boolean; threadId?: string; error?: string }> {
  const formattedPhone = formatPhone(phone);
  const formattedSender = formatPhone(config.sender_number);

  // Essai 1 : GET v5
  const urlGet = `${ONOFF_API_V5}/get-thread-id?phoneNumber=${encodeURIComponent(formattedPhone)}&senderNumber=${encodeURIComponent(formattedSender)}`;
  const resGet = await onoffRequest(urlGet, "GET", null, config);
  if (resGet.ok) {
    const threadId = resGet.data?.threadId || resGet.data?.id;
    if (threadId) return { ok: true, threadId };
  }

  // Essai 2 : POST v5 avec body
  const resPost = await onoffRequest(`${ONOFF_API_V5}/get-thread-id`, "POST", {
    phoneNumber: formattedPhone,
    senderNumber: formattedSender,
  }, config);
  if (resPost.ok) {
    const threadId = resPost.data?.threadId || resPost.data?.id;
    if (threadId) return { ok: true, threadId };
  }

  // Essai 3 : POST v4 new-thread
  const resV4 = await onoffRequest(`${ONOFF_API_V4}/new-thread`, "POST", {
    phoneNumber: formattedPhone,
    senderNumber: formattedSender,
  }, config);
  if (resV4.ok) {
    const threadId = resV4.data?.threadId || resV4.data?.id || resV4.data?.thread?.id;
    if (threadId) return { ok: true, threadId };
  }

  console.log("get-thread-id all failed:", JSON.stringify({ resGet, resPost, resV4 }));
  return { ok: false, error: `get-thread-id 400 (phone: ${formattedPhone})` };
}

async function sendSms(
  phone: string,
  message: string,
  config: { auth_token: string; instance_id: string; sender_number: string }
): Promise<{ ok: boolean; error?: string }> {
  const thread = await getThreadId(phone, config);
  if (!thread.ok || !thread.threadId) return { ok: false, error: `Échec get-thread-id: ${thread.error}` };
  return await onoffRequest(`${ONOFF_API_V4}/send-message`, "POST", {
    content: message,
    messageType: "TEXT",
    threadId: thread.threadId,
  }, config);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { action, campaign_id, user_token } = await req.json();

    if (!user_token) {
      return new Response(JSON.stringify({ error: "user_token manquant" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Client Lovable avec le JWT passé dans le body
    const supabase = createClient(LOVABLE_URL, LOVABLE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${user_token}` } },
    });

    if (action === "process") {
      const { data: campaign } = await supabase.from("sms_campaigns").select("*").eq("id", campaign_id).single();
      if (!campaign) {
        return new Response(JSON.stringify({ error: "Campagne introuvable" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: config } = await supabase.from("onoff_config").select("*").eq("user_id", campaign.user_id).single();
      if (!config?.auth_token) {
        return new Response(JSON.stringify({ error: "Config Onoff manquante — va dans Config Onoff" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const onoffConfig = {
        auth_token: config.auth_token,
        instance_id: config.instance_id || "",
        sender_number: config.sender_number || "",
      };

      await supabase.from("sms_campaigns").update({ status: "running", updated_at: new Date().toISOString() }).eq("id", campaign_id);
      await supabase.from("sms_logs").insert({ campaign_id, message: `Démarrage — ${campaign.total_contacts} contacts`, type: "info" });

      const { data: contacts } = await supabase
        .from("sms_contacts")
        .select("*")
        .eq("campaign_id", campaign_id)
        .eq("status", "pending")
        .order("sort_order", { ascending: true });

      if (!contacts?.length) {
        await supabase.from("sms_campaigns").update({ status: "completed" }).eq("id", campaign_id);
        return new Response(JSON.stringify({ message: "Aucun contact" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let sentCount = campaign.sent_count || 0;
      let failedCount = campaign.failed_count || 0;

      for (let i = 0; i < contacts.length; i++) {
        const { data: check } = await supabase.from("sms_campaigns").select("status").eq("id", campaign_id).single();
        if (!check || check.status === "stopped") {
          await supabase.from("sms_logs").insert({ campaign_id, message: "Arrêté par l'utilisateur", type: "warn" });
          break;
        }

        if (check.status === "paused") {
          await supabase.from("sms_logs").insert({ campaign_id, message: "En pause...", type: "warn" });
          let waited = 0;
          while (waited < 300000) {
            await sleep(2000);
            waited += 2000;
            const { data: r } = await supabase.from("sms_campaigns").select("status").eq("id", campaign_id).single();
            if (!r || r.status !== "paused") break;
          }
          const { data: r2 } = await supabase.from("sms_campaigns").select("status").eq("id", campaign_id).single();
          if (!r2 || r2.status === "stopped") break;
        }

        const contact = contacts[i];
        const msg = personalizeMessage(campaign.message, contact.name);

        await supabase.from("sms_logs").insert({
          campaign_id,
          message: `[${i + 1}/${contacts.length}] → ${contact.name || contact.phone}`,
          type: "info",
        });

        const result = await sendSms(contact.phone, msg, onoffConfig);

        if (result.ok) {
          sentCount++;
          await supabase.from("sms_contacts").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", contact.id);
          await supabase.from("sms_logs").insert({ campaign_id, message: `✓ ${contact.name || contact.phone}`, type: "success" });
        } else {
          failedCount++;
          await supabase.from("sms_contacts").update({ status: "failed", error_message: result.error }).eq("id", contact.id);
          await supabase.from("sms_logs").insert({ campaign_id, message: `✗ ${contact.name || contact.phone}: ${result.error}`, type: "error" });
        }

        await supabase.from("sms_campaigns").update({
          sent_count: sentCount,
          failed_count: failedCount,
          current_index: i + 1,
          updated_at: new Date().toISOString(),
        }).eq("id", campaign_id);

        if (i < contacts.length - 1) {
          const d = randomDelay();
          await supabase.from("sms_logs").insert({ campaign_id, message: `⏳ ${(d / 1000).toFixed(1)}s`, type: "info" });
          await sleep(d);
        }
      }

      const { data: final } = await supabase.from("sms_campaigns").select("status").eq("id", campaign_id).single();
      if (final && final.status !== "stopped") {
        await supabase.from("sms_campaigns").update({ status: "completed" }).eq("id", campaign_id);
      }
      await supabase.from("sms_logs").insert({
        campaign_id,
        message: `✅ Terminé : ${sentCount} envoyés, ${failedCount} échoués`,
        type: "success",
      });

      return new Response(JSON.stringify({ sent: sentCount, failed: failedCount }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Action inconnue" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
