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
    console.log("🔄 Starting Qogita alerts sync...");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Récupérer les alertes depuis votre backend
    const backendUrl = "http://localhost:3000/monitor/qogita";
    console.log(`📡 Fetching alerts from ${backendUrl}...`);

    const response = await fetch(backendUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch alerts: ${response.statusText}`);
    }

    const alerts = await response.json();
    console.log(`✅ Fetched ${alerts.length} alerts`);

    let insertedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    // Insérer ou mettre à jour chaque alerte
    for (const alert of alerts) {
      try {
        const alertData = {
          external_id: alert.id || `qogita_${Date.now()}_${Math.random()}`,
          title: alert.title || "Sans titre",
          description: alert.description || null,
          price: alert.price || null,
          url: alert.url || null,
          category: alert.category || null,
        };

        // Vérifier si l'alerte existe déjà
        const { data: existingAlert } = await supabaseClient
          .from("qogita_alerts")
          .select("id")
          .eq("external_id", alertData.external_id)
          .single();

        if (existingAlert) {
          // Mettre à jour l'alerte existante
          const { error: updateError } = await supabaseClient
            .from("qogita_alerts")
            .update({
              title: alertData.title,
              description: alertData.description,
              price: alertData.price,
              url: alertData.url,
              category: alertData.category,
              updated_at: new Date().toISOString(),
            })
            .eq("external_id", alertData.external_id);

          if (updateError) throw updateError;
          updatedCount++;
        } else {
          // Insérer une nouvelle alerte
          const { error: insertError } = await supabaseClient
            .from("qogita_alerts")
            .insert(alertData);

          if (insertError) throw insertError;
          insertedCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing alert:`, error);
        errorCount++;
      }
    }

    console.log(`✅ Sync completed: ${insertedCount} inserted, ${updatedCount} updated, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sync completed successfully`,
        stats: {
          total: alerts.length,
          inserted: insertedCount,
          updated: updatedCount,
          errors: errorCount,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Sync error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
