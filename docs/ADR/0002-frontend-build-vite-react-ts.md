# ADR 0002: Frontend build: Vite + React + TypeScript

- **Date:** 2025-08-28
- **Status:** Accepted
- **Owners:** @algolens-web
- **Tags:** [frontend/build] [dx]

## Context

We need a fast local dev loop, modern ES module build, and strong typing for a React SPA that renders canvases and code panels.

## Decision

Use **Vite** as the bundler/dev server with **React** and **TypeScript**. Keep path aliases via `@/` in `tsconfig.json`. Target modern browsers with ESM; transpile for others via Vite defaults.

## Consequences

- Very fast HMR (hot module replacement) and builds.
- Simple config for Tailwind, Playwright preview, and Sentry env injection.
- Lock-in to Vite plugin ecosystem (acceptable).

## Alternatives considered

- CRA (Create React App) — deprecated and slower.
- Webpack — powerful but slower and heavier config for our needs.
