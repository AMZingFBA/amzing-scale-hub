import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Default Eany Sheet ID - you can override via request body
const DEFAULT_SHEET_ID = "";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as { sheetId?: string; action?: string };
    const sheetId = body.sheetId || DEFAULT_SHEET_ID;
    const action = body.action;

    // Handle clear action
    if (action === "clear") {
      console.log("🗑️ Clearing Eany products table...");
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase
        .from('eany_products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, message: 'Table vidée avec succès' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if sheetId is provided
    if (!sheetId) {
      return new Response(
        JSON.stringify({ success: true, products: [], count: 0, message: "No sheet ID configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("🔄 Reading Eany products from Google Sheet (CSV)", { sheetId });

    // Public CSV export (no OAuth)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    const lines = csvText.split("\n").filter((line) => line.trim());

    // Header only or empty
    if (lines.length < 2) {
      console.log("ℹ️ Sheet has no data rows");
      return new Response(
        JSON.stringify({ success: true, products: [], count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const headers = parseCSVRow(lines[0]).map((h) => h.toLowerCase().trim());

    const products: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVRow(lines[i]);
      if (values.length === 0) continue;

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = (values[index] ?? "").trim();
      });

      if (!row.ean) continue;

      products.push({
        ean: row.ean,
        timestamp: row.timestamp || new Date().toISOString(),
        qogita_price_ht: parseFloat(row.eany_priceht || row.eany_price_ht || row.price_ht || "0") || 0,
        qogita_price_ttc: parseFloat(row.eany_pricettc || row.eany_price_ttc || row.price_ttc || "0") || 0,
        qogita_stock: row.eany_stock || row.stock ? parseInt(row.eany_stock || row.stock) : null,
        qogita_url: row.eany_url || row.url || null,
        selleramp_bsr: row.selleramp_bsr || row.bsr || null,
        selleramp_sale_price: row.selleramp_saleprice || row.sale_price ? parseFloat(row.selleramp_saleprice || row.sale_price) : null,
        selleramp_sales: row.selleramp_sales || row.sales || null,
        selleramp_sellers: row.selleramp_sellers || row.sellers || null,
        selleramp_variations: row.selleramp_variations || row.variations || null,
        selleramp_url: row.selleramp_url || null,
        amazon_url: row.amazon_url || null,
        fbm_profit: parseFloat(row.fbm_profit || "0") || 0,
        fbm_roi: parseFloat(row.fbm_roi || "0") || 0,
        fba_profit: parseFloat(row.fba_profit || "0") || 0,
        fba_roi: parseFloat(row.fba_roi || "0") || 0,
        alerts: row.alerts
          ? row.alerts.split(",").map((a: string) => a.trim()).filter(Boolean)
          : [],
      });
    }

    console.log("✅ Parsed Eany products", { count: products.length });

    return new Response(
      JSON.stringify({ success: true, products, count: products.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Google Sheet read error:", errorMessage);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage, products: [], count: 0 }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
