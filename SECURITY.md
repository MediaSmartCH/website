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
