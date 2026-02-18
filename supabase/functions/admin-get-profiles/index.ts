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

    // Fetch all data in parallel
    const [
      { data: profiles, error: profilesError },
      { data: subs, error: subsError },
      { data: roles, error: rolesError },
      { data: alertReadStatus, error: alertReadError },
      { data: productFindReadStatus, error: pfReadError },
      { data: totalAlerts, error: totalAlertsError },
      { data: totalProductFinds, error: totalPfError },
    ] = await Promise.all([
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
      // Count read alerts per user
      supabaseAdmin
        .from("alert_read_status")
        .select("user_id, is_read"),
      // Count read product find alerts per user
      supabaseAdmin
        .from("product_find_read_status")
        .select("user_id, is_read"),
      // Total alerts count
      supabaseAdmin
        .from("admin_alerts")
        .select("id", { count: "exact", head: true }),
      // Total product find alerts count
      supabaseAdmin
        .from("product_find_alerts")
        .select("id", { count: "exact", head: true }),
    ]);

    if (profilesError) throw profilesError;
    if (subsError) throw subsError;
    if (rolesError) throw rolesError;

    // Get auth users for last_sign_in_at
    const authUsersMap = new Map<string, string | null>();
    let page = 1;
    const perPage = 1000;
    let hasMore = true;
    
    while (hasMore) {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });
      
      if (authError) {
        console.error("Error fetching auth users:", authError);
        break;
      }
      
      for (const u of authData.users) {
        authUsersMap.set(u.id, u.last_sign_in_at ?? null);
      }
      
      hasMore = authData.users.length === perPage;
      page++;
    }

    // Build unread counts per user
    const totalAlertsCount = totalAlerts ?? 0;
    const totalPfCount = totalProductFinds ?? 0;
    const actualTotalAlerts = totalAlertsError ? 0 : (totalAlertsCount as any);
    const actualTotalPf = totalPfError ? 0 : (totalPfCount as any);

    // Count read alerts per user
    const readAlertsPerUser = new Map<string, number>();
    if (alertReadStatus) {
      for (const row of alertReadStatus) {
        if (row.is_read) {
          readAlertsPerUser.set(row.user_id, (readAlertsPerUser.get(row.user_id) || 0) + 1);
        }
      }
    }

    const readPfPerUser = new Map<string, number>();
    if (productFindReadStatus) {
      for (const row of productFindReadStatus) {
        if (row.is_read) {
          readPfPerUser.set(row.user_id, (readPfPerUser.get(row.user_id) || 0) + 1);
        }
      }
    }

    const enriched = (profiles ?? []).map((p) => {
      const subscription = (subs ?? []).find((s) => s.user_id === p.id);
      const role = (roles ?? []).find((r) => r.user_id === p.id);
      
      const readAlerts = readAlertsPerUser.get(p.id) || 0;
      const readPf = readPfPerUser.get(p.id) || 0;
      
      // Use the count from the head request
      const unreadAlerts = Math.max(0, (actualTotalAlerts as number) - readAlerts);
      const unreadPf = Math.max(0, (actualTotalPf as number) - readPf);
      const totalUnread = unreadAlerts + unreadPf;

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
        last_sign_in_at: authUsersMap.get(p.id) ?? null,
        unread_notifications: totalUnread,
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
