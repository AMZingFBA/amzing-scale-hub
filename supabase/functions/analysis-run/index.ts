import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Papa from 'https://esm.sh/papaparse@5.4.1';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SAS_BASE = 'https://sas.selleramp.com';
const ASIN_RE = /^B0[A-Z0-9]{8}$/;
const EAN_RE = /^\d{13}$/;

const COUNTRIES: Record<string, {
  name: string;
  keepa_mp: number;
  vat: number;
  dst_pct: number;
  domain: string;
  eur_rate: number;
}> = {
  FR: { name: 'France', keepa_mp: 4, vat: 1.20, dst_pct: 0.03, domain: 'amazon.fr', eur_rate: 1.0 },
  UK: { name: 'UK', keepa_mp: 2, vat: 1.20, dst_pct: 0.03, domain: 'amazon.co.uk', eur_rate: 1.158 },
  DE: { name: 'Allemagne', keepa_mp: 3, vat: 1.19, dst_pct: 0.03, domain: 'amazon.de', eur_rate: 1.0 },
  ES: { name: 'Espagne', keepa_mp: 9, vat: 1.21, dst_pct: 0.03, domain: 'amazon.es', eur_rate: 1.0 },
  IT: { name: 'Italie', keepa_mp: 8, vat: 1.22, dst_pct: 0.03, domain: 'amazon.it', eur_rate: 1.0 },
};

interface CookieJar { cookies: Record<string, string> }
interface AnalysisRow {
  asin: string | null;
  ean: string | null;
  price: number | null;
  name: string | null;
}

function mergeCookies(jar: CookieJar, headers: Headers) {
  const setCookies: string[] = typeof (headers as any).getSetCookie === 'function' ? (headers as any).getSetCookie() : [];
  if (setCookies.length === 0) {
    const single = headers.get('set-cookie');
    if (single) setCookies.push(single);
  }
  for (const sc of setCookies) {
    const kv = sc.split(';')[0]?.trim();
    if (!kv) continue;
    const idx = kv.indexOf('=');
    if (idx <= 0) continue;
    jar.cookies[kv.slice(0, idx)] = kv.slice(idx + 1);
  }
}

function getCookieHeader(jar: CookieJar): string {
  return Object.entries(jar.cookies).map(([k, v]) => `${k}=${v}`).join('; ');
}

async function fetchManual(url: string, options: RequestInit, jar: CookieJar, maxRedirects = 10): Promise<{ text: string; status: number; headers: Headers }> {
  const headers = new Headers((options.headers as HeadersInit) || {});
  const cookieHeader = getCookieHeader(jar);
  if (cookieHeader) headers.set('Cookie', cookieHeader);

  const resp = await fetch(url, { ...options, headers, redirect: 'manual' });
  mergeCookies(jar, resp.headers);

  if ([301, 302, 303, 307, 308].includes(resp.status) && maxRedirects > 0) {
    const location = resp.headers.get('location');
    if (location) {
      const absolute = location.startsWith('http') ? location : new URL(location, url).toString();
      const method = (resp.status === 307 || resp.status === 308) ? (options.method ?? 'GET') : 'GET';
      return fetchManual(absolute, { ...options, method, body: undefined }, jar, maxRedirects - 1);
    }
  }

  return {
    text: await resp.text().catch(() => ''),
    status: resp.status,
    headers: resp.headers,
  };
}

class SellerAmpClient {
  private uid: number | null = null;
  private token: string | null = null;
  private csrf: string | null = null;
  private jar: CookieJar = { cookies: {} };

  async login(email: string, password: string) {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    const loginPage = await fetchManual(`${SAS_BASE}/site/login`, { method: 'GET', headers: { 'User-Agent': ua } }, this.jar);
    const csrfMatch = loginPage.text.match(/name="csrf-token"\s+content="([^"]+)"/);
    if (!csrfMatch) throw new Error('SellerAmp login page CSRF token not found');

    const form = new URLSearchParams();
    form.set('_csrf-sasend', csrfMatch[1]);
    form.set('LoginForm[email]', email);
    form.set('LoginForm[password]', password);
    form.set('LoginForm[rememberMe]', '1');

