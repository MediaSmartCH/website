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

`mise.toml` pins Node 20 for this directory — `mise trust && mise install` sets it
up. The version is not cosmetic: `engines.node` in package.json is what Vercel
reads to pick the runtime for the functions in `api/`, so anything else means
developing against a different runtime than production (and pnpm warns about it
on every command). With another version manager, read the version from
`mise.toml`.

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

## Quality Checks

```bash
make typecheck   # tsc over src (tsconfig.json) and over api + scripts (tsconfig.api.json)
make test        # vitest
```

Both run on every pull request, in the `audit` job of `.github/workflows/security.yml`,
before the build check.

The two tsconfigs exist because `src` is browser code and `api` is Node: the API
needs `process` and `Buffer` in scope, and the browser code must not have them.

### Visual non-regression

`scripts/capture-style-snapshot.mjs` fingerprints every route in both languages
and both themes by resolved colour, typography and box size, keyed on visible
text so it survives class and DOM churn. Two captures of unchanged code are
byte-identical, so any reported difference is real.

```bash
pnpm dev
node scripts/capture-style-snapshot.mjs --out .snapshots/before.json
# ... make changes ...
node scripts/capture-style-snapshot.mjs --out .snapshots/after.json
node scripts/diff-style-snapshot.mjs .snapshots/before.json .snapshots/after.json
```

Puppeteer is not a dependency of this repo; the header of the capture script
explains how to provide it.

## Environment Variables

Application variables:

- `VITE_RECAPTCHA_SITE_KEY`: preferred public key used by Vite builds
- `REACT_APP_RECAPTCHA_SITE_KEY`: backward-compatible fallback while the Vercel project is still carrying the legacy CRA variable
- `RECAPTCHA_SECRET_KEY`: server-side secret used by `/api/send` and `/api/newsletter`
- `RESEND_API_KEY`: server-side key used by `/api/send` and `/api/newsletter`
- `SITE_ORIGIN`: canonical public origin. Decides which `Origin` headers and reCAPTCHA hostnames are accepted, and builds the booking manage links
- `ALLOWED_ORIGINS` (optional): extra origins the site is served from, comma-separated
- `SECURITY_COUNTER_SALT` (optional): salt for the hashed abuse-counter keys; falls back to `BOOKING_HMAC_SECRET`
- `RECAPTCHA_MIN_SCORE` (optional): minimum v3 score, defaults to `0.5`
- `CONTACT_CONFIRMATION_RECIPIENT_LIMIT`, `CONTACT_CONFIRMATION_DAILY_LIMIT`, `BOOKING_MAIL_RECIPIENT_LIMIT`, `BOOKING_MAIL_DAILY_LIMIT` (optional): outbound-mail ceilings, defaults in `api/_shared/outbound-mail-guard.ts`

Vercel project sync variables:

- `VERCEL_TOKEN` (optional, only for the manual GitHub sync workflow)

The repository now versions its Vercel project context in [`config/vercel-project-context.json`](config/vercel-project-context.json), so `VERCEL_TOKEN` is the only secret needed when you run the GitHub sync workflow manually. It must be a long-lived Vercel access token created in the dashboard. `VERCEL_PROJECT_ID` and `VERCEL_TEAM_ID` remain available as optional overrides.

## Vercel Configuration

Repo-controlled deployment settings live in [`vercel.json`](vercel.json):

- Vite framework preset
- pnpm install and build commands
- `dist` output directory
- `fluid: true`
- automatic Git deployments disabled for every branch except `production`
- `*.vercel.app` hosts remain directly browsable for deployment fallback and debugging
- GitHub deployment records still point to `https://mediasmart.ch`

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
- Every state-changing endpoint is guarded before its payload is parsed: allowed method, an `Origin` on one of our own pages, a JSON content type, and a body-size ceiling (`api/_shared/request-guard.ts`).
- Rate limits are counted in shared Cloudflare D1 counters as well as in memory, so a burst spread across serverless instances is caught. Requires migration `0002`; without it the counters fail soft to per-instance limits.
- Mail addressed to a visitor-supplied address is budgeted per recipient and per day (`api/_shared/outbound-mail-guard.ts`), so the contact form cannot be used to mail a third party at scale. The internal notification is never budgeted.
- Contact addresses are assembled at runtime and never appear in the HTML or the JS bundle; `ObfuscatedEmail` attaches the `mailto:` only once a visitor hovers or focuses the link.

[`SECURITY.md`](SECURITY.md) explains what each layer does, what it deliberately does not do, and the trade-offs behind the CSP.

The GitHub workflow [`.github/workflows/sync-vercel-project-settings.yml`](.github/workflows/sync-vercel-project-settings.yml) can re-apply those settings manually when you want GitHub to enforce the tracked Vercel configuration.

