import AOS from "aos";

const ORIGINAL_DURATION_ATTR = "data-aos-duration-original";
const ORIGINAL_DELAY_ATTR = "data-aos-delay-original";

const DEFAULT_DURATION = 420;
const DURATION_SCALE = 0.38;
const MIN_DURATION = 220;
const MAX_DURATION = 620;

const DELAY_SCALE = 0.3;
const MAX_DELAY = 150;
const STEP = 50;

function roundToStep(value: number, step = STEP) {
  return Math.round(value / step) * step;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseNumber(value: string | null) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function rememberOriginalAttribute(element: HTMLElement, attr: string, originalAttr: string) {
  const remembered = element.getAttribute(originalAttr);
  if (remembered !== null) {
    return remembered;
  }

  const current = element.getAttribute(attr);
  if (current !== null) {
    element.setAttribute(originalAttr, current);
  }

  return current;
}

function normalizeDuration(duration: number) {
  return clamp(roundToStep(duration * DURATION_SCALE), MIN_DURATION, MAX_DURATION);
}

function normalizeDelay(delay: number) {
  return clamp(roundToStep(delay * DELAY_SCALE), 0, MAX_DELAY);
}

// Many sections hardcode very long AOS timings. We preserve the original
// values once, then re-derive a shorter version on every refresh so the site
// feels much snappier without touching dozens of components manually.
export function tuneAosElements(root: ParentNode = document) {
  if (typeof window === "undefined") return;

  root.querySelectorAll<HTMLElement>("[data-aos]").forEach((element) => {
    const originalDuration = rememberOriginalAttribute(
      element,
      "data-aos-duration",
      ORIGINAL_DURATION_ATTR
    );
    const duration = parseNumber(originalDuration);
    if (duration !== null) {
      element.setAttribute("data-aos-duration", String(normalizeDuration(duration)));
    }

    const originalDelay = rememberOriginalAttribute(
      element,
      "data-aos-delay",
      ORIGINAL_DELAY_ATTR
    );
    const delay = parseNumber(originalDelay);
    if (delay !== null) {
      element.setAttribute("data-aos-delay", String(normalizeDelay(delay)));
    }

    if (!element.hasAttribute("data-aos-easing")) {
      element.setAttribute("data-aos-easing", "ease-out-cubic");
    }
  });
}

export function initAosAnimations() {
  if (typeof window === "undefined") return;

  tuneAosElements();

  AOS.init({
    once: true,
    offset: 24,
    delay: 0,
    duration: DEFAULT_DURATION,
    easing: "ease-out-cubic",
    throttleDelay: 60,
    debounceDelay: 40,
    disableMutationObserver: true,
  });

  AOS.refreshHard();
}

export function refreshAosAnimations() {
  if (typeof window === "undefined") return;

  tuneAosElements();
  AOS.refreshHard();
}
