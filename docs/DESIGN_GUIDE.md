# AlgoLens — Design Guide

_This guide defines the visual system for AlgoLens: tokens, layout, components, motion, accessibility, and patterns specific to algorithm visualization._

---

## 1) Principles

- **Clarity over cleverness** — Prefer obvious controls and labels.
- **Consistency** — Reuse patterns and tokens; avoid bespoke one‑offs.
- **Performance feel** — Transitions are snappy; nothing blocks the render loop.
- **Accessibility by default** — Keyboard, screen readers, and high contrast.
- **Content‑first** — Canvas and pseudocode take priority; chrome stays minimal.

---

## 2) Voice & Tone

- Voice: **calm, instructive, concise**.
- Tone: **supportive**, never patronizing. Prefer verbs (e.g., “Step”, “Reset”).
- Microcopy: sentence case; avoid exclamation unless user success.

---

## 3) Layout System

- **Grid**: 8px base. Spacing steps: 4 / **8** / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64.
- **Breakpoints** (Tailwind): `sm:640`, `md:768`, `lg:1024`, `xl:1280`, `2xl:1536`.
- **Containers**: `max-w-screen-xl` for content pages; visualizer is **full‑bleed** center panel with sticky toolbars.
- **Hit targets**: min 40×40 px.
- **Z‑index**: canvas(0), panels(10), tooltips(30), modals(50), toasts(60).

---

## 4) Color System

Use CSS variables for theming; Tailwind consumes via `theme.extend.colors`.

```css
/* tokens.css */
:root {
  --bg: 0 0% 100%;
  --fg: 222 47% 11%;
  --muted: 215 16% 47%;
  --border: 214 15% 91%;
  --primary: 221 83% 53%; /* blue */
  --primary-fg: 210 40% 98%;
  --accent: 262 83% 58%; /* violet */
  --success: 142 72% 29%; /* green */
  --warn: 38 92% 50%; /* amber */
  --danger: 0 84% 60%; /* red */
  --ring: var(--primary);
  --radius: 1rem; /* 16px */
}
.dark {
  --bg: 222 47% 5%;
  --fg: 210 40% 98%;
  --muted: 217 15% 65%;
  --border: 217 19% 27%;
  --primary: 221 83% 60%;
  --primary-fg: 222 47% 5%;
  --accent: 262 83% 66%;
  --success: 142 71% 45%;
  --warn: 38 92% 56%;
  --danger: 0 84% 67%;
}
```

Tailwind mapping example (in `tailwind.config.ts`):

```ts
export default {
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        fg: "hsl(var(--fg))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          fg: "hsl(var(--primary-fg))",
        },
        accent: "hsl(var(--accent))",
        success: "hsl(var(--success))",
        warn: "hsl(var(--warn))",
        danger: "hsl(var(--danger))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: { xl: "var(--radius)", "2xl": "calc(var(--radius) + 4px)" },
    },
  },
};
```

**Contrast rules**: Text vs background ≥ **4.5:1** (normal), ≥ **3:1** (≥18pt/24px or bold ≥14pt/18.7px).

---

## 5) Typography

- **UI font**: Inter (or system UI). Weights: 400 / 500 / 600.
- **Code font**: JetBrains Mono or ui‑monospace.
- **Scale** (Tailwind): `text-xs 12`, `sm 14`, `base 16`, `lg 18`, `xl 20`, `2xl 24`, `3xl 30`.
- Headings use **tight** tracking; paragraphs use `leading-7`.
- Code/pseudocode blocks use `text-sm` and 1.6 line height.

---

## 6) Iconography

- Library: **lucide-react**. Stroke `1.5`, sizes `16/20/24`.
- Always pair with text or `aria-label`. Do not rely on color alone to convey state.

---

## 7) Motion & Interaction

- Durations: micro (hover/focus) **120–160ms**; UI transitions **180–240ms**.
- Easing: `ease-out` for entering, `ease-in` for leaving; use `transition-[opacity,transform]`.
- **Reduced motion**: respect `prefers-reduced-motion`; disable nonessential animations.
- Focus rings: `ring-2 ring-ring ring-offset-2 ring-offset-bg`.

---

## 8) Components (UI)

Use **shadcn/ui** where convenient; otherwise Tailwind primitives.

### Buttons

- Sizes: sm (28px), md (36px), lg (44px).
- Primary: `bg-primary text-primary-fg hover:opacity-95 disabled:opacity-50`.
- Secondary: `bg-transparent border border-border hover:bg-border/30`.
- Destructive: `bg-danger text-white`.

### Cards / Panels

- `rounded-2xl shadow-sm border border-border bg-bg text-fg`.
- Panel header: 48px min height; sticky when needed; actions right aligned.

### Inputs

- `h-10 rounded-xl border border-border bg-bg px-3`.
- Focus: ring as above; invalid state uses `border-danger` + helper text.

