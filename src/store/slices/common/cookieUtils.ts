export const COOKIE_CONSENT_UPDATED_EVENT = "cookie-consent-updated";

export function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (Number.isFinite(days) && days > 0) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${name}=${encodeURIComponent(value || "")}${expires}; path=/; SameSite=Lax${secure}`;
}

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const parts = document.cookie.split(";");

  for (let i = 0; i < parts.length; i++) {
    let c = parts[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) {
      const raw = c.substring(nameEQ.length);
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
  }
  return null;
}

// Parses JSON safely with a fallback value; never throws
export function safeJSONParse<T>(jsonString: unknown, fallback: T): T {
  if (typeof jsonString !== "string") return fallback;
  const trimmed = jsonString.trim();
  if (!trimmed) return fallback;

  try {
    const parsed = JSON.parse(trimmed);
    const ok = parsed !== null && (typeof parsed === "object" || Array.isArray(parsed));
    return ok ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

// Reads cookie consent from localStorage; removes the entry if it is corrupted
export function getSafeConsentData(): Record<string, any> | null {
  try {
    const stored = localStorage.getItem("cookie_consent");
    if (!stored) return null;
    const data = safeJSONParse<Record<string, any>>(stored, null as any);
    if (data && typeof data === "object") return data;
    localStorage.removeItem("cookie_consent");
    return null;
  } catch {
    localStorage.removeItem("cookie_consent");
    return null;
  }
}

// Persists consent data to localStorage, adding an ISO timestamp for auditing
export function saveConsentData(consentData: Record<string, any>) {
  try {
    const dataWithTimestamp = {
      ...consentData,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie_consent", JSON.stringify(dataWithTimestamp));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: dataWithTimestamp })
      );
    }
    return true;
  } catch {
    return false;
  }
}
