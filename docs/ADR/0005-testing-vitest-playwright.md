# ADR 0005: Testing strategy: Vitest + Playwright

- **Date:** 2025-08-28
- **Status:** Accepted
- **Owners:** @algolens-web
- **Tags:** [quality/testing]

## Context

We need fast unit tests for utility code and components, plus E2E to protect critical flows (dataset generation, stepping, exporting).

## Decision

- **Vitest** for unit/integration tests with JSDOM.
- **Playwright** for E2E: run against `vite preview` in CI, collect traces on failure.

## Consequences

- Quick feedback locally; good CI artifacts on failure.
- Some flake risk in E2E; minimize with `waitFor*` and test ids.

## Alternatives considered

- Jest + Puppeteer — slower and more setup for our stack.
