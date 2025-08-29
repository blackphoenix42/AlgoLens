# Contributing to AlgoLens

Thanks for considering a contribution! This guide helps you get productive quickly.

## Quick Start

```sh
# Node version is read from .node-version
npm ci
npm run dev
```

**Useful scripts**

- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run lint` / `npm run typecheck` — quality gates
- `npm run test` — unit tests (Vitest)
- `npx playwright test` — E2E (Playwright)
- `npx changeset` — create a release note & bump proposal

## Git Hygiene

- Branches: `feat/<topic>`, `fix/<bug>`, `chore/<thing>`.
- Commits: **Conventional Commits** (e.g., `feat(canvas): add bar hover`).
- PRs: small, focused; fill out the PR template; include screenshots for UI.

## Pre-commit Hooks

We use **Husky**. After `npm ci`:

```sh
bash scripts/husky.sh
```

This enables `pre-commit` (lint/format) and `commit-msg` (commitlint).

## Adding a New Algorithm

1. Create an implementation in `src/engine/algorithms/<id>.ts` that matches the Algorithm contract.
2. Export metadata: name, pseudocode, language snippets.
3. Register it in `src/engine/registry.ts`.
4. Add a basic dataset scenario to test, and a Playwright flow if it’s interactive.

## Canvas / Rendering

- Keep React state minimal; draw to `<canvas>` inside `ArrayCanvas`.
- Use the `ArrayCanvasHandle` methods from `VisualizerPage` to trigger redraws on runner ticks.

## Tests

- Unit: `vitest run` for lib and hooks.
- E2E: run against `vite preview` (CI does this automatically).
- Avoid flakes (`await page.getByTestId(...).waitFor()`).

## Accessibility & i18n

- Keyboard reachable controls; visible focus rings.
- Use semantic roles (`role="slider"`, etc.).
- Strings should be centralized for translation later.

## Performance

- Avoid unnecessary re-renders; prefer memoized selectors.
- Keep per-frame work in canvas only; no heavy allocations on each tick.

## Docs & ADRs

- Significant decisions → add an ADR in `docs/ADR/` (see template).
- High-level architecture → `architecture.md`.

## Security

- Report vulnerabilities to **security@algolens.app**. Do **not** open public issues for sensitive reports.

## Releases

- Use Changesets:
  - `npx changeset` to propose a bump.
  - CI opens/update a **Version Packages** PR.
  - Merging to `master` publishes to npm and creates the GitHub release.

Thanks for helping make AlgoLens better!
