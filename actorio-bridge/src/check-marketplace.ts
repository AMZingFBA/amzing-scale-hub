import 'dotenv/config';
import { chromium } from 'playwright';

async function run() {
  const email = process.env.ACTORIO_EMAIL!;
  const password = process.env.ACTORIO_PASSWORD!;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ locale: 'fr-FR' });

  await page.goto('https://app.actorio.com/accounts/login/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const cb = page.locator('button.cky-btn-accept[data-cky-tag="accept-button"]');
  if (await cb.isVisible().catch(() => false)) await cb.click();
  await page.locator('#id_username').fill(email);
  await page.locator('#id_password').fill(password);
  await page.locator('button:has-text("SE CONNECTER")').first().click();
  await page.waitForURL(u => !u.pathname.includes('/accounts/login'), { timeout: 15000 });

  await page.goto('https://app.actorio.com/products/search/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const info = await page.evaluate((): any => {
    const mp = document.querySelector('#id_marketplace') as HTMLSelectElement | null;
    const mpOptions = mp ? Array.from(mp.options).map(o => ({ val: o.value, text: o.text, selected: o.selected })) : [];
    
    const st = document.querySelector('#id_store') as HTMLSelectElement | null;
    const stOptions = st ? Array.from(st.options).slice(0, 10).map(o => ({ val: o.value, text: o.text })) : [];
    
    // Check if filter button is disabled
    const btn = document.querySelector('#filter_button') as HTMLButtonElement | null;
    
    return { mpOptions, stOptions: stOptions.slice(0, 5), btnDisabled: btn?.disabled, btnText: btn?.textContent?.trim() };
  });
  
  console.log('Marketplace options:', JSON.stringify(info.mpOptions, null, 2));
  console.log('Store options (first 5):', JSON.stringify(info.stOptions, null, 2));
  console.log('Filter button disabled:', info.btnDisabled, '| text:', info.btnText);

  // Try selecting marketplace FR and check what happens to store
  if (info.mpOptions.length > 0) {
    const frOption = info.mpOptions.find((o: any) => o.val === 'FR' || o.text.includes('France') || o.text.includes('FR'));
    if (frOption) {
      console.log('Found FR option:', frOption);
      await page.selectOption('#id_marketplace', frOption.val);
      await page.waitForTimeout(2000);
      const afterInfo = await page.evaluate((): any => {
        const st = document.querySelector('#id_store') as HTMLSelectElement | null;
        const stOpts = st ? Array.from(st.options).slice(0, 5).map(o => ({ val: o.value, text: o.text, selected: o.selected })) : [];
        const btn = document.querySelector('#filter_button') as HTMLButtonElement | null;
        return { stOpts, btnDisabled: btn?.disabled };
      });
      console.log('After MP select - store options:', JSON.stringify(afterInfo.stOpts));
      console.log('After MP select - btn disabled:', afterInfo.btnDisabled);
    }
  }

  await browser.close();
}

run().catch(console.error);