    const auth = await fetchManual(
      `${SAS_BASE}/site/login`,
      {
        method: 'POST',
        headers: {
          'User-Agent': ua,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': `${SAS_BASE}/site/login`,
        },
        body: form.toString(),
      },
      this.jar,
    );

    const uid = auth.text.match(/"id":(\d+)/);
    const token = auth.text.match(/"api_token":"([^"]+)"/);
    const csrf = auth.text.match(/name="csrf-token"\s+content="([^"]+)"/);

    if (!uid || !token) throw new Error('SellerAmp login failed (invalid credentials or blocked)');

    this.uid = parseInt(uid[1]);
    this.token = token[1];
    this.csrf = csrf?.[1] ?? csrfMatch[1];
  }

  async lookupAsins(asins: string[], keepaMp: number): Promise<Record<string, any>> {
    if (!this.uid || !this.token || !this.csrf) throw new Error('SellerAmp not logged in');
    const batchSize = 100;
    const batches: string[][] = [];
    for (let i = 0; i < asins.length; i += batchSize) batches.push(asins.slice(i, i + batchSize));

    const merged: Record<string, any> = {};
    for (const batch of batches) {
      const one = await this.lookupBatch(batch, keepaMp);
      Object.assign(merged, one);
    }
    return merged;
  }

  private async lookupBatch(asins: string[], keepaMp: number): Promise<Record<string, any>> {
    const payload = {
      u: this.uid,
      api_token: this.token,
      asin: asins[0],
      sl_asin: '',
      action: 506,
      slid: 0,
      payload: {
        keepa_mp_id: keepaMp,
        asin_list: asins,
      },
    };

    const form = new URLSearchParams();
    form.set('data', JSON.stringify(payload));

    const call = await fetchManual(
      `${SAS_BASE}/api/do`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': this.csrf!,
          'Referer': `${SAS_BASE}/sas/lookup`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: form.toString(),
      },
      this.jar,
    );

    let result: any = {};
    try {
      result = JSON.parse(call.text);
    } catch {
      return {};
    }

    const out: Record<string, any> = {};
    for (const asin of asins) {
      const kpl = result?.kpls?.[asin];
      if (!kpl || typeof kpl !== 'object') continue;

      const cur = kpl.current || {};
      const pNew = parseInt(cur['18'] ?? '-1');
      const pAmz = parseInt(cur['0'] ?? '-1');
      const pFba = parseInt(cur['7'] ?? '-1');
      let p = -1;
      for (const value of [pNew, pAmz, pFba]) {
        if (value > 0 && (p < 0 || value < p)) p = value;
      }
      if (p <= 0) continue;

      const fbaFeeRaw = kpl.fba_fees_pick_and_pack_fee;
      const fbaFee = fbaFeeRaw && fbaFeeRaw > 0 ? fbaFeeRaw / 100 : null;

      let refPct = 0.15;
      try {
        const refRule = kpl.referral_fee_rule || '1,0.15';
        refPct = parseFloat(String(refRule).split(',')[1]);
      } catch {
        refPct = 0.15;
      }

      const closing = parseFloat(kpl.closing_fee || '0') || 0;
      const bsr = parseInt(cur['3'] || '0') || 0;
      const est = kpl.estimated_sales;
      const salesMo = (est && typeof est === 'object') ? (est.monthly || 0) : 0;

      const alerts: string[] = [];
      if (kpl.private_label) alerts.push('PL');
      if (kpl.ip_issue) alerts.push('IP');
      if (kpl.containsHazardousMaterials) alerts.push('Hazmat');
      if (kpl.containsLithiumBattery) alerts.push('Lithium');
      if (kpl.meltable) alerts.push('Meltable');
      if (kpl.oversize) alerts.push('Oversize');

      out[asin] = {
        prix_local: p / 100,
        ref_pct: refPct,
        fba_fee_local: fbaFee,
        closing_local: closing,
        bsr,
        sales_mo: salesMo,
        fba_sellers: kpl.stats_offer_count_fba || 0,
        fbm_sellers: kpl.stats_offer_count_fbm || 0,
        category: kpl.category_name || '',
        n_variations: Array.isArray(kpl.variations) ? kpl.variations.length : 0,
        alerts: alerts.join(', '),
      };
    }

    return out;
  }
}

