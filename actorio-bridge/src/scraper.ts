/**
 * Actorio scraper - Automates product search on app.actorio.com
 * Uses Playwright to control a browser, login, then navigate directly to
 * the search URL with query params (faster than form manipulation).
 * Results are loaded by DataTables SSP via AJAX — we intercept the JSON.
 */
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const SESSION_STATE_FILE = path.resolve(process.cwd(), '.actorio-session.json');
const ACTORIO_URL = 'https://app.actorio.com';

export interface ActorioFilters {
  // Amazon filters
  marketplace?: string;
  amazon_price_min?: number;
  amazon_price_max?: number;
  unit_profit_min?: number;
  unit_profit_max?: number;
  roi_min?: number;
  roi_max?: number;
  monthly_profit_min?: number;
  monthly_profit_max?: number;
  monthly_sales_min?: number;
  monthly_sales_max?: number;
  bsr_max?: number;
  category?: string;
  keywords?: string;
  exclude_incomplete?: boolean;
  exclude_multipacks?: boolean;
  exclude_hazmat?: boolean;
  asin_list?: string;
  // Supplier filters
  country?: string;
  supplier_type?: string;
  suppliers?: string[];
  supplier_price_min?: number;
  supplier_price_max?: number;
  updated_recently?: string;
  ean_list?: string;
}

export interface ActorioProduct {
  title: string;
  asin?: string;
  ean?: string;
  image_url?: string;
  amazon_price: number;
  supplier_price: number;
  supplier_price_ht?: boolean;
  supplier_url?: string;
  profit: number;
  roi: number;
  margin: number;
  monthly_sales?: number;
  monthly_profit?: number;
  bsr?: number;
  category?: string;
  brand?: string;
  supplier?: string;
  competition_level?: string;
  keepa_url?: string;
  correspondance?: string;
}

export interface ScraperResult {
  success: boolean;
  results: ActorioProduct[];
  count: number;
  duration_ms: number;
  error?: string;
  api_intercepted?: boolean;
  raw_api_response?: any;
}

let browser: Browser | null = null;
let context: BrowserContext | null = null;
let isLoggedIn = false;

/**
 * Initialize the browser with persistent session
 */
