# AlgoLens — Public Roadmap

_Last updated: 2025-08-29 (IST)_

This roadmap is a living plan for AlgoLens. It now incorporates your full feature list, organized into phases with clear acceptance criteria. Dates are targets, not guarantees.

## Guiding Principles

- **Learning-first UX:** visuals + pseudocode stay in sync; friction-free.
- **Deterministic engine:** stepable algorithms with reproducible state.
- **Performance & a11y:** 60 fps where it matters; full keyboard + screen reader paths.
- **Quality gates:** lint, typecheck, unit + E2E; no red builds on `master`.

## Release Train

- Patch releases: as needed (bugfixes/docs).
- Minor releases: ~every 3–6 weeks.
- Versioning: **Changesets**; see `changelog.md`.

---

## CURRENT — v0.1.x (MVP hardening) ⟶ _Aug–Sep 2025_

**Goal:** Stabilize initial visualizer; baseline a11y/perf; publish docs.

### Scope (from your list)

- **Core UX & Player**
  - Algorithm catalog/index (basic list + search) (P1)
  - Themes: light/dark (P0), high-contrast palette scaffold (P1), color-blind safe palettes (P1)
  - Interactive canvas: zoom, pan, full-screen (P0); grid toggle (P1)
  - Pseudocode/code panel with line highlighting synced to animation; language switch (TS/JS/CPP/Java/Python) (P0)
  - About panel: description + complexities (P0); Full code view (P1)
  - Dataset controls: arrays (random, nearly-sorted, reversed, few-unique, gaussian), size slider, seed (P0)
  - Player: play/pause, frame step, speed slider, rewind (P0)
  - Tooltips on hover (values/indices) (P0)
  - Session autosave/restore last state (P1)
  - Timeline scrubbing (basic), previews (P1)
- **Algorithm Coverage**
  - Sorting baseline: Bubble, Selection, Insertion (P0)
- **Visualization Modes & Panels**
  - Array views: bars (P0), table (P1)
  - Complexity overlay (ops counts) — minimal (P1)
- **Debugging & Inspection**
  - Edge-case runner presets (empty/1/dupes) (P1)
  - Snapshots/bookmarks (basic) (P1)
- **Platform & Performance**
  - 2D Canvas renderer; worker-ready event model (P1)
  - PWA skeleton, offline cache of shell (P1)
- **Security & Privacy**
  - CSP baseline; sandbox plan for future user code (P1)
  - Cookie/Privacy/Security docs; opt‑in telemetry gates (P0)

### Acceptance Criteria

- Lighthouse (desktop): Perf ≥ 80, A11y ≥ 90, Best Practices ≥ 90
- Playwright flows green (Linux/Chrome)
- Canvas steady at ≥ 50 fps on 1k elements on a mid‑range laptop

---

## NEXT — v0.2.0 (Algorithms + UX polish) ⟶ _Target: Oct 2025_

**Goal:** Add core `O(n log n)` sorts and deepen learning affordances.

### Scope

- **Algorithms (sorting):** Merge (top‑down & bottom‑up), Quick (Lomuto/Hoare; 2‑way vs 3‑way), Heap (P0)
- **UX:** compare/swap highlights; finalization state; timeline scrubbing with previews (P0)
- **Pseudocode ↔ Canvas:** hover/step linkage; callout current line (P0)
- **Player:** rewind to start; step into recursion (P1)
- **Export:** animated GIF for short runs (≤15 s) (P1)
- **Dataset:** size slider 8–2048; seed capture/share (P1)
- **A11y:** pass 2 — roles on sliders, SR announcements of key steps (P1)

### Acceptance Criteria

- Sync latency step→highlight ≤ 50 ms
- Each sort ships with: pseudocode, TS/CPP code, complexity notes
- GIF export completes ≤ 10 s for ≤ 15 s animations on CI

---

## v0.3.0 (Data structures + ArrayCanvas v2) ⟶ _Target: Nov–Dec 2025_

**Goal:** Introduce DS visualizers and refactor canvas for diff rendering.

### Scope

