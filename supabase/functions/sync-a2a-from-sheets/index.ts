import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHEET_ID = "1kZqaYXEakpDfRKk37Tr3S7DXktoa8DytHpsiOAGvILo";
const SHEET_NAME = "Sheet1";

// Column indices (0-based) matching the Google Sheet structure A-W
const COL = {
  ID: 0,
  DATE: 1,
  CANAL: 2,
  SOURCE: 3,
  TITRE: 4,
  PAYS_ACHAT: 5,
  PAYS_VENTE: 6,
  PRIX_ACHAT: 7,
  PRIX_VENTE: 8,
  LIEN_AMAZON_ACHAT: 9,
  LIEN_AMAZON_VENTE: 10,
  PROFIT: 11,
  MARGE: 12,
  ROI: 13,
  VENTES: 14,
  CLASSEMENT: 15,
  ASIN: 16,
  OFFRES: 17,
  LIEN_SAS: 18,
  LIEN_BBP: 19,
  LIEN_KEEPA: 20,
  LIEN_IDEALO: 21,
  LIEN_AMAZON: 22,
  IMAGE: 23,
  NOTE: 24,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔄 Fetching A2A products from Google Sheet...");

    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;
    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    const lines = csvText.split("\n").filter((line) => line.trim());

    // First line is a title row ("Alertes Smile - France Europe"), skip it
    // Data starts from line index 1 (no real header row with column names)
    const products: any[] = [];
    const seenIds = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVRow(lines[i]);
      if (values.length < 5) continue;

      const get = (idx: number) => (values[idx] ?? "").trim();

      const canal = get(COL.CANAL);
      const titre = get(COL.TITRE);
      const id = get(COL.ID) || `row-${i}`;

      // Skip empty rows
      if (!canal && !titre) continue;

      // Deduplicate by ID
      if (seenIds.has(id)) continue;
      seenIds.add(id);

      products.push({
        id,
        date: get(COL.DATE),
        canal,
        source: get(COL.SOURCE),
        titre,
        pays_achat: get(COL.PAYS_ACHAT),
        pays_vente: get(COL.PAYS_VENTE),
        prix_achat: get(COL.PRIX_ACHAT),
        prix_vente: get(COL.PRIX_VENTE),
        lien_amazon_achat: get(COL.LIEN_AMAZON_ACHAT),
        lien_amazon_vente: get(COL.LIEN_AMAZON_VENTE),
        profit: get(COL.PROFIT),
        marge_profit: get(COL.MARGE),
        roi: get(COL.ROI),
        ventes_amazon: get(COL.VENTES),
        classement: get(COL.CLASSEMENT),
        asin: get(COL.ASIN),
        offres: get(COL.OFFRES),
        lien_sas: get(COL.LIEN_SAS),
        lien_bbp: get(COL.LIEN_BBP),
        lien_keepa: get(COL.LIEN_KEEPA),
        lien_idealo: get(COL.LIEN_IDEALO),
        lien_amazon: get(COL.LIEN_AMAZON),
        image: get(COL.IMAGE),
        note: get(COL.NOTE),
      });
    }

    console.log("✅ Parsed A2A products", { count: products.length, duplicatesRemoved: seenIds.size !== lines.length - 1 });

    return new Response(
      JSON.stringify({ success: true, products, count: products.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ A2A Sheet read error:", errorMessage);

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
