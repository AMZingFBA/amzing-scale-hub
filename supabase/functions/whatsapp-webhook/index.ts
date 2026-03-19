import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[WHATSAPP-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN") || "amzing_fba_webhook_secret";

  // GET = Meta webhook verification
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      logStep("Webhook verified by Meta");
      return new Response(challenge, { status: 200 });
    }

    return new Response("Forbidden", { status: 403 });
  }

  // POST = incoming WhatsApp message
  if (req.method === "POST") {
    try {
      const body = await req.json();

      if (body.object !== "whatsapp_business_account") {
        return new Response("Not found", { status: 404 });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;

          // Handle message status updates (sent, delivered, read, failed)
          if (value?.statuses) {
            for (const status of value.statuses) {
              logStep("Status update", {
                id: status.id,
                status: status.status,
                recipient: status.recipient_id,
                errors: status.errors || undefined,
              });

              await supabase
                .from("whatsapp_messages")
                .update({ status: status.status })
                .eq("wamid", status.id);
            }
          }

          // Handle incoming messages
          if (value?.messages) {
            for (const msg of value.messages) {
              const from = msg.from;
              const timestamp = new Date(
                parseInt(msg.timestamp) * 1000
              ).toISOString();
              const contactName =
                value.contacts?.find(
                  (c: { wa_id: string }) => c.wa_id === from
                )?.profile?.name || null;

              let textBody = null;
              if (msg.type === "text") {
                textBody = msg.text.body;
              }

              logStep("Message received", {
                from,
                type: msg.type,
                name: contactName,
                text: textBody?.substring(0, 100),
              });

              // Store in Supabase
              await supabase.from("whatsapp_messages").insert({
                wamid: msg.id,
                phone: from,
                contact_name: contactName,
                direction: "incoming",
                message_type: msg.type,
                body: textBody,
                status: "received",
                created_at: timestamp,
              });
            }
          }
        }
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logStep("ERROR", { message: errorMessage });
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
