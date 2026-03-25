import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";

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

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
