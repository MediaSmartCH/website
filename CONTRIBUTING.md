# Contributing

## Scope

This repository contains the source code for the public MediaSmart website. Changes should prioritize production stability, accessibility, and supply-chain safety over velocity.

## Getting Started

1. Install Node.js 20.x.
2. Install dependencies with `pnpm install`.
3. Copy `.env.example` to `.env.local` and fill in the required values.
4. Run `make dev` for the frontend and `make api` when you need the local API routes.

## Branching and Pull Requests

- Open pull requests against the `production` branch.
- Keep pull requests focused on one concern.
- Update documentation when behavior, environment variables, or operational workflows change.
- Prefer squash merges so the protected branch keeps a linear and auditable history.

## Quality Gate

Before requesting review:

1. Run `make test`.
2. Run `make build`.
3. Confirm that any security-sensitive change documents its threat model or rationale in the relevant file.

## Security

- Never commit secrets, tokens, or customer data.
- Report vulnerabilities privately through GitHub private vulnerability reporting or by following [`SECURITY.md`](SECURITY.md).
- Treat workflow changes as sensitive. Pin third-party actions to immutable commits whenever possible.
