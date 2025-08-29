# ADR 0006: Error monitoring: Sentry

- **Date:** 2025-08-28
- **Status:** Accepted
- **Owners:** @algolens-infra
- **Tags:** [observability]

## Context

Canvas rendering and workers can fail subtly in production. We need visibility into exceptions and user-impacting sessions.

## Decision

Adopt **Sentry** (browser) with React Error Boundary, tracing (10% sample), and session replays (0.1, 1.0 on error). Initialize in `src/services/monitoring/sentry.client.config.ts`.

## Consequences

- Faster detection/triage with stack traces and breadcrumbs.
- Must handle PII responsibly; mask inputs and block media in replays.
- Extra bundle size (acceptable for benefits).

## Alternatives considered

- Rollbar/LogRocket — good options; Sentry is already integrated in our workflows.
