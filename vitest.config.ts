import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@features": path.resolve(__dirname, "src/features"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@store": path.resolve(__dirname, "src/store"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@test": path.resolve(__dirname, "src/test"),
      // Stub the virtual WASM module so tests never try to load the binary.
      "virtual:dotlottie-wasm-url": path.resolve(
        __dirname,
        "src/test/mocks/dotlottie-wasm-url.ts"
      ),
    },
  },
  test: {
    // macOS writes AppleDouble sidecars ("._name.test.ts") when the repo lives
    // on a non-APFS volume. They are not valid UTF-8 and would be collected as
    // empty, failing suites.
    exclude: [...configDefaults.exclude, "**/._*"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/test/setup-tests.ts"],
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
        "src/shared/config/languages.ts",
        "src/shared/config/lotties.ts",
        "src/shared/i18n/translator.ts",
        "src/shared/hooks/use-cookie-consent.ts",
      ],
    },
  },
});
