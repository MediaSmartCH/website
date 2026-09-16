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
- the address **text** is also withheld from a crawler that renders the page.
  Until the first pointer move, scroll, tap or keypress anywhere on the page,
  the DOM holds it backwards (`hc.tramsaidem@olleh`) with a bidi override
  putting it back in reading order. No address pattern matches that, and
  neither the domain nor the local part survives as a searchable substring. A
  render-and-dump scraper never performs any of those events, because
  extracting text does not require them; a person performs one within a second
  without noticing.

  Copying is itself text extraction, which is why the scrambling is temporary
  rather than permanent: once a visitor has interacted, the DOM holds ordinary
  text and selection, double-click, copy, find-in-page and assistive technology
  all behave normally. Selecting requires a pointer or a key, so the swap has
  always happened before anyone could copy anything.

  Reverse one text node, never several pieces: pieces are separate inline
  boxes, which lose sub-pixel glyph positioning at every seam and stop
  `text-decoration` from propagating into them. Measured on the privacy page,
  the single-node version reports **zero** differing pixels and an identical
  bounding box across the swap; a four-piece split differed on 2.8% of pixels
  and rendered 8px taller. If this is ever changed, measure it again rather
  than assuming;
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
`img-src` is restricted to our own origin, `data:`/`blob:` and the reCAPTCHA
badge — **if a portfolio item ever points at an image on another domain, that
domain has to be added here or the image will not render.**

No third-party image host is listed, and none is needed. The one that used to
be, `cdnjs.cloudflare.com`, served the country flags in the contact form's phone
field: `react-international-phone` points each flag at the Twemoji set hosted
there. Those SVGs now ship with the site (`src/assets/flags`, refreshed by
`scripts/fetch-country-flags.mjs`) and reach the library through its `flags`
prop, so no visitor's browser contacts Cloudflare to render the form.

That episode is worth remembering when tightening this header: a blocked image
raises no error the site can see. The flags simply became empty squares, and
nothing reported it.

`script-src` still carries `'unsafe-inline'`. It cannot be dropped as things
stand: react-helmet injects the structured-data block inline, and CSP applies to
inline `<script>` elements whatever their type. Moving to a nonce would require
a Vercel middleware that rewrites the header and the injected tags per request;
that is the next step available, not a change to make blindly.

## Cloudflare in front of Vercel

The site is served through Cloudflare, which proxies to Vercel. That has two
consequences the code has to account for.

### The origin is reachable without Cloudflare

Vercel's own deployment URLs answer directly. The immutable
`<project>-<hash>-<team>.vercel.app` URL is covered by Vercel's deployment
protection, but the branch alias `<project>-git-<branch>-<team>.vercel.app` is
not: it serves the real site, API included. Anything that relies on "requests
arrive via Cloudflare" is therefore not true by default — it has to be proven.

### `x-forwarded-for` is not the visitor

Vercel overwrites that header with the address that opened the connection and
does not forward what it received, which is what makes it unspoofable. Behind
Cloudflare the thing opening the connection *is* Cloudflare, so the header
holds an edge address shared by every visitor routed through that datacenter.
Keying a rate limit on it pools strangers into one bucket.

Cloudflare sends the real address in `cf-connecting-ip`, but that is a header
like any other: sent straight to the Vercel URL it lets a caller pick its own
identity, and therefore its own allowance.

### How both are handled

A Cloudflare Transform Rule adds a secret header (`x-origin-verify`) to every
request it forwards. `api/_shared/client-ip.js` checks it, and only a verified
request has its `cf-connecting-ip` believed; `request-guard.ts` refuses
unverified requests once enforcement is on.

A secret rather than an IP allowlist, because Cloudflare's published ranges
belong to every Cloudflare customer: "came from a Cloudflare address" only
proves someone used Cloudflare, not that they used ours. Anyone can point their
own zone at our origin and arrive from a valid Cloudflare address.

`/api/booking/health` is exempt (`requireCloudflareOrigin: false`): Vercel Cron
calls the deployment directly and never passes through Cloudflare. It is gated
on `CRON_SECRET` instead.

### Rolling it out, in this order

Reversing steps 1 and 3 refuses every API request.

1. **Cloudflare → Rules → Transform Rules → Modify Request Header.** Add a
   static header `x-origin-verify` with a long random value, on all incoming
   requests for the zone.
2. **Vercel → Settings → Environment Variables.** Set
   `CLOUDFLARE_ORIGIN_SECRET` to that value. Leave `CLOUDFLARE_ORIGIN_ENFORCE`
   unset: the secret is now checked, mismatches are logged, nothing is refused.
3. Watch the runtime logs for `Request reached the origin without valid
   Cloudflare proof`. Silence under real traffic means the rule covers
   everything.
4. Set `CLOUDFLARE_ORIGIN_ENFORCE=true`. Unverified requests now get a 403, and
   `cf-connecting-ip` was already being trusted from step 2 onward.

To rotate the secret, add the new value in Cloudflare first, then change it in
Vercel; there is a brief window where both must be accepted, so rotate with
enforcement off if the traffic matters.

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
