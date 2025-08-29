import { useState } from "react";

type View = "bars" | "dots" | "table";
type ColorMode = "plain" | "rainbow" | "value" | "custom";
type Colors = {
  base: string;
  compared: string;
  swapped: string;
  pivot: string;
  highlighted: string;
};

// Simple chevron-down icon; we'll rotate it 180° when collapsed
const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M6 9l6 6 6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ArrayViewPanel({
  view,
  onView,
  colorMode,
  onColorMode,
  colors,
  onColorsChange,
  showLabels,
  onShowLabels,
  showPlane,
  onShowPlane,
}: {
  view: View;
  onView: (v: View) => void;
  colorMode: ColorMode;
  onColorMode: (m: ColorMode) => void;
  colors: Colors;
  onColorsChange: (c: Colors) => void;
  showLabels: boolean;
  onShowLabels: (v: boolean) => void;
  showPlane: boolean;
  onShowPlane: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(true);

  const upd = (k: keyof Colors) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onColorsChange({ ...colors, [k]: e.target.value });

  return (
    <div className="card text-sm min-w-0">
      {/* Header with collapse/expand */}
      <div className="flex items-center justify-between">
        <div className="font-medium panel-title">Array View</div>
        <button
          className="px-2 py-1 rounded border
                     bg-white border-slate-200 hover:bg-slate-100
                     dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800/70
                     inline-flex items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="arrayview-body"
          title={open ? "Collapse" : "Expand"}
        >
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
          <span className="sr-only">{open ? "Collapse" : "Expand"}</span>
        </button>
      </div>

      {!open ? null : (
        <div id="arrayview-body" className="grid gap-2 mt-2 min-w-0">
          {/* Types */}
          <div className="grid gap-2">
            <div className="text-xs font-semibold panel-muted">Types</div>
            <div className="flex flex-wrap gap-2">
              <button
                className={`seg-btn ${view === "bars" ? "on" : ""}`}
                onClick={() => onView("bars")}
              >
                Bars
              </button>
              <button
                className={`seg-btn ${view === "dots" ? "on" : ""}`}
                onClick={() => onView("dots")}
              >
                Dots
              </button>
              <button
                className={`seg-btn ${view === "table" ? "on" : ""}`}
                onClick={() => onView("table")}
              >
                Table
              </button>
            </div>
          </div>

          {/* Labels & Axes */}
          <div className="grid gap-2 mt-3">
            <div className="text-xs font-semibold panel-muted">
              Labels & Axes
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => onShowLabels(e.target.checked)}
                />
                Show numbers
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPlane}
                  onChange={(e) => onShowPlane(e.target.checked)}
                />
                Cartesian plane
              </label>
            </div>
          </div>

          {/* Coloring */}
          <div className="grid gap-2 mt-3">
            <div className="text-xs font-semibold panel-muted">Coloring</div>
            <div className="flex flex-wrap gap-2">
              <button
                className={`seg-btn ${colorMode === "plain" ? "on" : ""}`}
                onClick={() => onColorMode("plain")}
              >
                Plain
              </button>
              <button
                className={`seg-btn ${colorMode === "rainbow" ? "on" : ""}`}
                onClick={() => onColorMode("rainbow")}
              >
                Rainbow
              </button>
              <button
                className={`seg-btn ${colorMode === "value" ? "on" : ""}`}
                onClick={() => onColorMode("value")}
              >
                By value
              </button>
              <button
                className={`seg-btn ${colorMode === "custom" ? "on" : ""}`}
                onClick={() => onColorMode("custom")}
              >
                Custom
              </button>
            </div>

            {colorMode === "custom" && (
              <div
                className="grid items-center gap-x-4 gap-y-2 mt-1"
                style={{ gridTemplateColumns: "auto auto auto auto" }}
              >
                <span className="panel-muted">Base</span>
                <input
                  type="color"
                  value={colors.base}
                  onChange={upd("base")}
                />
                <span className="panel-muted">Compared</span>
                <input
                  type="color"
                  value={colors.compared}
                  onChange={upd("compared")}
                />
                <span className="panel-muted">Swapped</span>
                <input
                  type="color"
                  value={colors.swapped}
                  onChange={upd("swapped")}
                />
                <span className="panel-muted">Pivot</span>
                <input
                  type="color"
                  value={colors.pivot}
                  onChange={upd("pivot")}
                />
                <span className="panel-muted">Highlight</span>
                <input
                  type="color"
                  value={colors.highlighted}
                  onChange={upd("highlighted")}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
