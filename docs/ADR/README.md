# Architecture Decision Records (ADR)

We use ADRs to document significant technical decisions for **AlgoLens**.
Each ADR captures **context → decision → consequences**, plus alternatives considered.

## Workflow

1. Copy `0000-template.md` → next number (e.g., `0006-my-decision.md`).
2. Write it in PR as `Proposed`.
3. Discuss; once merged, set Status to `Accepted` (or `Superseded` with a link).
4. Never edit the history of an Accepted ADR—create a new ADR to supersede it.

## Status values

- Proposed — drafted in a PR, under discussion.
- Accepted — merged and implemented (or planned next).
- Rejected — decision made not to proceed.
- Superseded — replaced by a newer ADR (link it).

## Index

- [0001: Record architecture decisions](0001-record-architecture-decisions.md)
- [0002: Frontend build: Vite + React + TypeScript](0002-frontend-build-vite-react-ts.md)
- [0003: Styling: Tailwind CSS](0003-styling-tailwindcss.md)
- [0004: CI/CD: GitHub Actions + Changesets](0004-ci-cd-github-actions-changesets.md)
- [0005: Testing strategy: Vitest + Playwright](0005-testing-vitest-playwright.md)
- [0006: Error monitoring: Sentry](0006-error-monitoring-sentry.md)
