import type { Plugin } from "vite";

/**
 * Pins every script and stylesheet URL to the deployment that produced it.
 *
 * Route chunks are content-hashed, so a tab left open across a deployment asks
 * for filenames the current deployment no longer has, and gets a 404. Vercel's
 * Skew Protection can still serve them — previous deployments stay addressable
 * — but only when the request says which deployment it belongs to. A static
 * build says nothing of the sort: the HTML carries no deployment id, and a
 * browser has no reason to invent one.
 *
 * Writing `?dpl=<id>` into the URLs at build time puts the answer in the
 * request itself. A stale tab holds the previous deployment's HTML, so its
 * chunk URLs carry that deployment's id and Vercel serves the matching files;
 * a fresh visit gets fresh HTML and the current id.
 *
 * Only the files a document does not already reference are marked, and that
 * boundary is what keeps the change free. A chunk named in the HTML is fetched
 * while the page boots, so a tab that has been open across a deployment already
 * holds it; marking it would gain nothing and would change its URL on every
 * deployment, costing returning visitors the long-lived vendor chunk the build
 * is arranged to preserve. Marking it in one place and not the other is not an
 * option either — one file under two URLs is one file fetched twice.
 *
 * What remains unprotected: a shared boot chunk whose content changed, in a tab
 * whose browser cache has since evicted it. The preload then 404s and the
 * import fails — which is the case `withChunkRecovery` already catches with a
 * single reload.
 *
 * The cookie Vercel documents for this is deliberately not used. Measured
 * against production: a request carrying `__vdpl` is served the *document* from
 * that deployment, not just its assets. A browser that set the cookie itself
 * would keep being handed the old HTML, and no reload would bring it back to
 * the current deployment — the opposite of recovering from a stale tab.
 *
 * Without a deployment id — every local build, and any host that is not Vercel
 * — the output is left exactly as it was.
 */

/**
 * A quoted string holding a filename.
 *
 * Deliberately permissive: what makes a match safe is not the shape of the
 * path but the check below that the filename is one this build emitted. The
 * closing delimiter must be the opening one, so a URL that already carries a
 * query cannot match twice.
 */
const QUOTED_REFERENCE =
  /(["'`])((?:\.{1,2}\/|\/)?(?:[A-Za-z0-9._-]+\/)*)([A-Za-z0-9._-]+\.(?:js|css))\1/g;

function pinReferences(
  source: string,
  emittedFiles: ReadonlySet<string>,
  deploymentId: string
): string {
  return source.replace(
    QUOTED_REFERENCE,
    (match, quote: string, directory: string, file: string) =>
      emittedFiles.has(file)
        ? `${quote}${directory}${file}?dpl=${deploymentId}${quote}`
        : match
  );
}

/** Basenames of the scripts and stylesheets this build produced. */
function collectEmittedFiles(fileNames: readonly string[]): Set<string> {
  const emitted = new Set<string>();

  for (const fileName of fileNames) {
    const base = fileName.split("/").pop();

    if (base && (base.endsWith(".js") || base.endsWith(".css"))) {
      emitted.add(base);
    }
  }

  return emitted;
}

/**
 * Basenames a document loads directly, which are therefore in hand before any
 * lazily-loaded chunk is ever requested.
 */
function collectDocumentReferences(documents: readonly string[]): Set<string> {
  const referenced = new Set<string>();

  for (const document of documents) {
    for (const [, , , file] of document.matchAll(QUOTED_REFERENCE)) {
      referenced.add(file);
    }
  }

  return referenced;
}

export function skewProtection(deploymentId: string): Plugin {
  const id = deploymentId.trim();

  return {
    name: "vercel-skew-protection",
    apply: "build",
    // Runs last so the documents Vite generates are already in the bundle:
    // what they reference is what decides which chunks are left alone.
    enforce: "post",
    generateBundle(_options, bundle) {
      if (!id) return;

      const documents = Object.values(bundle)
        .filter((file) => file.fileName.endsWith(".html"))
        .map((file) => (file.type === "asset" ? String(file.source) : ""));

      const bootFiles = collectDocumentReferences(documents);
      const pinnable = collectEmittedFiles(Object.keys(bundle));

      for (const bootFile of bootFiles) {
        pinnable.delete(bootFile);
      }

      for (const file of Object.values(bundle)) {
        if (file.type === "chunk") {
          file.code = pinReferences(file.code, pinnable, id);
        }
      }
    },
  };
}

export const __testing = {
  pinReferences,
  collectEmittedFiles,
  collectDocumentReferences,
};
