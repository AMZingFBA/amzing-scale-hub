/**
 * Diagnostic: inspect form structure and capture all network requests
 * when the filter button is clicked.
 */
import { chromium } from 'playwright';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const EMAIL = process.env.ACTORIO_EMAIL ?? '';
const PASSWORD = process.env.ACTORIO_PASSWORD ?? '';
const ACTORIO_URL = 'https://app.actorio.com';

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Track all requests/responses
  const log: any[] = [];
  page.on('request', req => {
    if (req.url().includes('actorio.com') && !req.url().includes('.png') && !req.url().includes('.jpg') && !req.url().includes('.css') && !req.url().includes('.js')) {
      log.push({ type: 'request', method: req.method(), url: req.url().substring(0, 120), postData: req.postData()?.substring(0, 200) });
    }
  });
  page.on('response', async res => {
    if (res.url().includes('actorio.com') && !res.url().includes('.png') && !res.url().includes('.jpg') && !res.url().includes('.css') && !res.url().includes('.js')) {
      const status = res.status();
      const loc = res.headers()['location'] ?? '';
      log.push({ type: 'response', status, url: res.url().substring(0, 120), location: loc || undefined });
    }
  });

  // Login
  console.log('Logging in...');
  await page.goto(`${ACTORIO_URL}/accounts/login/`, { waitUntil: 'domcontentloaded' });
  const acceptBtn = page.locator('button.cky-btn-accept[data-cky-tag="accept-button"]');
  if (await acceptBtn.isVisible().catch(() => false)) await acceptBtn.click();
  await page.fill('#id_username', EMAIL);
  await page.fill('#id_password', PASSWORD);
  await page.locator('button:has-text("SE CONNECTER"), input[type="submit"]').first().click();
  await page.waitForURL(url => !url.pathname.includes('/accounts/login'), { timeout: 15000 });
  console.log('Logged in:', page.url());
  log.length = 0; // clear login traffic

  // Load search page
  console.log('\nLoading search page...');
  await page.goto(`${ACTORIO_URL}/products/search/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#filter_button', { timeout: 15000 });
  log.length = 0;

  // Inspect the form
  const formInfo = await page.evaluate((): any => {
    const form = document.querySelector('form') as HTMLFormElement | null;
    if (!form) return { error: 'no form found' };
    const btn = document.querySelector('#filter_button') as HTMLButtonElement | null;
    const inputs = Array.from(form.querySelectorAll('input, select, textarea')).map((el: any) => ({
      id: el.id,
      name: el.name,
      type: el.type,
      value: el.value?.substring(0, 30),
    }));
    return {
      formMethod: form.method,
      formAction: form.action,
      formId: form.id,
      btnType: btn?.type,
      btnForm: btn?.getAttribute('form'),
      btnOnClick: btn?.getAttribute('onclick'),
      inputCount: inputs.length,
      inputs: inputs.slice(0, 20),
    };
  });
  console.log('\n=== FORM INFO ===');
  console.log(JSON.stringify(formInfo, null, 2));

  // Now do marketplace AJAX + fill ROI
  console.log('\nSetting marketplace FR via jQuery...');
  const mpResult = await page.evaluate((): any => {
    const jq = (window as any).jQuery;
    if (!jq) return { error: 'jQuery not found' };
    jq('#id_marketplace').val('FR').trigger('change');
    const hasFn = typeof (window as any).selectMarketplace === 'function';
    if (hasFn) (window as any).selectMarketplace();
    jq('#id_store').val(['ALL']);
    const btn = document.querySelector('#filter_button') as HTMLButtonElement | null;
    if (btn) { btn.disabled = false; btn.removeAttribute('disabled'); }
    return { jqVersion: jq.fn.jquery, hasSelectMarketplace: hasFn, mpVal: jq('#id_marketplace').val(), storeVal: jq('#id_store').val() };
  });
  console.log('jQuery eval result:', JSON.stringify(mpResult));

  await page.fill('#id_roi_0', '30').catch(() => {});

  // Wait for AJAX
  await page.waitForTimeout(3000);

  console.log('\nNetwork requests before click:');
  for (const entry of log) console.log(JSON.stringify(entry));
  log.length = 0;

  // Click filter button
  console.log('\nClicking filter button...');
  const navPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 25000 }).catch((e: any) => ({ error: e.message }));
  await page.locator('#filter_button').first().click();
  await navPromise;
  console.log('After click URL:', page.url());

  await page.waitForTimeout(2000);

  // Check what we got
  const pageInfo = await page.evaluate((): any => {
    const body = document.body?.innerText ?? '';
    const totalMatch = body.match(/sur\s+([\d\s]+)\s+résultat/i) ?? body.match(/([\d\s]+)\s+résultat/i);
    const mainTable = document.querySelector('table#main-table') as HTMLTableElement | null;
    const rows = mainTable?.tBodies[0]?.rows.length ?? 0;
    return {
      totalText: totalMatch ? totalMatch[0].trim() : 'NOT FOUND',
      tableRows: rows,
      urlOnPage: window.location.href.substring(0, 150),
    };
  });
  console.log('\n=== PAGE RESULT ===');
  console.log(JSON.stringify(pageInfo, null, 2));

  console.log('\nNetwork requests during/after click:');
  for (const entry of log) console.log(JSON.stringify(entry));

  fs.writeFileSync('/tmp/diag-form.json', JSON.stringify({ formInfo, mpResult, pageInfo, networkLog: log }, null, 2));
  console.log('\nSaved to /tmp/diag-form.json');

  await browser.close();
}

main().catch(console.error);