function parsePrice(value: unknown): number | null {
  if (value == null) return null;
  let s = String(value).trim();
  if (!s) return null;
  s = s.replace(/[€$£\s]/g, '');
  if (s.includes(',') && s.includes('.')) s = s.replace(/,/g, '');
  else if (s.includes(',')) s = s.replace(/,/g, '.');
  const v = Number(s);
  if (!Number.isFinite(v) || v <= 0) return null;
  return v;
}

function looksLikeDataCell(v: unknown): boolean {
  const s = String(v ?? '').trim();
  if (!s) return false;
  if (ASIN_RE.test(s.toUpperCase())) return true;
  if (EAN_RE.test(s)) return true;
  const p = parsePrice(s);
  return p != null && p >= 0.01 && p <= 50000;
}

function detectColumns(headers: string[], rawRows: Record<string, unknown>[]) {
  const mapping: Record<string, string> = {};
  const lowerMap = Object.fromEntries(headers.map((h) => [h, h.toLowerCase().trim()]));

  const asinKeywords = ['asin'];
  const eanKeywords = ['ean', 'gtin', 'barcode', 'code barre', 'code-barre'];
  const priceKeywords = ['prix', 'price', 'cout', 'cost', 'ttc', 'prix ttc', 'prix achat', 'buy price', 'purchase'];
  const nameKeywords = ['nom', 'name', 'titre', 'title', 'produit', 'product', 'description', 'designation', 'libelle'];

  for (const h of headers) {
    const l = lowerMap[h];
    if (!mapping.asin && asinKeywords.some((k) => k === l || l.includes(k))) mapping.asin = h;
    if (!mapping.ean && eanKeywords.some((k) => k === l || l.includes(k))) mapping.ean = h;
    if (!mapping.price && priceKeywords.some((k) => k === l || l.includes(k))) mapping.price = h;
    if (!mapping.name && nameKeywords.some((k) => k === l || l.includes(k))) mapping.name = h;
  }

  const sample = rawRows.slice(0, 20);
  for (const h of headers) {
    if (Object.values(mapping).includes(h)) continue;
    const values = sample.map((r) => String(r[h] ?? '').trim()).filter(Boolean);
    if (!values.length) continue;

    if (!mapping.asin) {
      const count = values.filter((v) => ASIN_RE.test(v.toUpperCase())).length;
      if (count > values.length * 0.5) {
        mapping.asin = h;
        continue;
      }
    }

    if (!mapping.ean) {
      const count = values.filter((v) => EAN_RE.test(v)).length;
      if (count > values.length * 0.5) {
        mapping.ean = h;
        continue;
      }
    }

    if (!mapping.price) {
      const parsed = values.map((v) => parsePrice(v)).filter((n): n is number => n != null);
      if (parsed.length > values.length * 0.5 && Math.max(...parsed) <= 10000) {
        mapping.price = h;
      }
    }
  }

  return mapping;
}

function parseCsv(bytes: Uint8Array): { rows: Record<string, unknown>[]; headers: string[] } {
  const text = new TextDecoder('utf-8').decode(bytes);

  // Header detection first pass
  const preview = Papa.parse<string[]>(text, {
    preview: 2,
    skipEmptyLines: true,
  });
  const first = (preview.data?.[0] || []) as unknown[];
  const isData = first.some(looksLikeDataCell);

  if (isData) {
    const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
    const maxLen = Math.max(...(parsed.data as string[][]).map((r) => r.length), 0);
    const headers = Array.from({ length: maxLen }, (_, i) => `col_${i}`);
    const rows = (parsed.data as string[][]).map((line) => {
      const r: Record<string, unknown> = {};
      for (let i = 0; i < headers.length; i++) r[headers[i]] = line[i] ?? '';
      return r;
    });
    return { rows, headers };
  }

  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h, idx) => (h && h.trim()) || `col_${idx}`,
  });
  const headers = parsed.meta.fields || [];
  return { rows: parsed.data as Record<string, unknown>[], headers };
}

