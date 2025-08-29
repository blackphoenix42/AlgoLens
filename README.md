# AlgoLens

A tiny VisuAlgo-style MVP built with **Vite + React + TypeScript + TailwindCSS**.
- Home page lists algorithms.
- Visualizer page renders canvas + pseudocode + transport controls.
- Algorithms are pure generators that yield visualization **frames**.

## Quick start
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Tech
- React Router for pages (`/:topic/:algo`)
- TailwindCSS for styling
- Alias `@` → `src` (vite.config.ts + tsconfig.json)

## Add a new algorithm
1. Create a file under `src/algorithms/<topic>/<name>.ts` exporting `export const run: Algorithm = function* (...) { ... }`
2. Register it in `src/engine/registry.ts` with metadata (`slug`, `title`, `pseudocode`, `load`).
3. It will appear on the Home page and route to `/<topic>/<slug>`.

## URL params
- `?n=16&seed=42&speed=8&step=12`
- `seed` controls input generation for deterministic replays.

## Notes
- Bubble Sort is implemented. Add Insertion/Merge next.
- Keep frames light and serializable.
