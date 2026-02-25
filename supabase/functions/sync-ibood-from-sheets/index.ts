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

    const getCellValue = (cell: any): string | null => {
      if (!cell) return null;
      if (cell.v !== null && cell.v !== undefined) return String(cell.v);
      if (cell.f) return String(cell.f);
      return null;
    };

    const seen = new Set<string>();
    const products: any[] = [];

    // New column mapping (0-indexed):
    // 0  Nom du produit
    // 1  EAN
    // 2  ASIN
    // 3  BSR
    // 4  Cout
    // 5  Prix de vente
    // 6  Ventes/mois
    // 7  Profit FBA
    // 8  ROI FBA
    // 9  Profit FBM
    // 10 ROI FBM
    // 11 PL
    // 12 Nb variations
    // 13 IP
    // 14 Hazmat
    // 15 Meltable
    // 16 Adult
    // 17 Fragile
    // 18 Oversize
    // 19 Restriction
    // 20 Alertes brutes
    // 21 Nb vendeurs
    // 22 Nb FBA
    // 23 Nb FBM
    // 24 Lien Amazon
    // 25 Chart (=IMAGE(...))
    // 26 Lien iBood

    for (let i = 0; i < rows.length; i++) {
      try {
        const cells = rows[i].c || [];
        const productName = getCellValue(cells[0])?.trim();
        const ean = getCellValue(cells[1])?.trim() || null;
        const asin = getCellValue(cells[2])?.trim() || null;

        if (!productName) continue;
        if (productName === 'Nom du produit') continue;

        const uniqueKey = ean || asin || productName;
        if (seen.has(uniqueKey)) continue;
        seen.add(uniqueKey);

        // Column 25 = Chart — parse IMAGE() formula to get the Keepa URL
        const chartRaw = getCellValue(cells[25]);
        const chartUrl = parseImageFormula(chartRaw);

        if (products.length < 3) {
          console.log(`[${productName?.substring(0, 30)}] Chart raw: "${chartRaw}" → parsed: "${chartUrl}"`);
        }

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
          variations: getCellValue(cells[12])?.trim() || null,
          ip: getCellValue(cells[13])?.trim() || null,
          hazmat: getCellValue(cells[14])?.trim() || null,
          meltable: getCellValue(cells[15])?.trim() || null,
          adult: getCellValue(cells[16])?.trim() || null,
          fragile: getCellValue(cells[17])?.trim() || null,
          oversize: getCellValue(cells[18])?.trim() || null,
          restriction: getCellValue(cells[19])?.trim() || null,
          raw_alerts: getCellValue(cells[20])?.trim() || null,
          nb_vendors: getCellValue(cells[21])?.trim() || null,
          nb_fba: getCellValue(cells[22])?.trim() || null,
          nb_fbm: getCellValue(cells[23])?.trim() || null,
          amazon_url: getCellValue(cells[24])?.trim() || null,
          chart_url: chartUrl,
          ibood_url: getCellValue(cells[26])?.trim() || null,
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
