import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components"),
      services: path.resolve(__dirname, "src/services"),
      config: path.resolve(__dirname, "src/config"),
      assets: path.resolve(__dirname, "src/assets"),
      store: path.resolve(__dirname, "src/store"),
      pages: path.resolve(__dirname, "src/pages"),
      // Stub the virtual WASM module so tests never try to load the binary.
      "virtual:dotlottie-wasm-url": path.resolve(
        __dirname,
        "src/__mocks__/dotlottie-wasm-url.ts"
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/setupTests.ts"],
    environmentOptions: {
      jsdom: {
        // A valid URL is required for Web Storage APIs (localStorage, sessionStorage)
        // to be available in jsdom. Without it the storage objects exist but have
        // no methods, which causes "localStorage.clear is not a function" errors.
        url: "http://localhost/",
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: [
        "src/store/slices/common/**",
        "src/config/languages.ts",
        "src/config/lotties.ts",
        "src/services/locales/safe.ts",
        "src/services/hooks/useCookieConsent.ts",
      ],
    },
  },
});
