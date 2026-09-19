/**
 * Refreshes the published Firefox add-on figures, at build time.
 *
 * The rating and the user count shown on the CopyLink Pro card come from
 * Mozilla, not from us, so they have to be read from Mozilla. They are read
 * once per build rather than once per visitor: the site is prerendered and
 * mostly static, a number that moves by one a week does not justify a request
 * from every browser that opens the homepage, and an addons.mozilla.org call
 * on the critical path would be a third party deciding how fast our page
 * paints.
 *
 * Source: the public AMO API, `/api/v5/addons/addon/<slug>/`. It is the
 * documented, structured endpoint behind the listing page itself — nothing
 * here scrapes HTML.
 *
 * The result is written to `src/features/it-services/data/addon-stats.json`,
 * which is committed. That file is the fallback: if Mozilla is slow, down, or
 * changes shape, the build keeps the values from the last successful run and
 * carries on. It never fails the build, and it never writes a number it did
 * not receive.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetFile = path.join(
  rootDir,
  "src",
  "features",
  "it-services",
  "data",
  "addon-stats.json"
);

/** Portfolio id → AMO slug. One entry today; the shape allows more. */
const ADDONS = [{ id: "url-copier", slug: "url-copier" }];

const API = "https://addons.mozilla.org/api/v5/addons/addon";
const TIMEOUT_MS = 8000;

/** A finite, non-negative number, or null. Anything else is not a figure. */
function positiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

function readExisting() {
  try {
    return JSON.parse(fs.readFileSync(targetFile, "utf8"));
  } catch {
    return { fetchedAt: null, addons: {} };
  }
}

async function fetchOne(slug) {
  const response = await fetch(`${API}/${slug}/`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = await response.json();

  // Only what is actually published is kept. A missing field stays null: the
  // card drops that line rather than showing a zero it invented.
  const rating = positiveNumber(payload?.ratings?.average);
  const ratingCount = positiveNumber(payload?.ratings?.count);
  const users = positiveNumber(payload?.average_daily_users);

  if (rating === null && ratingCount === null && users === null) {
    throw new Error("no usable figure in the response");
  }

  return {
    // `rating` is meaningless without someone having given it: AMO reports an
    // average of 0 for an add-on nobody has rated.
    rating: ratingCount ? rating : null,
    ratingCount: ratingCount || null,
    users,
  };
}

const previous = readExisting();
const next = { fetchedAt: new Date().toISOString(), addons: { ...previous.addons } };
let refreshed = 0;

for (const { id, slug } of ADDONS) {
  try {
    next.addons[id] = await fetchOne(slug);
    refreshed += 1;
    const { rating, ratingCount, users } = next.addons[id];
    console.log(
      `addon stats: ${id} → rating ${rating ?? "—"} (${ratingCount ?? 0}), users ${users ?? "—"}`
    );
  } catch (error) {
    console.warn(
      `addon stats: keeping the last known figures for "${id}" — ${error.message}`
    );
  }
}

// Nothing came back and nothing was stored: write the empty shape so the
// import resolves and the card simply shows no figures.
if (refreshed === 0 && !fs.existsSync(targetFile)) {
  fs.writeFileSync(targetFile, `${JSON.stringify({ fetchedAt: null, addons: {} }, null, 2)}\n`);
  process.exit(0);
}

if (refreshed > 0) {
  fs.writeFileSync(targetFile, `${JSON.stringify(next, null, 2)}\n`);
}
