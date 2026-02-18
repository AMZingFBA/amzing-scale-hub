import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHEET_ID = "1kZqaYXEakpDfRKk37Tr3S7DXktoa8DytHpsiOAGvILo";
const SHEET_NAME = "Sheet1";

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

    if (lines.length < 2) {
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

      // Skip rows without essential data
      const canal = row["canal"] || "";
      const titre = row["titre produit"] || "";
      if (!canal || !titre) continue;

      products.push({
        id: row["id"] || `${i}`,
        date: row["date/heure"] || "",
        canal,
        source: row["source"] || "",
        titre,
        pays_achat: row["pays achat"] || "",
        pays_vente: row["pays vente"] || "",
        prix_achat: row["prix achat"] || "",
        prix_vente: row["prix vente"] || "",
        profit: row["profit"] || "",
        marge_profit: row["marge profit"] || "",
        roi: row["roi"] || "",
        ventes_amazon: row["ventes amazon"] || "",
        classement: row["classement"] || "",
        asin: row["asin"] || "",
        offres: row["offres"] || "",
        lien_sas: row["lien sas"] || "",
        lien_bbp: row["lien bbp"] || "",
        lien_keepa: row["lien keepa"] || "",
        lien_idealo: row["lien idealo"] || "",
        lien_amazon: row["lien amazon"] || "",
        image: row["image"] || "",
        note: row["note"] || "",
      });
    }

    console.log("✅ Parsed A2A products", { count: products.length });

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