export async function initBrowser(headless = true): Promise<void> {
  if (browser) return;

  console.log(`[scraper] Launching browser (headless: ${headless})...`);
  browser = await chromium.launch({
    headless,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  // Load saved session state if available (avoids re-login on restart)
  let storageState: string | undefined;
  if (fs.existsSync(SESSION_STATE_FILE)) {
    storageState = SESSION_STATE_FILE;
    console.log('[scraper] Loading saved session state...');
  }

  context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'fr-FR',
    storageState,
  });

  // If we have a saved session, check if it's still valid
  if (storageState) {
    const probe = await context.newPage();
    try {
      await probe.goto(`${ACTORIO_URL}/products/search/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (!probe.url().includes('/accounts/login')) {
        isLoggedIn = true;
        console.log('[scraper] Session restored from saved state');
      } else {
        console.log('[scraper] Saved session expired, will re-login');
      }
    } catch { /* ignore */ } finally {
      await probe.close();
    }
  }

  console.log('[scraper] Browser ready');
}

/**
 * Login to Actorio
 */
export async function login(email: string, password: string): Promise<boolean> {
  if (!context) throw new Error('Browser not initialized');
  if (isLoggedIn) return true;

  const page = await context.newPage();

  try {
    console.log('[scraper] Logging in to Actorio...');
    // The real login URL - app.actorio.com redirects to /accounts/login/
    await page.goto(`${ACTORIO_URL}/accounts/login/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Dismiss cookie banner if present
    const acceptBtn = page.locator('button.cky-btn-accept[data-cky-tag="accept-button"]');
    if (await acceptBtn.isVisible().catch(() => false)) {
      console.log('[scraper] Dismissing cookie banner...');
      await acceptBtn.click();
      await page.waitForTimeout(500);
    }

    // Fill login form - Django form with #id_username and #id_password
    const usernameInput = page.locator('#id_username');
    const passwordInput = page.locator('#id_password');

    await usernameInput.waitFor({ timeout: 10000 });
    await usernameInput.fill(email);
    await passwordInput.fill(password);

    // Check "remember me"
    const rememberCheckbox = page.locator('#id_remember');
    if (await rememberCheckbox.isVisible().catch(() => false)) {
      await rememberCheckbox.check();
    }

    // Submit - button with text "SE CONNECTER"
    const submitBtn = page.locator('button:has-text("SE CONNECTER"), input[type="submit"]').first();
    await submitBtn.click();

    // Wait for redirect (successful login goes to /products/)
    await page.waitForURL((url) => !url.pathname.includes('/accounts/login'), { timeout: 15000 });
    console.log(`[scraper] Logged in! Current URL: ${page.url()}`);

    // Save session cookies to disk for future restarts
    if (context) {
      await context.storageState({ path: SESSION_STATE_FILE });
      console.log('[scraper] Session state saved');
    }

    isLoggedIn = true;
    return true;
  } catch (err: any) {
    console.error(`[scraper] Login failed: ${err.message}`);
    return false;
  } finally {
    await page.close();
  }
}

/**
 * Build the Actorio search URL from filters.
 * Confirmed working pattern from debug-v4:
 *   /products/search/?marketplace=FR&roi_min=30&store=ALL&similarity=2
 *
 * Field mapping (sans préfixe id_, _0/_1 → _min/_max) :
 *   roi_0/1         → roi_min / roi_max
 *   competitive_price_0/1 → amazon_price_min / amazon_price_max
 *   profit_0/1      → profit_min / profit_max
 *   profit_month_0/1 → profit_month_min / profit_month_max
 *   sales_month_0/1 → sales_month_min / sales_month_max
 *   bsr_0/1         → bsr_min / bsr_max
 *   price_0/1       → price_min / price_max
 */
function buildSearchUrl(filters: ActorioFilters): string {
  const params = new URLSearchParams();

  // Marketplace (FR, DE, ES, IT, GB)
  if (filters.marketplace) {
    const mp: Record<string, string> = {
      'amazon.fr': 'FR', 'amazon.de': 'DE', 'amazon.es': 'ES',
      'amazon.it': 'IT', 'amazon.co.uk': 'GB',
    };
    const val = mp[filters.marketplace] ?? filters.marketplace;
    params.set('marketplace', val);
  }

  // Store: specific supplier list, or store=ALL for all suppliers
  // EMPTY = placeholder (0 results), no param = might not work, ALL = all suppliers
  if (filters.suppliers?.length) {
    filters.suppliers.forEach(s => params.append('store', s));
  } else {
    params.set('store', 'ALL');
  }

  // ROI (form field names: roi_min / roi_max)
  if (filters.roi_min !== undefined) params.set('roi_min', String(filters.roi_min));
  if (filters.roi_max !== undefined) params.set('roi_max', String(filters.roi_max));

  // Amazon price (form field names: competitive_price_min / competitive_price_max)
  if (filters.amazon_price_min !== undefined) params.set('competitive_price_min', String(filters.amazon_price_min));
  if (filters.amazon_price_max !== undefined) params.set('competitive_price_max', String(filters.amazon_price_max));

  // Unit profit (form field names: profit_min / profit_max)
  if (filters.unit_profit_min !== undefined) params.set('profit_min', String(filters.unit_profit_min));
  if (filters.unit_profit_max !== undefined) params.set('profit_max', String(filters.unit_profit_max));

  // Monthly profit (form field names: profit_month_min / profit_month_max)
  if (filters.monthly_profit_min !== undefined) params.set('profit_month_min', String(filters.monthly_profit_min));
  if (filters.monthly_profit_max !== undefined) params.set('profit_month_max', String(filters.monthly_profit_max));

  // Monthly sales (form field names: sales_month_min / sales_month_max)
  if (filters.monthly_sales_min !== undefined) params.set('sales_month_min', String(filters.monthly_sales_min));
  if (filters.monthly_sales_max !== undefined) params.set('sales_month_max', String(filters.monthly_sales_max));

  // BSR (form field names: bsr_min / bsr_max — use bsr_max to set upper limit)
  if (filters.bsr_max !== undefined) params.set('bsr_max', String(filters.bsr_max));

  // Category
  if (filters.category) params.set('category', filters.category);

  // Keywords
  if (filters.keywords) params.set('keywords', filters.keywords);

  // Supplier filters
  if (filters.country) params.set('country', filters.country);
  if (filters.supplier_type) {
    const typeMap: Record<string, string> = {
      wholesale: 'WHL', retail: 'RTL', uploaded: 'UPL', exclusive: 'EXC',
    };
    params.set('type', typeMap[filters.supplier_type] ?? filters.supplier_type);
  }
  if (filters.supplier_price_min !== undefined) params.set('price_min', String(filters.supplier_price_min));
  if (filters.supplier_price_max !== undefined) params.set('price_max', String(filters.supplier_price_max));
  if (filters.updated_recently) {
    const updateMap: Record<string, string> = { '24h': '24', '48h': '48' };
    params.set('last_update', updateMap[filters.updated_recently] ?? filters.updated_recently);
  }

  // Lists
  if (filters.asin_list) params.set('asin_list', filters.asin_list);
  if (filters.ean_list) params.set('upc_list', filters.ean_list);

  // Booleans / checkboxes
  if (filters.exclude_incomplete) params.set('missing_fba', '1');
  if (filters.exclude_multipacks) params.set('multipack', '1');
  if (filters.exclude_hazmat) params.set('hazmat', '1');

  // Similarity (default 2 as in debug-v4)
  params.set('similarity', '2');

  return `${ACTORIO_URL}/products/search/?${params.toString()}`;
}

/**
 * Fill the Actorio search form with filters then click the search button.
 * The form uses GET, so clicking nav button navigates to a filtered URL.
 */
async function fillFilters(page: Page, filters: ActorioFilters): Promise<void> {
  // Marketplace select
  if (filters.marketplace) {
    const mp: Record<string, string> = {
      'amazon.fr': 'FR', 'amazon.de': 'DE', 'amazon.es': 'ES',
      'amazon.it': 'IT', 'amazon.co.uk': 'GB',
    };
    const val = mp[filters.marketplace] ?? filters.marketplace;
    await page.selectOption('#id_marketplace', val).catch(() => {});
  }

  const fill = async (id: string, val: number | undefined) => {
    if (val !== undefined)
      await page.fill(id, String(val)).catch(() => {});
  };

  await fill('#id_roi_0',               filters.roi_min);
  await fill('#id_roi_1',               filters.roi_max);
  await fill('#id_competitive_price_0', filters.amazon_price_min);
  await fill('#id_competitive_price_1', filters.amazon_price_max);
  await fill('#id_profit_0',            filters.unit_profit_min);
  await fill('#id_profit_1',            filters.unit_profit_max);
  await fill('#id_profit_month_0',      filters.monthly_profit_min);
  await fill('#id_profit_month_1',      filters.monthly_profit_max);
  await fill('#id_sales_month_0',       filters.monthly_sales_min);
  await fill('#id_sales_month_1',       filters.monthly_sales_max);
  await fill('#id_price_0',             filters.supplier_price_min);
  await fill('#id_price_1',             filters.supplier_price_max);

  if (filters.keywords) await page.fill('#id_keywords', filters.keywords).catch(() => {});
  if (filters.asin_list) await page.fill('#id_asin_list', filters.asin_list).catch(() => {});
  if (filters.ean_list)  await page.fill('#id_upc_list',  filters.ean_list).catch(() => {});
}

/**
 * Perform a product search on Actorio.
 * Navigates directly to the URL built by buildSearchUrl (GET params).
 * The user confirmed this URL format works: Actorio honors GET params.
 * Pagination uses Django's &page=N appended to the same URL.
 */
export async function search(filters: ActorioFilters, maxResults = 100): Promise<ScraperResult> {
  if (!context) throw new Error('Browser not initialized');
  if (!isLoggedIn) throw new Error('Not logged in');

  const startTime = Date.now();
  const page = await context.newPage();

  try {
    const baseUrl = buildSearchUrl(filters);
    console.log(`[scraper] Search URL: ${baseUrl}`);

    const allResults: ActorioProduct[] = [];
    let pageNum = 1;
    let totalCount = 0;

    while (allResults.length < maxResults) {
      const pageUrl = pageNum === 1 ? baseUrl : `${baseUrl}&page=${pageNum}`;
      console.log(`[scraper] Loading page ${pageNum}: ${pageUrl}`);
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Dismiss cookie banner (first page only)
      if (pageNum === 1) {
        const acceptBtn = page.locator('button.cky-btn-accept[data-cky-tag="accept-button"]');
        if (await acceptBtn.isVisible().catch(() => false)) {
          console.log('[scraper] Dismissing cookie banner...');
          await acceptBtn.click();
          await page.waitForTimeout(500);
        }
      }

      // Check for session expiry
      if (page.url().includes('/accounts/login')) {
        console.log('[scraper] Session expired — re-logging in...');
        isLoggedIn = false;
        const relogged = await login(process.env.ACTORIO_EMAIL!, process.env.ACTORIO_PASSWORD!);
        if (!relogged) throw new Error('Re-login failed after session expiry');
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }

      // Wait for table rows (up to 20s)
      let loaded = false;
      for (let i = 0; i < 10; i++) {
        await page.waitForTimeout(2000);
        const rowCount = await page.evaluate((): number => {
          const mainTbl = document.querySelector('table#main-table') as HTMLTableElement | null;
          if (mainTbl && mainTbl.tBodies[0]) return mainTbl.tBodies[0].rows.length;
          let max = 0;
          Array.from(document.querySelectorAll('table') as NodeListOf<HTMLTableElement>).forEach(function(t) {
            const tb = t.tBodies[0];
            if (tb && tb.rows.length > max) max = tb.rows.length;
          });
          return max;
        });
        console.log(`[scraper] [${(i + 1) * 2}s] rows=${rowCount}`);
        if (rowCount > 0) { loaded = true; break; }
      }

      if (!loaded) {
        console.log('[scraper] No rows found, stopping');
        break;
      }

      const pageRows = await scrapeFromDom(page, filters.marketplace ?? 'amazon.fr');
      if (pageRows.length === 0) break;
      allResults.push(...pageRows);

      const paginationInfo = await page.evaluate(
        (params: { currentPage: number; pageSize: number }): { total: number; maxPage: number } => {
          const body = document.body?.innerText ?? '';
          const totalMatch = body.match(/sur\s+([\d\s]+)\s+résultat/i)
            ?? body.match(/of\s+([\d\s]+)\s+result/i);
          const total = totalMatch ? parseInt(totalMatch[1].replace(/\s/g, '')) : 0;

          // Max page from visible pagination links
          const pageLinks = Array.from(document.querySelectorAll('a[href*="page="]')) as HTMLAnchorElement[];
          const maxPageFromLinks = pageLinks.reduce(function(mx, a) {
            const m = a.href.match(/[?&]page=(\d+)/);
            return m ? Math.max(mx, parseInt(m[1])) : mx;
          }, params.currentPage);

          // Max page computed from total ÷ pageSize (more reliable — pagination widget
          // may only show a window of 8 page numbers even if there are more pages)
          const maxPageFromTotal = (total > 0 && params.pageSize > 0)
            ? Math.ceil(total / params.pageSize)
            : maxPageFromLinks;

          const maxPage = Math.max(maxPageFromLinks, maxPageFromTotal);
          return { total, maxPage };
        },
        { currentPage: pageNum, pageSize: pageRows.length }
      );

      if (totalCount === 0 && paginationInfo.total > 0) totalCount = paginationInfo.total;
      console.log(`[scraper] Page ${pageNum}/${paginationInfo.maxPage} | fetched ${allResults.length} | total=${paginationInfo.total}`);

      if (pageNum >= paginationInfo.maxPage || allResults.length >= maxResults) break;
      pageNum++;
    }

    const duration = Date.now() - startTime;
    console.log(`[scraper] Done: ${allResults.length} results in ${duration}ms (${pageNum} pages)`);

    return {
      success: true,
      results: allResults,
      count: totalCount || allResults.length,
      duration_ms: duration,
      api_intercepted: false,
    };
  } catch (err: any) {
    console.error(`[scraper] Search failed: ${err.message}`);
    await page.screenshot({ path: 'error-screenshot.png' }).catch(() => {});
    return {
      success: false,
      results: [],
      count: 0,
      duration_ms: Date.now() - startTime,
      error: err.message,
    };
  } finally {
    await page.close();
  }
}

/**
 * Parse a DataTables SSP AJAX response.
 * Format: { draw, recordsTotal, recordsFiltered, data: Array<Array|Object> }
 *
 * Actorio cells often contain HTML (anchors, images) — we strip it.
 * Column order (best-guess from Actorio's table, adjust if needed):
 *   0: image  1: title/ASIN  2: EAN  3: brand  4: category
 *   5: amazon_price  6: supplier_price  7: profit  8: roi  9: margin
 *   10: monthly_sales  11: monthly_profit  12: bsr  13: competition
 *   14: supplier  15: updated_at
 */
function parseApiResponse(response: any): ActorioProduct[] {
  const rawData: any[] = response.data ?? [];
  if (!rawData.length) return [];

  // Log first row to help identify real column structure
  const first = rawData[0];
  if (Array.isArray(first)) {
    console.log(`[scraper] DataTables columns (${first.length} cols), first row sample:`);
    first.forEach((cell: any, i: number) => {
      const preview = stripHtml(String(cell ?? '')).substring(0, 60);
      console.log(`  [${i}] ${preview}`);
    });
  } else {
    console.log(`[scraper] DataTables object keys: ${Object.keys(first).join(', ')}`);
  }

  return rawData.map((row: any) => {
    // DataTables returns array-of-arrays OR array-of-objects
    if (Array.isArray(row)) {
      return parseRowArray(row);
    }
    return parseRowObject(row);
  }).filter(p => p.title || p.asin);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function toNum(val: any): number {
  if (val === null || val === undefined) return 0;
  const s = stripHtml(String(val)).replace(/[€%\s\u00a0]/g, '').replace(',', '.');
  return parseFloat(s) || 0;
}

function toInt(val: any): number {
  if (val === null || val === undefined) return 0;
  const s = stripHtml(String(val)).replace(/[\s\u00a0]/g, '');
  return parseInt(s) || 0;
}

/** Parse when DataTables returns array-of-arrays.
 * Column order confirmed from live DOM headers:
 *  0: Identifiants (ASIN + EAN + brand)
 *  1: Restrictions
 *  2: Titre AMZ
 *  3: Info AMZ (tooltip — skip)
 *  4: Info Fournisseur (supplier name + logo)
 *  5: Prix AMZ Actuel
 *  6: Prix Fournisseur
 *  7: Vendeurs AMZ
 *  8: Bénéfice Unitaire
 *  9: RoI Unitaire
 * 10: Ventes Mensuelles
 * 11: Bénéfice Mensuel
 * 12: Graphique Keepa (skip)
 * 13: AMZ BSR
 * 14: Marge Unitaire
 */
function parseRowArray(row: string[]): ActorioProduct {
  const c = (i: number) => stripHtml(String(row[i] ?? ''));

  // Col 0 : "B0XXXXXXXX 1234567890123 NomMarque"
  const identText = c(0);
  const asinMatch = identText.match(/\bB0[A-Z0-9]{8}\b/);
  const eanMatch  = identText.match(/\b\d{8,14}\b/);

  // Col 4 : supplier logo HTML → extract alt or text
  const supplierRaw  = String(row[4] ?? '');
  const supplierText = stripHtml(supplierRaw);
  // Try <img alt="amazon.fr"> pattern first
  const supplierAlt  = (supplierRaw.match(/alt="([^"]+)"/) ?? [])[1] ?? supplierText;

  // Col 3 : Info AMZ tooltip may contain image URL
  const infoAmzRaw = String(row[3] ?? '');
  const imageUrl   = (infoAmzRaw.match(/src="([^"]+)"/) ?? [])[1] ?? '';

  return {
    title:          c(2),
    asin:           asinMatch ? asinMatch[0] : '',
    ean:            eanMatch  ? eanMatch[0]  : '',
    image_url:      imageUrl,
    amazon_price:   toNum(row[5]),
    supplier_price: toNum(row[6]),
    profit:         toNum(row[8]),
    roi:            toNum(row[9]),
    monthly_sales:  toInt(row[10]),
    monthly_profit: toNum(row[11]),
    bsr:            toInt(row[13]),
    margin:         toNum(row[14]),
    supplier:       supplierAlt.trim(),
  };
}

/** Parse when DataTables returns array-of-objects (Actorio may use named keys) */
function parseRowObject(row: Record<string, any>): ActorioProduct {
  const get = (keys: string[]) => keys.map(k => row[k]).find(v => v !== undefined && v !== null) ?? '';
  return {
    title: stripHtml(String(get(['title', 'product_name', 'name', '1']))),
    asin: stripHtml(String(get(['asin', 'ASIN']))),
    ean: stripHtml(String(get(['ean', 'EAN', 'upc']))),
    image_url: stripHtml(String(get(['image_url', 'image', 'thumbnail']))),
    amazon_price: toNum(get(['amazon_price', 'competitive_price', 'price'])),
    supplier_price: toNum(get(['supplier_price', 'buy_price', 'price_supplier'])),
    profit: toNum(get(['profit', 'unit_profit'])),
    roi: toNum(get(['roi', 'ROI'])),
    margin: toNum(get(['margin'])),
    monthly_sales: toInt(get(['monthly_sales', 'sales_month', 'sales_30d'])),
    monthly_profit: toNum(get(['monthly_profit', 'profit_month'])),
    bsr: toInt(get(['bsr', 'BSR', 'sales_rank'])),
    category: stripHtml(String(get(['category', 'product_category']))),
    brand: stripHtml(String(get(['brand']))),
    supplier: stripHtml(String(get(['supplier', 'store', 'supplier_name']))),
    competition_level: stripHtml(String(get(['competition_level', 'competition']))),
  };
}

/**
 * Scrape product rows from the DataTables DOM on the current page.
 * Actorio renders results server-side (Django-tables2, NOT SSP AJAX).
 *
 * @param marketplace - e.g. 'amazon.fr', 'amazon.de' — used to extract the
 *   correct per-country value from multi-country cells (c8, c9, c10, c11, c14).
 *   Actorio always renders countries in db_amz_countries order: DE, ES, FR, GB, IT.
 */
async function scrapeFromDom(page: Page, marketplace: string): Promise<ActorioProduct[]> {
  // Quick diagnostic: check main-table row and cell counts
  const diag = await page.evaluate((): any => {
    // Try #main-table first, then best-rows table
    let table = document.querySelector('table#main-table') as HTMLTableElement | null;
    if (!table) {
      let best: HTMLTableElement | null = null;
      let bestCount = 0;
      Array.from(document.querySelectorAll('table') as NodeListOf<HTMLTableElement>).forEach(function(t) {
        const tb = t.tBodies[0];
        if (tb && tb.rows.length > bestCount) { bestCount = tb.rows.length; best = t; }
      });
      table = best;
    }
    if (!table) return { found: false, id: null };
    const tbody = (table as HTMLTableElement).tBodies[0];
    const rows = tbody ? tbody.rows.length : 0;
    const firstRowCells = (tbody && tbody.rows[0]) ? (tbody.rows[0] as HTMLTableRowElement).cells.length : 0;
    return { found: true, id: (table as HTMLTableElement).id || '(no id)', rows, firstRowCells };
  });
  console.log(`[scraper] table diag: ${JSON.stringify(diag)}`);

  // Scroll to bottom then back to top — triggers intersection-observer lazy-loads
  // (Amazon prices and Keepa images are lazy-loaded based on viewport on Actorio)
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight });
  });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { window.scrollTo({ top: 0 }); });

  // Wait up to 12s for Amazon prices to appear in c5
  for (let w = 0; w < 6; w++) {
    await page.waitForTimeout(2000);
    const hasPrices = await page.evaluate((): boolean => {
      let table = document.querySelector('table#main-table') as HTMLTableElement | null;
      if (!table) {
        let best: HTMLTableElement | null = null;
        let bestCount = 0;
        Array.from(document.querySelectorAll('table') as NodeListOf<HTMLTableElement>).forEach(function(t) {
          const tb = t.tBodies[0];
          if (tb && tb.rows.length > bestCount) { bestCount = tb.rows.length; best = t; }
        });
        table = best;
      }
      if (!table) return false;
      const tbody = (table as HTMLTableElement).tBodies[0];
      if (!tbody || !tbody.rows[0]) return false;
      const cells = Array.from((tbody.rows[0] as HTMLTableRowElement).cells) as HTMLTableCellElement[];
      if (cells.length < 6) return false;
      // Check if cells[5] (amazon price) has a number
      const txt = (cells[5] as HTMLElement).innerText ?? '';
      const dataOrd = cells[5].getAttribute('data-order') ?? '';
      return /\d/.test(txt) || /^\d/.test(dataOrd);
    });
    if (hasPrices) {
      console.log(`[scraper] Amazon prices loaded after ${(w + 1) * 2}s`);
      break;
    }
    console.log(`[scraper] Waiting for Amazon prices... (${(w + 1) * 2}s)`);
  }

  const rows = await page.evaluate((mktplace: string): any[] => {
    // Shim for esbuild --keep-names: __name() doesn't exist in browser context.
    // Use new Function() so esbuild cannot transform this expression.
    var __name = new Function('f', 'return f') as any;

    // db_amz_countries: FIXED order Actorio uses for multi-country cells
    // (matches hidden input #db_amz_countries on the page)
    var DB_AMZ = ['DE', 'ES', 'FR', 'GB', 'IT'];
    var mpToCode: Record<string, string> = {
      'amazon.fr': 'FR', 'amazon.de': 'DE', 'amazon.es': 'ES',
      'amazon.it': 'IT', 'amazon.co.uk': 'GB', 'amazon.com': 'US',
    };
    var code = mpToCode[mktplace] ?? mktplace.toUpperCase().replace('AMAZON.', '');
    var countryIdx = DB_AMZ.indexOf(code);
    if (countryIdx < 0) countryIdx = 0; // fallback to first country
    // Find the product table: try #main-table, then best-rows
    let table = document.querySelector('table#main-table') as HTMLTableElement | null;
    if (!table) {
      let best: HTMLTableElement | null = null;
      let bestCount = 0;
      Array.from(document.querySelectorAll('table') as NodeListOf<HTMLTableElement>).forEach(function(t) {
        const tbody = t.tBodies[0];
        if (tbody && tbody.rows.length > bestCount) { bestCount = tbody.rows.length; best = t; }
      });
      table = best;
    }
    if (!table) return [];
    const tbody = (table as HTMLTableElement).tBodies[0];
    if (!tbody) return [];
    const results: any[] = [];

    Array.from(tbody.rows).forEach(function(row) {
      const tr = row as HTMLTableRowElement;
      const cells = Array.from(tr.cells) as HTMLTableCellElement[];
      if (cells.length < 8) return;

      // --- col 0: Identifiants (ASIN + EAN) ---
      const col0Html = cells[0].innerHTML ?? '';
      const col0Text = (cells[0] as HTMLElement).innerText ?? '';
      const asinHref = col0Html.match(/\/products\/([A-Z0-9]{10})\b/);
      const asinTxt  = col0Text.match(/\bB0[A-Z0-9]{8}\b/);
      const asin = asinHref ? (asinHref[1] ?? '') : (asinTxt ? asinTxt[0] : '');
      const eanM = col0Text.match(/\b\d{8,14}\b/);
      const ean  = eanM ? eanM[0] : '';

      // --- col 1: Restrictions (ignoré) ---

      // --- col 2: Titre ---
      const titleRaw = (cells[2] as HTMLElement).innerText ?? '';
      const title = titleRaw.split('\n').map(function(s) { return s.trim(); })
                             .filter(function(s) { return s.length > 10; })[0] ?? '';

      // --- col 3: Info AMZ — image produit ET "Correspondance: XX%" ---
      const imgEl = cells[3].querySelector('img') as HTMLImageElement | null;
      const imageUrl = imgEl?.getAttribute('src') ?? '';
      // Correspondance est affiché sous l'image dans cette même colonne
      var correspondance = '';
      var c3text = (cells[3] as HTMLElement).innerText ?? '';
      // Chercher "Correspondance: XX%" ou "Correspondance :\n XX%"
      var corrTextMatch = c3text.match(/Correspondance\s*:?\s*\n?\s*(\d+)\s*%/i);
      if (corrTextMatch) {
        correspondance = corrTextMatch[1] + '%';
      }
      // Fallback: progress bar aria-valuenow dans c3
      if (!correspondance) {
        var c3html = cells[3].innerHTML ?? '';
        var avnM = c3html.match(/aria-valuenow="(\d+)"/);
        if (avnM) correspondance = avnM[1] + '%';
      }
      // Fallback: chercher Élevé/Moyen/Faible dans c3
      if (!correspondance) {
        if (/élevé|eleve|exact/i.test(c3text))      correspondance = 'Élevé';
        else if (/moyen|medium/i.test(c3text))       correspondance = 'Moyen';
        else if (/faible|low/i.test(c3text))         correspondance = 'Faible';
      }

      // --- col 4: Fournisseur (supplier name + logo + URL) ---
      var supAnchor = cells[4].querySelector('a') as HTMLAnchorElement | null;
      var supplier_url = supAnchor ? (supAnchor.getAttribute('href') ?? '') : '';
      // Make supplier URL absolute if it's relative
      if (supplier_url && supplier_url.startsWith('/')) {
        supplier_url = 'https://app.actorio.com' + supplier_url;
      }
      const supRaw = (cells[4] as HTMLElement).innerText ?? '';
      const supLines = supRaw.split('\n').map(function(s) { return s.trim(); })
                             .filter(function(s) { return s.length > 0; });
      const supplier = supLines[supLines.length - 1] ?? '';

      // Helpers
      var helpers = {
        // For single-country cells (c6): first non-N/A numeric line
        num: function(el: HTMLElement, strip: RegExp): number {
          var lines = el.innerText.split('\n');
          for (var i = 0; i < lines.length; i++) {
            var t = lines[i].trim();
            if (!t || /^N\/A$/i.test(t) || !/\d/.test(t)) continue;
            var cleaned = t.replace(strip, '').replace(',', '.');
            var n = parseFloat(cleaned);
            if (!isNaN(n) && isFinite(n)) return n;
          }
          return 0;
        },
        // For multi-country cells (c8-c11): get value at countryIdx.
        // Order = DB_AMZ = ['DE','ES','FR','GB','IT'].
        // Approach: collect lines that contain a number OR explicit "N/A" — one per country.
        // This handles both "\n\n"-separated AND "\n"-separated (single newline) cell formats.
        numCountry: function(el: HTMLElement, strip: RegExp, idx: number): number {
          var lines = el.innerText.split('\n');
          var values: string[] = [];
          for (var i = 0; i < lines.length; i++) {
            var t = lines[i].trim();
            if (t === '') continue; // skip blank lines
            // Keep lines that are a number OR explicit N/A marker
            if (/^N\/A$/i.test(t) || /\d/.test(t)) {
              values.push(t);
            }
          }
          var block = idx < values.length ? values[idx] : '';
          if (!block || /^N\/A$/i.test(block)) return 0;
          var cleaned = block.replace(strip, '').replace(',', '.').trim();
          var n = parseFloat(cleaned);
          return (!isNaN(n) && isFinite(n)) ? n : 0;
        },
        // For c14 margin (all values on one line separated by spaces):
        // extract all numbers in order, pick at countryIdx.
        marginCountry: function(el: HTMLElement, idx: number): number {
          var nums = (el.innerText.match(/\d+(?:[.,]\d+)?/g) || []);
          var val = nums[idx] ?? nums[0] ?? '0';
          return parseFloat(String(val).replace(',', '.')) || 0;
        }
      };

      // --- col 5: Prix AMZ Actuel (multi-country, un prix par pays dans l'ordre DB_AMZ) ---
      // Même structure que c8-c11 : prendre le prix au bon index pays.
      var amazon_price = helpers.numCountry(cells[5] as HTMLElement, /[€£\s\u00a0]/g, countryIdx);
      // Fallback : data-sort/data-order si la valeur async n'est pas encore là
      if (!amazon_price) {
        var sortVal = cells[5].getAttribute('data-sort') ?? cells[5].getAttribute('data-order') ?? '';
        if (sortVal && /^\d/.test(sortVal)) amazon_price = parseFloat(sortVal) || 0;
      }

      // --- col 6: Prix Fournisseur + HT flag ---
      var supplier_price = helpers.num(cells[6] as HTMLElement, /[€£\s\u00a0]/g);
      var supplier_price_ht = /(hors\s+TVA|HT|excl\.?\s*VAT)/i.test((cells[6] as HTMLElement).innerText ?? '');

      // --- col 8: Bénéfice Unitaire (multi-country) ---
      var profit  = helpers.numCountry(cells[8] as HTMLElement, /[€£\s\u00a0]/g, countryIdx);

      // --- col 9: ROI (multi-country) ---
      var roiRaw  = helpers.numCountry(cells[9] as HTMLElement, /[%\s\u00a0]/g,   countryIdx);
      var roi     = (roiRaw > 0 && roiRaw <= 500) ? roiRaw : 0;

      // --- col 10: Ventes Mensuelles (multi-country) ---
      var monthly_sales   = helpers.numCountry(cells[10] as HTMLElement, /[\s\u00a0]/g, countryIdx);

      // --- col 11: Bénéfice Mensuel (multi-country) ---
      var monthly_profit  = helpers.numCountry(cells[11] as HTMLElement, /[€£\s\u00a0]/g, countryIdx);

      // --- col 12: Graphique Keepa (90j) ---
      // Les images Keepa ne chargent QUE sur click/hover sur Actorio (lazy-load interactif).
      // querySelectorAll('img') ne retourne que des src vides. On construit l'URL
      // directement depuis l'ASIN : https://graph.keepa.com/pricehistory.png?asin=...
      var keepaDomainMap: Record<string, string> = {
        'amazon.fr': 'fr', 'amazon.de': 'de', 'amazon.es': 'es',
        'amazon.it': 'it', 'amazon.co.uk': 'co.uk', 'amazon.com': 'com',
      };
      var keepaDomain = keepaDomainMap[mktplace] ?? 'fr';
      var keepa_url = asin
        ? 'https://graph.keepa.com/pricehistory.png?asin=' + asin
          + '&domain=' + keepaDomain
          + '&salesrank=0&new=1&used=0&rating=0&range=90'
        : '';

      // --- col 13: BSR ---
      var bsr    = helpers.num(cells[13] as HTMLElement, /[^\d]/g);

      // --- col 14: Marge (multi-country, one line space-separated) ---
      var margin = helpers.marginCountry(cells[14] as HTMLElement, countryIdx);

      if (!asin && !title) return;

      results.push({
        title, asin, ean, image_url: imageUrl,
        supplier, supplier_url, supplier_price, supplier_price_ht,
        amazon_price,
        profit, roi, monthly_sales, monthly_profit,
        bsr, margin,
        keepa_url, correspondance,
        _debug: results.length === 0 ? {
          c0: col0Text.substring(0, 40),
          c3_text: c3text.trim().substring(0, 100),
          correspondance_extracted: correspondance,
          c5_text: (cells[5] as HTMLElement).innerText.trim().substring(0, 80),
          c5_html: cells[5].innerHTML.substring(0, 200),
          c5_data_order: cells[5].getAttribute('data-order') ?? '',
          c5_attrs: cells[5].getAttributeNames().join(', '),
          c6: (cells[6] as HTMLElement).innerText.trim().substring(0, 40),
          c8: (cells[8] as HTMLElement).innerText.trim().substring(0, 60),
          c9: (cells[9] as HTMLElement).innerText.trim().substring(0, 60),
          c10: (cells[10] as HTMLElement).innerText.trim().substring(0, 60),
          c14: (cells[14] as HTMLElement).innerText.trim().substring(0, 60),
          keepa_url: keepa_url.substring(0, 80),
          total_cells: cells.length,
          countryIdx,
          marketplace: mktplace,
        } : undefined,
      });
    });

    return results;
  }, marketplace);

  console.log(`[scraper] DOM scrape: ${rows.length} products extracted`);
  if (rows.length > 0 && (rows[0] as any)._debug) {
    console.log('[scraper] First row debug:', JSON.stringify((rows[0] as any)._debug, null, 2));
    rows.forEach(r => { delete (r as any)._debug; });
  }
  return rows as ActorioProduct[];
}

/**
 * Cleanup
 */
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
    context = null;
    isLoggedIn = false;
    console.log('[scraper] Browser closed');
  }
}
