# Makefile — AlgoLens
# Usage: `make <target>` (run `make help` to list commands)

SHELL := /bin/bash
.ONESHELL:
MAKEFLAGS += --no-builtin-rules

# ---- Vars (override like: make preview PORT=5000) ----
NODE ?= node
NPM ?= npm
NPX ?= npx

PORT ?= 4173
BASE_URL ?= http://127.0.0.1:$(PORT)

DOCKER_IMAGE ?= algolens/web
DOCKER_TAG ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo dev)

# Budgets (used by analyze)
BUDGET_JS ?= 250kb
BUDGET_TOTAL ?= 600kb

# ---- Default ----
default: help

# ---- Meta ----
.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z0-9_\-]+:.*?## ' $(MAKEFILE_LIST) | sed -E 's/:.*##/: /' | sort

# ---- Install / Clean ----
.PHONY: install
install: ## Install dependencies (clean install)
	$(NPM) ci

.PHONY: clean
clean: ## Remove build artifacts and reports
	rm -rf dist build .vite .cache coverage playwright-report test-results analysis

.PHONY: deepclean
deepclean: clean ## Clean + node_modules & lockfile cache
	rm -rf node_modules .npm-cache

# ---- Dev / Build / Preview ----
.PHONY: dev
dev: ## Start Vite dev server
	$(NPM) run dev

.PHONY: build
build: ## Build production bundle (Vite)
	$(NPM) run build

.PHONY: postbuild
postbuild: ## Post-build stamping & checks
	$(NODE) scripts/postbuild.mjs

.PHONY: preview
preview: ## Preview the built app at PORT (vite preview)
	$(NPX) vite preview --port $(PORT) --strictPort

.PHONY: serve-dist
serve-dist: ## Serve /dist via static server (http-server)
	$(NPX) http-server ./dist -p $(PORT) -s

# ---- Lint / Format / Types ----
.PHONY: lint
lint: ## Lint sources (ESLint)
	$(NPX) eslint . --max-warnings=0

.PHONY: format
format: ## Format with Prettier
	$(NPX) prettier --write .

.PHONY: typecheck
typecheck: ## Type-check TypeScript
	$(NPX) tsc --noEmit

# ---- Tests ----
.PHONY: test
test: ## Run unit tests (Vitest)
	$(NPX) vitest run

.PHONY: e2e
e2e: ## Run Playwright E2E (uses playwright.config.ts)
	PW_BASE_URL=$(BASE_URL) $(NPX) playwright test

.PHONY: e2e-update
e2e-update: ## Update Playwright screenshot baselines
	PW_BASE_URL=$(BASE_URL) $(NPX) playwright test --update-snapshots

# ---- Accessibility / Lighthouse ----
.PHONY: a11y
a11y: ## Run pa11y-ci accessibility checks
	$(NPX) pa11y-ci --config pa11y-ci.json

.PHONY: lhci
lhci: build ## Run Lighthouse CI against /dist
	$(NPX) -y @lhci/cli autorun --config=lhci/lighthouserc.json

# ---- Analysis / Perf / Licenses / Sitemap ----
.PHONY: analyze
analyze: build ## Bundle size analysis + budgets
	$(NODE) scripts/analyze.mjs --dir dist --budget-js $(BUDGET_JS) --budget-total $(BUDGET_TOTAL) --fail-on-threshold

.PHONY: perf
perf: ## Quick performance probe (Playwright if available)
	$(NODE) scripts/perf-benchmark.mjs --url $(BASE_URL) --tries 3

.PHONY: licenses
licenses: ## Third-party license audit
	$(NODE) scripts/check-licenses.mjs

.PHONY: sitemap
sitemap: ## Generate sitemap.xml (edit base if needed)
	$(NODE) scripts/generate-sitemap.mjs --base $(BASE_URL) --out public/sitemap.xml

# ---- CI meta target ----
.PHONY: ci
ci: install typecheck lint test e2e a11y analyze lhci ## Run the common CI checks

# ---- Docker (production image) ----
.PHONY: docker-build
docker-build: ## Build Docker image (multi-stage) -> $(DOCKER_IMAGE):$(DOCKER_TAG)
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

.PHONY: docker-run
docker-run: ## Run container on :8080
	docker run --rm -p 8080:80 --name algolens $(DOCKER_IMAGE):$(DOCKER_TAG)

.PHONY: docker-stop
docker-stop: ## Stop running container
	- docker stop algolens

# ---- Release (Changesets) ----
.PHONY: changeset
changeset: ## Create a new changeset
	$(NPX) changeset

.PHONY: version
version: ## Apply version bumps from changesets
	$(NPX) changeset version

.PHONY: publish
publish: ## Publish (usually via CI). Locally runs npm publish if configured.
	$(NPM) publish || echo "Publishing is usually handled by CI."