function parseExcel(bytes: Uint8Array): { rows: Record<string, unknown>[]; headers: string[] } {
  const wb = XLSX.read(bytes, { type: 'array' });
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];
  const allRows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, raw: false, defval: '' }) as any[][];
  if (!allRows.length) return { rows: [], headers: [] };

  const first = allRows[0];
  const isData = first.some(looksLikeDataCell);

  if (isData) {
    const headers = Array.from({ length: first.length }, (_, i) => `col_${i}`);
    const rows = allRows.map((line) => {
      const r: Record<string, unknown> = {};
      for (let i = 0; i < headers.length; i++) r[headers[i]] = line[i] ?? '';
      return r;
    });
    return { rows, headers };
  }

  const headers = first.map((h, i) => (String(h || '').trim()) || `col_${i}`);
  const rows = allRows.slice(1).map((line) => {
    const r: Record<string, unknown> = {};
    for (let i = 0; i < headers.length; i++) r[headers[i]] = line[i] ?? '';
    return r;
  });
  return { rows, headers };
}

function normalizeRows(
  rawRows: Record<string, unknown>[],
  headers: string[],
  frontendMapping?: Record<string, string> | null,
): { rows: AnalysisRow[]; mapping: Record<string, string> } {
  let mapping: Record<string, string> = {};

  if (frontendMapping && (frontendMapping.asin || frontendMapping.ean || frontendMapping.price)) {
    for (const key of ['asin', 'ean', 'price'] as const) {
      const col = frontendMapping[key];
      if (col && headers.includes(col)) mapping[key] = col;
    }
    const auto = detectColumns(headers, rawRows);
    if (auto.name) mapping.name = auto.name;
    if (!mapping.asin && !mapping.ean) mapping = auto;
  } else {
    mapping = detectColumns(headers, rawRows);
  }

  if (!mapping.asin && !mapping.ean) {
    throw new Error('Could not detect ASIN or EAN column');
  }
  if (!mapping.price) {
    throw new Error('Could not detect price column');
  }

  const rows: AnalysisRow[] = [];
  for (const raw of rawRows) {
    const asinRaw = mapping.asin ? String(raw[mapping.asin] ?? '').trim().toUpperCase() : '';
    const eanRaw = mapping.ean ? String(raw[mapping.ean] ?? '').trim() : '';

    const row: AnalysisRow = {
      asin: ASIN_RE.test(asinRaw) ? asinRaw : null,
      ean: EAN_RE.test(eanRaw) ? eanRaw : null,
      price: parsePrice(mapping.price ? raw[mapping.price] : null),
      name: mapping.name ? (String(raw[mapping.name] ?? '').trim() || null) : null,
    };

    if ((row.asin || row.ean) && row.price != null) rows.push(row);
  }

  return { rows, mapping };
}

function analyzeProduct(productData: any, buyPrice: number, countryCode: string) {
  const country = COUNTRIES[countryCode];
  const sellEur = productData.prix_local * country.eur_rate;
  const refPct = productData.ref_pct;
  const closingEur = Math.round(productData.closing_local * country.eur_rate * 100) / 100;
  const commDstEur = Math.round(sellEur * refPct * (1 + country.dst_pct) * 100) / 100;
  const commissionEur = Math.round(sellEur * refPct * 100) / 100;

  const marginHt = (sellEur - buyPrice) / country.vat;

  const feesFbm = commDstEur + closingEur;
  const profitFbm = Math.round((marginHt - feesFbm) * 100) / 100;
  const roiFbm = buyPrice > 0 ? Math.round((profitFbm / buyPrice) * 10000) / 100 : 0;

  const fbaLocal = productData.fba_fee_local;
  const fbaEur = fbaLocal != null ? Math.round(fbaLocal * country.eur_rate * 100) / 100 : null;

  let profitFba: number | null = null;
  let roiFba: number | null = null;
  if (fbaEur != null) {
    const fbaDst = Math.round(fbaEur * country.dst_pct * 100) / 100;
    const feesFba = commDstEur + fbaEur + fbaDst + closingEur;
    profitFba = Math.round((marginHt - feesFba) * 100) / 100;
    roiFba = buyPrice > 0 ? Math.round((profitFba / buyPrice) * 10000) / 100 : 0;
  }

  return {
    sell_price: Math.round(sellEur * 100) / 100,
    profit_fba: profitFba,
    roi_fba: roiFba,
    profit_fbm: profitFbm,
    roi_fbm: roiFbm,
    bsr: productData.bsr,
    sales_monthly: productData.sales_mo,
    fba_sellers: productData.fba_sellers,
    fbm_sellers: productData.fbm_sellers,
    category: productData.category,
    variations: productData.n_variations,
    alerts: productData.alerts,
    commission_pct: Math.round(refPct * 10000) / 100,
    fba_fee: fbaEur,
    country_code: countryCode,
  };
}

