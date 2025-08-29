# Playwright Baseline Screenshots

This folder stores **baseline images** for `expect(page).toHaveScreenshot()` and
`expect(locator).toHaveScreenshot()` assertions.

- Commit baselines to git so CI can compare against them.
- Update baselines only when the UI changed **intentionally**:
  ```sh
  # app running at http://127.0.0.1:4173 (vite preview) or dev server
  npx playwright test --update-snapshots
  ```

## Tips for stable screenshots

- Disable animations and caret; mask dynamic UI (timestamps, counters).
- Use a fixed viewport and seed any random data.
- Block analytics/telemetry requests during tests.
- Prefer a deterministic font stack (ship webfonts or lock system fonts).

## Conventions

- Baselines live here: `e2e/__screenshots__/`.
- Name files predictably, e.g., `home.png`, `visualizer-bubble-step-3.png`.
- Put spec files in `e2e/*.spec.ts` and call `toHaveScreenshot("<name>.png")`.

## Updating baselines

When a legitimate UI change modifies pixels:

1. Review the visual diff output in Playwright.
2. Re-run with `--update-snapshots`.
3. Verify new baselines locally and **commit** the updated PNGs.

## CI Notes

- CI compares current screenshots vs. the committed baselines.
- Keep Playwright browsers up to date across dev & CI to reduce diffs.
- For OS-specific rendering differences, consider separate baselines via `project` configs.
