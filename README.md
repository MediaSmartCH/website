# MediaSmart Website

Marketing website built with React, TypeScript, and Vite, deployed on Vercel with two serverless API endpoints:

- `POST /api/send` for contact emails via Resend
- `POST /api/newsletter` for newsletter capture via Resend

## Stack

- React 18
- TypeScript
- Vite 7
- pnpm 10
- Vercel Functions (`api/`)
- `@lottiefiles/dotlottie-react` for Lottie animations (replaces the legacy `dotlottie-player` web component)
- Redux Toolkit for global state (theme, language, animations toggle)

## Prerequisites

- Node.js 20.x
- pnpm 10.x
- Vercel CLI for local project sync

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the environment template and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

3. Validate the local environment:

   ```bash
   make check-env
   ```

## Run Locally

Start the frontend:

```bash
make dev
```

Start the local API server in another terminal:

```bash
make api
```

Local URLs:

- Frontend: `http://localhost:3000`
- Local API proxy target: `http://localhost:3001`

## Build And Preview

Build the production bundle:

```bash
make build
```

Preview the production bundle:

```bash
make preview
```

Generate a bundle report:

```bash
make analyze
```

## Environment Variables

Application variables:

- `VITE_RECAPTCHA_SITE_KEY`: preferred public key used by Vite builds
- `REACT_APP_RECAPTCHA_SITE_KEY`: backward-compatible fallback while the Vercel project is still carrying the legacy CRA variable
- `RECAPTCHA_SECRET_KEY`: server-side secret used by `/api/send` and `/api/newsletter`
- `RESEND_API_KEY`: server-side key used by `/api/send` and `/api/newsletter`

Vercel project sync variables:

- `VERCEL_TOKEN` (optional, only for the manual GitHub sync workflow)

The repository now versions its Vercel project context in [`config/vercel-project-context.json`](config/vercel-project-context.json), so `VERCEL_TOKEN` is the only secret needed when you run the GitHub sync workflow manually. It must be a long-lived Vercel access token created in the dashboard. `VERCEL_PROJECT_ID` and `VERCEL_TEAM_ID` remain available as optional overrides.

## Vercel Configuration

Repo-controlled deployment settings live in [`vercel.json`](vercel.json):

- Vite framework preset
- pnpm install and build commands
- `dist` output directory
- `fluid: true`
- automatic Git deployments disabled for every branch except `main`
- `*.vercel.app` hosts redirected to `https://mediasmart.ch`

Dashboard-only project settings are versioned in [`config/vercel-project-settings.json`](config/vercel-project-settings.json).
Custom-domain routing is versioned in [`config/vercel-domains.json`](config/vercel-domains.json).
Both are synced with:

```bash
make vercel-sync-dry-run
make vercel-sync
```

The sync scripts apply:

- `productionDeploymentsFastLane`
- `resourceConfig.fluid`
- `mediasmart.ch` as the production origin
- `www.mediasmart.ch` as a 308 redirect to `mediasmart.ch`

The client now pins API requests with `x-deployment-id`, so the code is already ready for Vercel skew protection. The dashboard-level toggle itself still requires a Pro or Enterprise plan.

## Security Notes

- reCAPTCHA is now enforced server-side on each form submission. The public client no longer performs a standalone `/api/verify-recaptcha` call.
- The under-construction newsletter form now uses the server-side Resend flow instead of exposing a browser-side email delivery provider.
- Public form endpoints add `Cache-Control: no-store`, hidden honeypot fields, and stricter payload length validation.

The GitHub workflow [`.github/workflows/sync-vercel-project-settings.yml`](.github/workflows/sync-vercel-project-settings.yml) can re-apply those settings manually when you want GitHub to enforce the tracked Vercel configuration.

## GitHub Actions

Repository-managed workflows now follow a lighter trigger strategy:

- `Security & Quality`: runs manually or on pull requests targeting `main`
- `CodeQL`: runs manually, on pull requests targeting `main`, and on the weekly security schedule
- `Sync Vercel Settings`: runs manually only
- `Update portfolio screenshots`: runs manually or on the weekly screenshot refresh schedule, then opens or updates a pull request instead of pushing directly to `main`

This repository only defines the workflow files stored in `.github/workflows/`. Entries shown in the GitHub Actions UI such as Dependabot or other platform-managed features are managed by GitHub and are not controlled by these workflow files.

## Make Targets

```bash
make help
```

Main targets:

- `make install`
- `make update`
- `make dev`
- `make api`
- `make build`
- `make preview`
- `make analyze`
- `make clean`
- `make check-env`
- `make test`
- `make test-watch`
- `make test-coverage`
- `make vercel-sync-dry-run`
- `make vercel-sync`
- `make vercel-sync-project-dry-run`
- `make vercel-sync-project`
- `make vercel-sync-domains-dry-run`
- `make vercel-sync-domains`

## Project Structure

