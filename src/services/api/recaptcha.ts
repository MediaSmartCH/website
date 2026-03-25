type ExecuteRecaptcha = ((action: string) => Promise<string>) | undefined;

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

export const getRecaptchaToken = async (
  executeRecaptcha: ExecuteRecaptcha,
  action: string
): Promise<string | null> => {
  if (shouldBypassRecaptcha()) {
    return "";
  }

  if (!executeRecaptcha) {
    return null;
  }

  try {
    const token = await executeRecaptcha(action);
    return typeof token === "string" && token.trim() ? token : null;
  } catch (error) {
    console.error("Unable to generate a reCAPTCHA token:", error);
    return null;
  }
};
