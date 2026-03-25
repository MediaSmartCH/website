import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

const plugins = [react(), tsconfigPaths()];
const generatedPagesDir = path.resolve(__dirname, "generated-pages");
const generatedHtmlInputs = fs.existsSync(generatedPagesDir)
  ? Object.fromEntries(
      fs
        .readdirSync(generatedPagesDir)
        .filter((file) => file.endsWith(".html"))
        .map((file) => [
          path.basename(file, ".html"),
          path.resolve(generatedPagesDir, file),
        ])
    )
  : {};

// Bundle analyzer is opt-in via ANALYZE=true environment variable
if (process.env.ANALYZE === "true") {
  plugins.push(
    visualizer({
      open: true,
      filename: "bundle-report.html",
      gzipSize: true,
      brotliSize: true,
    })
  );
}

export default defineConfig({
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
      '/api': 'http://localhost:3001',
    },
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components"),
      services: path.resolve(__dirname, "src/services"),
      config: path.resolve(__dirname, "src/config"),
      assets: path.resolve(__dirname, "src/assets"),
      store: path.resolve(__dirname, "src/store"),
      pages: path.resolve(__dirname, "src/pages"),
    },
  },
  assetsInclude: ["**/*.lottie"],
  build: {
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
        // Group major libraries into stable vendor chunks to improve cache hit
        // rates and keep the Lottie runtime isolated from route code.
        manualChunks(id) {
          if (id.includes("@lottiefiles") || id.includes("@dotlottie")) {
            return "lottie-vendor";
          }

          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/react-router-dom/")
          ) {
            return "react-vendor";
          }

          if (
            id.includes("/node_modules/redux/") ||
            id.includes("/node_modules/react-redux/") ||
            id.includes("/node_modules/@reduxjs/toolkit/") ||
            id.includes("/node_modules/redux-persist/")
          ) {
            return "redux-vendor";
          }

          if (id.includes("/node_modules/antd/")) {
            return "antd-vendor";
          }

          if (
            id.includes("/node_modules/lucide-react/") ||
            id.includes("/node_modules/aos/")
          ) {
            return "ui-vendor";
          }

          return undefined;
        },
      },
    },
  },
});