- **ArrayCanvas v2:** layers (grid/marks/annotations), diff rendering (P0)
- **Data structures:** Stack, Queue, Binary Search walkthrough (P0); BST ops (insert/search) (P1)
- **Inspection:** watch panel (variables/expressions); state diff panel; invariants badges (P1)
- **Debugging:** conditional stops; improved snapshots/bookmarks (P1)
- **Strings (intro):** KMP, Z (P1)

### Acceptance Criteria

- Diff rendering reduces per‑step draw time by ≥ 30% vs v1
- Watch panel evaluates expressions at ≤ 2 ms per tick for typical cases

---

## v0.4.0 (Graphs intro + Export upgrades) ⟶ _Target: Q1 2026_

**Goal:** First graph algorithms + richer exports.

### Scope

- **GraphCanvas:** nodes/edges with straight/curved edges, weighted labels; presets (grid/tree/random) (P0)
- **Algorithms:** BFS, DFS, Topological sort (Kahn/DFS) (P0); Dijkstra (P1)
- **Export:** SVG stills; MP4 (ffmpeg.wasm) experimental (P1)
- **Data input:** import edge list/adj matrix/JSON (P1)

### Acceptance Criteria

- BFS/DFS show queue/stack overlays and parent trees
- SVG export deterministic and matches visible state

---

## v0.5.0 (Educator features & i18n) ⟶ _Target: Q2 2026_

**Goal:** Classroom/demo delight.

### Scope

- **Presenter mode:** hide chrome, keyboard shortcuts, spotlight (P0)
- **Pedagogy:** step explanations; invariant callouts; quizzes (“predict next state”); hint ladder (P1)
- **i18n:** extract strings; base `en`; pilot `hi`; RTL support baseline (P1)
- **Annotations:** pin notes on frames; export replay JSON (P1)

### Acceptance Criteria

- Presenter toggle with one key; restores previous layout
- Quizzes persist and grade locally (no server)

---

## v0.6.0 (Authoring & Plugins)

**Goal:** Let users extend the system safely.

### Scope

- **Custom Code Visualizer:** built‑in editor (TS/JS) + small `emit()` API (P0)
- **Visual DSL/block editor** to script animations (P1)
- **WASM authoring (C++/Rust)** in WASI‑like sandbox; stdout→events (P1)
- **Plugin system:** algorithms, layouts, generators, color themes; versioned packages (P0)
- **Validation:** lint animations (missing events, consistent indices) (P1)
- **Deterministic RNG** harness exposed to scripts (P0)

---

## v0.7.0 (Collaboration & Sharing)

**Goal:** Make sharing and discussion first‑class.

### Scope

- **Permalinks:** algorithm + dataset + timestamp; scopes (view/comment/edit) (P0)
- **Export:** GIF/MP4/SVG/PNG; watermark toggle (P0)
- **Annotations/sticky notes:** timeline‑anchored; comment threads; @mentions (P1)
- **Live‑share presenter:** followers sync to presenter timeline (P1)
- **Embed widget:** iframe API (start/stop/seek, presets) (P1)

---

## v0.8.0 (Experimentation & Benchmarking)

**Goal:** Enable empirical exploration.

### Scope

- **Side‑by‑side runs** (2–4 algorithms), synced timelines (P0)
- **Batch mode:** sweep sizes/distributions; aggregate mean/variance (P0)
- **Parameter sweeps:** pivot strategy, bucket size, hashing load factor (P1)
- **Empirical vs theoretical curves:** auto fit on log‑log; percentile plots (P1)
- **Space usage estimator**; stability tester (P1)
- **Charts export:** PNG/SVG & raw CSV/JSON (P0)

---

## v0.9.0 (Advanced algorithms)

**Goal:** Cover breadth demanded by CP/DSA learners.

### Scope (highlights; full inventory below)

