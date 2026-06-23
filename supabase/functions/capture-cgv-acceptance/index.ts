// Capture CGV acceptance (version + IP + user-agent) on the user's profile and subscription.
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const requestedVersion = typeof body.cgv_version === "string" ? body.cgv_version : null;

    // Resolve current CGV version
    let version = requestedVersion;
    if (!version) {
      const { data: cur } = await supabase
        .from("cgv_versions")
        .select("version")
        .eq("is_current", true)
        .maybeSingle();
      version = cur?.version || new Date().toISOString().slice(0, 10);
    }

    const ip =
      req.headers.get("cf-connecting-ip") ||
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const ua = req.headers.get("user-agent") || null;
    const now = new Date().toISOString();

    const userId = userData.user.id;

    await supabase
      .from("profiles")
      .update({
        cgv_version: version,
        cgv_accepted_at: now,
        cgv_ip: ip,
        cgv_user_agent: ua,
      })
      .eq("id", userId);

    await supabase
      .from("subscriptions")
      .update({
        cgv_version: version,
        cgv_accepted_at: now,
        cgv_ip: ip,
        cgv_user_agent: ua,
      })
      .eq("user_id", userId);

    return new Response(
      JSON.stringify({ ok: true, cgv_version: version, accepted_at: now, ip, ua }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
