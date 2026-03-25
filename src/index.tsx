import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import "antd/dist/reset.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'aos/dist/aos.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Silence noisy console output during development
if (import.meta.env.DEV) {
  console.info = () => {};
  console.warn = () => {};
}

// Prefer the Vite env var, fall back to the CRA convention
const RECAPTCHA_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
  import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY ||
  "";

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_KEY}>
        <App />
      </GoogleReCaptchaProvider>
    </Provider>
  </React.StrictMode>
);
