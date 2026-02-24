import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHEET_ID = "1Lx-Rj-uT8thkTjxnW7Hxo8fu-xUpMdVNe8G7uCDSb24";

const parseImageFormula = (raw?: string | null): string | null => {
  if (!raw) return null;
  const trimmed = raw.trim();
  const imageMatch = trimmed.match(/=IMAGE\("([^"]+)"\)/i);
  if (imageMatch?.[1]) return imageMatch[1].trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use gviz JSON endpoint which preserves IMAGE() formulas (CSV strips them)
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=0`;
    console.log('Fetching gviz JSON from:', gvizUrl);

    const response = await fetch(gvizUrl, {
      headers: { 'Accept': 'application/json, text/plain' },
      redirect: 'follow',
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Sheet fetch failed:', response.status, body.substring(0, 500));
      throw new Error(`Failed to fetch sheet: ${response.status}`);
    }

    const rawText = await response.text();

    // Strip JSONP wrapper: google.visualization.Query.setResponse({...})
    const jsonMatch = rawText.match(/google\.visualization\.Query\.setResponse\((.+)\);?\s*$/s);
    if (!jsonMatch?.[1]) {
      console.error('Could not parse gviz response, first 500 chars:', rawText.substring(0, 500));
      throw new Error('Invalid gviz response format');
    }

    const gvizData = JSON.parse(jsonMatch[1]);
    const cols = gvizData.table?.cols || [];
    const rows = gvizData.table?.rows || [];

    console.log('Columns:', cols.map((c: any) => c.label).join(', '));
    console.log('Total rows:', rows.length);

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ success: true, products: [], count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get cell value: check v (value) first, then f (formatted/formula)
    const getCellValue = (cell: any): string | null => {
      if (!cell) return null;
      if (cell.v !== null && cell.v !== undefined) return String(cell.v);
      if (cell.f) return String(cell.f);
      return null;
    };

    // For IMAGE() formulas, the value is often null but formula is in f
    const getCellFormula = (cell: any): string | null => {
      if (!cell) return null;
      // f contains the formula or formatted value
      if (cell.f) return String(cell.f);
      if (cell.v !== null && cell.v !== undefined) return String(cell.v);
      return null;
    };

    const seen = new Set<string>();
    const products: any[] = [];

    for (const row of rows) {
      try {
        const cells = row.c || [];
        const productName = getCellValue(cells[0])?.trim();
        const ean = getCellValue(cells[1])?.trim() || null;
        const asin = getCellValue(cells[2])?.trim() || null;

        if (!productName) continue;

        const uniqueKey = ean || asin || productName;
        if (seen.has(uniqueKey)) continue;
        seen.add(uniqueKey);

        const iboodUrl = getCellValue(cells[20])?.trim() || null;

        // Column V (index 21) = Chart with IMAGE() formulas
        // Try both value and formula fields to extract the image URL
        const chartRaw = getCellFormula(cells[21]);
        const chartImageUrl = parseImageFormula(chartRaw);

        // Log first few for debugging
        if (products.length < 3) {
          console.log(`[${productName?.substring(0, 30)}] Chart raw: "${chartRaw}", parsed: "${chartImageUrl}"`);
        }

        const fallbackAmazonImage = asin
          ? `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SX679_.jpg`
          : null;

        products.push({
          id: uniqueKey,
          product_name: productName,
          ean,
          asin,
          bsr: getCellValue(cells[3])?.trim() || null,
          cost: getCellValue(cells[4])?.trim() || null,
          sale_price: getCellValue(cells[5])?.trim() || null,
          monthly_sales: getCellValue(cells[6])?.trim() || null,
          fba_profit: getCellValue(cells[7])?.trim() || null,
          fba_roi: getCellValue(cells[8])?.trim() || null,
          fbm_profit: getCellValue(cells[9])?.trim() || null,
          fbm_roi: getCellValue(cells[10])?.trim() || null,
          private_label: getCellValue(cells[11])?.trim() || null,
          size: getCellValue(cells[12])?.trim() || null,
          meltable: getCellValue(cells[13])?.trim() || null,
          variations: getCellValue(cells[14])?.trim() || null,
          sellers: getCellValue(cells[15])?.trim() || null,
          nb_vendors: getCellValue(cells[16])?.trim() || null,
          nb_fba: getCellValue(cells[17])?.trim() || null,
          nb_fbm: getCellValue(cells[18])?.trim() || null,
          amazon_url: getCellValue(cells[19])?.trim() || null,
          ibood_url: iboodUrl,
          chart_url: chartImageUrl || fallbackAmazonImage,
        });
      } catch (e) {
        console.error('Row parse error:', e);
      }
    }

    console.log(`✅ iBood: ${products.length} products loaded`);

    return new Response(
      JSON.stringify({ success: true, products, count: products.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ iBood sync error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
