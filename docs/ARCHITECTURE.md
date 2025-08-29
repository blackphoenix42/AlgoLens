# AlgoLens — Architecture Overview

> Vite + React + TypeScript + Tailwind. Panels & canvas for algorithm visuals, with a small engine/runner layer.

## Goals

- Clear separation of **UI (panels/controls)** and **simulation engine**.
- Deterministic, stepable execution (play/pause/seek).
- Shareable state via **URL** and export (images/video later).

## Topology

```
[Browser]
   │
   ▼
React App (App shell, routing, theme)
   │
   ├─ Panels (Code / About / Export / ArrayView)
   ├─ Controls (Transport / DatasetPanel)
   └─ Canvas (ArrayCanvas + toolbar)
         │
         ▼
   Runner (useRunner)  ──> Engine (registry + algorithm impl)
         │                     │
         └── emits ticks ──────┘
                │
                ▼
        Render to <canvas> (draw loop)
```

## Key Modules (by directory)

- `src/pages/`
  - **HomePage / VisualizerPage**: route composition. Visualizer wires panels + canvas + runner.
- `src/features/sorting/ui/`
  - **ArrayCanvas**: imperative canvas renderer, exposes a handle for playhead-controlled redraws.
  - **Toolbar**: zoom/speed/grid toggles, export shortcuts.
- `src/components/controls/`
  - **Transport**: play/pause/step/seek, speed.
  - **DatasetPanel**: dataset generators (random, gaussian, reversed, few-unique, custom).
  - **ArrayViewPanel**: tabular view; useful for a11y and debugging.
- `src/components/panels/`
  - **CodePanel**: shows multi-language code; highlights current line.
  - **AboutPanel**: algorithm notes/complexity.
  - **ExportPanel**: image/video export (uses `lib/exporter`).
- `src/core/algorithm/`
  - **registry.ts** (`find`/`register`): index of algorithms and their metadata.
- `src/core/runner/`
  - **player.ts** (`usePlayer`/`Player`): playhead state machine; emits frames for the canvas to draw.
- `src/lib/`
  - **arrays.ts**: dataset factories.
  - **exporter.ts**: typed draw options (`DrawOptions`) + image/video plumbing.
  - **urlState.ts**: encode/decode settings in the URL for shareable links.
- `src/services/monitoring/`
  - **sentry.client.config.ts**: error monitoring initialization.
- `public/`
  - Static assets (`/brand/AlgoLens.png`), PWA files, well-known files.

## Algorithm Contract (proposed)

Algorithms should be pure, stepable, and serializable.

```ts
export interface AlgoStepContext<TState> {
  state: TState; // current simulation state
  emit?: (event: string, data?: unknown) => void; // optional events
}

export interface Algorithm<TState, TInput> {
  id: string;
  name: string;
  languages?: Partial<Record<"cpp" | "java" | "py" | "js", string>>; // code snippets
  pseudocode?: string;
  init(input: TInput): TState; // initial state from dataset
  step(ctx: AlgoStepContext<TState>): TState; // advance by one step
  done(state: TState): boolean; // termination
}
```

Register in `core/algorithm/registry.ts` and wire in `VisualizerPage`.

## Runner Loop (simplified)

- **Idle** until user hits Play.
- On each tick: `next = algo.step({ state }); setState(next); draw(next);`
- Stops when `algo.done(state)` or user presses Pause/Stop.
- Seeks by replaying steps from `init` quickly up to target index.

## Rendering

- Canvas redraw happens on runner ticks. Use a **single source of truth** (state passed into `ArrayCanvas.draw()`).
- Prefer batched updates and avoid holding React state for per-bar animations; draw directly to 2D context.

## URL State

- Shareable links: algorithm id, dataset seed/size, speed, theme, playhead index → encoded in query/hash.
- On load: hydrate UI/runner from URL → avoids mismatches between panels/canvas.

## Testing

- **Vitest** for lib + hooks.
- **Playwright** for flows: load visualizer, generate dataset, step, export.

## Observability

- **Sentry** error boundary around `<App />` with low sampling for tracing/replays.

## Extensibility

- New algorithm = new module implementing the contract + registry entry + code/pseudocode snippets.
- Canvas variants (graphs, trees) live under `features/*/ui/…`.
