import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Client anon: uniquement pour valider le token et appeler la RPC has_role
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false },
      }
    );

    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Token invalide" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminId = claimsData.claims.sub;

    const { data: isAdmin } = await supabaseAuth.rpc("has_role", {
      _user_id: adminId,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Accès réservé aux administrateurs" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Client service role: lecture globale (bypass RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const [{ data: profiles, error: profilesError }, { data: subs, error: subsError }, { data: roles, error: rolesError }] =
      await Promise.all([
        supabaseAdmin
          .from("profiles")
          .select("id, full_name, email, phone, nickname, avatar_url, created_at, updated_at")
          .order("created_at", { ascending: false }),
        supabaseAdmin
          .from("subscriptions")
          .select("user_id, plan_type, status, expires_at, is_trial"),
        supabaseAdmin
          .from("user_roles")
          .select("user_id, role"),
      ]);

    if (profilesError) throw profilesError;
    if (subsError) throw subsError;
    if (rolesError) throw rolesError;

    const enriched = (profiles ?? []).map((p) => {
      const subscription = (subs ?? []).find((s) => s.user_id === p.id);
      const role = (roles ?? []).find((r) => r.user_id === p.id);

      return {
        ...p,
        subscription: subscription
          ? {
              plan_type: subscription.plan_type,
              status: subscription.status,
              expires_at: subscription.expires_at,
              is_trial: subscription.is_trial,
            }
          : undefined,
        role: role?.role ?? "user",
      };
    });

    return new Response(JSON.stringify({ profiles: enriched }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ADMIN-GET-PROFILES] Error:", message);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
