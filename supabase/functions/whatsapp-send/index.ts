import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-key",
};

const ADMIN_EMAIL = "amzingfba26@gmail.com";

// Le projet principal où l'admin est connecté
const MAIN_SUPABASE_URL = "https://wvmfzlogijvqcsgablrb.supabase.co";
const MAIN_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bWZ6bG9naWp2cWNzZ2FibHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTI3MTYsImV4cCI6MjA3NjgyODcxNn0.4ciuBXzeLQB4RatGnJuXJemQ_w6xr5f8Bhm2SUOzdtY";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the caller is the admin via the MAIN Supabase project
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Check against main project where admin is actually logged in
    const mainSupabase = createClient(MAIN_SUPABASE_URL, MAIN_SUPABASE_ANON_KEY);
    const {
      data: { user },
      error: authError,
    } = await mainSupabase.auth.getUser(token);

    if (authError || !user || user.email !== ADMIN_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Accès réservé à l'admin" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request
    const { phone, message } = await req.json();

    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: "phone et message requis" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Clean phone number (remove + if present)
    const cleanPhone = phone.replace("+", "");

    // Send via Meta WhatsApp API
    const whatsappToken = Deno.env.get("WHATSAPP_TOKEN");
    const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

    const metaResponse = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: cleanPhone,
          type: "text",
          text: { body: message },
        }),
      }
    );

    const metaData = await metaResponse.json();

    if (!metaResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Erreur Meta API", details: metaData }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const wamid = metaData.messages?.[0]?.id || null;

    // Store outgoing message in DB (whatsapp project)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabase.from("whatsapp_messages").insert({
      wamid,
      phone: cleanPhone,
      direction: "outgoing",
      message_type: "text",
      body: message,
      status: "sent",
    });

    return new Response(
      JSON.stringify({ success: true, wamid }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
