import { logger } from "@shared/lib/logger";

type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const privateNetworkPattern =
  /^(localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/;

export const getRecaptchaSiteKey = () =>
  import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
  import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY ||
  "";

export const shouldBypassRecaptcha = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    privateNetworkPattern.test(window.location.hostname) ||
    window.location.hostname.endsWith(".local")
  );
};

const SCRIPT_ID = "google-recaptcha-v3";

/**
 * The in-flight (or settled) load, so the script is requested exactly once
 * however many forms ask for it.
 */
let loading: Promise<Grecaptcha | null> | undefined;

/**
 * Loads reCAPTCHA and resolves once it is ready to mint tokens.
 *
 * This used to be `GoogleReCaptchaProvider`, mounted around the contact form.
 * A provider loads on mount, and the contact form is part of the page on every
 * desktop visit, so every visitor paid for reCAPTCHA — 353KB across five
 * requests, plus Google's own main-thread work and a webfont from
 * fonts.gstatic.com — whether or not they ever touched the form. Doing it here
 * means the request happens when someone actually starts filling one in.
 *
 * The protection is unchanged: the same site key, the same v3 actions, the
 * same token handed to the same server-side check.
 */
function loadRecaptcha(): Promise<Grecaptcha | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const siteKey = getRecaptchaSiteKey();
  if (!siteKey) return Promise.resolve(null);

  loading ??= new Promise<Grecaptcha | null>((resolve) => {
    const settle = () => {
      const grecaptcha = window.grecaptcha;
      if (!grecaptcha) {
        resolve(null);
        return;
      }

      // `ready` fires once the library has finished setting itself up; calling
      // execute before that throws.
      grecaptcha.ready(() => resolve(grecaptcha));
    };

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      settle();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = settle;
    script.onerror = () => {
      logger.error("Unable to load reCAPTCHA");
      // Let a later attempt try again rather than failing every submission
      // for the rest of the session over one blocked request.
      loading = undefined;
      resolve(null);
    };

    document.head.appendChild(script);
  });

  return loading;
}

/**
 * Starts loading reCAPTCHA without waiting for it.
 *
 * Called the first time a visitor touches a protected form, so the script is
 * long since ready by the time they reach the submit button.
 */
export const warmRecaptcha = () => {
  if (shouldBypassRecaptcha()) return;
  void loadRecaptcha();
};

/**
 * A token for `action`, or null when one could not be produced.
 *
 * Returns an empty string on a private network, where the server side skips
 * verification — the same contract the provider-based version had.
 */
export const getRecaptchaToken = async (
  action: string
): Promise<string | null> => {
  if (shouldBypassRecaptcha()) {
    return "";
  }

  try {
    const grecaptcha = await loadRecaptcha();
    if (!grecaptcha) {
      return null;
    }

    const token = await grecaptcha.execute(getRecaptchaSiteKey(), { action });
    return typeof token === "string" && token.trim() ? token : null;
  } catch (error) {
    logger.error("Unable to generate a reCAPTCHA token:", error);
    return null;
  }
};
