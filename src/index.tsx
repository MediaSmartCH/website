import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "aos/dist/aos.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

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
