/**
 * Renders narrow WebP copies of the project screenshots.
 *
 * The originals are 1440px wide because that is the viewport they are captured
 * at, and they are shown in cards 420–460px across. A phone was downloading
 * 1440px of JPEG to draw 400 — about 300KB over a full scroll of the homepage.
 *
 * One file per width, offered through a srcset, so the browser fetches the one
 * it needs. The originals stay exactly as they are and remain the `src`, so
 * anything that ignores srcset — and any image this script has not run over
 * yet — is unaffected.
 *
 * Runs as the first step of `pnpm build`. Output is derived, not committed;
 * the manifest is, so `tsc` and the tests have something to resolve.
 */

import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Public directories whose images are shown far smaller than they are stored. */
const SOURCE_DIRS = ["public/screenshots", "public/portfolio"];

/** Where the narrow copies go, relative to each source directory. */
const VARIANT_DIR = "responsive";

/**
 * Widths to render.
 *
 * The widest card on the site is 460 CSS px, so 960 covers it at 2x and 1440
 * is there for a 3x phone and for the lightbox, which shows these full size.
 * A width at or above the source is skipped rather than upscaled.
 */
const WIDTHS = [480, 960, 1440];

/** WebP quality. Screenshots are mostly flat UI; 74 is visually clean here. */
const QUALITY = 74;

const MANIFEST = path.join(root, "src/shared/config/image-variants.json");

const isSource = (name) =>
  /\.(jpe?g|png)$/i.test(name) && !name.startsWith("._");

/** Cheap staleness check, so a rebuild does not re-encode unchanged files. */
const fingerprint = (file) => {
  const { size, mtimeMs } = fs.statSync(file);
  return createHash("sha1").update(`${size}:${Math.round(mtimeMs)}`).digest("hex").slice(0, 12);
};

async function run() {
  const manifest = {};
  let written = 0;
  let reused = 0;

  for (const dir of SOURCE_DIRS) {
    const absDir = path.join(root, dir);
    if (!fs.existsSync(absDir)) continue;

    const outDir = path.join(absDir, VARIANT_DIR);
    fs.mkdirSync(outDir, { recursive: true });

    for (const name of fs.readdirSync(absDir)) {
      const source = path.join(absDir, name);
      if (!isSource(name) || !fs.statSync(source).isFile()) continue;

      const stem = name.replace(/\.(jpe?g|png)$/i, "");
      const stamp = fingerprint(source);
      const meta = await sharp(source).metadata();
      if (!meta.width || !meta.height) continue;

      const publicBase = `/${path.basename(dir)}`;
      const entries = [];

      for (const width of WIDTHS) {
        // Never upscale; matching the source exactly is fine, and worth doing —
        // a 1440px WebP of a 1440px JPEG is a fraction of the weight at the
        // same pixels, which is what a 3x phone ends up choosing.
        if (width > meta.width) continue;

        const outName = `${stem}-${width}-${stamp}.webp`;
        const outPath = path.join(outDir, outName);

        if (fs.existsSync(outPath)) {
          reused += 1;
        } else {
          await sharp(source).resize({ width }).webp({ quality: QUALITY }).toFile(outPath);
          written += 1;
        }

        entries.push({ width, url: `${publicBase}/${VARIANT_DIR}/${outName}` });
      }

      if (!entries.length) continue;

      manifest[`${publicBase}/${name}`] = {
        width: meta.width,
        height: meta.height,
        variants: entries,
      };
    }

    // Drop files whose source changed or disappeared, so the directory does not
    // grow a copy per edit.
    const live = new Set(
      Object.values(manifest).flatMap((entry) => entry.variants.map((v) => path.basename(v.url)))
    );
    for (const name of fs.readdirSync(outDir)) {
      if (!live.has(name)) fs.rmSync(path.join(outDir, name), { force: true });
    }
  }

  const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(MANIFEST, `${JSON.stringify(ordered, null, 2)}\n`, "utf8");

  console.log(
    `Image variants: ${Object.keys(ordered).length} sources, ${written} written, ${reused} reused`
  );
}

await run();