```text
api/                              Vercel Functions
config/                           Deployment settings tracked in git
public/                           Static assets
scripts/                          Local tooling and Vercel sync scripts
src/_archive/                     Inactive components kept for future reimplementation
src/assets/lotties/               .lottie animation files (light + dark variants per animation)
src/components/
  common/                         Shared UI components (Navbar, Footer, Contact, …)
    DotAnim.tsx                   Single animation player (wraps DotLottieReact)
  layout/                         Routing infrastructure (LangLayout, ErrorBoundary, RouteSeo)
  preloader/                      Full-page loading spinner
  presentation/                   Page-specific section components
    cookies/                      Cookie consent banner
    home/                         Home page sections
    itServices/                   IT services page sections
    privacy-policy/               Privacy policy page (single unified component)
    videoServices/                Video services page sections
src/config/
  Config.tsx                      React Router configuration
  lotties.ts                      Animation registry: keys, lazy loaders, and dimensions
src/pages/                        Route-level page wrappers
src/services/
  api/                            Fetch helpers and reCAPTCHA client
  aos/                            AOS animation timing utilities
  hooks/                          Custom React hooks
  locales/                        i18n translation files (en/, fr/) + safe accessor
  router/                         Language-aware link helpers
  seo/                            SEO route metadata
src/store/
  slices/common/                  animationsSlice, themeSlice, languageSlice, cookieUtils
```

## Internationalization (i18n)

All user-facing text is managed through translation files in `src/services/locales/`:

```text
src/services/locales/
  en/          English translations (navbar, footer, home, it, video, cookies, privacy, …)
  fr/          French translations (mirror structure)
  index.ts     Master dictionary — registers each namespace for both languages
  safe.ts      useTranslations(lang) hook — dot-notation accessor with fallback
```

To add a new translated string:

1. Add the key to both `en/<namespace>.ts` and `fr/<namespace>.ts`.
2. The key is immediately accessible via `t.text("namespace.key")` in any component that calls `useTranslations(languageReducer)`.

Supported languages are defined in `src/config/languages.ts`. The active language is stored in Redux (`languageSlice`) and synced to the `/:lang/` URL prefix by `LangLayout`.

## Cookies & Consent

Cookie consent is managed by `src/components/presentation/cookies/index.tsx` (the `ModernCookieBanner` component). Consent state is persisted in `localStorage` via `src/store/slices/common/cookieUtils.ts`.

Three optional cookie categories are presented to the user:

| Category | What it covers | Always on? |
|---|---|---|
| Necessary | Contact form, Calendly booking, reCAPTCHA | Yes |
| Functionality | Theme preference, language preference | No |
| Performance | Google Analytics | No |

Calendly functionality is treated as a necessary cookie and is always enabled — no user action required.

To open the consent modal programmatically from any component:

```ts
import { requestCookieSettingsOpen } from "store/slices/common/cookieUtils";
requestCookieSettingsOpen();
```

To read current consent state in a component, use the `useCookieConsent` hook:

```tsx
import useCookieConsent from "services/hooks/useCookieConsent";
const consent = useCookieConsent(); // ConsentPreferences
```

## Animations

Animations are powered by `@lottiefiles/dotlottie-react`. The WASM runtime is bundled locally (via `vite-plugin-dotlottie-wasm-url`) so the player never fetches from an external CDN, which the production Content-Security-Policy would block.

### Adding a new animation

1. Export two `.lottie` files from After Effects / LottieFiles: one for light mode, one for dark mode.
2. Drop them in `src/assets/lotties/<section>/`.
3. Add a new entry to `LOTTIE_LOADERS` in `src/config/lotties.ts` with lazy `import()` calls for both variants.
4. Add a matching entry to `LOTTIE_PRESENTATION` in the same file with the animation's native pixel dimensions (and an optional `scale` factor if it needs a visual boost).
5. Use `<DotAnim anim="your.key" />` anywhere in the component tree.

`DotAnim` resolves the correct variant for the current theme automatically and switches files with a crossfade when the theme changes.

### Global animations toggle

A Redux slice (`animationsSlice`) tracks whether animations are enabled globally. On first load the initial value is derived automatically:

- Disabled if the OS-level **Reduce Motion** accessibility preference is on.
- Disabled on devices with ≤ 2 CPU cores or < 2 GB RAM.
- Otherwise enabled.

The preference is persisted in a cookie (`animations=on|off`, 1-year expiry) so it survives page reloads. Users can toggle it from the navbar. All `DotAnim` instances respond immediately via the imperative `dotLottieInstance.play() / .pause()` API — no remount required.

To read or update the toggle from a component, use the `useInterfaceControls` hook:

```tsx
const { animationsEnabled, flipAnimations } = useInterfaceControls();
```

## Troubleshooting

- If the contact form fails in production, confirm that either `VITE_RECAPTCHA_SITE_KEY` or `REACT_APP_RECAPTCHA_SITE_KEY` exists in Vercel project env vars.
- If `make vercel-sync` fails locally, run `vercel login` and confirm the project is linked.
- If the sync GitHub workflow fails, verify that `VERCEL_TOKEN` is a dashboard-created Vercel access token. A local Vercel CLI session token is not sufficient for GitHub Actions.
- If animations fail to load in production, verify that `wasm-unsafe-eval` is present in the `Content-Security-Policy` header defined in `vercel.json`. The DotLottie WASM runtime requires it.
- If an animation plays in the wrong variant after a theme switch, check that both `light` and `dark` entries exist for its key in `LOTTIE_LOADERS` and that the corresponding `.lottie` files are present in `src/assets/lotties/`.
