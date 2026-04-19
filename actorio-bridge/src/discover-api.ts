/**
 * Discovery script - Intercepts Actorio's network to find their internal API.
 * Run with: npm run discover
 * This opens a visible browser so you can see what's happening.
 */
import 'dotenv/config';
import { chromium } from 'playwright';

const ACTORIO_URL = 'https://app.actorio.com';

async function discover() {
  const email = process.env.ACTORIO_EMAIL;
  const password = process.env.ACTORIO_PASSWORD;

  if (!email || !password) {
    console.error('Set ACTORIO_EMAIL and ACTORIO_PASSWORD in .env');
    process.exit(1);
  }

  console.log('[discover] Launching browser (visible)...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Intercept all API calls
  const apiCalls: { method: string; url: string; status: number; body?: any }[] = [];

  page.on('response', async (response) => {
    const url = response.url();
    // Only capture API calls (not static assets)
    if (
      url.includes('/api/') ||
      url.includes('/graphql') ||
      url.includes('/search') ||
      url.includes('/products') ||
      (url.includes('actorio') && response.request().resourceType() === 'xhr') ||
      (url.includes('actorio') && response.request().resourceType() === 'fetch')
    ) {
      const method = response.request().method();
      const status = response.status();
      let body: any = null;
      try {
        body = await response.json();
      } catch {
        // Not JSON
      }
      apiCalls.push({ method, url, status, body: body ? '(captured)' : null });
      console.log(`[API] ${method} ${status} ${url}`);
      if (body) {
        console.log(`  -> Response keys: ${Object.keys(body).join(', ')}`);
        if (body.results || body.data || body.items || body.products) {
          console.log(`  -> HAS RESULT DATA! Count: ${
            (body.results || body.data || body.items || body.products)?.length || 'unknown'
          }`);
        }
      }
    }
  });

  // Login
  console.log('[discover] Navigating to login...');
  await page.goto(`${ACTORIO_URL}/login`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshot-login.png' });

  console.log('[discover] Filling credentials...');
  // Try common selectors for email/password
  const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
  const passwordInput = page.locator('input[type="password"]').first();

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await page.screenshot({ path: 'screenshot-filled.png' });

  // Click submit
  const submitBtn = page.locator('button[type="submit"], button:has-text("Log in"), button:has-text("Sign in"), button:has-text("Connexion"), button:has-text("Se connecter")').first();
  await submitBtn.click();

  console.log('[discover] Waiting for navigation after login...');
  await page.waitForURL('**/products/**', { timeout: 30000 }).catch(() => {
    console.log('[discover] Did not redirect to /products, checking current URL...');
  });
  console.log(`[discover] Current URL: ${page.url()}`);
  await page.screenshot({ path: 'screenshot-after-login.png' });

  // Navigate to search
  console.log('[discover] Going to product search...');
  await page.goto(`${ACTORIO_URL}/products/search/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshot-search-page.png' });
  console.log(`[discover] Search page URL: ${page.url()}`);

  // Wait for user to do a manual search
  console.log('\n========================================');
  console.log('Browser is open. Manually do a search on Actorio.');
  console.log('I will capture all API calls.');
  console.log('Press Ctrl+C when done.');
  console.log('========================================\n');

  // Keep browser open
  await new Promise(() => {}); // Wait forever until Ctrl+C
}

discover().catch(console.error);
