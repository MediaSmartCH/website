/**
 * Renders the first frame of every .lottie file to a small WebP "poster".
 *
 * DotAnim shows that poster the instant a slot appears and swaps in the live
 * player once it has drawn its first frame — and with animations switched off
 * the poster is the only thing rendered, so it has to look right at full
 * display size, not merely fill the box. Without it, the box stays empty for
 * as long as the DotLottie runtime (~1.7MB of WASM) plus the animation file
 * take to arrive — measured at 1.7s on a fast machine and 4.5s on a CPU four
 * times slower, which a quick scroll easily outruns.
 *
 * Posters are committed, not built on every `pnpm build`: they only change when
 * an animation does, and generating them needs puppeteer, which is deliberately
 * not a dependency of this repo. Provision it the same way the style snapshot
 * harness does, then:
 *
 *   node scripts/generate-lottie-posters.mjs
 *
 * Re-run it after adding or replacing a .lottie file.
 */

import { createServer } from 'http';
import { createReadStream, existsSync, readdirSync } from 'fs';
import { mkdir, readdir, writeFile } from 'fs/promises';
import { dirname, extname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const lottieRoot = join(root, 'src/assets/lotties');
const posterRoot = join(lottieRoot, 'posters');

/**
 * Long edges to render, in pixels.
 *
 * One file per width, offered to the browser through a srcset so it fetches the
 * one it actually needs instead of always the largest. Measured on the hero,
 * which is the page's LCP element:
 *
 *   phone 360 @3x      310 CSS px ->  930 device px
 *   Lighthouse mobile  362 CSS px ->  950 device px
 *   Lighthouse desktop 863 CSS px ->  863 device px
 *   desktop 1920 @2x  1200 CSS px -> 2400 device px
 *
 * So 1000 covers both Lighthouse profiles almost exactly, 700 covers the
 * smaller card slots on a 1x desktop, and 1400 stays for high-density desktops.
 * A width larger than the animation's own drawn size is skipped rather than
 * upscaled.
 */
const POSTER_LONG_EDGES = [700, 1000, 1400];
/** WebP quality. Flat vector art stays clean well below the default, and at
 *  this size the extra pixels buy more perceived sharpness than the bitrate
 *  would — 1400/0.62 and 1100/0.78 weigh the same. */
const POSTER_QUALITY = 0.62;

const MIME = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.wasm': 'application/wasm',
  '.lottie': 'application/octet-stream',
  '.json': 'application/json',
};

/** Serves the repo read-only so the page can import the runtime and the assets. */
function startStaticServer() {
  const server = createServer((req, res) => {
    const filePath = join(root, decodeURIComponent(req.url.split('?')[0]));
    // Refuse anything resolving outside the repo.
    if (!filePath.startsWith(root) || !existsSync(filePath)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    });
    createReadStream(filePath).pipe(res);
  });

  return new Promise((ready) => {
    server.listen(0, '127.0.0.1', () => ready({ server, port: server.address().port }));
  });
}

async function findLottieFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('._')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full !== posterRoot) found.push(...(await findLottieFiles(full)));
    } else if (entry.name.endsWith('.lottie')) {
      found.push(full);
    }
  }
  return found.sort();
}

function resolveWebRuntime() {
  const base = join(root, 'node_modules/.pnpm');
  const match = existsSync(base)
    ? readdirSync(base).find((d) => d.startsWith('@lottiefiles+dotlottie-web@'))
    : null;
  if (!match) {
    throw new Error('@lottiefiles/dotlottie-web not found under node_modules/.pnpm');
  }
  return `node_modules/.pnpm/${match}/node_modules/@lottiefiles/dotlottie-web/dist`;
}

/**
 * Runs in the page: draws frame 0 of `src` and returns it as a WebP data URL.
 *
 * `render` is awaited rather than `load`, because `load` only means the file
 * was parsed — the canvas is still blank at that point.
 */
