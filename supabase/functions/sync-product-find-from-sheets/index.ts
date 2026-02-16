import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Google Sheet ID
const SHEET_ID = "1fh85PAOtLXWUU-Q4SgZuYv7zwS9L1GD6yRe7yHYkscQ";
const SHEET_NAME = "Sheet1";

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

// Better CSV parsing that handles quotes and special characters
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  // Clean up quotes from values
  return result.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
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

    // Get admin user ID from user_roles table
    const { data: adminRole, error: adminError } = await supabaseClient
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')
      .limit(1)
      .maybeSingle();
    
    const adminId = adminRole?.user_id;
    if (!adminId) {
      console.error('Admin lookup error:', adminError);
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

    const headers = parseCSVLine(lines[0]);
    console.log('📋 Headers:', headers);
    console.log('📋 Number of headers:', headers.length);

    // Build column index map from headers
    const headerMap: Record<string, number> = {};
    headers.forEach((h, i) => {
      headerMap[h.toLowerCase().trim()] = i;
    });

    // Column indices
    const COL = {
      ID: headerMap['id'] ?? 0,
      DATE_HEURE: headerMap['date/heure'] ?? 1,
      CANAL: headerMap['canal'] ?? 2,
      SOURCE: headerMap['source'] ?? 3,
      TITRE_PRODUIT: headerMap['titre produit'] ?? 4,
      EAN: headerMap['ean'] ?? 5,
      PRIX_ACHAT: headerMap['prix achat'] ?? 6,
      PRIX_VENTE: headerMap['prix vente'] ?? 7,
      BSR: headerMap['bsr'] ?? 8,
      BSR_PERCENT: headerMap['bsr %'] ?? 9,
      VENTES_MOIS: headerMap['ventes/mois'] ?? 10,
      FBM_PROFIT: headerMap['fbm profit'] ?? 11,
      FBM_ROI: headerMap['fbm roi'] ?? 12,
      FBA_PROFIT: headerMap['fba profit'] ?? 13,
      FBA_ROI: headerMap['fba roi'] ?? 14,
      PRIVATE_LABEL: headerMap['private label'] ?? 15,
      TAILLE: headerMap['taille'] ?? 16,
      MELTABLE: headerMap['meltable'] ?? 17,
      VARIATIONS: headerMap['variations'] ?? 18,
      VENDEURS: headerMap['vendeurs'] ?? 19,
      LIEN_AMAZON: headerMap['lien amazon'] ?? 20,
      LIEN_SOURCE: headerMap['lien source'] ?? 21,
    };

    console.log('📋 Column mapping:', COL);

    // Skip loading all existing alerts (too slow with 280k+ rows)
    // Instead, use upsert with ON CONFLICT to handle duplicates

    let insertedCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;
    const dataRows = lines.slice(1);

    // Log first row for debugging
    if (dataRows.length > 0) {
      const firstCols = parseCSVLine(dataRows[0]);
      console.log('📋 First row columns count:', firstCols.length);
      console.log('📋 Lien Amazon (col ' + COL.LIEN_AMAZON + '):', firstCols[COL.LIEN_AMAZON]);
      console.log('📋 Lien Source (col ' + COL.LIEN_SOURCE + '):', firstCols[COL.LIEN_SOURCE]);
    }

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
        const mappedSource = mapSourceName(source);
        
        // Get link values
        const amazonUrl = cols[COL.LIEN_AMAZON]?.trim() || null;
        const sourceUrl = cols[COL.LIEN_SOURCE]?.trim() || null;

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
          amazon_url: amazonUrl,
          source_url: sourceUrl,
          created_at: createdAt,
        };

        // Upsert: insert or update on conflict (ean, source_name)
        const { error: upsertError } = await supabaseClient
          .from('product_find_alerts')
          .upsert(alertData, { onConflict: 'ean,source_name', ignoreDuplicates: false });

        if (upsertError) {
          // If upsert fails (e.g. no unique constraint), try insert and ignore duplicates
          if (upsertError.code === '42P10' || upsertError.message?.includes('unique')) {
            skippedCount++;
          } else {
            console.error('❌ Insert error:', upsertError);
            skippedCount++;
          }
        } else {
          insertedCount++;
          console.log(`✅ Inserted: ${title.substring(0, 50)}... (${source} -> ${alertData.source_name}) Amazon: ${amazonUrl ? 'YES' : 'NO'}`);
        }
      } catch (rowError) {
        console.error('❌ Row processing error:', rowError);
        skippedCount++;
      }
    }

    console.log(`✅ Sync completed: ${insertedCount} inserted, ${updatedCount} updated, ${skippedCount} skipped`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sync completed`,
        stats: {
          total: dataRows.length,
          inserted: insertedCount,
          updated: updatedCount,
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
