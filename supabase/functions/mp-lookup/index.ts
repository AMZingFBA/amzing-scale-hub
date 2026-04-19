import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SAS_BASE = 'https://sas.selleramp.com';

const COUNTRIES: Record<string, {
  name: string; keepa_mp: number; vat: number; domain: string;
  eur_rate: number; dst_pct: number; dst_on_fba: boolean;
}> = {
  FR: { name: 'France',    keepa_mp: 4, vat: 1.20, domain: 'amazon.fr',    eur_rate: 1.0,   dst_pct: 0.03, dst_on_fba: true  },
  UK: { name: 'UK',        keepa_mp: 2, vat: 1.20, domain: 'amazon.co.uk', eur_rate: 1.158, dst_pct: 0.02, dst_on_fba: true  },
  DE: { name: 'Allemagne', keepa_mp: 3, vat: 1.19, domain: 'amazon.de',    eur_rate: 1.0,   dst_pct: 0.0,  dst_on_fba: false },
  ES: { name: 'Espagne',   keepa_mp: 9, vat: 1.21, domain: 'amazon.es',    eur_rate: 1.0,   dst_pct: 0.03, dst_on_fba: false },
  IT: { name: 'Italie',    keepa_mp: 8, vat: 1.22, domain: 'amazon.it',    eur_rate: 1.0,   dst_pct: 0.03, dst_on_fba: false },
};

// ─── Cookie-aware fetch ───────────────────────────────────────────────────────

interface CookieJar { cookies: Record<string, string> }

function mergeCookies(jar: CookieJar, headers: Headers) {
  const setCookies: string[] =
    typeof (headers as any).getSetCookie === 'function'
      ? (headers as any).getSetCookie()
      : [];
  if (setCookies.length === 0) {
    const sc = headers.get('set-cookie');
    if (sc) setCookies.push(sc);
  }
  for (const sc of setCookies) {
    const directive = sc.split(';')[0].trim();
    const idx = directive.indexOf('=');
    if (idx > 0) {
      jar.cookies[directive.substring(0, idx).trim()] = directive.substring(idx + 1).trim();
    }
  }
}

function getCookieHeader(jar: CookieJar): string {
  return Object.entries(jar.cookies).map(([k, v]) => `${k}=${v}`).join('; ');
}

async function fetchManual(
  url: string,
  options: RequestInit,
  jar: CookieJar,
  maxRedirects = 10,
): Promise<{ text: string; status: number; headers: Headers }> {
  const headers = new Headers((options.headers as HeadersInit) || {});
  const cookieHdr = getCookieHeader(jar);
  if (cookieHdr) headers.set('Cookie', cookieHdr);

  const resp = await fetch(url, { ...options, headers, redirect: 'manual' });
  mergeCookies(jar, resp.headers);

  if ([301, 302, 303, 307, 308].includes(resp.status) && maxRedirects > 0) {
    const location = resp.headers.get('location');
    if (location) {
      const absolute = location.startsWith('http') ? location : new URL(location, url).toString();
      const newMethod = (resp.status === 307 || resp.status === 308) ? (options.method ?? 'GET') : 'GET';
      return fetchManual(absolute, { ...options, method: newMethod, body: undefined }, jar, maxRedirects - 1);
    }
  }

  const text = await resp.text().catch(() => '');
  return { text, status: resp.status, headers: resp.headers };
}

// ─── SellerAmp client ─────────────────────────────────────────────────────────

class SellerAmpClient {
  private uid: number | null = null;
  private token: string | null = null;
  private csrf: string | null = null;
  private jar: CookieJar = { cookies: {} };

  async login(email: string, password: string) {
    const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

    // 1. GET login page → extract CSRF
    const { text: loginHtml } = await fetchManual(
      `${SAS_BASE}/site/login`,
      { method: 'GET', headers: { 'User-Agent': UA } },
      this.jar,
    );
    const csrfMatch = loginHtml.match(/name="csrf-token"\s+content="([^"]+)"/);
    if (!csrfMatch) throw new Error('Login page: CSRF token not found');
    const csrf = csrfMatch[1];

