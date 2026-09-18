import fs from "fs";
import { createHash } from "crypto";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { defineConfig, Plugin, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const _require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Serves the DotLottie WASM binary locally and exposes its URL through the
 * `virtual:dotlottie-wasm-url` virtual module.
 *
 * Without it, DotLottie falls back to its CDN (unpkg / jsdelivr). In production
 * the Content-Security-Policy blocks that, so every animation silently fails.
 *
 * The two modes need different mechanics:
 *   - build: emit the file as a content-hashed asset via Rollup's emitFile.
 *   - serve: emitFile is a build-only API — calling it logs "not supported in
 *     serve mode" and returns undefined, which left the dev server pulling the
 *     1.7MB binary from unpkg. Point at the file on disk instead, through
 *     Vite's /@fs/ route.
 */
function dotLottieWasmPlugin(): Plugin {
  const VIRTUAL_ID = "virtual:dotlottie-wasm-url";
  const RESOLVED_ID = "\0" + VIRTUAL_ID;
  const ASSET_HASH_LENGTH = 8;

  let isServe = false;

  /**
   * Absolute path to the WASM binary inside dotlottie-web.
   *
   * Resolved through the package entrypoints so package exports and pnpm's
   * symlinked layout both work. dotlottie-web is a transitive dep of
   * dotlottie-react, so it is resolved from that package's own location —
   * pnpm does not expose transitive deps at the project root.
   */
  const resolveWasmPath = () => {
    const dotLottieReactEntry = _require.resolve(
      "@lottiefiles/dotlottie-react"
    );
    const dotLottieEntry = createRequire(dotLottieReactEntry).resolve(
      "@lottiefiles/dotlottie-web"
    );
    return path.join(path.dirname(dotLottieEntry), "dotlottie-player.wasm");
  };

  /**
   * Builds the /@fs/ URL Vite serves a file from during development.
   *
   * Vite decodes the request path with decodeURI, so the encoding has to match:
   * escape what is illegal in a URI (a space in this repo's own path, for one)
   * but leave `@`, `+` and `/` alone — percent-encoding those yields a path
   * Vite cannot match, and the SPA fallback answers with index.html instead.
   */
  const toDevUrl = (absolutePath: string) => {
    const posixPath = absolutePath.split(path.sep).join("/");
    const encoded = encodeURI(posixPath).replace(
      /[#?]/g,
      (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`
    );
    return `/@fs${encoded}`;
  };

  return {
    name: "dotlottie-wasm-asset",
    configResolved(config) {
      isServe = config.command === "serve";
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;

      const wasmSrc = resolveWasmPath();

      if (isServe) {
        return `export default ${JSON.stringify(toDevUrl(wasmSrc))}`;
      }

      const wasmBuffer = fs.readFileSync(wasmSrc);
      const hash = createHash("sha256")
        .update(wasmBuffer)
        .digest("hex")
        .slice(0, ASSET_HASH_LENGTH);
      const assetFileName = `assets/dotlottie-player-${hash}.wasm`;

      const refId = this.emitFile({
        type: "asset",
        fileName: assetFileName,
        source: wasmBuffer,
      });

      return `export default import.meta.ROLLUP_FILE_URL_${refId}`;
    },
  };
}

const generatedPagesDir = path.resolve(__dirname, "generated-pages");
const generatedHtmlInputs = fs.existsSync(generatedPagesDir)
  ? (() => {
      try {
        return Object.fromEntries(
          fs
            .readdirSync(generatedPagesDir)
            // Skip macOS AppleDouble sidecars ("._name.html"), which appear when
            // the repo lives on a non-APFS volume and are not valid UTF-8 HTML.
            .filter((file) => file.endsWith(".html") && !file.startsWith("._"))
            .map((file) => [
              path.basename(file, ".html"),
              path.resolve(generatedPagesDir, file),
            ])
        );
      } catch (error) {
        console.error(
          `Failed to scan generated pages directory "${generatedPagesDir}":`,
          error
        );
        return {};
      }
    })()
  : {};

export default defineConfig(async () => {
  const plugins: PluginOption[] = [dotLottieWasmPlugin(), react()];

  // Load the bundle analyzer lazily so normal builds never try to require
  // an ESM-only dependency while Vite is bundling this config file.
  if (process.env.ANALYZE === "true") {
    const { visualizer } = await import("rollup-plugin-visualizer");

    plugins.push(
      visualizer({
        open: true,
        filename: "bundle-report.html",
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return {
    envPrefix: ["VITE_", "REACT_APP_"],
    define: {
      __VERCEL_DEPLOYMENT_ID__: JSON.stringify(process.env.VERCEL_DEPLOYMENT_ID ?? ""),
    },
    plugins,
    server: {
      port: 3000,
      open: true,
      // Forward /api requests to the local dev API server
      proxy: {
        "/api": "http://localhost:3001",
      },
    },
    resolve: {
      alias: {
        "@app": path.resolve(__dirname, "src/app"),
        "@features": path.resolve(__dirname, "src/features"),
        "@shared": path.resolve(__dirname, "src/shared"),
        "@store": path.resolve(__dirname, "src/store"),
        "@styles": path.resolve(__dirname, "src/styles"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@test": path.resolve(__dirname, "src/test"),
      },
    },
    assetsInclude: ["**/*.lottie"],
    build: {
      /**
       * Country flags stay as files; everything else keeps the default rule.
       *
       * They are 2KB each and there are 218 of them, so inlining put every one
       * into the contact chunk — 58KB gzipped charged to every visitor, for
       * images only shown to someone who opens the country selector. As files
       * the player's `loading="lazy"` fetches just the handful on screen.
       */
      assetsInlineLimit: (filePath: string) =>
        filePath.includes("/assets/flags/") ? false : undefined,
      // Raise the default 500KB limit to account for expected large vendor chunks
      // while still surfacing bundles that are unusually large for this app.
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, "index.html"),
          ...generatedHtmlInputs,
        },
        onwarn(warning, warn) {
          // Suppress eval warnings originating from the @dotlottie third-party library
          if (warning.code === "EVAL" && warning.id?.includes("@dotlottie")) return;
          warn(warning);
        },
        output: {
          // Keep the React runtime in its own long-lived chunk so app deploys do
          // not invalidate it. Everything else is left to Rolldown's own chunker:
          // hand-grouping the remaining vendors measurably inflated the entry.
          manualChunks(id) {
            if (
              id.includes("/node_modules/react/") ||
              id.includes("/node_modules/react-dom/") ||
              id.includes("/node_modules/scheduler/")
            ) {
              return "react-vendor";
            }

            return undefined;
          },
        },
      },
    },
  };
});