- **Sorting:** Counting, Radix (LSD/MSD), Bucket, Shell (P0)
- **Searching:** Linear, Binary, Interpolation, Ternary, Exponential (P0)
- **Graphs:** 0‑1 BFS, Bellman–Ford, SPFA, Floyd–Warshall, Johnson’s, A\*, bidirectional, SCC (Kosaraju/Tarjan), Biconnected/AP/Bridges, MST (Kruskal/Prim+DSU), Max‑Flow (Edmonds–Karp/Dinic), Min‑Cut, Matching (Hopcroft–Karp), Eulerian/Hierholzer (P0–P1)
- **Trees:** BST delete, AVL/Red‑Black (rotations), Splay, Treap, B/B+ Tree (demos), Segment Tree (iter/rec + lazy), Fenwick (BIT), Trie/Compressed, Suffix Tree (Ukkonen demo), LCA (binary lifting/Euler+RMQ) (P0–P1)
- **Heaps/Hash:** Binary/d‑ary, Fibonacci (demo), Pairing, Hash tables (OA/chaining) (P1)
- **Strings:** Rabin–Karp, Boyer–Moore/Horspool, Aho–Corasick, Suffix Array (SA‑IS/doubling), LCP (Kasai), Suffix Automaton, Edit distance, rolling‑hash collision demos (P0–P1)
- **DP:** Knapsack, LIS (n² & n log n), Coin change, Matrix chain, Bitmask DP (TSP), Tree DP, Digit DP, SOS DP, CHT (Li Chao) (P0–P1)
- **Geometry:** Orientation/CCW, segment intersection, sweep line, convex hull (Graham/Andrew), closest pair, Delaunay/Voronoi (HL demo), polygon area/PIP (P0–P1)
- **Number theory:** Sieve (Eratosthenes/linear), GCD/Extended, mod inv/exp, CRT, Miller–Rabin demo, Pollard Rho demo (P0–P1)
- **Advanced/Other:** Union‑Find (PC+rank), Top‑k (quickselect/heaps), LRU/LFU, rate limiting (token/leaky), Bloom filter (FPR demo) (P0–P1)

---

## v1.0 (Classroom suite, Governance & Compliance)

**Goal:** Production‑ready for education orgs.

### Scope

- **Classroom/Edu:** teacher dashboards (assign/track/auto‑grade), LMS (LTI), rooms/roster/permissions, printable worksheets with QR, proctor view, anti‑plagiarism heuristics (P0–P1)
- **Admin & Governance:** plugin registry with signing/moderation/ratings, version pinning for classroom stability, backup/restore of org workspaces, RBAC (owner/admin/teacher/student/viewer) (P0–P1)
- **Security & Privacy:** hardened CSP, untrusted code in iframes, no network in sandbox unless allowed, quotas/timeouts, FERPA/GDPR toggles, private workspaces (P0)
- **Accessibility & Inclusivity:** full keyboard navigation, screen‑reader narration, adjustable font/marker sizes, alt text & captions, RTL ready (P0)

---

## Integrations (progressively across phases)

- GitHub/Gist import/export for datasets and scripts; issue reporter with replay JSON
- Google Drive/OneDrive save; Notion/Obsidian embed
- Competitive‑programming site adapters
- Webhooks for run events (education analytics)

## Platform & Performance (ongoing)

- WebGL/Canvas2D hybrid; LOD for large `n`
- Worker threads for algorithm execution; message‑based events
- Memory‑safe sandbox; incremental, GC‑friendly state with structural sharing
- Mobile‑first responsive layouts & gestures
- Snapshot compression for long timelines

## Analytics & Product Ops (opt‑in, post‑MVP)

- Heatmaps of pause/rewind steps
- Algorithm popularity, common wrong answers
- Perf telemetry (frame times, dropped frames)
- A/B framework for pedagogy features

---

## Milestone Table (updated)

| Milestone | Target       | Key Items                                                                             |
| --------- | ------------ | ------------------------------------------------------------------------------------- |
| v0.1.x    | Aug–Sep 2025 | MVP sorting, themes, basic player/datasets, tooltips, autosave, table view, snapshots |
| v0.2.0    | Oct 2025     | Merge/Quick/Heap, sync highlights, previews, GIF export, step‑into recursion          |
| v0.3.0    | Nov–Dec 2025 | ArrayCanvas v2, Stack/Queue/BS, watch & state‑diff, conditional stops, KMP/Z          |
| v0.4.0    | Q1 2026      | GraphCanvas, BFS/DFS/Topo, Dijkstra, SVG/MP4 export, graph import                     |
| v0.5.0    | Q2 2026      | Presenter mode, quizzes & hints, annotations, i18n+RTL                                |
| v0.6.0    | —            | Authoring (editor/DSL/WASM), plugins, RNG harness, linting                            |
| v0.7.0    | —            | Sharing: permalinks, annotations threads, live‑share, embeds                          |
| v0.8.0    | —            | Experimentation: side‑by‑side, batch mode, sweeps, curves, charts                     |
| v0.9.0    | —            | Advanced algorithms (graphs/trees/strings/DP/geometry/NT/etc.)                        |
| v1.0      | —            | Classroom suite, governance, compliance, full a11y                                    |

