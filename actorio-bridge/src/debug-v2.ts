/**
 * Debug v2 - Try multiple Actorio URLs to find the login page
 */
import 'dotenv/config';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const URLS_TO_TRY = [
  'https://app.actorio.com',
  'https://app.actorio.com/auth/login',
  'https://app.actorio.com/signin',
  'https://app.actorio.com/account/login',
  'https://actorio.com/login',
  'https://actorio.com',
];

async function debug() {
  console.log('[debug] Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'fr-FR',
  });

  for (const url of URLS_TO_TRY) {
    const page = await context.newPage();
    console.log(`\n[debug] Trying: ${url}`);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      // Wait a bit for SPA to render
      await page.waitForTimeout(3000);

      const finalUrl = page.url();
      const title = await page.title();
      console.log(`  -> URL: ${finalUrl}`);
      console.log(`  -> Title: ${title}`);

      // Check for input fields
      const inputs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('input')).map(el => ({
          type: el.type,
          name: el.name,
          id: el.id,
          placeholder: el.placeholder,
          ariaLabel: el.getAttribute('aria-label') || '',
        }));
      });

      if (inputs.length > 0) {
        console.log(`  -> Inputs found: ${inputs.length}`);
        inputs.forEach(inp => {
          console.log(`     <input type="${inp.type}" name="${inp.name}" id="${inp.id}" placeholder="${inp.placeholder}" aria-label="${inp.ariaLabel}">`);
        });
      }

      // Check for login-related text
      const hasLoginElements = await page.evaluate(() => {
        const text = document.body?.innerText || '';
        return {
          hasEmail: text.toLowerCase().includes('email') || text.toLowerCase().includes('e-mail'),
          hasPassword: text.toLowerCase().includes('password') || text.toLowerCase().includes('mot de passe'),
          hasSignIn: text.toLowerCase().includes('sign in') || text.toLowerCase().includes('connexion') || text.toLowerCase().includes('se connecter'),
          hasGoogle: text.toLowerCase().includes('google'),
        };
      });
      console.log(`  -> Login indicators:`, hasLoginElements);

      const safeName = url.replace(/[^a-z0-9]/gi, '_');
      await page.screenshot({ path: `debug-${safeName}.png` });
      console.log(`  -> Screenshot: debug-${safeName}.png`);

      // If we found login elements, dump the HTML
      if (hasLoginElements.hasEmail || hasLoginElements.hasPassword || hasLoginElements.hasSignIn) {
        const html = await page.evaluate(() => document.body?.innerHTML?.substring(0, 10000) || '');
        writeFileSync(`debug-${safeName}.html`, html);
        console.log(`  -> HTML saved: debug-${safeName}.html`);
      }
    } catch (err: any) {
      console.log(`  -> Error: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\n[debug] Done');
}

debug().catch(console.error);
