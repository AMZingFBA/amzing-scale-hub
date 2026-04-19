/**
 * Debug script - captures screenshots and dumps page HTML to understand Actorio's structure
 */
import 'dotenv/config';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const ACTORIO_URL = 'https://app.actorio.com';

async function debug() {
  console.log('[debug] Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'fr-FR',
  });
  const page = await context.newPage();

  // Go to login page
  console.log('[debug] Navigating to Actorio...');
  await page.goto(`${ACTORIO_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {
    console.log('[debug] networkidle timeout, continuing...');
  });

  console.log(`[debug] Current URL: ${page.url()}`);

  // Try main page too
  if (!page.url().includes('/login')) {
    console.log('[debug] Redirected, trying main URL...');
    await page.goto(ACTORIO_URL, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    console.log(`[debug] Current URL: ${page.url()}`);
  }

  // Screenshot
  await page.screenshot({ path: 'debug-login.png', fullPage: true });
  console.log('[debug] Screenshot saved: debug-login.png');

  // Dump all input fields
  const inputs = await page.evaluate(() => {
    const els = document.querySelectorAll('input, button[type="submit"], button');
    return Array.from(els).map(el => ({
      tag: el.tagName,
      type: (el as any).type || '',
      name: (el as any).name || '',
      id: el.id || '',
      placeholder: (el as any).placeholder || '',
      className: el.className.substring(0, 80),
      text: el.textContent?.trim().substring(0, 50) || '',
      ariaLabel: el.getAttribute('aria-label') || '',
    }));
  });

  console.log('\n[debug] All inputs and buttons on page:');
  inputs.forEach((inp, i) => {
    console.log(`  ${i}: <${inp.tag.toLowerCase()} type="${inp.type}" name="${inp.name}" id="${inp.id}" placeholder="${inp.placeholder}" class="${inp.className}" text="${inp.text}" aria-label="${inp.ariaLabel}">`);
  });

  // Dump page title and key elements
  const title = await page.title();
  console.log(`\n[debug] Page title: ${title}`);

  // Check for iframes
  const iframes = page.frames();
  console.log(`[debug] Frames: ${iframes.length}`);
  for (const frame of iframes) {
    console.log(`  - ${frame.url()}`);
  }

  // Dump any forms
  const forms = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('form')).map(f => ({
      action: f.action,
      method: f.method,
      id: f.id,
      className: f.className.substring(0, 80),
    }));
  });
  console.log('\n[debug] Forms:', JSON.stringify(forms, null, 2));

  // Also dump the outerHTML of the first 3000 chars of body
  const bodyHtml = await page.evaluate(() => document.body?.innerHTML?.substring(0, 5000) || 'EMPTY');
  writeFileSync('debug-body.html', bodyHtml);
  console.log('[debug] Body HTML saved to debug-body.html');

  await browser.close();
  console.log('[debug] Done');
}

debug().catch(console.error);