---

## Appendix — Full Feature Inventory (verbatim from your list)

### Core UX & Player

• Algorithm catalog/index with search, tags, category, “related algorithms,” difficulty filters  
• Multi-theme UI (light/dark/high-contrast), color-blind safe palettes  
• Interactive canvas: zoom/pan, grid/snap, drag to rearrange nodes/bars, full-screen  
• Pseudocode/code panel with line highlighting synced to animation (language switch option (Cpp, java, python, javascript))  
• About that algorithm, its complexities and everything  
• Full code view option  
• Option for Custom Code Visualizer  
• Control dataset/random dataset/custom input  
• Player controls: play/pause, frame step, step into/over recursion, speed slider, rewind, rotate  
• Timeline scrubbing with state previews; time-travel undo/redo  
• Breakpoints (line, state, condition predicate)  
• Watch panel for variables/expressions; inline diffs  
• Call stack viewer & recursion tree  
• Tooltips on hover (values, indices, parent/child, costs, invariants)  
• Session autosave; restore last state on reopen  
• Multi-tab/multi-canvas workspace

### Data Input & Generators

• Arrays: size slider, range, distributions (random, Gaussian, nearly sorted, reversed, few-unique, sawtooth, custom)  
• Strings: manual input, random with alphabet/pattern density, regex-based generator  
• Graphs: generators (grid, tree, DAG, Erdős–Rényi, Barabási–Albert, Watts–Strogatz, planar), import (edge list/adj matrix/JSON), directed/undirected, weighted (incl. negative), positions (force/Kamada–Kawai/spectral/manual)  
• Trees/Tries: balanced/unbalanced, BST inserts from sequence, duplicates toggle, load from preorder/inorder  
• Matrices/DP tables: size, obstacle density (for pathfinding/maze), random weights  
• Seeded RNG for reproducibility; dataset save/load; named presets  
• File import/export (CSV/JSON/GraphML); drag-drop; clipboard paste

### Algorithm Coverage (phased rollouts)

Sorting: Bubble, Selection, Insertion, Merge (top-down/bottom-up), Quick (Lomuto/Hoare, 2-way/3-way), Heap, Counting, Radix (LSD/MSD), Bucket, Shell  
Searching: Linear, Binary, Interpolation, Ternary, Exponential  
Graphs: BFS/DFS (orders, parents), Topological sort (Kahn/DFS), Dijkstra, 0-1 BFS, Bellman–Ford, SPFA, Floyd–Warshall, Johnson’s, A\* (grid & general), Bidirectional search, SCC (Kosaraju/Tarjan), Biconnected/AP/Bridges, MST (Kruskal/Prim with DSU), Max Flow (Edmonds–Karp/Dinic), Min-Cut, Matching (Hopcroft–Karp), Eulerian/Hierholzer  
Trees: BST ops (insert/delete/search), AVL/Red-Black (rotations), Splay, Treap, B-Tree/B+Tree, Segment Tree (iterative/recursive, lazy propagation), Fenwick (BIT), Trie/Compressed trie, Suffix Tree (Ukkonen – demo), LCA (binary lifting/Euler+RMQ)  
Heaps/Hash: Binary heap, d-ary heap, Fibonacci heap (demo), Pairing heap, Hash tables (chaining/open addressing: linear/quadratic/double)  
Strings: KMP, Z-algorithm, Rabin–Karp, Boyer–Moore/Horspool, Aho–Corasick, Suffix Array (SA-IS/Prefix-doubling), LCP (Kasai), Suffix Automaton, Edit distance (Levenshtein/Damerau), Rolling hash collisions demo  
DP: Knapsack (0/1, unbounded), LIS (n² & n log n), Edit distance, Coin change, Matrix chain, Bitmask DP (TSP), Tree DP, Digit DP, SOS DP, Convex hull trick (Li Chao)  
Geometry: Orientation/CCW, Segment intersection, Sweep line (events/active set), Convex hull (Graham/Andrew), Closest pair (divide & conquer), Delaunay/Voronoi (high-level), Polygon area/point-in-poly  
Number Theory: Sieve (Eratosthenes/linear), GCD/Extended, Modular inverse/exponentiation, CRT (Chinese Remainder Theorem), Miller–Rabin (demo), Pollard Rho (demo)  
Advanced/Other: Union-Find (path compression/rank), Top-k (Quickselect/Heaps), LRU/LFU cache behavior, Rate limiting (token/leaky bucket), Bloom filter (FPR demo)  
**cp-algorithms.com – ALL ALGORITHMS from cp-algorithms.com**

