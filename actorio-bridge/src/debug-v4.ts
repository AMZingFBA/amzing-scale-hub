/**
 * Debug v4 - URL-based search with store=ALL
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

  // Track actorio API calls
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('actorio.com/products') && !url.includes('save_user') && !url.includes('.js') && !url.includes('.css')) {
      const method = res.request().method();
      console.log(`[API] ${method} ${res.status()} ${url.substring(0, 150)}`);
      try {
        const ct = res.headers()['content-type'] || '';
        if (ct.includes('json')) {
          const json = await res.json();
          console.log(`  JSON keys: ${Object.keys(json).join(', ')}`);
          writeFileSync('debug-v4-api.json', JSON.stringify(json, null, 2).substring(0, 100000));
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

  // Direct URL search with store=ALL
  const searchUrl = `${ACTORIO_URL}/products/search/?marketplace=FR&roi_min=30&store=ALL&similarity=2`;
  console.log(`\nNavigating to: ${searchUrl}`);
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

  // Wait for results to load (DataTables AJAX)
  console.log('Waiting for DataTables to load...');

  // Poll for results
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(2000);

    const state = await page.evaluate(() => {
      // Check for result count text
      const resultCountEl = document.querySelector('#result_count, .dataTables_info, [id*="result"]');
      const resultText = resultCountEl?.textContent?.trim() || '';

      // Count visible table rows (not filter tables)
      const allTables = document.querySelectorAll('table');
      let dataRows = 0;
      let dataTableId = '';
      allTables.forEach(t => {
        const rows = t.querySelectorAll('tbody tr');
        if (rows.length > 10) { // Likely a results table
          dataRows = rows.length;
          dataTableId = t.id || t.className.substring(0, 50);
        }
      });

      // Check for loading state
      const loading = document.querySelector('.loading, .dataTables_processing, [class*="processing"]');
      const isLoading = loading ? (loading as HTMLElement).style.display !== 'none' : false;

      // Look for "X résultats" text anywhere
      const bodyText = document.body?.innerText || '';
      const resultMatch = bodyText.match(/(\d+)\s*résultat/);

      return {
        resultText,
        dataRows,
        dataTableId,
        isLoading,
        resultMatch: resultMatch ? resultMatch[0] : null,
        url: window.location.href,
      };
    });

    console.log(`[${i * 2}s] rows=${state.dataRows} loading=${state.isLoading} result="${state.resultMatch || state.resultText}"`);

    if (state.dataRows > 0 && !state.isLoading) {
      console.log(`\nResults loaded! ${state.dataRows} rows in table "${state.dataTableId}"`);
      break;
    }
    if (state.resultMatch && state.resultMatch.includes('0')) {
      console.log('\n0 results returned');
      break;
    }
  }

  // Screenshot
  await page.screenshot({ path: 'debug-v4-results.png', fullPage: true });

  // Try to extract results data
  const results = await page.evaluate(() => {
    // Find the main results table (the one with many rows)
    const allTables = document.querySelectorAll('table');
    let resultTable: HTMLTableElement | null = null;
    allTables.forEach(t => {
      if (t.querySelectorAll('tbody tr').length > 5) resultTable = t as HTMLTableElement;
    });

    if (!resultTable) return { error: 'No result table found', tables: allTables.length };

    const headers = Array.from(resultTable.querySelectorAll('thead th'))
      .map(th => th.textContent?.trim() || '');

    const rows = Array.from(resultTable.querySelectorAll('tbody tr')).slice(0, 5).map(row => {
      return Array.from(row.querySelectorAll('td')).map(td => td.textContent?.trim().substring(0, 80) || '');
    });

    return { headers, rows, totalRows: resultTable.querySelectorAll('tbody tr').length };
  });

  console.log('\nResults extraction:');
  console.log(JSON.stringify(results, null, 2));

  // Save full page HTML
  const html = await page.evaluate(() => document.body?.innerHTML?.substring(0, 100000) || '');
  writeFileSync('debug-v4-page.html', html);

  await browser.close();
  console.log('\nDone');
}

debug().catch(console.error);
