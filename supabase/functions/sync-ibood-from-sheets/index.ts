import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHEET_ID = "1Lx-Rj-uT8thkTjxnW7Hxo8fu-xUpMdVNe8G7uCDSb24";
const SHEET_NAME = "Analyse SellerAmp";

const imageCache = new Map<string, { url: string | null; expiresAt: number }>();
const IMAGE_CACHE_TTL_MS = 30 * 60 * 1000;

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

const parseImageFormula = (raw?: string | null): string | null => {
  if (!raw) return null;
  const trimmed = raw.trim();
  const imageMatch = trimmed.match(/^=IMAGE\("([^"]+)"\)/i);
  if (imageMatch?.[1]) return imageMatch[1].trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return null;
};

const extractMetaImage = (html: string): string | null => {
  const patterns = [
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["'][^>]*>/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["'][^>]*>/i,
    /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["'][^>]*>/i,
    /<meta\s+content=["']([^"']+)["']\s+name=["']twitter:image["'][^>]*>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]?.trim()) return match[1].trim();
  }

  const iboodImageMatch = html.match(/https:\/\/image\.ibood\.io\/image\/[^"'\s<)]+/i);
  if (iboodImageMatch?.[0]) return iboodImageMatch[0].trim();

  return null;
};

const resolveIboodImage = async (iboodUrl?: string | null): Promise<string | null> => {
  if (!iboodUrl) return null;

  const now = Date.now();
  const cached = imageCache.get(iboodUrl);
  if (cached && cached.expiresAt > now) return cached.url;

  try {
    const pageResponse = await fetch(iboodUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AMZingBot/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: 'follow',
    });

    if (!pageResponse.ok) {
      imageCache.set(iboodUrl, { url: null, expiresAt: now + IMAGE_CACHE_TTL_MS });
      return null;
    }

    const html = await pageResponse.text();
    const imageUrl = extractMetaImage(html);
    imageCache.set(iboodUrl, { url: imageUrl, expiresAt: now + IMAGE_CACHE_TTL_MS });
    return imageUrl;
  } catch {
    imageCache.set(iboodUrl, { url: null, expiresAt: now + IMAGE_CACHE_TTL_MS });
    return null;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use export format which works better with shared sheets
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
    console.log('Fetching CSV from:', csvUrl);
    const response = await fetch(csvUrl, {
      headers: { 'Accept': 'text/csv' },
      redirect: 'follow',
    });
    if (!response.ok) {
      const body = await response.text();
      console.error('Sheet fetch failed:', response.status, body.substring(0, 500));
      throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    console.log('CSV first 500 chars:', csvText.substring(0, 500));
    console.log('CSV total length:', csvText.length);
    const lines = csvText.split('\n').filter(line => line.trim());
    console.log('Total lines:', lines.length);

    if (lines.length < 2) {
      return new Response(
        JSON.stringify({ success: true, products: [], count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Skip header row
    const dataRows = lines.slice(1);
    const seen = new Set<string>();
    const products: any[] = [];

    for (const line of dataRows) {
      try {
        const cols = parseCSVLine(line);
        const productName = cols[0]?.trim();
        const ean = cols[1]?.trim();
        const asin = cols[2]?.trim();

        if (!productName) continue;

        // Use EAN, ASIN or product name as unique key
        const uniqueKey = ean || asin || productName;
        if (seen.has(uniqueKey)) continue;
        seen.add(uniqueKey);

        const iboodUrl = cols[20]?.trim() || null;
        const imageFromSheet = parseImageFormula(cols[21]?.trim() || null);
        const resolvedImageUrl = imageFromSheet || await resolveIboodImage(iboodUrl);
        const fallbackAmazonImage = asin ? `https://images.amazon.com/images/P/${asin}.01._SX600_.jpg` : null;

        products.push({
          id: uniqueKey,
          product_name: productName,
          ean: ean || null,
          asin: asin || null,
          bsr: cols[3]?.trim() || null,
          cost: cols[4]?.trim() || null,
          sale_price: cols[5]?.trim() || null,
          monthly_sales: cols[6]?.trim() || null,
          fba_profit: cols[7]?.trim() || null,
          fba_roi: cols[8]?.trim() || null,
          fbm_profit: cols[9]?.trim() || null,
          fbm_roi: cols[10]?.trim() || null,
          private_label: cols[11]?.trim() || null,
          size: cols[12]?.trim() || null,
          meltable: cols[13]?.trim() || null,
          variations: cols[14]?.trim() || null,
          sellers: cols[15]?.trim() || null,
          nb_vendors: cols[16]?.trim() || null,
          nb_fba: cols[17]?.trim() || null,
          nb_fbm: cols[18]?.trim() || null,
          amazon_url: cols[19]?.trim() || null,
          ibood_url: iboodUrl,
          chart_url: resolvedImageUrl || fallbackAmazonImage,
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