### Tabs

- Underline/slider style; keep 44px min touch target.

### Tooltips

- `text-sm`, max width 240px, high contrast.

### Dialogs/Drawers

- Dim background `bg-black/60`; focus trap; Esc closes; large content scrolls body.

---

## 9) Visualizer Patterns

### Canvas styling

- Background: neutral; avoid strong tints behind bars/nodes.
- Grid: optional thin lines (`opacity 0.12`); toggle via toolbar.
- Maintain **16ms/frame** budget; avoid layout thrash; draw directly to context.

### Array bars (sorting)

- Default: neutral (`muted` at 60% alpha).
- **Active** (current index): `accent`.
- **Compare** (i, j): `primary`.
- **Swap**: `warn` pulse 140ms.
- **Sorted** (finalized): `success`.
- Width: `floor(canvasWidth / n)`, with 1px gap for n ≤ 256; no gap for large n.
- Height interpolation linear; cap minimum 2px for visibility.
- Labels: show on hover for small n (≤64); never during playback at >1× speed.

### Pseudocode & Code panel

- Highlight current line: background `primary/10`, left border `primary` 2px.
- Keep **line numbers** optional; ensure keyboard scroll sync with canvas.

### Transport controls

- Group: Play/Pause, Step, Seek slider, Speed select.
- Keyboard: `Space` (play/pause), `←/→` (step), `Shift+←/→` (seek 10), `Home/End`.
- Accessibility: role `slider` for the seek bar with value text.

---

## 10) Empty States & Errors

- Empty: short description + primary action (e.g., “Generate Dataset”).
- Error: concise summary, optional details accordion, copyable stack if developer mode.
- Use Sentry boundary fallback with friendly message.

---

## 11) Responsive Behavior

- **sm**: vertical stack; panels collapse to accordions.
- **md**: two columns; canvas above controls.
- **lg+**: three columns possible; canvas center, panels side.
- Prefer `overflow-auto` over viewport locks; keep toolbars sticky bottom or top.

---

## 12) Accessibility Checklist

- Keyboard path for **all** controls; no keyboard traps.
- Visible focus; maintain **tab order** matching visual order.
- Announce algorithm changes with `aria-live="polite"` in a status region.
- Ensure color contrast per §4; provide non‑color cues for compare/swap states.
- Provide skip link to canvas (`Skip to controls`).

---

## 13) Content Guidelines

- Label buttons with verbs (“Generate”, “Export PNG”).
- Use sentence case for headings and controls.
- Numbers: format with locale (`Intl.NumberFormat()`), especially dataset sizes.

---

## 14) Theming

- Dark mode: class strategy (`.dark`) toggled by user/system.
- Theme switch persists to `localStorage` key `theme`.
- To add a theme, override CSS variables under a class (e.g., `.theme-highcontrast`).

---

## 15) Assets

- Logos in `/public/brand/`. Keep **clearspace** = height of “A”.
- Favicon via PWA manifest; use monochrome mask icon for iOS.

---

## 16) Internationalization

- Reserve space for longer labels (German/Hindi).
- Avoid baked‑in widths on buttons; prefer padding.
- Extract strings; avoid string concatenation; use placeholders.

---

## 17) Contribution Workflow (Design)

- Propose component/visual changes via PR with screenshots (light/dark) and before/after.
- For token changes, update `tokens.css`, Tailwind theme, and this guide.
- Add Playwright snapshots for visual regressions when feasible.

---

## 18) Changelog for Design Tokens

Maintain a section in the project changelog or a `DESIGN_CHANGELOG.md`:

- `Added` new tokens/components
- `Changed` token values (note breaking impacts)
- `Deprecated` tokens/components

---

## 19) Tailwind Utilities (cheat‑sheet)

- Focus ring: `focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg`.
- Card: `rounded-2xl border border-border bg-bg text-fg shadow-sm`.
- Muted text: `text-muted` (map this in Tailwind).
- Divider: `border-t border-border`.

---

## 20) Example Snippets

### Panel Header (TSX)

```tsx
<div className="flex items-center justify-between h-12 px-3 border-b border-border">
  <h2 className="text-sm font-medium">Pseudocode</h2>
  <div className="flex items-center gap-2">{/* actions */}</div>
</div>
```

### Toolbar Button

```tsx
<button
  className="h-9 px-3 rounded-xl border border-border bg-bg hover:bg-border/30 active:scale-[0.98] transition"
  aria-label="Step"
>
  <IconStep className="size-4" />
</button>
```

---

## 21) Open Questions / To‑Decide

- High‑contrast mode tokens.
- Color palette for graph algorithms (nodes/edges states).
- Standardized test ids for Playwright (`data-testid`).

---

_Keep this guide versioned. Changes should be reviewed like code._
