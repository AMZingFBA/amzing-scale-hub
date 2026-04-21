import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ONOFF_API_V4 = "https://production-server.onoffapp.net/mobile/v4";
const ONOFF_API_V5 = "https://production-server.onoffapp.net/mobile/v5";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(): number {
  return Math.floor(Math.random() * 7000) + 3000; // 3-10s
}

function personalizeMessage(template: string, name: string): string {
  if (name) {
    return template.replace(/Bonjour \{nom\},/gi, `Bonjour ${name},`).replace(/{nom}/gi, name);
  }
  // Pas de nom → "Bonjour,"
  return template.replace(/Bonjour \{nom\},/gi, "Bonjour,").replace(/{nom}/gi, "");
}

// Format phone number
function formatPhone(phone: string): string {
  let p = phone.replace(/\s+/g, "").replace(/[^\d+]/g, "");
  if (p.startsWith("0")) p = "+33" + p.slice(1);
  if (!p.startsWith("+")) p = "+" + p;
  return p;
}

// ─── Onoff API calls ───

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
    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}` };
    }
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Get or create thread ID for a phone number
async function getThreadId(
  phone: string,
  config: { auth_token: string; instance_id: string; sender_number: string }
): Promise<{ ok: boolean; threadId?: string; error?: string }> {
  const formattedPhone = formatPhone(phone);

  // Call get-thread-id endpoint (v5)
  const url = `${ONOFF_API_V5}/get-thread-id?phoneNumber=${encodeURIComponent(formattedPhone)}&senderNumber=${encodeURIComponent(config.sender_number)}`;

  const result = await onoffRequest(url, "GET", null, config);

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  // Extract threadId from response
  const threadId = result.data?.threadId || result.data?.id;
  if (!threadId) {
    return { ok: false, error: "threadId non trouvé dans la réponse" };
  }

  return { ok: true, threadId };
}

// Send SMS via Onoff
async function sendSms(
  phone: string,
  message: string,
  config: { auth_token: string; instance_id: string; sender_number: string }
): Promise<{ ok: boolean; error?: string }> {
  // Step 1: Get thread ID for this contact
  const thread = await getThreadId(phone, config);
  if (!thread.ok || !thread.threadId) {
    return { ok: false, error: `Échec get-thread-id: ${thread.error}` };
  }

  // Step 2: Send message in thread
  const result = await onoffRequest(`${ONOFF_API_V4}/send-message`, "POST", {
    content: message,
    messageType: "TEXT",
    threadId: thread.threadId,
  }, config);

  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin check
    const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").single();
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Accès admin requis" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, campaign_id } = await req.json();

    if (action === "process") {
      const { data: campaign } = await supabase.from("sms_campaigns").select("*").eq("id", campaign_id).single();
      if (!campaign) {
        return new Response(JSON.stringify({ error: "Campagne introuvable" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get Onoff config
      const { data: config } = await supabase.from("onoff_config").select("*").eq("user_id", user.id).single();
      if (!config?.auth_token) {
        return new Response(JSON.stringify({ error: "Config Onoff manquante - va dans Config Onoff" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const onoffConfig = {
        auth_token: config.auth_token,
        instance_id: config.instance_id || "",
        sender_number: config.sender_number || "",
      };

      // Set running
      await supabase.from("sms_campaigns").update({ status: "running", updated_at: new Date().toISOString() }).eq("id", campaign_id);
      await supabase.from("sms_logs").insert({ campaign_id, message: `Démarrage — ${campaign.total_contacts} contacts`, type: "info" });

      // Get pending contacts
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
        // Check status
        const { data: check } = await supabase.from("sms_campaigns").select("status").eq("id", campaign_id).single();

        if (!check || check.status === "stopped") {
          await supabase.from("sms_logs").insert({ campaign_id, message: "Arrêté par l'utilisateur", type: "warn" });
          break;
        }

        if (check.status === "paused") {
          await supabase.from("sms_logs").insert({ campaign_id, message: "En pause...", type: "warn" });
          let waited = 0;
          while (waited < 300000) { // 5 min max
            await sleep(2000);
            waited += 2000;
            const { data: r } = await supabase.from("sms_campaigns").select("status").eq("id", campaign_id).single();
            if (!r || r.status === "stopped" || r.status === "running") break;
          }
          const { data: r2 } = await supabase.from("sms_campaigns").select("status").eq("id", campaign_id).single();
          if (!r2 || r2.status === "stopped") break;
          if (r2.status === "running") {
            await supabase.from("sms_logs").insert({ campaign_id, message: "Reprise...", type: "info" });
          }
        }

        const contact = contacts[i];
        const msg = personalizeMessage(campaign.message, contact.name);

        await supabase.from("sms_logs").insert({
          campaign_id,
          message: `[${i + 1}/${contacts.length}] Envoi à ${contact.name || contact.phone}...`,
          type: "info"
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

        // Delay between messages (3-10 sec)
        if (i < contacts.length - 1) {
          const delay = randomDelay();
          await supabase.from("sms_logs").insert({ campaign_id, message: `Pause ${(delay / 1000).toFixed(0)}s...`, type: "info" });
          await sleep(delay);
        }
      }

      const { data: final } = await supabase.from("sms_campaigns").select("status").eq("id", campaign_id).single();
      if (final && final.status !== "stopped") {
        await supabase.from("sms_campaigns").update({ status: "completed" }).eq("id", campaign_id);
      }
      await supabase.from("sms_logs").insert({
        campaign_id,
        message: `Terminé : ${sentCount} envoyés, ${failedCount} échoués`,
        type: "success"
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
