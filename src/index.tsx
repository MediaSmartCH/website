// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import "aos/dist/aos.css";
// // import reportWebVitals from "./reportWebVitals";
// import { Provider } from "react-redux";
// import { store } from "./store/store";
// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
// import 'antd/dist/reset.css';                 // antd v5 reset (si tu utilises antd)
// import 'slick-carousel/slick/slick.css';      // styles slick *globaux*
// import 'slick-carousel/slick/slick-theme.css';

// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );

// if (import.meta.env.NODE_ENV === 'development') {
//   console.info = () => {};
//   console.warn = () => {};
//   console.debug = () => {};
// }

// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""}>
//         <App />
//       </GoogleReCaptchaProvider>
//     </Provider>
//   </React.StrictMode>
// );


// // reportWebVitals();


import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import App from "./App";
// import "aos/dist/aos.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// styles globaux
import "antd/dist/reset.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'aos/dist/aos.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Silence console en dev si tu veux
if (import.meta.env.DEV) {
  console.info = () => {};
  console.warn = () => {};
}

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
