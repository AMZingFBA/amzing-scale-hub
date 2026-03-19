import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false },
      }
    );

    const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Token invalide" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminId = userData.user.id;
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

    const { userId, action, expiresAt } = await req.json();

    if (!userId || !action) {
      return new Response(JSON.stringify({ error: "userId et action requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    if (action === "grant") {
      const defaultExpiry = new Date();
      defaultExpiry.setMonth(defaultExpiry.getMonth() + 12);
      const finalExpiry = expiresAt || defaultExpiry.toISOString();

      const { data: existing } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (existing) {
        const { error: updateError } = await supabaseAdmin
          .from("subscriptions")
          .update({
            plan_type: "vip",
            status: "active",
            is_trial: false,
            payment_provider: "manual_admin",
            expires_at: finalExpiry,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (updateError) throw new Error(updateError.message);
      } else {
        const { error: insertError } = await supabaseAdmin
          .from("subscriptions")
          .insert({
            user_id: userId,
            plan_type: "vip",
            status: "active",
            is_trial: false,
            payment_provider: "manual_admin",
            expires_at: finalExpiry,
          });

        if (insertError) throw new Error(insertError.message);
      }

      console.log(`[ADMIN-TOGGLE-VIP] VIP granted to ${userId} until ${finalExpiry} by admin ${adminId}`);

      return new Response(JSON.stringify({ success: true, action: "grant", expires_at: finalExpiry }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (action === "revoke") {
      const { error: revokeError } = await supabaseAdmin
        .from("subscriptions")
        .update({
          plan_type: "free",
          status: "expired",
          is_trial: false,
          expires_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (revokeError) throw new Error(revokeError.message);

      console.log(`[ADMIN-TOGGLE-VIP] VIP revoked for ${userId} by admin ${adminId}`);

      return new Response(JSON.stringify({ success: true, action: "revoke" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Action invalide (grant ou revoke)" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    console.error("[ADMIN-TOGGLE-VIP] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
