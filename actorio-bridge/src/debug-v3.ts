/**
 * Debug v3 - Use JavaScript to set select values (multiselect plugin)
 */
import 'dotenv/config';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const ACTORIO_URL = 'https://app.actorio.com';

async function debug() {
  const email = process.env.ACTORIO_EMAIL!;
  const password = process.env.ACTORIO_PASSWORD!;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'fr-FR',
  });
  const page = await context.newPage();

  // Track Actorio API calls
  const apiCalls: string[] = [];
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('actorio.com') && !url.includes('google') && !url.includes('cookie') && !url.includes('hubspot') && !url.includes('youtube') && !url.includes('messagebird')) {
      const method = res.request().method();
      apiCalls.push(`[${method}] ${res.status()} ${url}`);
      try {
        const ct = res.headers()['content-type'] || '';
        if (ct.includes('json')) {
          const json = await res.json();
          apiCalls.push(`  JSON: ${JSON.stringify(json).substring(0, 300)}`);
          if (Object.keys(json).length > 2) {
            writeFileSync('debug-v3-api.json', JSON.stringify(json, null, 2));
          }
        }
      } catch {}
    }
  });

  // Login
  await page.goto(`${ACTORIO_URL}/accounts/login/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const cookieBtn = page.locator('button.cky-btn-accept[data-cky-tag="accept-button"]');
  if (await cookieBtn.isVisible().catch(() => false)) await cookieBtn.click();
  await page.locator('#id_username').fill(email);
  await page.locator('#id_password').fill(password);
  await page.locator('button:has-text("SE CONNECTER")').first().click();
  await page.waitForURL(u => !u.pathname.includes('/accounts/login'), { timeout: 15000 });
  console.log(`Logged in: ${page.url()}`);

  // Search page
  await page.goto(`${ACTORIO_URL}/products/search/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  console.log(`Search page: ${page.url()}`);

  // Set ROI min using direct input (this works because it's a real input)
  await page.fill('#id_roi_0', '30');

  // Set marketplace using jQuery (since it's a custom multiselect)
  await page.evaluate(() => {
    const $ = (window as any).jQuery;
    if ($) {
      // Set marketplace value via jQuery
      $('#id_marketplace').val('FR');
      // Trigger the change handler
      if (typeof (window as any).selectMarketplace === 'function') {
        (window as any).selectMarketplace();
      }
      // Enable the filter button
      $('#filter_button').prop('disabled', false).removeAttr('disabled');
    }
  });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'debug-v3-before-click.png' });

  // Check filter_button state
  const isDisabled = await page.evaluate(() => {
    const btn = document.querySelector('#filter_button') as HTMLButtonElement;
    return btn ? btn.disabled : 'not found';
  });
  console.log(`Button disabled: ${isDisabled}`);

  // Click RECHERCHER
  console.log('Clicking RECHERCHER...');
  apiCalls.length = 0; // Reset to capture only search-related calls

  await page.locator('#filter_button').click();
  console.log('Clicked! Waiting for results...');

  // Wait for navigation or AJAX
  await page.waitForTimeout(20000);

  const afterUrl = page.url();
  console.log(`URL after search: ${afterUrl}`);
  await page.screenshot({ path: 'debug-v3-after-click.png', fullPage: true });

  // Check for DataTables or result rows
  const pageState = await page.evaluate(() => {
    const $ = (window as any).jQuery;
    const results: any = {};

    // Check DataTables
    if ($ && $.fn.DataTable) {
      const tables = $('table.dataTable');
      results.dataTables = tables.length;
      if (tables.length > 0) {
        try {
          const dt = tables.first().DataTable();
          results.dtRowCount = dt.rows().count();
          results.dtData = dt.rows().data().toArray().slice(0, 3);
        } catch (e: any) {
          results.dtError = e.message;
        }
      }
    }

    // Check all tables
    results.tables = Array.from(document.querySelectorAll('table')).map((t: any) => ({
      id: t.id,
      class: t.className.substring(0, 80),
      visibleRows: t.querySelectorAll('tbody tr:not([style*="display: none"])').length,
      totalRows: t.querySelectorAll('tbody tr').length,
    }));

    // Check for result count text
    const resultTextEl = document.querySelector('.dataTables_info, [class*="result-count"], [class*="showing"]');
    results.resultText = resultTextEl?.textContent?.trim() || 'none found';

    // Check loading indicators
    results.loading = !!document.querySelector('.loading, .spinner, [class*="loading"]');

    return results;
  });

  console.log('\nPage state after search:');
  console.log(JSON.stringify(pageState, null, 2));

  // Save post-search body HTML
  const bodyHtml = await page.evaluate(() => document.body?.innerHTML?.substring(0, 50000) || '');
  writeFileSync('debug-v3-results.html', bodyHtml);

  // Save API calls
  writeFileSync('debug-v3-api-calls.log', apiCalls.join('\n'));
  console.log(`\n${apiCalls.length} API calls captured`);

  await browser.close();
  console.log('Done');
}

debug().catch(console.error);
