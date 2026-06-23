// Edge function: notify-credaris
// Signs payload with HMAC-SHA256 and POSTs to CREDARIS_WEBHOOK_URL.
// Logs everything in public.credaris_sync_log and supports retry.

import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const log = (step: string, details?: unknown) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[NOTIFY-CREDARIS] ${step}${d}`);
};

const RETRY_DELAYS_SEC = [0, 30, 300]; // 0s, 30s, 5min

interface NotifyBody {
  event: string;
  external_id?: string;
  externalId?: string;
  user_id?: string | null;
  payload: Record<string, unknown>;
  // If true, retries an existing log entry by external_id instead of creating one.
  retry?: boolean;
}

async function postSigned(body: string, secret: string, url: string) {
  const signature = createHmac("sha256", secret).update(body, "utf8").digest("hex");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-amzing-signature": signature,
    },
    body,
  });
  const text = await res.text().catch(() => "");
  return { status: res.status, body: text };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  try {
    const secret = Deno.env.get("AMZING_WEBHOOK_SECRET");
    const url = Deno.env.get("CREDARIS_WEBHOOK_URL");
    if (!secret) throw new Error("AMZING_WEBHOOK_SECRET not set");
    if (!url) throw new Error("CREDARIS_WEBHOOK_URL not set");

    const input = (await req.json()) as NotifyBody;
    const event = input.event;
    const externalId = input.external_id || input.externalId;
    const payload = input.payload;
    if (!event || !externalId || !payload) {
      return new Response(JSON.stringify({ error: "event, external_id, payload required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    log("Notify request", { event, externalId, retry: !!input.retry });

    // Upsert log entry as pending
    const fullPayload = { ...payload, event, external_id: externalId };
    const { data: existing } = await supabase
      .from("credaris_sync_log")
      .select("id, retry_count, status")
      .eq("external_id", externalId)
      .maybeSingle();

    let logId: string;
    let retryCount = 0;

    if (existing) {
      logId = existing.id;
      retryCount = existing.retry_count;
      if (existing.status === "success" && !input.retry) {
        log("Already success, skipping", { externalId });
        return new Response(JSON.stringify({ ok: true, already_sent: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("credaris_sync_log")
        .insert({
          event,
          external_id: externalId,
          user_id: input.user_id ?? null,
          payload: fullPayload,
          status: "pending",
        })
        .select("id")
        .single();
      if (insErr) throw insErr;
      logId = inserted!.id;
    }

    // Serialize ONCE, sign, send.
    const bodyStr = JSON.stringify(fullPayload);

    let lastErr: string | null = null;
    let lastStatus = 0;
    let lastResponse = "";

    for (let i = 0; i < RETRY_DELAYS_SEC.length; i++) {
      if (i > 0) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_SEC[i] * 1000));
      }
      try {
        const r = await postSigned(bodyStr, secret, url);
        lastStatus = r.status;
        lastResponse = r.body.slice(0, 4000);
        log("Sent attempt", { attempt: i + 1, status: r.status });

        if (r.status >= 200 && r.status < 300) {
          await supabase
            .from("credaris_sync_log")
            .update({
              status: "success",
              http_status: r.status,
              response_body: lastResponse,
              retry_count: retryCount + i,
              last_attempt_at: new Date().toISOString(),
              next_retry_at: null,
              error_message: null,
            })
            .eq("id", logId);
          return new Response(
            JSON.stringify({ ok: true, status: r.status, response: lastResponse }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        lastErr = `HTTP ${r.status}: ${lastResponse.slice(0, 200)}`;
      } catch (err) {
        lastErr = err instanceof Error ? err.message : String(err);
        log("Attempt error", { attempt: i + 1, error: lastErr });
      }
    }

    // All retries failed
    const nextRetry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15min for cron pickup
    await supabase
      .from("credaris_sync_log")
      .update({
        status: "failed",
        http_status: lastStatus || null,
        response_body: lastResponse,
        retry_count: retryCount + RETRY_DELAYS_SEC.length,
        last_attempt_at: new Date().toISOString(),
        next_retry_at: nextRetry,
        error_message: lastErr,
      })
      .eq("id", logId);

    return new Response(
      JSON.stringify({ ok: false, error: lastErr, http_status: lastStatus, response: lastResponse }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log("ERROR", { msg });
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
