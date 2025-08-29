# ADR 0003: Styling: Tailwind CSS

- **Date:** 2025-08-28
- **Status:** Accepted
- **Owners:** @algolens-web
- **Tags:** [frontend/ui]

## Context

We need consistent styling and dark mode with minimal CSS churn. The UI includes panels, toolbars, and canvas overlays.

## Decision

Adopt **Tailwind CSS** for utility-first styling. Use a small design token layer (colors, spacing, radius) and component patterns for panels and controls. Prefer semantic class groupings over long one-offs.

## Consequences

- Fast iteration; fewer cascades/specificity issues.
- Smaller CSS via purge (Vite + Tailwind).
- Utilities in JSX can grow noisy; mitigate with components and `clsx`.

## Alternatives considered

- CSS Modules — fine but slower iteration for this project.
- Styled-components — runtime overhead not needed here.
