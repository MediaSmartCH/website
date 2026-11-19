import puppeteer from 'puppeteer';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dataPath = resolve(root, 'src/features/it-services/data/it-portfolio.json');
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

// One capture job: where to point the browser, at what size, in which colour
// scheme, and where the JPEG lands.
const jobs = [];

for (const item of data.items) {
  // `hasDarkPreview` means the site honours prefers-color-scheme and the
  // gallery swaps the preview with the site theme, so a dark twin has to exist
  // next to every light asset. Sites without a dark theme stay light-only:
  // capturing them in dark would just re-shoot the same light page.
  const schemes = item.hasDarkPreview ? ['light', 'dark'] : ['light'];
  const viewport = item.previewViewport ?? { width: 1440, height: 900 };

  if (item.screenshotUrls?.length) {
    for (let i = 0; i < item.screenshotUrls.length; i++) {
      const url = resolveScreenshotUrl(item.screenshotUrls[i], item.url || item.screenshotUrls[i]);
      for (const scheme of schemes) {
        const suffix = scheme === 'dark' ? '-dark' : '';
        jobs.push({
          url,
          viewport,
          scheme,
          output: resolve(outputDir, `${item.id}-${i}${suffix}.jpg`),
        });
      }
    }
    continue;
  }

  // Items carrying hand-placed `images` are not regenerated here; only their
  // dark twin is, from the item's own URL, so the two stay in step.
  if (item.hasDarkPreview && item.images?.length && item.url) {
    for (const image of item.images) {
      jobs.push({
        url: item.url,
        viewport,
        scheme: 'dark',
        output: resolve(root, 'public', image.replace(/^\//, '').replace(/(\.[a-z0-9]+)$/i, '-dark$1')),
      });
    }
  }
}

for (const job of jobs) {
  const { url, viewport, scheme, output: outputPath } = job;

  try {
    const page = await browser.newPage();
    await page.setViewport({ deviceScaleFactor: 1, ...viewport });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);

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
    console.log(`✓ ${basename(outputPath)}  ← ${url} (${scheme})`);
    successCount++;
  } catch (err) {
    console.error(`✗ ${basename(outputPath)}  ← ${url} (${scheme})  (${err.message})`);
    errorCount++;
  }
}

await browser.close();

console.log(`\nDone: ${successCount} succeeded, ${errorCount} failed`);
