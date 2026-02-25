import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      throw new Error('Invalid gviz response format');
    }

    const gvizData = JSON.parse(jsonMatch[1]);
    const rows = gvizData.table?.rows || [];

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

    const cleanEan = (raw: string | null): string | null => {
      if (!raw) return null;
      const cleaned = raw.replace(/^EAN:\s*/i, '').trim();
      return cleaned.length >= 8 ? cleaned : null;
    };

    const seen = new Set<string>();
    const products: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        const cells = rows[i].c || [];
        const productName = getCellValue(cells[0])?.trim();
        if (!productName) continue;
        if (productName === 'Nom du produit') continue;

        const ean = cleanEan(getCellValue(cells[1])?.trim() || null);
        const asin = getCellValue(cells[2])?.trim() || null;

        const uniqueKey = `${asin || ''}_${productName}`;
        if (seen.has(uniqueKey)) continue;
        seen.add(uniqueKey);

        const chartRaw = getCellValue(cells[25]);
        const chartFromFormula = parseImageFormula(chartRaw);
        const chartUrl = chartFromFormula || (asin ? `https://graph.keepa.com/pricehistory.png?asin=${asin}&domain=fr` : null);

        products.push({
          id: `${i}_${asin || productName}`,
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

    console.log(`✅ iBood: ${products.length} products loaded from ${rows.length} rows`);

    // --- Auto-create alert in admin_alerts if product list changed ---
    if (products.length > 0) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Get admin user id
        const { data: adminRole } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin')
          .limit(1)
          .single();

        if (adminRole) {
          // Check if there's already a recent ibood alert (< 30 min) with the same count
          const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
          const { data: recentAlert } = await supabase
            .from('admin_alerts')
            .select('id, title')
            .eq('category', 'produits')
            .eq('subcategory', 'produits-ibood')
            .gte('created_at', thirtyMinAgo)
            .limit(1);

          // Only insert if no recent alert exists OR count changed
          const currentTitle = `🔥 ${products.length} produits iBood disponibles`;
          const alreadyExists = recentAlert && recentAlert.length > 0 && recentAlert[0].title === currentTitle;

          if (!alreadyExists) {
            // Build content with first 3 product names
            const preview = products.slice(0, 3).map(p => `• ${p.product_name}`).join('\n');
            const content = `${products.length} produits iBood analysés :\n${preview}${products.length > 3 ? `\n... et ${products.length - 3} autres` : ''}`;

            await supabase.from('admin_alerts').insert({
              admin_id: adminRole.user_id,
              title: currentTitle,
              content,
              category: 'produits',
              subcategory: 'produits-ibood',
              link_url: 'https://amzingfba.com/produits-ibood',
            });

            console.log('📢 New iBood alert created in admin_alerts');
          } else {
            console.log('⏭️ iBood alert already exists, skipping');
          }
        }
      } catch (alertErr) {
        console.error('Alert creation error (non-blocking):', alertErr);
      }
    }

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