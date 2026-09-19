/**
 * Renders every route into the built HTML.
 *
 * Runs after `vite build`, on the files in `dist/generated-pages/`, so the
 * script tags, stylesheet links and hero preload Vite injected are all kept —
 * this step only fills in what was missing: the page content, and the JSON-LD
 * that until now was written by Helmet in the browser and therefore never
 * reached a crawler that does not run JavaScript.
 *
 * The rendering itself happens in `src/app/prerender.tsx`; this file is the
 * plumbing that bundles it for Node, walks the routes and writes the result.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PassThrough } from "node:stream";
import { build } from "vite";
import { JSDOM } from "jsdom";
import { renderToPipeableStream } from "react-dom/server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const generatedDir = path.join(distDir, "generated-pages");
const ssrOutDir = path.join(rootDir, ".prerender");

/**
 * Gives the render a DOM.
 *
 * Node has none, and two things in the app need one before React is even
 * involved: DOMPurify, which sanitises the rich-text strings the dictionaries
 * hold, and the DOMParser that turns the result into React elements. Without a
 * window DOMPurify loads inert and `sanitize` is not a function.
 *
 * This has to run before the bundle is imported, because DOMPurify binds to
 * `window` when its module is evaluated, not when it is called.
 */
function installDom() {
  const { window } = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "https://mediasmart.ch/",
  });

  // jsdom does not implement matchMedia, and the animation preferences read it
  // as the module loads. Everything answers false, which is the neutral
  // starting point: the light theme, and animations on.
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  });

  const globals = [
    "window",
    "document",
    "navigator",
    "DOMParser",
    "Node",
    "Element",
    "HTMLElement",
    "SVGElement",
    "CustomEvent",
    "Event",
    "getComputedStyle",
    "matchMedia",
    "requestAnimationFrame",
    "cancelAnimationFrame",
  ];

  for (const name of globals) {
    if (globalThis[name] === undefined) {
      Object.defineProperty(globalThis, name, {
        value: window[name] ?? window,
        configurable: true,
        writable: true,
      });
    }
  }
}

const SUPPORTED_LANGUAGES = ["fr", "en"];
const ROOT_PLACEHOLDER = '<div id="root"></div>';

/** Mirrors `buildOutputFilename` in generate-localized-html.mjs. */
const buildOutputFilename = (language, pathname) => {
  const slug = pathname === "/" ? "" : pathname.replace(/^\//, "").replace(/\//g, "-");
  return slug ? `${language}-${slug}.html` : `${language}.html`;
};

/** Bundles the renderer for Node and returns its module. */
async function buildRenderer() {
  await build({
    logLevel: "warn",
    build: {
      ssr: path.join(rootDir, "src", "app", "prerender.tsx"),
      outDir: ssrOutDir,
      emptyOutDir: true,
      // The CSS the components import is already in the client build; the copy
      // this pass would emit is never served.
      cssCodeSplit: false,
      rollupOptions: {
        output: { entryFileNames: "prerender.mjs" },
      },
    },
  });

  return import(pathToFileURL(path.join(ssrOutDir, "prerender.mjs")).href);
}

/**
 * Renders one route to HTML and returns it with its JSON-LD.
 *
 * Streamed rather than rendered to a string, and awaited to completion: the
 * pages hang several `lazy()` components off Suspense boundaries — the contact
 * section, the animation player — and `renderToString` cannot wait for a
 * dynamic import to resolve, so it aborted on the first one it met.
 * `onAllReady` hands back the finished document with every boundary filled in,
 * which is the point of the exercise: the contact form is part of what a
 * crawler should see.
 */
function renderRoute(renderer, language, pathname) {
  const element = renderer.createRouteElement(language, pathname);

  return new Promise((resolve, reject) => {
    const chunks = [];
    const sink = new PassThrough();

    sink.on("data", (chunk) => chunks.push(chunk));
    sink.on("end", () =>
      resolve({
        html: Buffer.concat(chunks).toString("utf8"),
        jsonLd: renderer.renderJsonLd(language, pathname),
      })
    );
    sink.on("error", reject);

    const stream = renderToPipeableStream(element, {
      onAllReady() {
        stream.pipe(sink);
      },
      onError: reject,
    });
  });
}

/**
 * Inserts the rendered markup and the JSON-LD into one built page.
 *
 * Only the JSON-LD is taken from Helmet's output. The rest of the head —
 * title, description, Open Graph, canonical, hreflang — is already written by
 * generate-localized-html.mjs from the same `route-seo-data.json`, and copying
 * Helmet's version on top of it would ship every tag twice.
 */
function injectInto(filePath, { html, jsonLd }) {
  const source = fs.readFileSync(filePath, "utf8");

  if (!source.includes(ROOT_PLACEHOLDER)) {
    throw new Error(`No empty root element found in ${path.relative(rootDir, filePath)}`);
  }

  let output = source.replace(ROOT_PLACEHOLDER, `<div id="root">${html}</div>`);

  if (jsonLd) {
    output = output.replace("</head>", `  ${jsonLd}\n</head>`);
  }

  return fs.writeFileSync(filePath, output, "utf8");
}

installDom();

const renderer = await buildRenderer();
let rendered = 0;

for (const language of SUPPORTED_LANGUAGES) {
  for (const pathname of renderer.PRERENDERED_PATHS) {
    const filePath = path.join(generatedDir, buildOutputFilename(language, pathname));

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Nothing to prerender at ${path.relative(rootDir, filePath)} — is "${pathname}" missing from routeKeyByPath?`
      );
    }

    injectInto(filePath, await renderRoute(renderer, language, pathname));
    rendered += 1;
  }
}

fs.rmSync(ssrOutDir, { recursive: true, force: true });

console.log(`Prerendered ${rendered} pages into dist/generated-pages/`);
