type LottieAssetModule = { default: string };
type LottieVariantLoader = () => Promise<LottieAssetModule>;
type ResourceStatus = "pending" | "resolved" | "rejected";
type LottieDimensions = { width: number; height: number };
type LottieFit = "contain" | "cover" | "fill" | "none" | "fit-width" | "fit-height";
type LottiePresentation = {
  width: number;
  height: number;
  fit?: LottieFit;
  scale?: number;
  align?: [number, number];
};

type LottiePairLoader = {
  light: LottieVariantLoader;
  dark?: LottieVariantLoader;
};

type LottieResource = {
  preload: () => Promise<void>;
  read: () => string;
};

// Assets are resolved lazily so each route only loads the animation variants it
// actually needs instead of importing the full catalog upfront.
const LOTTIE_LOADERS = {
  "home.hero": {
    light: () => import("@assets/lotties/home/Home_light.lottie"),
    dark: () => import("@assets/lotties/home/Home_dark.lottie"),
  },
  "home.about": {
    light: () => import("@assets/lotties/home/About_light.lottie"),
    dark: () => import("@assets/lotties/home/About_dark.lottie"),
  },

  "it.hero": {
    light: () => import("@assets/lotties/it/IT_light.lottie"),
    dark: () => import("@assets/lotties/it/IT_dark.lottie"),
  },
  "it.about": {
    light: () => import("@assets/lotties/it/Introduction_light.lottie"),
    dark: () => import("@assets/lotties/it/Introduction_dark.lottie"),
  },

  "it.services.website": {
    light: () => import("@assets/lotties/it/Website_light.lottie"),
    dark: () => import("@assets/lotties/it/Website_dark.lottie"),
  },
  "it.services.maintenance": {
    light: () => import("@assets/lotties/it/Maintenance_light.lottie"),
    dark: () => import("@assets/lotties/it/Maintenance_dark.lottie"),
  },
  "it.services.optimization": {
    light: () => import("@assets/lotties/it/Optimization_light.lottie"),
    dark: () => import("@assets/lotties/it/Optimization_dark.lottie"),
  },
  "it.services.security": {
    light: () => import("@assets/lotties/it/Security_light.lottie"),
    dark: () => import("@assets/lotties/it/Security_dark.lottie"),
  },
  "it.services.backup": {
    light: () => import("@assets/lotties/it/Backup_light.lottie"),
    dark: () => import("@assets/lotties/it/Backup_dark.lottie"),
  },
  "it.services.support": {
    light: () => import("@assets/lotties/it/Support_light.lottie"),
    dark: () => import("@assets/lotties/it/Support_dark.lottie"),
  },

  "it.process": {
    light: () => import("@assets/lotties/it/Process_light.lottie"),
    dark: () => import("@assets/lotties/it/Process_dark.lottie"),
  },

  "video.editing": {
    light: () => import("@assets/lotties/video/Editing_light.lottie"),
    dark: () => import("@assets/lotties/video/Editing_dark.lottie"),
  },
  "video.live": {
    light: () => import("@assets/lotties/video/Live_light.lottie"),
    dark: () => import("@assets/lotties/video/Live_dark.lottie"),
  },
  "video.photography": {
    light: () => import("@assets/lotties/video/Photography_light.lottie"),
    dark: () => import("@assets/lotties/video/Photography_dark.lottie"),
  },
  "video.rental": {
    light: () => import("@assets/lotties/video/Rental_light.lottie"),
    dark: () => import("@assets/lotties/video/Rental_dark.lottie"),
  },
  "video.retransmission": {
    light: () => import("@assets/lotties/video/Retransmission_light.lottie"),
    dark: () => import("@assets/lotties/video/Retransmission_dark.lottie"),
  },
  "video.production": {
    light: () => import("@assets/lotties/video/Video_light.lottie"),
    dark: () => import("@assets/lotties/video/Video_dark.lottie"),
  },
  "video.header": {
    light: () => import("@assets/lotties/video/VideoHeader_light.lottie"),
    dark: () => import("@assets/lotties/video/VideoHeader_dark.lottie"),
  },
} as const satisfies Record<string, LottiePairLoader>;

export type LottieKey = keyof typeof LOTTIE_LOADERS;

/** Every catalogued animation, for exhaustive iteration in tests and preloads. */
export const LOTTIE_KEYS = Object.keys(LOTTIE_LOADERS) as LottieKey[];

/**
 * Poster stems, relative to `assets/lotties/posters` and without the
 * `_light` / `_dark` suffix.
 *
 * A poster is the animation's first frame, flattened to a ~14kB WebP. DotAnim
 * paints it the moment a slot appears, so the box is never empty while the
 * DotLottie runtime and the animation file are still on their way. Regenerate
 * with `node scripts/generate-lottie-posters.mjs` after touching a .lottie.
 */
const LOTTIE_POSTER_STEM: Record<LottieKey, string> = {
  "home.hero": "home/Home",
  "home.about": "home/About",

  "it.hero": "it/IT",
  "it.about": "it/Introduction",

  "it.services.website": "it/Website",
  "it.services.maintenance": "it/Maintenance",
  "it.services.optimization": "it/Optimization",
  "it.services.security": "it/Security",
  "it.services.backup": "it/Backup",
  "it.services.support": "it/Support",

  "it.process": "it/Process",

  "video.editing": "video/Editing",
  "video.live": "video/Live",
  "video.photography": "video/Photography",
  "video.rental": "video/Rental",
  "video.retransmission": "video/Retransmission",
  "video.production": "video/Video",
  "video.header": "video/VideoHeader",
};

