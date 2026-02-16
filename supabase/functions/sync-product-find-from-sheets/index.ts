import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHEET_ID = "1fh85PAOtLXWUU-Q4SgZuYv7zwS9L1GD6yRe7yHYkscQ";
const SHEET_NAME = "Sheet1";

const mapSourceName = (source: string): string => {
  const trimmed = source?.trim() || '';
  if (trimmed.toLowerCase() === 'qogita') return 'Qogita2';
  return trimmed;
};

const parseDate = (dateStr: string): string => {
  if (!dateStr) return new Date().toISOString();
  try {
    const frenchMatch = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):?(\d{2})?/);
    if (frenchMatch) {
      const [, day, month, year, hour, minute, second = '00'] = frenchMatch;
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).toISOString();
    }
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date.toISOString();
  } catch (e) {
    console.error('Date parse error:', e);
  }
  return new Date().toISOString();
};

const parseNumber = (value: string | undefined | null): number | null => {
  if (!value || value === '' || value === '-' || value === 'N/A') return null;
  const cleaned = value.toString().replace(',', '.').replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔄 Starting incremental Product Find sync...");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get admin user ID
    const { data: adminRole } = await supabaseClient
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')
      .limit(1)
      .maybeSingle();
    
    const adminId = adminRole?.user_id;
    if (!adminId) throw new Error('No admin user found');

    // Load existing EAN+source pairs to skip duplicates
    const { data: existingAlerts, error: existingError } = await supabaseClient
      .from('product_find_alerts')
      .select('ean, source_name');

    if (existingError) {
      console.error('Error loading existing alerts:', existingError);
      throw new Error('Failed to load existing alerts');
    }

    const existingKeys = new Set(
      (existingAlerts || []).map(a => `${a.ean}__${a.source_name}`)
    );
    console.log(`📊 ${existingKeys.size} existing EAN+source pairs loaded`);

    // Fetch Google Sheet
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error(`Failed to fetch sheet: ${response.statusText}`);

    const csvText = await response.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return new Response(
        JSON.stringify({ success: true, message: 'No data rows found', stats: { total: 0, inserted: 0, skipped: 0 } }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers = parseCSVLine(lines[0]);
    const headerMap: Record<string, number> = {};
    headers.forEach((h, i) => { headerMap[h.toLowerCase().trim()] = i; });

    const COL = {
      DATE_HEURE: headerMap['date/heure'] ?? 1,
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

    const dataRows = lines.slice(1);
    let insertedCount = 0;
    let skippedCount = 0;

    // Collect new rows to batch insert
    const newAlerts: any[] = [];

    for (const line of dataRows) {
      try {
        const cols = parseCSVLine(line);
        const ean = cols[COL.EAN]?.trim();
        const source = cols[COL.SOURCE]?.trim();
        const title = cols[COL.TITRE_PRODUIT]?.trim();
        
        if (!ean || !source || !title) { skippedCount++; continue; }

        const mappedSource = mapSourceName(source);
        const key = `${ean}__${mappedSource}`;

        // Skip if already exists in DB
        if (existingKeys.has(key)) { skippedCount++; continue; }

        // Mark as seen to avoid duplicates within this batch
        existingKeys.add(key);

        newAlerts.push({
          admin_id: adminId,
          source_name: mappedSource,
          product_title: title,
          ean,
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
          created_at: parseDate(cols[COL.DATE_HEURE]?.trim()),
        });
      } catch (rowError) {
        console.error('❌ Row error:', rowError);
        skippedCount++;
      }
    }

    // Batch insert new alerts in chunks of 500
    if (newAlerts.length > 0) {
      const BATCH_SIZE = 500;
      for (let i = 0; i < newAlerts.length; i += BATCH_SIZE) {
        const batch = newAlerts.slice(i, i + BATCH_SIZE);
        const { error: insertError } = await supabaseClient
          .from('product_find_alerts')
          .insert(batch);

        if (insertError) {
          console.error(`❌ Batch insert error (${i}-${i + batch.length}):`, insertError);
          skippedCount += batch.length;
        } else {
          insertedCount += batch.length;
          console.log(`✅ Inserted batch: ${batch.length} rows`);
        }
      }
    }

    console.log(`✅ Sync done: ${insertedCount} new, ${skippedCount} skipped (total sheet rows: ${dataRows.length})`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sync completed`,
        stats: { total: dataRows.length, inserted: insertedCount, skipped: skippedCount },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Sync error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