    // 2. POST login form
    const form = new URLSearchParams();
    form.set('_csrf-sasend', csrf);
    form.set('LoginForm[email]', email);
    form.set('LoginForm[password]', password);
    form.set('LoginForm[rememberMe]', '1');

    const { text: afterLogin } = await fetchManual(
      `${SAS_BASE}/site/login`,
      {
        method: 'POST',
        headers: {
          'User-Agent': UA,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': `${SAS_BASE}/site/login`,
        },
        body: form.toString(),
      },
      this.jar,
    );

    const uidMatch = afterLogin.match(/"id":(\d+)/);
    const tokenMatch = afterLogin.match(/"api_token":"([^"]+)"/);
    const csrf2Match = afterLogin.match(/name="csrf-token"\s+content="([^"]+)"/);

    if (!uidMatch || !tokenMatch) throw new Error('SellerAmp login failed — check credentials');

    this.uid = parseInt(uidMatch[1]);
    this.token = tokenMatch[1];
    this.csrf = csrf2Match?.[1] ?? csrf;
    console.log(`[SAS] Logged in uid=${this.uid}`);
  }

  async lookupBatch(asins: string[], keepaMp: number): Promise<Record<string, any>> {
    if (!this.uid || !this.token || !this.csrf) throw new Error('Not logged in');

    const payload = {
      u: this.uid,
      api_token: this.token,
      asin: asins[0],
      sl_asin: '',
      action: 506,
      slid: 0,
      payload: { keepa_mp_id: keepaMp, asin_list: asins },
    };

    const form = new URLSearchParams();
    form.set('data', JSON.stringify(payload));

    const { text } = await fetchManual(
      `${SAS_BASE}/api/do`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': this.csrf,
          'Referer': `${SAS_BASE}/sas/lookup`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: form.toString(),
      },
      this.jar,
    );

    let result: any;
    try { result = JSON.parse(text); } catch { return {}; }
    return this.parseResponse(result, asins);
  }

  private parseResponse(result: any, asins: string[]): Record<string, any> {
    const dataMap: Record<string, any> = {};

    for (const asin of asins) {
      const kpl = result?.kpls?.[asin];
      if (!kpl || typeof kpl !== 'object') continue;

      const cur = kpl.current || {};
      const prixNew = parseInt(cur['18'] ?? '-1');
      const prixAmz = parseInt(cur['0'] ?? '-1');
      const prixFba = parseInt(cur['7'] ?? '-1');

      let prix = -1;
      for (const p of [prixNew, prixAmz, prixFba]) {
        if (p > 0 && (prix < 0 || p < prix)) prix = p;
      }
      if (prix <= 0) continue;

      const fbaFeeRaw = kpl.fba_fees_pick_and_pack_fee;
      const fbaFee = fbaFeeRaw && fbaFeeRaw > 0 ? fbaFeeRaw / 100 : null;

      let refPct = 0.15;
      try {
        const refRule = kpl.referral_fee_rule || '1,0.15';
        refPct = parseFloat(refRule.split(',')[1]);
      } catch { /* keep default */ }

      const closing = parseFloat(kpl.closing_fee || '0') || 0;
      const bsr = parseInt(cur['3'] || '0') || 0;
      const est = kpl.estimated_sales;
      const salesMo = typeof est === 'object' && est ? (est.monthly || 0) : 0;

      const fbaS = kpl.stats_offer_count_fba || 0;
      const fbmS = kpl.stats_offer_count_fbm || 0;
      const cat = kpl.category_name || '';

      const variations = kpl.variations;
      const nVariations = Array.isArray(variations) ? variations.length : 0;

      const alerts: string[] = [];
      if (kpl.private_label) alerts.push('PL');
      if (kpl.ip_issue) alerts.push('IP');
      if (kpl.containsHazardousMaterials) alerts.push('Hazmat');
      if (kpl.containsLithiumBattery) alerts.push('Lithium');
      if (kpl.meltable) alerts.push('Meltable');
      if (kpl.oversize) alerts.push('Oversize');

      let imageUrl = kpl.product_image || null;
      if (!imageUrl) {
        const images = kpl.images;
        if (Array.isArray(images) && images.length > 0) imageUrl = images[0];
      }

      const title = kpl.title || '';

      // Parse seller offers
      const offersList: any[] = [];
      const keepaOffers = kpl.keepa_offers;
      if (keepaOffers && typeof keepaOffers === 'object') {
        for (const offer of (keepaOffers.offers || [])) {
          if (!offer || typeof offer !== 'object') continue;
          const oPrice = offer.price || 0;
          let oShipping = offer.shippingPrice || 0;
          if (typeof oShipping === 'string') oShipping = parseFloat(oShipping) || 0;
          if (typeof oShipping === 'number' && oShipping < 100) oShipping = Math.round(oShipping * 100);
          const totalCents = oPrice + oShipping;
          if (totalCents <= 0) continue;
          const sellerType = offer.isAmazon ? 'AMZ' : (offer.isFBA ? 'FBA' : 'FBM');
          offersList.push({
            seller_id: offer.sellerId || '',
            type: sellerType,
            price: oPrice / 100,
            shipping: oShipping / 100,
            total_price: totalCents / 100,
            stock: offer.stock_count || offer.stock_display || 0,
            is_prime: !!offer.isPrime,
            condition: offer.condition || 1,
          });
        }
        offersList.sort((a, b) => a.total_price - b.total_price);
      }

      const ean = kpl.ean || (Array.isArray(kpl.eanList) && kpl.eanList[0]) || '';

      dataMap[asin] = {
        prix_local: prix / 100,
        prix_amz_local: prixAmz > 0 ? prixAmz / 100 : null,
        prix_fba_local: prixFba > 0 ? prixFba / 100 : null,
        ref_pct: refPct,
        fba_fee_local: fbaFee,
        closing_local: closing,
        bsr,
        sales_mo: salesMo,
        fba_sellers: fbaS,
        fbm_sellers: fbmS,
        category: cat,
        n_variations: nVariations,
        alerts: alerts.join(', '),
        weight_g: kpl.package_weight || 0,
        height_mm: kpl.package_height || 0,
        length_mm: kpl.package_length || 0,
        width_mm: kpl.package_width || 0,
        image_url: imageUrl,
        title,
        ean,
        offers: offersList,
        keepa_data: {
          current: cur,
          category_name: cat,
          bsr,
          avg: kpl.avg || {},
          avg30: kpl.avg30 || {},
          avg90: kpl.avg90 || {},
          avg180: kpl.avg180 || {},
        },
      };
    }
    return dataMap;
  }

  async resolveEan(ean: string): Promise<string | null> {
    const url = `${SAS_BASE}/sas/lookup?SasLookup%5Bsearch_term%5D=${ean}`;
    try {
      const { text } = await fetchManual(
        url,
        {
          method: 'GET',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        },
        this.jar,
      );
      const jsonAsins = [...text.matchAll(/"asin"\s*:\s*"(B[A-Z0-9]{9})"/g)].map(m => m[1]);
      if (jsonAsins.length > 0) return jsonAsins[0];
      const bare = text.match(/\bB0[A-Z0-9]{8}\b/);
      if (bare) return bare[0];
    } catch { /* ignored */ }
    return null;
  }
}

