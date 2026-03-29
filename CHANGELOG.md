# Changelog

This changelog tracks the main milestone releases of the MediaSmart website and the most important platform, security, and delivery updates.

## V2.2.1 | Released March 29, 2026

- Hardened GitHub Actions workflows and deployment-related automation.
- Improved screenshot updates by routing them through pull-request based automation.
- Tightened Vercel sync behavior, deployment URL normalization, and preview handling.
- Kept deployment URLs directly browsable for fallback and debugging scenarios.

## V2.2.0 | Released March 27, 2026

- Refreshed the website experience and strengthened SEO metadata.
- Added screenshot automation and iterated on generated portfolio previews.
- Hardened public forms, browser policies, sanitization, outbound links, and API rate limiting.
- Improved mobile loading, Lottie rendering, animation controls, and homepage stability.
- Continued codebase cleanup across cookie consent, i18n, rendering, and tests.

## V2.1.0 | Released March 16, 2026

- Shipped a major UI overhaul across contact flows, theming, portfolio presentation, and page structure.
- Stabilized pnpm, Node.js, and Vercel build compatibility.
- Improved serverless environment handling and cookie banner consistency between languages.

## V2.0.1 | Released November 11, 2025

- Restored contact delivery through the current provider flow.
- Stabilized mobile navigation behavior and added the repository-managed SPA deployment configuration for Vercel.

## V2.0.0 | Released September 25, 2025

- Rebuilt the application architecture around route-level pages, shared components, and clearer feature ownership.
- Introduced language-aware routing, a custom 404 page, updated privacy pages, and stronger cookie consent flows.
- Added the contact form with reCAPTCHA-backed serverless validation and construction-mode support.
- Split translation resources into locale-specific files and hardened translation lookups.
- Migrated the frontend build from CRA to Vite and cleaned up legacy styling and console noise.

## V1.0.0 | Released May 3, 2024

- Bootstrapped the original React marketing website and asset pipeline.
- Iterated on analytics experiments, FAQ copy, multilingual content, theming, and cookie helpers.
- Added and tuned Lottie-based section animations.
- Reworked homepage content and removed the testimonial section from the main landing experience.
