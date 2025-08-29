// e2e/fixtures/selectors.ts
export const S = {
  // Prefer your data-testid; fallback to first canvas
  canvas: "[data-testid='array-canvas'], canvas",

  // Transport controls (prefer explicit testids, else aria-labels/text)
  play: "[data-testid='play'], [aria-label='Play'], button:has-text('Play')",
  step: "[data-testid='step'], [aria-label='Step'], button:has-text('Step')",

  // Links/buttons that likely exist
  toVisualizer:
    "a[href*='/visualizer'], [data-testid='nav-visualizer'], a:has-text('Visualizer')",
} as const;