// Eager on purpose: these resolve to URL strings, not image data, and the
// poster is only useful if its address is known synchronously — an extra async
// hop would reintroduce the very gap it exists to cover.
const POSTER_URLS = import.meta.glob<string>(
  "../../assets/lotties/posters/**/*.webp",
  { eager: true, query: "?url", import: "default" }
);

function readPosterUrl(stem: string, variant: "light" | "dark") {
  return POSTER_URLS[`../../assets/lotties/posters/${stem}_${variant}.webp`];
}

// The React canvas player does not inherit the source animation footprint the
// same way the old SVG web component did. Keeping the native dimensions here
// lets DotAnim restore the expected size across all sections without page-level
// CSS workarounds.
const LOTTIE_PRESENTATION: Record<LottieKey, LottiePresentation> = {
  "home.hero": { width: 1050, height: 433 },
  "home.about": { width: 615, height: 480, scale: 1.08 },

  "it.hero": { width: 981, height: 488 },
  "it.about": { width: 604, height: 480, scale: 1.12 },

  "it.services.website": { width: 470, height: 375, scale: 1.08 },
  "it.services.maintenance": { width: 499, height: 375, scale: 1.08 },
  "it.services.optimization": { width: 433, height: 358, scale: 1.08 },
  "it.services.security": { width: 478, height: 369, scale: 1.08 },
  "it.services.backup": { width: 512, height: 343, scale: 1.08 },
  "it.services.support": { width: 421, height: 409, scale: 1.08 },

  // Keep the tall process animation at its native footprint. Overscaling makes
  // it visually overpower the step list and overlap surrounding content.
  "it.process": { width: 488, height: 939 },

  "video.editing": { width: 584, height: 458, scale: 1.08 },
  "video.live": { width: 574, height: 392, scale: 1.08 },
  "video.photography": { width: 612, height: 466, scale: 1.14 },
  "video.rental": { width: 572, height: 403, scale: 1.16 },
  "video.retransmission": { width: 523, height: 439, scale: 1.16 },
  "video.production": { width: 661, height: 453, scale: 1.12 },
  "video.header": { width: 966, height: 516 },
};

// Module-level cache: once a variant is resolved it stays in memory for the
// lifetime of the page. The key format is "<animKey>:<variant>" (e.g. "home.hero:dark").
const resourceCache = new Map<string, LottieResource>();

// Implements the React Suspense "render-as-you-fetch" pattern.
// - While the promise is pending, read() throws the promise so Suspense can suspend the tree.
// - Once resolved, read() returns the .lottie file URL synchronously.
// - On rejection, read() re-throws so an ErrorBoundary can catch it.
function createResource(loader: LottieVariantLoader): LottieResource {
  let status: ResourceStatus = "pending";
  let value = "";
  let error: unknown;

  const promise = loader().then(
    (module) => {
      status = "resolved";
      value = module.default;
    },
    (reason) => {
      status = "rejected";
      error = reason;
    }
  );

  return {
    preload: () => promise.then(() => undefined),
    read: () => {
      if (status === "pending") {
        throw promise; // Suspense catches this and shows the fallback UI
      }

      if (status === "rejected") {
        throw error; // ErrorBoundary catches this
      }

      return value;
    },
  };
}

// Returns the cached resource if it already exists, otherwise creates and caches it.
// This ensures each variant is only fetched once, even if multiple components request it.
function getResource(cacheKey: string, loader: LottieVariantLoader) {
  const cached = resourceCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const resource = createResource(loader);
  resourceCache.set(cacheKey, resource);
  return resource;
}

// Falls back to the light variant when no dark variant exists for a given key.
function resolveLoader(key: LottieKey, theme: string) {
  // Widened on purpose: `as const` tells TypeScript every current entry has a
  // dark variant, which makes the fallback below look dead. The catalogue is
  // allowed to hold light-only animations, so the guard has to stay meaningful.
  const pair: LottiePairLoader = LOTTIE_LOADERS[key];
  const variant = theme === "dark" && pair.dark ? "dark" : "light";
  const loader = variant === "dark" && pair.dark ? pair.dark : pair.light;

  return {
    cacheKey: `${key}:${variant}`,
    loader,
  };
}

export function preloadLottieSrc(key: LottieKey, theme: string) {
  const { cacheKey, loader } = resolveLoader(key, theme);
  return getResource(cacheKey, loader).preload();
}

export function readLottieSrc(key: LottieKey, theme: string) {
  const { cacheKey, loader } = resolveLoader(key, theme);
  return getResource(cacheKey, loader).read();
}

export function getLottieAspectRatio(key: LottieKey) {
  const { width, height } = LOTTIE_PRESENTATION[key];
  return width / height;
}

export function getLottiePresentation(key: LottieKey) {
  return LOTTIE_PRESENTATION[key];
}

/**
 * URL of the still frame standing in for an animation until it has drawn.
 *
 * Falls back to the light poster for keys that have no dark variant, mirroring
 * how `resolveLoader` picks the animation file itself.
 */
export function getLottiePoster(key: LottieKey, theme: string): string | undefined {
  const stem = LOTTIE_POSTER_STEM[key];
  if (!stem) return undefined;

  const preferred = theme === "dark" ? readPosterUrl(stem, "dark") : undefined;
  return preferred ?? readPosterUrl(stem, "light");
}
