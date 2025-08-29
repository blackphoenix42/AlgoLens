# ADR 0001: Record architecture decisions

- **Date:** 2025-08-28
- **Status:** Accepted
- **Owners:** @algolens-maintainers
- **Tags:** [process/governance]

## Context

AlgoLens will evolve quickly (algorithms, UI, export, DX). We need a lightweight, versioned way to document decisions and their rationale.

## Decision

Adopt Architecture Decision Records (ADRs) stored under `docs/ADR/`, numbered, one decision per file, reviewed via PRs. Use the template `0000-template.md`.

## Consequences

- Clear, auditable history of choices.
- Faster onboarding and fewer “why did we…?” debates.
- Slight process overhead when decisions are significant.

## Alternatives considered

- Wiki pages — lack versioned review with code changes.
- Commit messages — too granular, hard to discover.