### Visualization Modes & Panels

• Array views: bars, dots, table, rainbow/stability coloring  
• Graph view: straight/curved edges, weighted labels, path highlight, negative-edge alert  
• DP view: heatmap cells, arrows to predecessors, fill order animation  
• Tree view: layered layout, pointer arrows, balance factors/colors  
• Memory model: stack/heap objects, pointer aliasing, reference counts  
• Complexity overlay: theoretical O(·) + live counts (comparisons, swaps, relaxations, pushes/pops)  
• State diff panel (before/after arrays/maps/sets)  
• Invariant badges (e.g., “prefix [0..i) sorted”)

### Debugging & Inspection

• Conditional stops (e.g., `arr[i] > arr[j]`, `dist[u] + w < dist[v]`)  
• Snapshots/bookmarks; label and jump  
• Deterministic record‑replay; export replay JSON  
• Error injection (flip comparison, remove relaxation, mutate key) → visualize breakage  
• Edge case runner (empty, 1‑elem, duplicates, all‑equal, worst‑case)  
• Floating‑point mode (epsilon, NaN/Inf warnings)

### Experimentation & Benchmarking

• Side‑by‑side runs (2–4 algorithms) on same input, synced timelines  
• Batch mode: run across multiple sizes/distributions; aggregate mean/variance  
• Parameter sweeps (pivot strategy, bucket size, hashing load factor)  
• Empirical vs theoretical curves; automatic complexity fit (log‑log regression)  
• Space usage estimator (peak working set)  
• Stability tester (tag equal elements and verify final order)  
• Randomized trials with seed ranges; percentile plots  
• Export charts (PNG/SVG) & raw results (CSV/JSON)

### Pedagogy & Guidance

• Step explanations (“why this step”), invariant callouts, counterexample generator  
• Annotated proofs (loop invariants, correctness sketches)  
• “Predict next state” quizzes, multiple‑choice checkpoints  
• “Fill‑the‑gap” pseudocode tasks with instant feedback  
• Hint ladder; misconceptions gallery (“why my quicksort TLEs”)  
• Concept maps linking related algorithms  
• Exploration prompts (e.g., change comparator; remove path compression)

### Authoring / Extensibility

• Built‑in code editor (TS/JS + `emit()` API)  
• Visual DSL/block editor to script animations without code  
• C++/Rust authoring via WebAssembly (WASI sandbox)  
• Unit tests for author scripts; golden‑state snapshot tests  
• Plugin system: algorithms, layouts, generators, color themes  
• Share/import “algovis packages” (zip/JSON manifest), semantic versioning  
• Linting for animations (no missing events, consistent indices)  
• Deterministic RNG harness available to scripts

### Collaboration & Sharing

• Permalinks to algorithm + dataset + timestamp  
• Export GIF/MP4/SVG/PNG; watermark toggle  
• Annotations/sticky notes anchored to timeline/state  
• Comment threads per step; @mentions  
• Live‑share “presenter mode” (followers auto‑sync)  
• Embed widget (iframe) with API for start/stop/seek and presets

### Classroom / Edu Suite

