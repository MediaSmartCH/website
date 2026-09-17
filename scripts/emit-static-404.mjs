/**
 * Copies the prerendered 404 shell to `dist/404.html`.
 *
 * Vercel serves a `404.html` sitting at the root of the output directory for
 * every request that matches no route, and — unlike a rewrite, which always
 * answers 200 — it sends it with a real 404 status. That is the whole point:
 * before this, a catch-all rewrite handed the homepage to any unknown URL, so
 * `/fr/nope` answered 200 with the homepage title. Google calls that a soft 404
 * and reports it.
 *
 * The French shell is used because French is the default locale. The language
 * actually rendered comes from the URL segment (see `app/layout/lang-layout`),
 * so an English visitor still gets the English 404 once the app hydrates; only
 * the prerendered metadata is French, and it is `noindex` either way.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(rootDir, "dist", "generated-pages", "fr-404.html");
const target = path.join(rootDir, "dist", "404.html");

if (!fs.existsSync(source)) {
  console.error(
    `Cannot emit dist/404.html: "${source}" is missing. It is produced by ` +
      `generate-localized-html.mjs from the "/404" entry of route-seo-data.json.`
  );
  process.exit(1);
}

const html = fs.readFileSync(source, "utf8");

// A page served from the root must not claim to be indexable, and the shell is
// only ever correct here if the generator kept its noindex directive.
if (!/<meta[^>]+name="robots"[^>]+content="noindex/.test(html)) {
  console.error(
    "Cannot emit dist/404.html: the 404 shell no longer carries a noindex " +
      'robots meta. Check the "not-found" entries in route-seo-data.json.'
  );
  process.exit(1);
}

fs.writeFileSync(target, html, "utf8");
console.log("Emitted dist/404.html from generated-pages/fr-404.html");