## GitHub Actions

Repository-managed workflows now follow a lighter trigger strategy:

- `Security & Quality`: runs manually or on pull requests targeting `production`
- `CodeQL`: runs manually, on pull requests targeting `production`, and on the weekly security schedule
- `Sync Vercel Settings`: runs manually only
- `Update portfolio screenshots`: runs manually or on the weekly screenshot refresh schedule, pushes a dedicated automation branch, and opens or updates a pull request instead of pushing directly to `production` when the token is allowed to create pull requests

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
- `make typecheck`
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
  _shared/                        Cross-endpoint helpers (mailers, rate limit, reCAPTCHA)
  _tests/                         Handler contract tests
  booking/_lib/                   Booking domain: slots, tokens, D1, Google Calendar
config/                           Deployment settings tracked in git
public/                           Static assets
scripts/                          Local tooling, Vercel sync, visual-regression snapshots
src/app/                          Application shell — nothing feature-specific lives here
  entries/                        One entry point per locale (fr.tsx, en.tsx)
  layout/                         site-layout, lang-layout, route-seo, error-boundary
  bootstrap.tsx                   Mounts React once the active locale is loaded
  router.tsx                      React Router configuration
src/features/                     One folder per product area, self-contained
  booking/                        Modal, calendar, manage page, booking API client
  contact/                        Contact section and form
  cookies/                        Consent banner
  error/  home/  it-services/  privacy-policy/  support-contract/
  under-construction/  video-services/
    components/                   Sections rendered by that feature only
    api/ · data/                  Feature-owned data access and fixtures
src/shared/                       Reusable across features, owns no product logic
  components/                     navbar, footer, selectors, dot-anim, rich-text, backdrops
  config/                         languages, lotties, construction flag
  constants/                      contact details, social links
  hooks/                          store-hooks, use-cookie-consent, use-interface-controls, …
  i18n/                           Translation bundles (en/, fr/), registry and translator
  lib/                            fetch-with-deployment, recaptcha, scroll-animations
  seo/                            Route metadata
  types/                          Ambient module declarations
src/store/                        Redux store
  slices/common/                  animationsSlice, themeSlice, languageSlice, cookieUtils
src/styles/                       Global stylesheets
  tokens.css                      Design tokens: raw palette + per-theme roles
  app.css                         Barrel; import order is the cascade order
  base.css · sections.css · responsive.css
  components/                     buttons, forms, phone-input, faq, preloader
src/test/                         Vitest setup and module mocks
```

## Styling

Colours go through design tokens, never a hex value in the JSX.

`src/styles/tokens.css` has two layers. `--palette-*` on `:root` holds the raw
colours, named after what they look like. `--color-*` on `.App` and `.AppDark`
assigns them to semantic roles, named after what they are for. `.App` /
`.AppDark` already wrapped the whole tree, so the theme switch needs no extra
markup.

`tailwind.config.js` exposes the roles as utilities, so a component writes
`text-heading` or `bg-surface` and gets the right colour in either theme —
instead of the `isLight ? "text-[#14172D]" : "text-[#F6F6F6]"` ternaries this
replaced.

To add a colour: add the raw value to `--palette-*`, assign it to a role in both
theme blocks, register the role in `tailwind.config.js`, then use the class.

Some roles resolve to the same colour in one theme and differ in the other —
`heading`, `heading-strong` and `ink` are all `#F6F6F6` in dark mode. They stay
separate because merging them would change the light theme. That is a design
inconsistency worth resolving deliberately, not a refactoring one.

## Internationalization (i18n)

All user-facing text is managed through translation files in `src/shared/i18n/`:

```text
src/shared/i18n/
  en/            English translations (navbar, footer, home, it, video, cookies, privacy, …)
  fr/            French translations (mirror structure)
  registry.ts    Per-locale loader — each entry point registers its own bundle
  index.ts       Dictionary facade over the registry
  translator.ts  useTranslations(lang) hook — dot-notation accessor with fallback
```

To add a new translated string:

1. Add the key to both `en/<namespace>.ts` and `fr/<namespace>.ts`.
2. The key is immediately accessible via `t.text("namespace.key")` in any component that calls `useTranslations(languageReducer)`.

Supported languages are defined in `src/shared/config/languages.ts`. The active language is stored in Redux (`languageSlice`) and synced to the `/:lang/` URL prefix by `LangLayout`.

## Cookies & Consent

Cookie consent is managed by `src/features/cookies/components/cookie-banner.tsx` (the `ModernCookieBanner` component). Consent state is persisted in `localStorage` via `src/store/slices/common/cookieUtils.ts`.

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
3. Add a new entry to `LOTTIE_LOADERS` in `src/shared/config/lotties.ts` with lazy `import()` calls for both variants.
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
