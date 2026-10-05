// Builds public/Nitesh-Shantha-Kumar-CV.pdf from the print-first /cv page (public/cv.html).
// Usage (from site/): start `npx wrangler dev`, then `node tools/build-cv.mjs [url]`.
// Needs Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`).
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const url = process.argv[2] || 'http://localhost:8787/cv';
const out = fileURLToPath(new URL('../public/Nitesh-Shantha-Kumar-CV.pdf', import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
await browser.close();
console.log('wrote', out);
