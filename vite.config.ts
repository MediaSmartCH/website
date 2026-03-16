import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

const plugins = [react(), tsconfigPaths()];

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
  plugins,
  server: {
    port: 3000,
    open: true,
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
});
