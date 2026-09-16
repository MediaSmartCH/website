# Security Policy

## Supported Versions

We actively support the latest version of this project.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ Yes             |
| Older   | ❌ No              |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

👉 Do NOT open a public issue.

Instead, please contact us directly at:
security@mediasmart.ch

If you prefer, you can also use GitHub's private vulnerability reporting feature.

Please include:
- A clear description of the issue
- Steps to reproduce
- Potential impact
- Any suggested fix (if available)

## Response Time

We aim to:
- Acknowledge receipt within 48 hours
- Provide an initial assessment within 5 working days

## Disclosure Policy

We follow responsible disclosure:
- Issues will be fixed before public disclosure
- Credit will be given when appropriate

## How the public endpoints are protected

Every form on the site is unauthenticated and reachable by anyone, so each one
is defended in layers. No single layer is relied on: reCAPTCHA scores can be
farmed, IP addresses rotate, and headers can be forged, so the controls are
arranged so that defeating one still leaves a ceiling behind it.

### Before anything is parsed

`api/_shared/request-guard.ts` refuses, in order: a method the endpoint does not
answer, a request that did not come from one of our own pages (`Origin`, falling
back to Fetch Metadata and then the referrer), a body larger than the endpoint's
ceiling, and a content type that is not JSON. These stop cross-site scripted
submissions and scanner traffic before any validation, reCAPTCHA call or
database round-trip happens. They do not stop a determined attacker with `curl`
— that is what the layers below are for.

### Rate limiting that survives scaling

The in-memory limiter only sees the requests that landed on the same serverless
instance. Vercel runs many concurrently, so a burst fired in parallel used to
get a fresh allowance on each one, and a cold start wiped the history.

`enforceRateLimit` now counts in memory first (free, instant) and then confirms
against shared counters in Cloudflare D1, so every instance sees the same
number. Read-only endpoints escalate to the shared store only once traffic stops
looking like browsing (`durableAfter`), which keeps the calendar responsive.

If D1 is unreachable the in-memory verdict stands: a Cloudflare outage degrades
the ceiling from global to per-instance, it does not close the contact form.

### Outbound mail budgets

A form that mails a copy of its content to the address typed into it is,
mechanically, an open relay — put a victim's address in the e-mail field and a
payload in the message field, and our verified domain delivers it.

`api/_shared/outbound-mail-guard.ts` budgets the recipient directly: a ceiling
per address per day, and a site-wide ceiling per day. Sub-addressing
(`name+tag@`) and provider-ignored dots are collapsed first, so an attacker
cannot mint unlimited "distinct" recipients that reach one mailbox.

The two mails a contact submission sends are treated differently on purpose:

- the **notification to us** goes to a fixed address we own, cannot be aimed at
  anyone, and is always attempted — it is the actual enquiry;
- the **confirmation copy** goes wherever the form said, and is the one that is
  budgeted. Over the ceiling it is silently dropped and the enquiry is still
  delivered, so a visitor's message is never refused because of a limit that
  exists to protect someone else's inbox.

A booking claims its budget before the calendar is touched, and hands it back on
every path that abandons the booking.

### Counters hold no personal data

Counter keys are salted SHA-256 digests of the IP or address, namespaced per
control. A dump of the `security_counters` table cannot be turned back into a
visitor list, and the same subject under two controls produces two uncorrelated
keys.

### reCAPTCHA

Verification has a five-second deadline and fails closed, checks that the
challenge was solved on one of our own hostnames (so a token minted on an
attacker's page cannot be spent here), rejects a stale challenge, and enforces a
minimum score that `RECAPTCHA_MIN_SCORE` can raise. Raise it only after watching
what real submissions score: too high silently turns visitors away.

## E-mail addresses and harvesting

Harvesters fetch a site and run a regex over everything it serves — the HTML,
and the JavaScript bundles too, because that is where a single-page app keeps
its text.

Rendering an address with `[at]` in place of the `@` does not help: the address
still has to reach the `mailto:` link, so it remains in the source, in the
bundle and in the rendered DOM. The only thing that changes is that the visitor
can no longer copy it.

So instead:

- addresses are stored as encoded halves and assembled at runtime
  (`src/shared/constants/contact.ts`), joined through a char code so no
  minifier folds them back together. A test asserts that no address-shaped
  string exists in that file;
- `ObfuscatedEmail` attaches the `mailto:` only on the first hover, focus or
  touch, so a crawler that renders the page still finds no link. A click or an
  `Enter` that never hovered opens the mail client from the handler, so the
  visitor never notices;
- structured data carries no `email`. It is published on every page and is
  machine-readable by design, which made it the easiest address on the site to
  collect; the contact page URL and the phone number serve the same purpose;
- `public/404.html` links to the contact section rather than a `mailto:`. It is
  static HTML, so an address there needs no JavaScript to harvest at all.

After a build, `grep -rE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" dist`
should return only the placeholder addresses used in form examples.

The ceiling here is real: anything that executes our JavaScript can read what a
visitor reads. This raises the cost of automated harvesting; it does not make
the address secret, which is why the anti-abuse work above lives on the server.

## Content Security Policy

The policy in `vercel.json` allows only what the site actually loads: its own
origin, Google Fonts for styles and fonts, reCAPTCHA, and Vercel Analytics.
`img-src` is restricted to our own origin, `data:`/`blob:`, the reCAPTCHA badge
and `cdnjs.cloudflare.com` — **if a portfolio item ever points at an image on
another domain, that domain has to be added here or the image will not render.**

`cdnjs.cloudflare.com` is there for one reason: `react-international-phone`
renders each country flag as an `<img>` pointing at the Twemoji SVG set hosted
there. Removing it does not raise an error anywhere — the contact form's country
selector simply shows empty squares where the flags belong, which is exactly how
this entry came to be needed. Serving those SVGs ourselves would close the last
third-party image request and stop visitors' browsers reaching Cloudflare at
all; it means vendoring roughly 240 files and passing them through the library's
`flags` prop.

`script-src` still carries `'unsafe-inline'`. It cannot be dropped as things
stand: react-helmet injects the structured-data block inline, and CSP applies to
inline `<script>` elements whatever their type. Moving to a nonce would require
a Vercel middleware that rewrites the header and the injected tags per request;
that is the next step available, not a change to make blindly.

## Animation Security

### WASM execution

The DotLottie player requires WebAssembly to render animations. The WASM binary is bundled locally at build time so the browser never fetches it from an external CDN. The `Content-Security-Policy` header in `vercel.json` restricts script execution to trusted sources and includes `wasm-unsafe-eval` exclusively for the animation runtime. Removing this directive will silently break all animations; adding broader `unsafe-eval` instead would weaken the policy unnecessarily.

### Global animations toggle

Users can disable all animations from the navbar. The preference is stored in a first-party cookie (`animations=on|off`) with a 1-year expiry and `SameSite=Lax; Secure` flags. This toggle also serves as a mitigation layer for animation-related attack surfaces:

- **Reduced attack surface** — when animations are disabled the DotLottie WASM runtime is never invoked, eliminating any WASM-related execution path for that session.
- **Accessibility compliance** — the toggle is automatically set to off when the OS-level `prefers-reduced-motion` preference is detected, honouring the user's intent without requiring manual action.
- **No server-side state** — the preference is resolved entirely client-side from the cookie, so no authentication or session is required and there is no server endpoint to target.

### .lottie file integrity

Animation files are static assets compiled into the Vite bundle with content-hashed filenames. They are never fetched from user-controlled URLs and cannot be swapped at runtime. Adding a new animation requires a code change and a new deployment.
