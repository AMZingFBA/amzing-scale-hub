import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Google Sheet ID
const SHEET_ID = "1fh85PAOtLXWUU-Q4SgZuYv7zwS9L1GD6yRe7yHYkscQ";
const SHEET_NAME = "Sheet1"; // Adjust if different

// Mapping des sources vers les noms dans la BDD
// Exception: "Qogita" doit être mappé vers "Qogita2"
const mapSourceName = (source: string): string => {
  const trimmed = source?.trim() || '';
  if (trimmed.toLowerCase() === 'qogita') {
    return 'Qogita2';
  }
  return trimmed;
};

// Parse French date format "DD/MM/YYYY HH:mm:ss" or other formats
const parseDate = (dateStr: string): string => {
  if (!dateStr) return new Date().toISOString();
  
  try {
    // Try DD/MM/YYYY HH:mm:ss format
    const frenchMatch = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):?(\d{2})?/);
    if (frenchMatch) {
      const [, day, month, year, hour, minute, second = '00'] = frenchMatch;
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).toISOString();
    }
    
    // Try ISO format
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (e) {
    console.error('Date parse error:', e);
  }
  
  return new Date().toISOString();
};

// Parse number safely
const parseNumber = (value: string | undefined | null): number | null => {
  if (!value || value === '' || value === '-' || value === 'N/A') return null;
  
  // Replace comma with dot for French decimals
  const cleaned = value.toString().replace(',', '.').replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔄 Starting Product Find sync from Google Sheets...");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get admin user ID
    const { data: adminId } = await supabaseClient.rpc('get_admin_user_id');
    if (!adminId) {
      throw new Error('No admin user found');
    }

    // Fetch Google Sheet as CSV
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;
    console.log(`📡 Fetching from: ${csvUrl}`);

    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }

    const csvText = await response.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return new Response(
        JSON.stringify({ success: true, message: 'No data rows found', stats: { total: 0, inserted: 0, skipped: 0 } }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse CSV header
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^"|"$/g, ''));
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    console.log('📋 Headers:', headers);

    // Column mapping (0-indexed based on the user's specification)
    // ID; Date/Heure; Canal; Source; Titre Produit; EAN; Prix Achat; Prix Vente; BSR; BSR %; Ventes/mois; FBM Profit; FBM ROI; FBA Profit; FBA ROI; Private Label; Taille; Meltable; Variations; Vendeurs; Lien Amazon; Lien Source
    const COL = {
      ID: 0,
      DATE_HEURE: 1,
      CANAL: 2,
      SOURCE: 3,
      TITRE_PRODUIT: 4,
      EAN: 5,
      PRIX_ACHAT: 6,
      PRIX_VENTE: 7,
      BSR: 8,
      BSR_PERCENT: 9,
      VENTES_MOIS: 10,
      FBM_PROFIT: 11,
      FBM_ROI: 12,
      FBA_PROFIT: 13,
      FBA_ROI: 14,
      PRIVATE_LABEL: 15,
      TAILLE: 16,
      MELTABLE: 17,
      VARIATIONS: 18,
      VENDEURS: 19,
      LIEN_AMAZON: 20,
      LIEN_SOURCE: 21,
    };

    // Get existing IDs to avoid duplicates
    const { data: existingAlerts } = await supabaseClient
      .from('product_find_alerts')
      .select('ean, created_at');
    
    const existingKeys = new Set(
      (existingAlerts || []).map(a => `${a.ean}_${a.created_at?.slice(0, 10)}`)
    );

    let insertedCount = 0;
    let skippedCount = 0;
    const dataRows = lines.slice(1);

    for (const line of dataRows) {
      try {
        const cols = parseCSVLine(line);
        
        const ean = cols[COL.EAN]?.trim();
        const dateHeure = cols[COL.DATE_HEURE]?.trim();
        const source = cols[COL.SOURCE]?.trim();
        const title = cols[COL.TITRE_PRODUIT]?.trim();
        
        // Skip if missing required fields
        if (!ean || !source || !title) {
          console.log('⏭️ Skipping row with missing required fields');
          skippedCount++;
          continue;
        }

        const createdAt = parseDate(dateHeure);
        const key = `${ean}_${createdAt.slice(0, 10)}`;
        
        // Skip if already exists
        if (existingKeys.has(key)) {
          skippedCount++;
          continue;
        }

        const alertData = {
          admin_id: adminId,
          source_name: mapSourceName(source),
          product_title: title,
          ean: ean,
          cost_price: parseNumber(cols[COL.PRIX_ACHAT]),
          current_price: parseNumber(cols[COL.PRIX_VENTE]) || 0,
          sale_price: parseNumber(cols[COL.PRIX_VENTE]),
          bsr: cols[COL.BSR]?.trim() || null,
          bsr_percent: cols[COL.BSR_PERCENT]?.trim() || null,
          monthly_sales: cols[COL.VENTES_MOIS]?.trim() || null,
          profit: parseNumber(cols[COL.FBM_PROFIT]),
          roi: parseNumber(cols[COL.FBM_ROI]),
          fba_profit: parseNumber(cols[COL.FBA_PROFIT]),
          fba_roi: parseNumber(cols[COL.FBA_ROI]),
          private_label: cols[COL.PRIVATE_LABEL]?.trim() || null,
          product_size: cols[COL.TAILLE]?.trim() || null,
          meltable: cols[COL.MELTABLE]?.trim() || null,
          variations: cols[COL.VARIATIONS]?.trim() || null,
          sellers: cols[COL.VENDEURS]?.trim() || null,
          amazon_url: cols[COL.LIEN_AMAZON]?.trim() || null,
          source_url: cols[COL.LIEN_SOURCE]?.trim() || null,
          created_at: createdAt,
        };

        const { error: insertError } = await supabaseClient
          .from('product_find_alerts')
          .insert(alertData);

        if (insertError) {
          console.error('❌ Insert error:', insertError);
          skippedCount++;
        } else {
          existingKeys.add(key);
          insertedCount++;
          console.log(`✅ Inserted: ${title.substring(0, 50)}... (${source} -> ${alertData.source_name})`);
        }
      } catch (rowError) {
        console.error('❌ Row processing error:', rowError);
        skippedCount++;
      }
    }

    console.log(`✅ Sync completed: ${insertedCount} inserted, ${skippedCount} skipped`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sync completed`,
        stats: {
          total: dataRows.length,
          inserted: insertedCount,
          skipped: skippedCount,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Sync error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
