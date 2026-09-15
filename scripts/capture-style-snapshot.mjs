/**
 * Captures a visual fingerprint of every route, in both languages and both
 * themes, so a refactoring can be proven not to change the rendered result.
 *
 * The fingerprint is keyed on **visible text** rather than on selectors or DOM
 * position: class names and element nesting are exactly what the refactoring
 * moves around, while the copy is functionally invariant. For every text node
 * we record the resolved colours, typography and box size, plus a page-wide
 * histogram of every colour in use.
 *
 * Puppeteer is deliberately not a dependency of this repo — update-screenshots.yml
 * provisions it the same way. `npm install --no-save` cannot run here (npm does
 * not understand the pnpm `workspace:` protocol in the lockfile), so install it
 * outside the project and link it in:
 *
 *   mkdir -p /tmp/pptr && cd /tmp/pptr && npm init -y
 *   npm install puppeteer@24.40.0
 *   cd <repo> && ln -sfn /tmp/pptr/node_modules/puppeteer node_modules/puppeteer
 *
 * Then, with the dev server running:
 *
 *   pnpm dev
 *   node scripts/capture-style-snapshot.mjs --out .snapshots/before.json
 *   node scripts/diff-style-snapshot.mjs .snapshots/before.json .snapshots/after.json
 *
 * Two captures of identical code produce byte-identical fingerprints, so any
 * reported difference is a real rendering change.
 */

import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const BASE_URL = process.env.SNAPSHOT_BASE_URL ?? 'http://localhost:3000';
const LANGUAGES = ['fr', 'en'];
const THEMES = ['light', 'dark'];
const ROUTES = [
  '',
  '/it-services',
  '/video-services',
  '/support-contract',
  '/privacy-policy',
  '/404',
];

const VIEWPORT = { width: 1440, height: 900 };
/** Let fonts, lazy images and the Lottie players settle before reading styles. */
const SETTLE_MS = 2500;

function parseOutPath() {
  const index = process.argv.indexOf('--out');
  const value = index >= 0 ? process.argv[index + 1] : null;
  return resolve(root, value ?? '.snapshots/snapshot.json');
}

/**
 * Runs in the page. Returns the style fingerprint for the current document.
 *
 * Scrolls the whole page first and forces every AOS element to its final state,
 * otherwise scroll-triggered sections are captured mid-animation and the
 * snapshot is not reproducible.
 */
async function fingerprintPage() {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
    window.scrollTo(0, y);
    await sleep(120);
  }
  window.scrollTo(0, 0);

  document.querySelectorAll('[data-aos]').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.transition = 'none';
  });

  // Wait for the webfonts AFTER the scroll pass, not before: below-the-fold text
  // only requests its face once it renders, so an earlier `fonts.ready` resolves
  // too soon. Text laid out in the fallback face measures differently, and that
  // race made one button oscillate between 120px and 143px.
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  await sleep(400);

  const normalise = (value) => value.replace(/\s+/g, ' ').trim();
  const textStyles = {};
  const boxes = {};
  const colorHistogram = {};

  const bump = (key) => {
    colorHistogram[key] = (colorHistogram[key] ?? 0) + 1;
  };

  for (const element of document.querySelectorAll('body *')) {
    const style = getComputedStyle(element);

    if (style.color) bump(`color ${style.color}`);
    if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      bump(`background ${style.backgroundColor}`);
    }
    if (style.borderTopWidth !== '0px') bump(`border ${style.borderTopColor}`);

    // Only elements whose own text is a direct child are keyed, so a wrapper
    // does not shadow the element that actually paints the text.
    const ownText = normalise(
      Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent)
        .join(' '),
    );
    if (!ownText || ownText.length < 3) continue;

    const key = `${element.tagName.toLowerCase()}|${ownText.slice(0, 120)}`;
    if (textStyles[key]) continue;

    textStyles[key] = {
      color: style.color,
      backgroundColor: style.backgroundColor,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontFamily: style.fontFamily.split(',')[0].replace(/["']/g, ''),
      lineHeight: style.lineHeight,
      textAlign: style.textAlign,
    };

    const rect = element.getBoundingClientRect();
    boxes[key] = { width: Math.round(rect.width), height: Math.round(rect.height) };
  }

  return {
    textStyles,
    boxes,
    colorHistogram,
    documentHeight: document.documentElement.scrollHeight,
    textNodeCount: Object.keys(textStyles).length,
  };
}

async function capturePage(browser, { language, route, theme }) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  const url = `${BASE_URL}/${language}${route}`;

  // Seed the persisted preferences before the app boots: theme and language are
  // plain cookies, and the consent record lives in localStorage. Without the
  // consent entry the cookie banner overlays every page.
  await page.evaluateOnNewDocument(
    (themeValue, languageValue) => {
      document.cookie = `theme=${themeValue}; path=/`;
      document.cookie = `language=${languageValue}; path=/`;
      localStorage.setItem(
        'cookie_consent',
        JSON.stringify({
          necessary: true,
          googleAnalytics: false,
          themePreference: true,
          languagePreference: true,
          timestamp: '2020-01-01T00:00:00.000Z',
        }),
      );
    },
    theme,
    language,
  );

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60_000 });
  await new Promise((r) => setTimeout(r, SETTLE_MS));

  const fingerprint = await page.evaluate(fingerprintPage);
  await page.close();

  return fingerprint;
}

const outPath = parseOutPath();
mkdirSync(dirname(outPath), { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

const snapshot = { baseUrl: BASE_URL, viewport: VIEWPORT, pages: {} };

try {
  for (const language of LANGUAGES) {
    for (const theme of THEMES) {
      for (const route of ROUTES) {
        const key = `${language}${route || '/'}@${theme}`;
        process.stdout.write(`capturing ${key} … `);
        snapshot.pages[key] = await capturePage(browser, { language, route, theme });
        console.log(`${snapshot.pages[key].textNodeCount} text nodes`);
      }
    }
  }
} finally {
  await browser.close();
}

writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`\nWrote ${Object.keys(snapshot.pages).length} page fingerprints to ${outPath}`);