• Teacher dashboards: assign activities, track progress, auto‑grading for quizzes  
• LMS integration (LTI), grade passback  
• Classroom rooms with roster & permissions  
• Anti‑plagiarism heuristics for authored code tasks  
• Printable worksheets (QR to load the scenario)  
• Proctor view (live state of each student’s timeline)

### Accessibility & Inclusivity

• Full keyboard navigation, ARIA roles, screen‑reader step narration  
• Adjustable font/line/marker sizes; haptics (mobile) and optional audio cues  
• Alt text for visuals; captions on step explanations  
• RTL (right‑to‑left) support; i18n for UI + content packs

### Integrations

• GitHub/Gist import/export for datasets and scripts  
• Google Drive/OneDrive save; Notion/Obsidian embed  
• Competitive programming sites sample imports (format adapters)  
• Issue reporter linking to GitHub with attached replay JSON  
• Webhooks for run events (education analytics)

### Platform & Performance

• PWA (Progressive Web App), offline cache, “install” support  
• WebGL/Canvas2D hybrid renderer; level‑of‑detail for large n  
• Worker threads for algorithm execution; message‑based events  
• Memory‑safe sandbox for user code, CPU quotas, timeouts  
• Incremental GC‑friendly state representation, structural sharing  
• Mobile‑first responsive layouts, touch gestures  
• Snapshot compression for long timelines

### Security & Privacy

• Content Security Policy; iframes for untrusted code  
• No network in sandboxed code unless explicitly allowed  
• Rate limits on heavy operations; runaway detection  
• Private workspaces; share links with scopes (view/comment/edit)  
• GDPR/FERPA toggles for edu environments; local‑only mode

### Analytics & Product Ops (opt‑in)

• Heatmaps of steps where users pause/rewind (to improve tutorials)  
• Algorithm popularity, common wrong answers  
• Perf telemetry (frame times, dropped frames)  
• A/B testing framework for pedagogy features

### Admin & Governance

• Plugin registry with signing, moderation, and ratings  
• Version pinning for classroom stability  
• Backup/restore of org workspaces  
• Role‑based access control (owner/admin/teacher/student/viewer)

### Per‑Algorithm Options (examples)

• Quicksort: pivot (first/last/random/median‑of‑three), 2‑way vs 3‑way, tail‑recursion elimination toggle  
• Merge sort: top‑down vs bottom‑up, buffer reuse, galloping (Timsort demo)  
• Heap sort: 1‑based vs 0‑based heap, sift‑down variant, build‑heap method  
• Counting/Radix: base (2–1024), stable/unstable, signed handling  
• Binary search: lower/upper bound, bug traps (mid overflow, termination)  
• Dijkstra: PQ type (binary/fibonacci demo/pairing), early exit, decrease‑key vs insert‑again  
• Bellman–Ford: iteration visualization, negative cycle detection path  
• A\*: heuristic (Manhattan/Euclidean/zero), tie‑break, diagonal moves, corner‑cutting rules  
• Topo sort: Kahn vs DFS, cycle detection visualization  
• SCC: Kosaraju vs Tarjan, finishing times & lowlink displays  
• Max flow: level graph/build, blocking flow augmentations, residual graph explorer  
• Union‑Find: union by rank/size, path compression (full/halving/splitting)  
• Segment tree: point/range updates, lazy propagation on/off, iterative vs recursive  
• Fenwick: prefix sum & range updates (BIT of BITs demo)  
• Tries: compressed vs standard, failure links (Aho–Corasick)  
• KMP/Z: prefix/Z arrays; mismatch jumps; visualize borders  
• LIS: patience piles, tails array; reconstruct sequence  
• Convex hull: Andrew vs Graham; collinear handling  
• Edit distance: table transitions (diag/ins/del), path backtracking

### Delight & Extras

• “Mistake explorer” (toggle one line to see failure; auto‑generate counterexample)  
• “Sandbox puzzles” (reach target state under move budget)  
• Achievements (first N^2 → N log N transition, 100% invariants)  
• Daily challenge datasets; leaderboard (opt‑in)  
• Easter‑egg theme (retro terminal / graph paper)

---

_See also: `architecture.md`, `design_guide.md`, ADRs in `docs/ADR/`._