async function renderPoster(src, longEdge, quality) {
  const { DotLottie } = window.__dotlottie;

  const canvas = document.createElement('canvas');
  // Square working surface: with the default "contain" fit the art is drawn
  // letterboxed inside it, and the exact box is recoverable from the animation's
  // own aspect ratio — no second render pass needed.
  canvas.width = longEdge;
  canvas.height = longEdge;
  document.body.appendChild(canvas);

  try {
    const player = new DotLottie({ canvas, src, autoplay: false, loop: false });

    await new Promise((done, fail) => {
      const timer = setTimeout(() => fail(new Error('render timeout')), 15000);
      player.addEventListener('render', () => { clearTimeout(timer); done(); });
      player.addEventListener('loadError', (event) => {
        clearTimeout(timer);
        fail(new Error(String(event?.error ?? 'loadError')));
      });
    });

    const size = player.animationSize?.() ?? {};
    const ratio = (size.width || longEdge) / (size.height || longEdge);
    const drawnW = ratio >= 1 ? longEdge : Math.round(longEdge * ratio);
    const drawnH = ratio >= 1 ? Math.round(longEdge / ratio) : longEdge;
    const offsetX = Math.round((longEdge - drawnW) / 2);
    const offsetY = Math.round((longEdge - drawnH) / 2);

    const out = document.createElement('canvas');
    out.width = drawnW;
    out.height = drawnH;
    out
      .getContext('2d')
      .drawImage(canvas, offsetX, offsetY, drawnW, drawnH, 0, 0, drawnW, drawnH);

    player.destroy();
    return { dataUrl: out.toDataURL('image/webp', quality), width: drawnW, height: drawnH };
  } finally {
    canvas.remove();
  }
}

const { server, port } = await startStaticServer();
const runtimeDir = resolveWebRuntime();
const origin = `http://127.0.0.1:${port}`;

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 60_000,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage();
  await page.goto(`${origin}/package.json`, { waitUntil: 'domcontentloaded' });
  await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');

  await page.evaluate(
    async (runtime, wasm) => {
      const mod = await import(runtime);
      mod.DotLottie.setWasmUrl(wasm);
      window.__dotlottie = mod;
    },
    `${origin}/${runtimeDir}/index.js`,
    `${origin}/${runtimeDir}/dotlottie-player.wasm`,
  );

  const files = await findLottieFiles(lottieRoot);
  console.log(`${files.length} animations à traiter\n`);

  let totalBytes = 0;
  for (const file of files) {
    const rel = relative(lottieRoot, file);
    const target = join(posterRoot, rel.replace(/\.lottie$/, '.webp'));

    const src = `${origin}/${encodeURI(relative(root, file).split('\\').join('/'))}`;
    const rendered = [];
    let widest = 0;

    for (const longEdge of POSTER_LONG_EDGES) {
      // Re-render rather than downscale: the art is vector, so drawing it at the
      // target size is sharper than resampling the 1400px raster would be.
      const result = await page.evaluate(renderPoster, src, longEdge, POSTER_QUALITY);

      // Past the animation's own drawn size there is nothing left to resolve,
      // and a wider file would just be the same picture with more bytes.
      if (result.width <= widest) break;
      widest = result.width;

      const bytes = Buffer.from(result.dataUrl.split(',')[1], 'base64');
      const variant = target.replace(/\.webp$/, `-${result.width}.webp`);
      await mkdir(dirname(variant), { recursive: true });
      await writeFile(variant, bytes);
      totalBytes += bytes.length;
      rendered.push(`${result.width}×${result.height} ${(bytes.length / 1024).toFixed(1)}kB`);
    }

    console.log(`  ${rel.padEnd(42)} ${rendered.join('  ')}`);
  }

  console.log(`\n${files.length} posters, ${(totalBytes / 1024).toFixed(0)} kB au total`);
} finally {
  await browser.close();
  server.close();
}
