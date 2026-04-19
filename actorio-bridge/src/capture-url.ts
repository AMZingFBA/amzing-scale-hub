import 'dotenv/config';
import { chromium } from 'playwright';

async function run() {
  const email = process.env.ACTORIO_EMAIL!;
  const password = process.env.ACTORIO_PASSWORD!;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
    locale: 'fr-FR',
  });

  // Intercept all responses
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('actorio.com') && !url.includes('.png') && !url.includes('.svg') && !url.includes('.js') && !url.includes('.css') && !url.includes('.woff')) {
      const ct = res.headers()['content-type'] ?? '';
      console.log(`[resp] ${res.request().method()} ${res.status()} ${ct.substring(0, 20)} ${url.substring(0, 120)}`);
      // Log request body for POST calls
      const reqBody = res.request().postData();
      if (reqBody) console.log(`  req body: ${reqBody.substring(0, 200)}`);
      try {
        if (ct.includes('json')) {
          const body = await res.json();
          console.log(`  JSON keys: ${Object.keys(body).join(', ')}; recordsTotal: ${body.recordsTotal ?? 'n/a'}`);
        }
      } catch {}
    }
  });

  await page.goto('https://app.actorio.com/accounts/login/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const cb = page.locator('button.cky-btn-accept[data-cky-tag="accept-button"]');
  if (await cb.isVisible().catch(() => false)) await cb.click();
  await page.locator('#id_username').fill(email);
  await page.locator('#id_password').fill(password);
  await page.locator('button:has-text("SE CONNECTER")').first().click();
  await page.waitForURL(u => !u.pathname.includes('/accounts/login'), { timeout: 15000 });
  console.log('Logged in:', page.url());

  await page.goto('https://app.actorio.com/products/search/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Find and inspect the marketplace UI element
  const marketplaceInfo = await page.evaluate((): any => {
    // Look for marketplace-related elements
    const mkArea = document.querySelector('#id_marketplace, [class*="marketplace"], [id*="marketplace"]');
    const parent = mkArea?.parentElement;
    return {
      mkHtml: mkArea?.outerHTML?.substring(0, 500),
      parentHtml: parent?.outerHTML?.substring(0, 500),
      // Look for FR flag/option anywhere
      frOption: document.querySelector('[data-value="FR"], [data-marketplace="FR"], [value="FR"]')?.outerHTML?.substring(0, 200),
      // Options in the marketplace select
      selectOptions: Array.from(document.querySelectorAll('#id_marketplace option') ?? []).map((o: any) => ({ value: o.value, text: o.textContent?.trim().substring(0, 20) })).slice(0, 10),
    };
  });
  console.log('Marketplace UI:', JSON.stringify(marketplaceInfo, null, 2));

  // Store options
  const storeOptions = await page.evaluate((): any[] =>
    Array.from(document.querySelectorAll('#id_store option') ?? []).slice(0, 10).map((o: any) => ({ value: o.value, text: o.textContent?.trim().substring(0, 30) }))
  );
  console.log('Store options (first 10):', JSON.stringify(storeOptions, null, 2));

  // Try clicking the actual FR marketplace element in the UI
  // Actorio likely has a custom multiselect dropdown that shows flag icons
  const selMarketplace = await page.locator('#id_marketplace option[value="FR"]').count();
  if (selMarketplace > 0) {
    await page.selectOption('#id_marketplace', 'FR');
    await page.waitForTimeout(1000);
    console.log('Selected marketplace FR via selectOption');
  }

  // Fill roi_min
  await page.fill('#id_roi_0', '30');
  await page.waitForTimeout(500);

  // Enable filter button (it's disabled until a marketplace is selected)
  await page.evaluate((): void => {
    const btn = document.querySelector('#filter_button') as HTMLButtonElement | null;
    if (btn) { btn.disabled = false; btn.removeAttribute('disabled'); }
  });

  console.log('\nClicking RECHERCHER...');
  const navPromise = page.waitForURL(() => true, { timeout: 15000 }).catch(() => {});
  await page.locator('#filter_button').click();
  await navPromise;
  await page.waitForTimeout(5000);

  const finalUrl = page.url();
  console.log('\nURL after search:', finalUrl);

  // Count visible rows + result text
  const state = await page.evaluate((): any => {
    const allTables = Array.from(document.querySelectorAll('table')) as HTMLTableElement[];
    let directRows = 0;
    allTables.forEach(function(t) {
      const tb = t.tBodies[0];
      if (tb && tb.rows.length > directRows) directRows = tb.rows.length;
    });
    const body = document.body?.innerText ?? '';
    const match = body.match(/(\d[\d\s]*)\s*résultat/);
    // Check first row's col9 for roi value
    let firstRoi = '';
    allTables.forEach(function(t) {
      const tb = t.tBodies[0];
      if (tb && tb.rows.length > 5) {
        const firstRow = tb.rows[0] as HTMLTableRowElement;
        if (firstRow.cells.length > 9) {
          firstRoi = (firstRow.cells[9] as HTMLElement).innerText.trim().substring(0, 30);
        }
      }
    });
    return { directRows, resultText: match ? match[0] : 'none', firstRoi };
  });
  console.log('\nResult state:', state);

  await browser.close();
}

run().catch(console.error);
