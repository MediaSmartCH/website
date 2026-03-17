# MediaSmart Website

Marketing website built with React, TypeScript, and Vite, deployed on Vercel with two serverless API endpoints:

- `POST /api/send` for contact emails via Resend
- `POST /api/verify-recaptcha` for reCAPTCHA verification

## Stack

- React 18
- TypeScript
- Vite 7
- pnpm 10
- Vercel Functions (`api/`)

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
- `RECAPTCHA_SECRET_KEY`: server-side secret used by `/api/verify-recaptcha`
- `RESEND_API_KEY`: server-side key used by `/api/send`

Vercel project sync variables:

- `VERCEL_PROJECT_ID`
- `VERCEL_TEAM_ID`
- `VERCEL_TOKEN`

`VERCEL_PROJECT_ID` and `VERCEL_TEAM_ID` are optional locally if `.vercel/project.json` already exists. `VERCEL_TOKEN` is required in CI.

## Vercel Configuration

Repo-controlled deployment settings live in [`vercel.json`](vercel.json):

- Vite framework preset
- pnpm install and build commands
- `dist` output directory
- `fluid: true`

Dashboard-only settings are versioned in [`config/vercel-project-settings.json`](config/vercel-project-settings.json) and synced with:

```bash
make vercel-sync-dry-run
make vercel-sync
```

The sync script applies:

- `productionDeploymentsFastLane`
- `resourceConfig.fluid`

The client now pins API requests with `x-deployment-id`, so the code is already ready for Vercel skew protection. The dashboard-level toggle itself still requires a Pro or Enterprise plan.

The GitHub workflow [`.github/workflows/sync-vercel-project-settings.yml`](.github/workflows/sync-vercel-project-settings.yml) re-applies those settings on `main` whenever the sync config changes.

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
- `make vercel-sync-dry-run`
- `make vercel-sync`

## Project Structure

```text
api/                         Vercel Functions
config/                      Deployment settings tracked in git
public/                      Static assets
scripts/                     Local tooling and Vercel sync scripts
src/components/              UI components
src/pages/                   Route-level pages
src/services/                API helpers, hooks, and localization
src/store/                   Redux store
```

## Troubleshooting

- If the contact form fails in production, confirm that either `VITE_RECAPTCHA_SITE_KEY` or `REACT_APP_RECAPTCHA_SITE_KEY` exists in Vercel project env vars.
- If `make vercel-sync` fails locally, run `vercel login` and confirm the project is linked.
- If the sync GitHub workflow fails, verify `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, and `VERCEL_TEAM_ID` in repository secrets.
