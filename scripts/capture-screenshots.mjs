import puppeteer from 'puppeteer';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dataPath = resolve(root, 'src/data/itPortfolio.json');
const outputDir = resolve(root, 'public/screenshots');

mkdirSync(outputDir, { recursive: true });

const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

// Resolves a screenshot URL: absolute URLs are used as-is; relative paths are
// prefixed with the origin of the item's base URL.
function resolveScreenshotUrl(screenshotUrl, baseUrl) {
  if (screenshotUrl.startsWith('http://') || screenshotUrl.startsWith('https://')) {
    return screenshotUrl;
  }
  try {
    const base = new URL(baseUrl);
    const path = screenshotUrl.startsWith('/') ? screenshotUrl : `/${screenshotUrl}`;
    return `${base.origin}${path}`;
  } catch {
    return screenshotUrl;
  }
}

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

let successCount = 0;
let errorCount = 0;

for (const item of data.items) {
  if (!item.screenshotUrls || item.screenshotUrls.length === 0) continue;

  for (let i = 0; i < item.screenshotUrls.length; i++) {
    const url = resolveScreenshotUrl(item.screenshotUrls[i], item.url || item.screenshotUrls[i]);
    const outputPath = resolve(outputDir, `${item.id}-${i}.jpg`);

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

      // Mask the webdriver flag so pages do not activate bot-detection or cookie banners
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
      });

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Scroll progressively through the page to trigger lazy-loaded images
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 300;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= document.body.scrollHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              resolve();
            }
          }, 100);
        });
      });

      // Wait for lazy-loaded images to finish rendering after the scroll pass
      await new Promise((r) => setTimeout(r, 3000));

      await page.screenshot({
        path: outputPath,
        type: 'jpeg',
        quality: 85,
        fullPage: false,
      });

      await page.close();
      console.log(`✓ ${item.id}-${i}.jpg  ← ${url}`);
      successCount++;
    } catch (err) {
      console.error(`✗ ${item.id}-${i}  ← ${url}  (${err.message})`);
      errorCount++;
    }
  }
}

await browser.close();

console.log(`\nDone: ${successCount} succeeded, ${errorCount} failed`);
