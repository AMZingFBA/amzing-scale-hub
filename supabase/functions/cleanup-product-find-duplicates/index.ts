import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json().catch(() => ({}));
    const mode = body.mode || 'old'; // 'old' = delete old, 'duplicates' = delete duplicates
    const batchSize = body.batch_size || 20;

    if (mode === 'old') {
      // Delete OLD alerts (>30 days) in micro-batches
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      console.log(`🗑️ Deleting alerts older than ${cutoff} (batch: ${batchSize})`);

      const { data: oldAlerts, error } = await supabase
        .from('product_find_alerts')
        .select('id')
        .lt('created_at', cutoff)
        .limit(batchSize);

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      if (!oldAlerts || oldAlerts.length === 0) {
        return new Response(
          JSON.stringify({ success: true, mode, message: 'No old alerts to delete', deleted: 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const ids = oldAlerts.map(a => a.id);
      const { error: delErr } = await supabase
        .from('product_find_alerts')
        .delete()
        .in('id', ids);

      const deleted = delErr ? 0 : ids.length;
      console.log(`✅ Deleted ${deleted} old alerts`);

      return new Response(
        JSON.stringify({ success: true, mode, deleted, remaining: oldAlerts.length === batchSize }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (mode === 'duplicates') {
      const source = body.source || 'Leclerc';
      console.log(`🧹 Cleaning duplicates for: ${source} (batch: ${batchSize})`);

      const { data: alerts, error } = await supabase
        .from('product_find_alerts')
        .select('id, ean, created_at')
        .eq('source_name', source)
        .order('created_at', { ascending: false })
        .limit(batchSize);

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      if (!alerts || alerts.length === 0) {
        return new Response(
          JSON.stringify({ success: true, mode, source, deleted: 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const seen = new Set<string>();
      const toDelete: string[] = [];
      for (const alert of alerts) {
        if (seen.has(alert.ean)) {
          toDelete.push(alert.id);
        } else {
          seen.add(alert.ean);
        }
      }

      let deleted = 0;
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase
          .from('product_find_alerts')
          .delete()
          .in('id', toDelete);
        if (!delErr) deleted = toDelete.length;
      }

      console.log(`✅ ${source}: checked ${alerts.length}, deleted ${deleted}`);
      return new Response(
        JSON.stringify({ success: true, mode, source, checked: alerts.length, deleted }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid mode. Use 'old' or 'duplicates'" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
