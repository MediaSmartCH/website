/**
 * Refreshes the published figures for the free tools, at build time.
 *
 * Two stores publish numbers about CopyLink Pro, and neither of them is us:
 * Mozilla Add-ons (rating, reviews, users) and GitHub (stars). They are read
 * once per build rather than once per visitor — the site is prerendered and
 * mostly static, a number that moves by one a week does not justify a request
 * from every browser that opens the homepage, and a third-party call on the
 * critical path would let addons.mozilla.org decide how fast our page paints.
 *
 * Sources, both the documented JSON APIs behind the pages themselves — nothing
 * here scrapes HTML:
 *   Mozilla   GET https://addons.mozilla.org/api/v5/addons/addon/<slug>/
 *   GitHub    GET https://api.github.com/repos/<owner>/<repo>
 *
 * What gets fetched is driven entirely by `it-portfolio.json`, so there is one
 * list of tools, not two:
 *   `url`       pointing at addons.mozilla.org  → the Mozilla figures
 *   `sourceUrl` pointing at github.com          → the star count
 * A tool with no `sourceUrl` gets no GitHub call and no GitHub line on its
 * card. That is how Voice Studio and MediaSmart Lab stay out of this: their
 * code is not public, so there is nothing to link to.
 *
 * The result is written to `src/features/it-services/data/tool-stats.json`,
 * which is committed. That file is the fallback: if a store is slow, down, or
 * changes shape, the build keeps the values from the last successful run and
 * carries on. It never fails the build, and it never writes a number it did
 * not receive.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "features", "it-services", "data");
const portfolioFile = path.join(dataDir, "it-portfolio.json");
const targetFile = path.join(dataDir, "tool-stats.json");

const AMO_API = "https://addons.mozilla.org/api/v5/addons/addon";
const GITHUB_API = "https://api.github.com/repos";
const TIMEOUT_MS = 8000;

/** A finite, non-negative number, or null. Anything else is not a figure. */
function positiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

function readExisting() {
  try {
    const parsed = JSON.parse(fs.readFileSync(targetFile, "utf8"));
    return {
      addons: parsed.addons ?? {},
      repos: parsed.repos ?? {},
    };
  } catch {
    return { addons: {}, repos: {} };
  }
}

async function getJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: { Accept: "application/json", ...headers },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    // GitHub answers 403 with a rate-limit body rather than 429; say which,
    // because "HTTP 403" on its own sends the next reader looking for a token.
    const rateLimited =
      response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0";
    throw new Error(rateLimited ? "rate limited" : `HTTP ${response.status}`);
  }

  return response.json();
}

/** The add-on slug, if this tool is published on Mozilla Add-ons. */
function amoSlug(item) {
  const match = /^https:\/\/addons\.mozilla\.org\/[^/]+\/firefox\/addon\/([^/]+)\/?$/.exec(
    item.url ?? ""
  );
  return match ? match[1] : null;
}

/** The owner/repo pair, if this tool declares a public GitHub source. */
function githubRepo(item) {
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)\/?$/.exec(item.sourceUrl ?? "");
  return match ? { owner: match[1], name: match[2] } : null;
}

async function fetchAddon(slug) {
  const payload = await getJson(`${AMO_API}/${slug}/`);

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

async function fetchRepo({ owner, name }) {
  const payload = await getJson(`${GITHUB_API}/${owner}/${name}`, {
    Accept: "application/vnd.github+json",
  });

  // A private repository 404s for an unauthenticated call, so reaching here
  // already means public. The explicit check costs nothing and documents the
  // rule: we never link to source that is not open.
  if (payload?.private === true || payload?.visibility === "private") {
    throw new Error("repository is not public");
  }

  return { stars: positiveNumber(payload?.stargazers_count) };
}

const items = JSON.parse(fs.readFileSync(portfolioFile, "utf8")).items ?? [];
const previous = readExisting();
const next = {
  fetchedAt: new Date().toISOString(),
  addons: { ...previous.addons },
  repos: { ...previous.repos },
};

let refreshed = 0;

for (const item of items) {
  const slug = amoSlug(item);
  if (slug) {
    try {
      next.addons[item.id] = await fetchAddon(slug);
      refreshed += 1;
      const { rating, ratingCount, users } = next.addons[item.id];
      console.log(
        `tool stats: ${item.id} — Mozilla rating ${rating ?? "—"} (${ratingCount ?? 0}), users ${users ?? "—"}`
      );
    } catch (error) {
      console.warn(
        `tool stats: keeping the last known Mozilla figures for "${item.id}" — ${error.message}`
      );
    }
  }

  const repo = githubRepo(item);
  if (repo) {
    try {
      next.repos[item.id] = await fetchRepo(repo);
      refreshed += 1;
      console.log(
        `tool stats: ${item.id} — GitHub ${repo.owner}/${repo.name}, ${next.repos[item.id].stars ?? "—"} stars`
      );
    } catch (error) {
      console.warn(
        `tool stats: keeping the last known GitHub figures for "${item.id}" — ${error.message}`
      );
    }
  }
}

// Nothing came back and nothing was stored: write the empty shape so the
// import resolves and the cards simply show no figures.
if (refreshed === 0 && !fs.existsSync(targetFile)) {
  fs.writeFileSync(
    targetFile,
    `${JSON.stringify({ fetchedAt: null, addons: {}, repos: {} }, null, 2)}\n`
  );
  process.exit(0);
}

if (refreshed > 0) {
  fs.writeFileSync(targetFile, `${JSON.stringify(next, null, 2)}\n`);
}
