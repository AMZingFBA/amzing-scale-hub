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

    // Process ONE source at a time, with a small limit
    const body = await req.json().catch(() => ({}));
    const source = body.source || 'Leclerc';
    const batchSize = body.batch_size || 50;

    console.log(`🧹 Cleaning duplicates for: ${source} (batch: ${batchSize})`);

    // Fetch a small batch of alerts for this source
    const { data: alerts, error } = await supabase
      .from('product_find_alerts')
      .select('id, ean, created_at')
      .eq('source_name', source)
      .order('created_at', { ascending: false })
      .limit(batchSize);

    if (error) {
      console.error('Fetch error:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!alerts || alerts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No alerts found', deleted: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find duplicates within this batch
    const seen = new Set<string>();
    const toDelete: string[] = [];

    for (const alert of alerts) {
      if (seen.has(alert.ean)) {
        toDelete.push(alert.id);
      } else {
        seen.add(alert.ean);
      }
    }

    // Delete duplicates
    let deleted = 0;
    for (let i = 0; i < toDelete.length; i += 20) {
      const batch = toDelete.slice(i, i + 20);
      const { error: delErr } = await supabase
        .from('product_find_alerts')
        .delete()
        .in('id', batch);
      if (!delErr) deleted += batch.length;
      else console.error('Delete error:', delErr);
    }

    console.log(`✅ ${source}: checked ${alerts.length}, deleted ${deleted}, unique ${seen.size}`);

    return new Response(
      JSON.stringify({ success: true, source, checked: alerts.length, deleted, unique: seen.size }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
