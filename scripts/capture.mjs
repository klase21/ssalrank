import { chromium } from 'playwright';
const base = process.env.CAPTURE_URL || 'https://ssalrank-bt8bro5fr-klase21s-projects.vercel.app';
const outDir = 'docs/images';
async function shot(url, path, viewport, wait=1500){
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(wait);
  await page.screenshot({ path, fullPage: true });
  console.log('saved', path);
  await browser.close();
}
await shot(base, `${outDir}/ranking-desktop.png`, { width: 1280, height: 800 });
await shot(base + '/post/1?lang=ko', `${outDir}/detail-desktop.png`, { width: 1280, height: 800 });
await shot(base + '/admin', `${outDir}/admin-desktop.png`, { width: 1280, height: 800 });
await shot(base, `${outDir}/ranking-mobile.png`, { width: 390, height: 844 });
await shot(base + '/post/1?lang=en', `${outDir}/detail-mobile.png`, { width: 390, height: 844 });
console.log('done');
