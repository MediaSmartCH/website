import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import {
  getRecaptchaSiteKey,
  shouldBypassRecaptcha,
} from "services/api/recaptcha";

interface ScopedRecaptchaProviderProps {
  children: React.ReactNode;
}

const reCaptchaKey = getRecaptchaSiteKey();

const ScopedRecaptchaProvider = ({
  children,
}: ScopedRecaptchaProviderProps) => {
  // Keep reCAPTCHA off the initial app bootstrap and only load it where a form
  // actually needs a token. Local/private environments already bypass it.
  if (shouldBypassRecaptcha() || !reCaptchaKey) {
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default ScopedRecaptchaProvider;
