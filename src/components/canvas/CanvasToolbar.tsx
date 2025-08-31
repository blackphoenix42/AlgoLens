import React, { useState } from "react";

import type { ArrayCanvasHandle } from "./ArrayCanvas";

import { useFullscreen } from "@/hooks/useFullscreen";

type Props = {
  surfaceRef: React.RefObject<HTMLDivElement>; // FULLSCREEN targets this whole surface
  canvasHandle?: React.RefObject<ArrayCanvasHandle>;
  panMode: boolean;
  onPanMode: (on: boolean) => void;
  dragging: boolean;
  onDragging: (on: boolean) => void;
  gridOn: boolean;
  snapOn: boolean;
};

// Simple chevron-down icon; rotate 180° when collapsed
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

export default function CanvasToolbar({
  surfaceRef,
  canvasHandle,
  panMode,
  onPanMode,
  dragging,
  onDragging,
  gridOn,
  snapOn,
}: Props) {
  const { isFullscreen, enter, exit } = useFullscreen<HTMLDivElement>();
  const full = () => (isFullscreen ? exit() : enter(surfaceRef.current));
  type NoArgKeys = {
    [K in keyof ArrayCanvasHandle]: ArrayCanvasHandle[K] extends () => void
      ? K
      : never;
  }[keyof ArrayCanvasHandle];

  const call = (fn: NoArgKeys) => {
    const h = canvasHandle?.current;
    if (!h) return;
    h[fn](); // typed as () => void
  };
  // collapse / expand
  const [open, setOpen] = useState(true);

  // small helper for consistent button styling
  const baseBtn =
    "px-2 py-1 rounded border transition-colors " +
    "bg-white border-slate-200 hover:bg-slate-100 " +
    "dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800/70";

  const pressed =
    "ring-1 ring-slate-300 dark:ring-slate-600 " +
    "bg-slate-100 dark:bg-slate-800/70";

  const Divider = () => (
    <span className="mx-2 h-5 w-px bg-slate-300 dark:bg-slate-700" />
  );

  return (
    <div
      className={
        "card text-sm min-w-0 " +
        "bg-white border border-slate-200 " +
        "dark:bg-slate-900 dark:border-slate-700"
      }
    >
      {/* Header with collapse/expand */}
      <div className="flex items-center justify-between">
        <div className="font-semibold panel-title text-slate-900 dark:text-slate-200">
          Canvas Controls
        </div>
        <button
          className="px-2 py-1 rounded border
                     bg-white border-slate-200 hover:bg-slate-100
                     dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800/70
                     inline-flex items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="canvas-controls-body"
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
        <div
          id="canvas-controls-body"
          className="mt-2 flex flex-wrap gap-2 items-center text-slate-900 dark:text-slate-200"
        >
          <button
            className={baseBtn}
            onClick={() => call("zoomOut")}
            title="Zoom out"
          >
            −
          </button>
          <button
            className={baseBtn}
            onClick={() => call("zoomIn")}
            title="Zoom in"
          >
            +
          </button>
          <button
            className={baseBtn}
            onClick={() => call("resetView")}
            title="Reset view"
          >
            Reset
          </button>

          <Divider />

          <button
            className={`${baseBtn} ${gridOn ? pressed : ""}`}
            onClick={() => call("toggleGrid")}
            aria-pressed={gridOn}
            title={gridOn ? "Grid: On" : "Grid: Off"}
          >
            Grid {gridOn ? "On" : "Off"}
          </button>

          <button
            className={`${baseBtn} ${panMode ? pressed : ""}`}
            onClick={() => onPanMode(!panMode)}
            aria-pressed={panMode}
            title={panMode ? "Pan: On" : "Pan: Off"}
          >
            {panMode ? "Pan On" : "Pan Off"}
          </button>

          <button
            className={`${baseBtn} ${snapOn ? pressed : ""}`}
            onClick={() => call("toggleSnap")}
            aria-pressed={snapOn}
            title={snapOn ? "Snap to grid: On" : "Snap to grid: Off"}
          >
            Snap {snapOn ? "On" : "Off"}
          </button>

          <button
            className={`${baseBtn} ${dragging ? pressed : ""}`}
            onClick={() => {
              const next = !dragging;
              onDragging(next);
              canvasHandle?.current?.setDragEnabled(next);
            }}
            aria-pressed={dragging}
            title={dragging ? "Drag: On" : "Drag: Off"}
          >
            {dragging ? "Drag On" : "Drag Off"}
          </button>

          <Divider />

          <button
            className={baseBtn}
            onClick={() => call("rotate90")}
            title="Rotate by 90°"
          >
            Rotate 90°
          </button>

          <Divider />

          <button className={baseBtn} onClick={full} title="Toggle fullscreen">
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      )}
    </div>
  );
}
