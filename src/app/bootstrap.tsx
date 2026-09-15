import React from "react";
import ReactDOM from "react-dom/client";
import App from "@app/app";
import { Provider } from "react-redux";
import { store } from "@store/store";
import { ensureLocale } from "@shared/i18n/registry";
import { resolveInitialLanguage } from "@store/slices/common/languageSlice";

import "antd/dist/reset.css";
import 'aos/dist/aos.css';
import '@styles/index.css';

// Silence noisy console output during development.
//
// NOTE: this also swallows logger.debug(), which is the channel the i18n layer
// uses to report missing translation keys — they are dev-only by design, so in
// practice they never appear. Left as-is because removing the silencing would
// change what a developer sees; worth revisiting together.
if (import.meta.env.DEV) {
  console.info = () => {};
  console.warn = () => {};
}

/**
 * Mounts the app once the starting language is available.
 *
 * Each `src/entries/<lang>.tsx` registers its own dictionary synchronously, so
 * on a prerendered page this resolves immediately and nothing is delayed. The
 * await only does real work on the SPA fallback, where the served HTML does not
 * match the requested language.
 */
export async function bootstrap() {
  await ensureLocale(resolveInitialLanguage());

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}
