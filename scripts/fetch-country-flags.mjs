/**
 * Downloads the country flag SVGs the phone field needs, once, into the repo.
 *
 * react-international-phone points every flag at the Twemoji set on
 * cdnjs.cloudflare.com. That made the contact form depend on a third party at
 * render time: every visitor's browser reached Cloudflare, and the moment the
 * CSP stopped allowing that host the flags silently became empty squares with
 * no error anywhere. Serving them ourselves removes both problems.
 *
 * The files are committed, not fetched at build time — a build must not depend
 * on a CDN either. Re-run this only when the library's country list changes:
 *
 *   node scripts/fetch-country-flags.mjs
 *
 * Twemoji is CC-BY 4.0 (graphics), which NOTICE records.
 */

import { mkdir, writeFile, readdir } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import { defaultCountries, parseCountry } from 'react-international-phone';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src/assets/flags');

const TWEMOJI_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg';
/** Polite concurrency: 218 files from one host. */
const BATCH = 12;

/**
 * Twemoji names flag files after the two regional-indicator codepoints, which
 * are the ASCII letters of the iso2 code offset into U+1F1E6..U+1F1FF.
 */
function twemojiFileName(iso2) {
  const codePoints = [...iso2.toUpperCase()].map(
    (letter) => (0x1f1e6 + letter.charCodeAt(0) - 0x41).toString(16),
  );
  return `${codePoints.join('-')}.svg`;
}

async function download(iso2) {
  const url = `${TWEMOJI_BASE}/${twemojiFileName(iso2)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${iso2}: ${response.status} for ${url}`);
  }

  const svg = await response.text();
  // Guard against a CDN error page being written out as if it were a flag.
  if (!svg.trimStart().startsWith('<svg')) {
    throw new Error(`${iso2}: response is not an SVG`);
  }

  await writeFile(join(outDir, `${iso2}.svg`), svg, 'utf8');
  return svg.length;
}

await mkdir(outDir, { recursive: true });

const countries = defaultCountries.map(parseCountry);
console.log(`${countries.length} drapeaux à récupérer\n`);

let bytes = 0;
const failures = [];

for (let i = 0; i < countries.length; i += BATCH) {
  const slice = countries.slice(i, i + BATCH);
  const results = await Promise.allSettled(slice.map((c) => download(c.iso2)));

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      bytes += result.value;
    } else {
      failures.push(`${slice[index].iso2}: ${result.reason.message}`);
    }
  });
  process.stdout.write(`\r  ${Math.min(i + BATCH, countries.length)}/${countries.length}`);
}

const written = (await readdir(outDir)).filter((f) => f.endsWith('.svg'));
console.log(`\n\n${written.length} fichiers, ${(bytes / 1024).toFixed(0)} kB au total`);

if (failures.length) {
  console.error(`\n${failures.length} échec(s) :`);
  failures.forEach((f) => console.error(`  ${f}`));
  process.exit(1);
}
