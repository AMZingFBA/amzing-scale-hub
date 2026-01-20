import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google Sheet ID from URL
const GOOGLE_SHEET_ID = '1PNOSwe9pE9qnCunJ4OyUlnJLT7zMoGPWJZvt4lNWDvw';
const SHEET_NAME = 'Sheet1'; // Default sheet name

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting Google Sheets sync for Qogita products...');

    // Fetch data from Google Sheets as CSV (public access)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`;
    console.log('📊 Fetching from:', csvUrl);
    
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    console.log('📄 Received CSV data, length:', csvText.length);

    // Parse CSV
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      console.log('⚠️ No data rows found in sheet');
      return new Response(
        JSON.stringify({ success: true, message: 'No data to sync', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse header row
    const headers = parseCSVRow(lines[0]);
    console.log('📋 Headers found:', headers);

    // Parse data rows
    const products = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVRow(lines[i]);
      if (values.length === 0) continue;

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header.toLowerCase().trim()] = values[index]?.trim() || '';
      });

      // Skip rows without EAN
      if (!row.ean) continue;

      const product = {
        ean: row.ean,
        timestamp: row.timestamp || new Date().toISOString(),
        qogita_price_ht: parseFloat(row.qogita_priceht || row.priceht || '0') || 0,
        qogita_price_ttc: parseFloat(row.qogita_pricettc || row.pricettc || '0') || 0,
        qogita_stock: row.qogita_stock ? parseInt(row.qogita_stock) : null,
        qogita_url: row.qogita_url || null,
        selleramp_bsr: row.selleramp_bsr || null,
        selleramp_sale_price: row.selleramp_saleprice ? parseFloat(row.selleramp_saleprice) : null,
        selleramp_sales: row.selleramp_sales || null,
        selleramp_sellers: row.selleramp_sellers || null,
        selleramp_variations: row.selleramp_variations || null,
        selleramp_url: row.selleramp_url || null,
        amazon_url: row.amazon_url || null,
        fbm_profit: parseFloat(row.fbm_profit || '0') || 0,
        fbm_roi: parseFloat(row.fbm_roi || '0') || 0,
        fba_profit: parseFloat(row.fba_profit || '0') || 0,
        fba_roi: parseFloat(row.fba_roi || '0') || 0,
        alerts: row.alerts ? row.alerts.split(',').map(a => a.trim()).filter(a => a) : [],
      };

      products.push(product);
    }

    console.log(`✅ Parsed ${products.length} products from Google Sheet`);

    if (products.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No valid products found', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upsert products (update if EAN exists, insert if not)
    let upsertedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      const { error } = await supabase
        .from('qogita_products')
        .upsert(product, {
          onConflict: 'ean',
          ignoreDuplicates: false,
        });

      if (error) {
        console.error(`❌ Error upserting EAN ${product.ean}:`, error.message);
        errorCount++;
      } else {
        upsertedCount++;
      }
    }

    console.log(`✅ Sync complete: ${upsertedCount} upserted, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${upsertedCount} products from Google Sheet`,
        count: upsertedCount,
        errors: errorCount,
        total: products.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Sync error:', errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to parse CSV row (handles quoted values)
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}
