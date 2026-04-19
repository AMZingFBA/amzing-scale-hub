/**
 * Debug search with actual click - captures state after clicking RECHERCHER
 */
import 'dotenv/config';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const ACTORIO_URL = 'https://app.actorio.com';

async function debugSearchClick() {
  const email = process.env.ACTORIO_EMAIL!;
  const password = process.env.ACTORIO_PASSWORD!;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'fr-FR',
  });
  const page = await context.newPage();

  // Track ALL XHR/fetch to actorio.com
  const apiCalls: string[] = [];
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('actorio.com') && !url.includes('google') && !url.includes('cookie') && !url.includes('hubspot')) {
      const method = res.request().method();
      apiCalls.push(`[${method}] ${res.status()} ${url}`);
      try {
        const contentType = res.headers()['content-type'] || '';
        if (contentType.includes('json')) {
          const json = await res.json();
          apiCalls.push(`  JSON keys: ${Object.keys(json).join(', ')}`);
          apiCalls.push(`  JSON preview: ${JSON.stringify(json).substring(0, 500)}`);
          writeFileSync('debug-search-api-response.json', JSON.stringify(json, null, 2));
        } else if (contentType.includes('html')) {
          const text = await res.text();
          apiCalls.push(`  HTML length: ${text.length}`);
          if (text.length > 1000) {
            writeFileSync('debug-search-result-page.html', text);
            apiCalls.push('  -> SAVED to debug-search-result-page.html');
          }
        }
      } catch {}
    }
  });

  // Login
  console.log('[debug] Logging in...');
  await page.goto(`${ACTORIO_URL}/accounts/login/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  const acceptBtn = page.locator('button.cky-btn-accept[data-cky-tag="accept-button"]');
  if (await acceptBtn.isVisible().catch(() => false)) await acceptBtn.click();
  await page.locator('#id_username').fill(email);
  await page.locator('#id_password').fill(password);
  await page.locator('button:has-text("SE CONNECTER")').first().click();
  await page.waitForURL((url) => !url.pathname.includes('/accounts/login'), { timeout: 15000 });
  console.log(`[debug] Logged in: ${page.url()}`);

  // Go to search
  console.log('[debug] Going to search...');
  await page.goto(`${ACTORIO_URL}/products/search/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Apply a simple filter: ROI min 30
  console.log('[debug] Setting ROI min = 30...');
  await page.locator('#id_roi_0').fill('30');
  await page.locator('#id_roi_0').dispatchEvent('input');
  await page.locator('#id_roi_0').dispatchEvent('change');
  await page.waitForTimeout(500);

  // Set marketplace to FR
  await page.locator('#id_marketplace').selectOption('FR');
  await page.waitForTimeout(500);

  // Check if button is now enabled
  const btnDisabled = await page.locator('#filter_button').getAttribute('disabled');
  console.log(`[debug] Button disabled: ${btnDisabled}`);

  // Force enable it
  await page.evaluate(() => {
    const btn = document.querySelector('#filter_button') as HTMLButtonElement;
    if (btn) { btn.disabled = false; btn.removeAttribute('disabled'); }
  });

  // Screenshot before click
  await page.screenshot({ path: 'debug-before-click.png' });

  // Click RECHERCHER
  console.log('[debug] Clicking RECHERCHER...');
  await page.locator('#filter_button').click();

  // Wait and capture
  console.log('[debug] Waiting 15 seconds for results...');
  await page.waitForTimeout(15000);

  const currentUrl = page.url();
  console.log(`[debug] Current URL after search: ${currentUrl}`);
  await page.screenshot({ path: 'debug-after-click.png', fullPage: true });

  // Dump table structure
  const tableInfo = await page.evaluate(() => {
    const tables = document.querySelectorAll('table');
    const info: any[] = [];
    tables.forEach((t, idx) => {
      const rows = t.querySelectorAll('tbody tr');
      info.push({
        index: idx,
        id: t.id,
        className: t.className.substring(0, 100),
        rowCount: rows.length,
        headerCells: Array.from(t.querySelectorAll('thead th, thead td')).map(th => th.textContent?.trim().substring(0, 30) || ''),
        firstRowCells: rows.length > 0
          ? Array.from(rows[0].querySelectorAll('td')).map(td => td.textContent?.trim().substring(0, 50) || '')
          : [],
      });
    });
    return info;
  });

  console.log('\n[debug] Tables found:');
  tableInfo.forEach(t => {
    console.log(`  Table #${t.index}: id="${t.id}" class="${t.className}" rows=${t.rowCount}`);
    if (t.headerCells.length) console.log(`    Headers: ${t.headerCells.join(' | ')}`);
    if (t.firstRowCells.length) console.log(`    First row: ${t.firstRowCells.join(' | ')}`);
  });

  // Also check for DataTables
  const dtInfo = await page.evaluate(() => {
    const dt = (window as any).jQuery?.fn?.dataTable;
    if (!dt) return 'No DataTables detected';
    const tables = (window as any).jQuery('table.dataTable');
    return `DataTables: ${tables.length} tables`;
  });
  console.log(`\n[debug] ${dtInfo}`);

  // Save API calls log
  writeFileSync('debug-search-click-api.log', apiCalls.join('\n'));
  console.log(`[debug] ${apiCalls.length} API calls saved`);

  await browser.close();
  console.log('[debug] Done');
}

debugSearchClick().catch(console.error);
