SHELL := /bin/sh

.DEFAULT_GOAL := help

VERCEL_SYNC_SCRIPT := scripts/sync-vercel-project-settings.mjs
VERCEL_DOMAIN_SYNC_SCRIPT := scripts/sync-vercel-domain-settings.mjs

.PHONY: help install update dev api start build preview analyze clean env check-env test test-watch test-coverage vercel-sync vercel-sync-dry-run vercel-sync-project vercel-sync-project-dry-run vercel-sync-domains vercel-sync-domains-dry-run

help: ## Show available targets
	@grep -E '^[a-zA-Z0-9_-]+:.*## ' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*## "}; {printf "  %-22s %s\n", $$1, $$2}'

install: ## Install dependencies with pnpm
	pnpm install

update: ## Refresh dependencies from the lockfile
	pnpm update

dev: ## Start the Vite development server
	pnpm run dev

api: ## Start the local API server for /api/send
	pnpm run api

start: dev ## Alias for dev

build: ## Build the production bundle
	pnpm run build

preview: ## Preview the production build
	pnpm run preview

analyze: ## Generate the bundle analysis report
	pnpm run analyze

test: ## Run the test suite once
	pnpm test

test-watch: ## Run tests in watch mode (re-runs on file changes)
	pnpm test:watch

test-coverage: ## Run tests and generate a coverage report
	pnpm test:coverage

clean: ## Remove generated files
	rm -rf dist node_modules/.vite bundle-report.html

env: check-env ## Alias for check-env

check-env: ## Validate the local environment file
	@test -f .env.local || (echo "Missing .env.local. Copy .env.example first." && exit 1)
	@grep -Eq '^(VITE_RECAPTCHA_SITE_KEY|REACT_APP_RECAPTCHA_SITE_KEY)=' .env.local || (echo "Missing VITE_RECAPTCHA_SITE_KEY or REACT_APP_RECAPTCHA_SITE_KEY in .env.local." && exit 1)
	@grep -q '^RECAPTCHA_SECRET_KEY=' .env.local || (echo "Missing RECAPTCHA_SECRET_KEY in .env.local." && exit 1)
	@grep -q '^RESEND_API_KEY=' .env.local || (echo "Missing RESEND_API_KEY in .env.local." && exit 1)
	@echo "Local environment looks valid."

vercel-sync-project-dry-run: ## Show the tracked Vercel project patch without applying it
	node $(VERCEL_SYNC_SCRIPT) --dry-run

vercel-sync-project: ## Apply tracked Vercel project settings
	node $(VERCEL_SYNC_SCRIPT)

vercel-sync-domains-dry-run: ## Show the tracked Vercel domain changes without applying them
	node $(VERCEL_DOMAIN_SYNC_SCRIPT) --dry-run

vercel-sync-domains: ## Apply tracked Vercel domain settings
	node $(VERCEL_DOMAIN_SYNC_SCRIPT)

vercel-sync-dry-run: vercel-sync-project-dry-run vercel-sync-domains-dry-run ## Show all tracked Vercel changes without applying them

vercel-sync: vercel-sync-project vercel-sync-domains ## Apply all tracked Vercel settings