// ─── Calculator ───────────────────────────────────────────────────────────────

function calculateProduct(
  productData: any,
  countryCode: string,
  userId: string,
  lookupId: string,
): any {
  const country = COUNTRIES[countryCode];
  const eurRate = country.eur_rate;
  const dstPct = country.dst_pct;
  const dstOnFba = country.dst_on_fba;
  const domain = country.domain;

  const sellEur = Math.round(productData.prix_local * eurRate * 100) / 100;
  const closingEur = Math.round(productData.closing_local * eurRate * 100) / 100;
  const referralEur = Math.round(productData.prix_local * productData.ref_pct * eurRate * 100) / 100;

  const fbaLocal = productData.fba_fee_local;
  const fbaEur = fbaLocal != null ? Math.round(fbaLocal * eurRate * 100) / 100 : null;

  let dstEur = 0;
  if (dstPct > 0) {
    let dstBase = closingEur + referralEur;
    if (dstOnFba && fbaEur != null) dstBase += fbaEur;
    dstEur = Math.round(dstBase * dstPct * 100) / 100;
  }

  let totalFeesFba: number | null = null;
  if (fbaEur != null) {
    totalFeesFba = Math.round((closingEur + referralEur + dstEur + fbaEur) * 100) / 100;
  }
  const dstFbm = dstPct > 0 ? (closingEur + referralEur) * dstPct : 0;
  const totalFeesFbm = Math.round((closingEur + referralEur + dstFbm) * 100) / 100;

  const amazonPriceEur = productData.prix_amz_local != null
    ? Math.round(productData.prix_amz_local * eurRate * 100) / 100 : null;
  const fbaPriceEur = productData.prix_fba_local != null
    ? Math.round(productData.prix_fba_local * eurRate * 100) / 100 : null;

  const asin = productData._asin || '';

  return {
    lookup_id: lookupId,
    user_id: userId,
    asin,
    ean: productData.ean || '',
    product_name: productData.title || '',
    image_url: productData.image_url || null,
    category: productData.category || '',
    bsr: productData.bsr || 0,
    sales_monthly: productData.sales_mo || 0,
    sell_price: sellEur,
    amazon_price: amazonPriceEur,
    fba_price: fbaPriceEur,
    fba_fee: fbaEur,
    commission_pct: Math.round(productData.ref_pct * 100 * 100) / 100,
    commission_eur: referralEur,
    closing_fee: closingEur,
    dst_fee: dstEur,
    total_fees_fba: totalFeesFba,
    total_fees_fbm: totalFeesFbm,
    profit_fba: null,
    roi_fba: null,
    profit_fbm: null,
    roi_fbm: null,
    fba_sellers: productData.fba_sellers || 0,
    fbm_sellers: productData.fbm_sellers || 0,
    variations: productData.n_variations || 0,
    alerts: productData.alerts || '',
    buy_price: null,
    country_code: countryCode,
    amazon_url: `https://www.${domain}/dp/${asin}`,
    keepa_data: productData.keepa_data || null,
    offers: productData.offers || [],
    weight_g: productData.weight_g || 0,
    height_mm: productData.height_mm || 0,
    length_mm: productData.length_mm || 0,
    width_mm: productData.width_mm || 0,
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Verify user JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: userError } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    ).auth.getUser(authHeader.replace('Bearer ', ''));

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { queryInput, countryCode = 'FR', profileId } = body;

    if (!queryInput) {
      return new Response(JSON.stringify({ error: 'queryInput is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const country = COUNTRIES[countryCode];
    if (!country) {
      return new Response(JSON.stringify({ error: `Unknown country: ${countryCode}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse items
    const items = queryInput
      .split(/[,\n]/)
      .map((s: string) => s.trim().toUpperCase())
      .filter(Boolean);
    const queryType = items.length > 1 ? 'batch' : 'single';

    // Create lookup row with status 'processing'
    const { data: lookup, error: lookupErr } = await supabaseAdmin
      .from('mp_lookups')
      .insert({
        user_id: user.id,
        profile_id: profileId || null,
        query_type: queryType,
        query_input: queryInput.trim(),
        country_code: countryCode,
        status: 'processing',
      })
      .select()
      .single();

    if (lookupErr) throw new Error(`Failed to create lookup: ${lookupErr.message}`);
    const lookupId = lookup.id;
    const t0 = Date.now();

    // Get credentials
    const sasEmail = Deno.env.get('SAS_EMAIL');
    const sasPassword = Deno.env.get('SAS_PASSWORD');
    const workerSecret = Deno.env.get('WORKER_SECRET');

    if (!sasEmail || !sasPassword || !workerSecret) {
      throw new Error('Missing SAS_EMAIL, SAS_PASSWORD or WORKER_SECRET env vars');
    }

    // Login to SellerAmp
    const sas = new SellerAmpClient();
    await sas.login(sasEmail, sasPassword);

    // Separate ASINs from EANs
    const asins: string[] = [];
    const eanToAsin: Record<string, string> = {};

    for (const item of items) {
      if (/^B[A-Z0-9]{9}$/.test(item)) {
        asins.push(item);
      } else if (/^\d{8,13}$/.test(item)) {
        const asin = await sas.resolveEan(item);
        if (asin) {
          eanToAsin[item] = asin;
          asins.push(asin);
        } else {
          console.warn(`EAN not found: ${item}`);
        }
      } else {
        asins.push(item); // try as ASIN anyway
      }
    }

    if (asins.length === 0) {
      await supabaseAdmin.rpc('mp_fail', {
        p_secret: workerSecret,
        p_id: lookupId,
        p_error: 'No valid ASINs found',
      });
      return new Response(JSON.stringify({ error: 'No valid ASINs found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Lookup all 5 countries in parallel
    const allCountryCodes = Object.keys(COUNTRIES);
    const countryResults: Record<string, Record<string, any>> = {};

    await Promise.all(
      allCountryCodes.map(async (cc) => {
        try {
          countryResults[cc] = await sas.lookupBatch(asins, COUNTRIES[cc].keepa_mp);
        } catch (e) {
          console.error(`Lookup failed for ${cc}:`, e);
          countryResults[cc] = {};
        }
      }),
    );

    // Build results for primary country
    const primaryData = countryResults[countryCode] || {};
    const asinToEan: Record<string, string> = {};
    for (const [ean, asin] of Object.entries(eanToAsin)) asinToEan[asin] = ean;

    const results: any[] = [];

    for (const [asin, productData] of Object.entries(primaryData)) {
      productData._asin = asin;
      if (asinToEan[asin] && !productData.ean) productData.ean = asinToEan[asin];

      const result = calculateProduct(productData, countryCode, user.id, lookupId);

      // Add eu_data from all countries
      const euData: Record<string, any> = {};
      for (const cc of allCountryCodes) {
        const ccPd = countryResults[cc]?.[asin];
        if (!ccPd) continue;
        ccPd._asin = asin;
        const ccResult = calculateProduct(ccPd, cc, user.id, lookupId);
        euData[cc] = {
          bsr: ccResult.bsr,
          sell_price: ccResult.sell_price,
          fba_fee: ccResult.fba_fee,
          commission_eur: ccResult.commission_eur,
          commission_pct: ccResult.commission_pct,
          closing_fee: ccResult.closing_fee,
          fba_sellers: ccResult.fba_sellers,
          fbm_sellers: ccResult.fbm_sellers,
          sales_monthly: ccResult.sales_monthly,
          amazon_price: ccResult.amazon_price,
          fba_price: ccResult.fba_price,
          variations: ccResult.variations,
          alerts: ccResult.alerts,
          offers: ccResult.offers,
        };
      }
      result.eu_data = euData;
      results.push(result);
    }

    // Store via mp_complete RPC
    const processingMs = Date.now() - t0;
    const { error: rpcErr } = await supabaseAdmin.rpc('mp_complete', {
      p_secret: workerSecret,
      p_id: lookupId,
      p_results: results,
      p_processing_ms: processingMs,
    });

    if (rpcErr) throw new Error(`mp_complete failed: ${rpcErr.message}`);

    console.log(`[OK] Lookup ${lookupId} done in ${processingMs}ms — ${results.length} results`);

    return new Response(
      JSON.stringify({ success: true, lookup_id: lookupId, count: results.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err: any) {
    console.error('mp-lookup error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
