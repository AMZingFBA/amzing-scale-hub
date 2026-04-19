/**
 * Debug search page - captures the full structure of Actorio's search page
 * after logging in, including all form elements, selectors, and network calls
 */
import 'dotenv/config';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const ACTORIO_URL = 'https://app.actorio.com';

async function debugSearch() {
  const email = process.env.ACTORIO_EMAIL!;
  const password = process.env.ACTORIO_PASSWORD!;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'fr-FR',
  });
  const page = await context.newPage();

  // Capture API calls
  const apiCalls: string[] = [];
  page.on('request', (req) => {
    if (req.resourceType() === 'xhr' || req.resourceType() === 'fetch') {
      apiCalls.push(`[REQ] ${req.method()} ${req.url()}`);
      const body = req.postData();
      if (body) apiCalls.push(`  BODY: ${body.substring(0, 500)}`);
    }
  });
  page.on('response', async (res) => {
    if (res.request().resourceType() === 'xhr' || res.request().resourceType() === 'fetch') {
      apiCalls.push(`[RES] ${res.status()} ${res.url()}`);
      try {
        const json = await res.json();
        apiCalls.push(`  DATA keys: ${Object.keys(json).join(', ')}`);
        if (json.results) apiCalls.push(`  results count: ${json.results.length}`);
        if (json.count !== undefined) apiCalls.push(`  count: ${json.count}`);
        // Save first API response that looks like data
        if (json.results || json.data || json.count !== undefined) {
          writeFileSync('debug-api-response.json', JSON.stringify(json, null, 2).substring(0, 50000));
          apiCalls.push('  -> SAVED to debug-api-response.json');
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

  // Navigate to search page
  console.log('[debug] Going to search page...');
  await page.goto(`${ACTORIO_URL}/products/search/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  console.log(`[debug] Search page URL: ${page.url()}`);

  await page.screenshot({ path: 'debug-search-page.png', fullPage: true });
  console.log('[debug] Screenshot saved');

  // Dump all form elements
  const formElements = await page.evaluate(() => {
    const elements: any[] = [];

    // All inputs
    document.querySelectorAll('input, select, textarea, button').forEach(el => {
      elements.push({
        tag: el.tagName.toLowerCase(),
        type: (el as any).type || '',
        name: (el as any).name || '',
        id: el.id || '',
        className: el.className.substring(0, 100),
        placeholder: (el as any).placeholder || '',
        value: (el as any).value?.substring(0, 50) || '',
        text: el.textContent?.trim().substring(0, 80) || '',
        disabled: (el as any).disabled || false,
        visible: el.getBoundingClientRect().height > 0,
      });
    });

    return elements;
  });

  console.log(`\n[debug] Form elements on search page (${formElements.length} total):`);
  formElements.filter(e => e.visible).forEach((el, i) => {
    console.log(`  ${i}: <${el.tag} type="${el.type}" name="${el.name}" id="${el.id}" placeholder="${el.placeholder}" value="${el.value}" disabled=${el.disabled} class="${el.className}">${el.text ? ` "${el.text}"` : ''}`);
  });

  // Look for the search/filter button specifically
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a.btn, input[type="submit"]')).map(el => ({
      tag: el.tagName,
      id: el.id,
      text: el.textContent?.trim().substring(0, 80) || '',
      className: el.className.substring(0, 100),
      disabled: (el as any).disabled || false,
      href: (el as any).href || '',
    }));
  });
  console.log(`\n[debug] Buttons:`);
  buttons.forEach((b, i) => {
    console.log(`  ${i}: <${b.tag} id="${b.id}" disabled=${b.disabled} class="${b.className}"> "${b.text}"`);
  });

  // Find all dropdowns/selects
  const selects = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('select')).map(sel => ({
      id: sel.id,
      name: sel.name,
      className: sel.className.substring(0, 80),
      options: Array.from(sel.options).slice(0, 10).map(o => ({ value: o.value, text: o.text })),
      optionCount: sel.options.length,
    }));
  });
  console.log(`\n[debug] Selects:`);
  selects.forEach(s => {
    console.log(`  <select id="${s.id}" name="${s.name}" options=${s.optionCount}>`);
    s.options.forEach(o => console.log(`    "${o.value}" -> "${o.text}"`));
    if (s.optionCount > 10) console.log(`    ... and ${s.optionCount - 10} more`);
  });

  // Save full HTML of search form area
  const searchHtml = await page.evaluate(() => {
    // Try to find the main form or filter area
    const form = document.querySelector('form') || document.querySelector('[class*="filter"]') || document.querySelector('main') || document.body;
    return form?.innerHTML?.substring(0, 30000) || '';
  });
  writeFileSync('debug-search-form.html', searchHtml);
  console.log('\n[debug] Search form HTML saved to debug-search-form.html');

  // Save API calls log
  writeFileSync('debug-api-calls.log', apiCalls.join('\n'));
  console.log(`[debug] ${apiCalls.length} API calls saved to debug-api-calls.log`);

  await browser.close();
  console.log('[debug] Done');
}

debugSearch().catch(console.error);
