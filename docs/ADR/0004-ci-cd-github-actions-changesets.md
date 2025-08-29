# ADR 0004: CI/CD: GitHub Actions + Changesets

- **Date:** 2025-08-28
- **Status:** Accepted
- **Owners:** @algolens-infra
- **Tags:** [infra/ci] [release/versioning]

## Context

We want reliable PR checks and automated, traceable releases with human-written changelogs.

## Decision

- Use **GitHub Actions** for CI: lint, typecheck, test, build on PRs and `master`.
- Use **Changesets** for versioning + changelog; open a "Version Packages" PR and publish to npm on merge (with provenance). Tags and GitHub Releases are created automatically.

## Consequences

- Consistent quality gates; faster feedback.
- Transparent semantic versioning workflow.
- Requires `NPM_TOKEN` secret and maintainer discipline to write changesets.

## Alternatives considered

- Manual releases — error-prone and inconsistent.
- Semantic-release — good but less explicit authoring of release notes for our needs.