function passesFilters(r: any, f: Record<string, any>): boolean {
  if (f.min_roi_fba != null && r.roi_fba != null && r.roi_fba < f.min_roi_fba) return false;
  if (f.min_profit_fba != null && r.profit_fba != null && r.profit_fba < f.min_profit_fba) return false;
  if (f.min_roi_fbm != null && r.roi_fbm != null && r.roi_fbm < f.min_roi_fbm) return false;
  if (f.min_profit_fbm != null && r.profit_fbm != null && r.profit_fbm < f.min_profit_fbm) return false;

  if (f.min_sales_monthly != null && (r.sales_monthly || 0) < f.min_sales_monthly) return false;
  if (f.max_sellers_fba != null && (r.fba_sellers || 0) > f.max_sellers_fba) return false;
  if (f.max_sellers_fbm != null && (r.fbm_sellers || 0) > f.max_sellers_fbm) return false;

  if (f.max_bsr != null) {
    const bsr = r.bsr || 0;
    if (bsr > f.max_bsr || bsr <= 0) return false;
  }
  if (f.min_bsr != null && (r.bsr || 0) < f.min_bsr) return false;

  const excludeAlerts = Array.isArray(f.exclude_alerts) ? f.exclude_alerts : [];
  if (excludeAlerts.length && r.alerts) {
    const productAlerts = String(r.alerts).split(',').map((a) => a.trim());
    for (const alert of excludeAlerts) {
      if (productAlerts.includes(alert)) return false;
    }
  }

  if (f.max_variations != null && (r.variations || 0) > f.max_variations) return false;
  if (f.min_sell_price != null && r.sell_price != null && r.sell_price < f.min_sell_price) return false;
  if (f.max_sell_price != null && r.sell_price != null && r.sell_price > f.max_sell_price) return false;

  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { filePath, fileName, filters, columnMapping, userId } = await req.json();
    if (!filePath || !fileName || !userId) {
      return new Response(JSON.stringify({ error: 'filePath, fileName, and userId are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const user = { id: userId };

    const countryCode = filters?.country || 'FR';
    const country = COUNTRIES[countryCode];
    if (!country) {
      return new Response(JSON.stringify({ error: `Unknown country: ${countryCode}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: created, error: createErr } = await admin
      .from('file_analyses')
      .insert({
        user_id: user.id,
        file_path: filePath,
        file_name: fileName,
        filters: filters || {},
        column_mapping: columnMapping || null,
        status: 'processing',
      })
      .select('id')
      .single();

    if (createErr || !created) {
      throw new Error(`Failed to create analysis row: ${createErr?.message || 'unknown error'}`);
    }

    const analysisId = created.id as string;
    const startedAt = Date.now();

    try {
      const download = await admin.storage.from('file-uploads').download(filePath);
      if (download.error || !download.data) {
        throw new Error(`Unable to download file from storage: ${download.error?.message || 'missing file'}`);
      }

      const bytes = new Uint8Array(await download.data.arrayBuffer());

      const ext = String(fileName).toLowerCase().split('.').pop();
      let parsed: { rows: Record<string, unknown>[]; headers: string[] };
      if (ext === 'csv') parsed = parseCsv(bytes);
      else if (ext === 'xlsx' || ext === 'xls') parsed = parseExcel(bytes);
      else throw new Error(`Unsupported file format: .${ext}`);

      if (!parsed.rows.length || !parsed.headers.length) {
        throw new Error('File is empty or has no data rows');
      }

      const normalized = normalizeRows(parsed.rows, parsed.headers, columnMapping || null);
      const rows = normalized.rows;
      const mapping = normalized.mapping;

      const totalRows = rows.length;
      if (!totalRows) {
        throw new Error('No valid rows found in file (need ASIN/EAN + price)');
      }

      const uniqueAsins: string[] = [];
      const seen = new Set<string>();
      for (const row of rows) {
        if (row.asin && !seen.has(row.asin)) {
          seen.add(row.asin);
          uniqueAsins.push(row.asin);
        }
      }

      if (!uniqueAsins.length) {
        throw new Error('No ASINs found in file. EAN-only lookup is not yet supported.');
      }

      const sasEmail = Deno.env.get('SAS_EMAIL');
      const sasPassword = Deno.env.get('SAS_PASSWORD');
      if (!sasEmail || !sasPassword) throw new Error('Missing SAS_EMAIL or SAS_PASSWORD env vars');

      const sas = new SellerAmpClient();
      await sas.login(sasEmail, sasPassword);
      const sasData = await sas.lookupAsins(uniqueAsins, country.keepa_mp);

      const allResults: any[] = [];
      for (const row of rows) {
        if (!row.asin || !sasData[row.asin]) continue;
        const product = sasData[row.asin];

        const analysis = analyzeProduct(product, row.price!, countryCode);
        allResults.push({
          asin: row.asin,
          ean: row.ean,
          product_name: row.name || product.category || '',
          buy_price: row.price,
          amazon_url: `https://www.${country.domain}/dp/${row.asin}`,
          ...analysis,
        });
      }

      const filtered = allResults.filter((r) => passesFilters(r, filters || {}));

      if (filtered.length > 0) {
        const batchSize = 500;
        for (let i = 0; i < filtered.length; i += batchSize) {
          const batch = filtered.slice(i, i + batchSize).map((r) => ({
            analysis_id: analysisId,
            asin: r.asin,
            ean: r.ean,
            product_name: r.product_name,
            buy_price: r.buy_price,
            sell_price: r.sell_price,
            profit_fba: r.profit_fba,
            roi_fba: r.roi_fba,
            profit_fbm: r.profit_fbm,
            roi_fbm: r.roi_fbm,
            bsr: r.bsr,
            sales_monthly: r.sales_monthly,
            fba_sellers: r.fba_sellers,
            fbm_sellers: r.fbm_sellers,
            category: r.category,
            variations: r.variations,
            alerts: r.alerts,
            commission_pct: r.commission_pct,
            fba_fee: r.fba_fee,
            country_code: r.country_code,
            amazon_url: r.amazon_url,
          }));

          const insertRes = await admin.from('analysis_results').insert(batch);
          if (insertRes.error) throw new Error(`Failed inserting results: ${insertRes.error.message}`);
        }
      }

      const durationMs = Date.now() - startedAt;
      const { error: completeErr } = await admin
        .from('file_analyses')
        .update({
          status: 'completed',
          results_count: filtered.length,
          total_rows: totalRows,
          column_mapping: mapping,
          processing_duration_ms: durationMs,
          updated_at: new Date().toISOString(),
        })
        .eq('id', analysisId);

      if (completeErr) throw new Error(`Failed to mark completed: ${completeErr.message}`);

      return new Response(JSON.stringify({ success: true, analysisId, count: filtered.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (processErr: any) {
      await admin
        .from('file_analyses')
        .update({
          status: 'error',
          error_message: String(processErr?.message || processErr).slice(0, 500),
          updated_at: new Date().toISOString(),
        })
        .eq('id', analysisId);

      throw processErr;
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
