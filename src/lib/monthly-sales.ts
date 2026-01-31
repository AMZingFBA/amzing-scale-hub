/**
 * Normalise les formats de ventes mensuelles (SellerAmp) vers un nombre.
 * Objectif: une valeur fiable pour le filtrage.
 *
 * Exemples gérés:
 * - "30+/mo" -> 30
 * - "100+" -> 100
 * - "2k+" / "2.5k" / "2,5k" -> 2000 / 2500
 * - "50-100" -> 50 (borne basse)
 */

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const asNumber = Number(trimmed.replace(',', '.'));
    return Number.isFinite(asNumber) ? asNumber : null;
  }
  return null;
};

export const parseMonthlySalesValue = (salesInput: unknown): number => {
  if (typeof salesInput !== 'string') return 0;
  const raw = salesInput.trim();
  if (!raw || raw === 'Unknown' || raw === 'N/A') return 0;

  const normalized = raw.toLowerCase().replace(/\s+/g, '');

  // Handle "2k+", "2.5k", "2,5k" (thousands)
  const kMatch = normalized.match(/(\d+(?:[\.,]\d+)?)k/);
  if (kMatch) {
    const n = Number(kMatch[1].replace(',', '.'));
    return Number.isFinite(n) ? Math.floor(n * 1000) : 0;
  }

  // Handle ranges like "50-100" -> take lower bound
  const rangeMatch = normalized.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) {
    const n = Number(rangeMatch[1]);
    return Number.isFinite(n) ? n : 0;
  }

  // Handle formats like "30+/mo", "100+", "29/mo"
  const numMatch = normalized.match(/(\d+)/);
  const n = numMatch ? Number(numMatch[1]) : 0;
  return Number.isFinite(n) ? n : 0;
};

/**
 * Retourne une valeur sûre pour filtrer:
 * - si salesValueCandidate est non-numérique (ex: "Unknown") ou NaN, on ignore et on re-parse le texte.
 * - si au final ce n'est pas un nombre fini, on renvoie 0.
 */
export const getMonthlySalesValue = (
  salesValueCandidate: unknown,
  salesTextCandidate: unknown
): number => {
  // Priority: trust the displayed text (ex: "30+/mo") to avoid mismatches.
  const parsedFromText = parseMonthlySalesValue(
    typeof salesTextCandidate === 'string'
      ? salesTextCandidate
      : salesTextCandidate == null
        ? ''
        : String(salesTextCandidate)
  );
  if (parsedFromText > 0) return parsedFromText;

  // Fallback: use provided numeric value only if the text is missing/unknown.
  const direct = toFiniteNumber(salesValueCandidate);
  if (direct !== null) return Math.floor(direct);

  return 0;
};
