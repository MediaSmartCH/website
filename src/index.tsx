import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "aos/dist/aos.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import 'antd/dist/reset.css';                 // antd v5 reset (si tu utilises antd)
import 'slick-carousel/slick/slick.css';      // styles slick *globaux*
import 'slick-carousel/slick/slick-theme.css';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

if (process.env.NODE_ENV === 'development') {
  console.info = () => {};
  console.warn = () => {};
  console.debug = () => {};
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""}>
        <App />
      </GoogleReCaptchaProvider>
    </Provider>
  </React.StrictMode>
);


reportWebVitals();
