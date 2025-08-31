import React, {
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";

type Highlights = {
  compared?: [number, number];
  swapped?: [number, number];
  pivot?: number;
  indices?: number[];
};

export type ArrayCanvasHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  setPanMode: (on: boolean) => void;
  rotate90: () => void;
  setDragEnabled: (on: boolean) => void;
  centerBars: () => void;
};

type Colors = {
  base: string;
  compared: string;
  swapped: string;
  pivot: string;
  highlighted: string;
};
type View = "bars" | "dots" | "table";
type ColorMode = "plain" | "rainbow" | "value" | "custom";

type Props = {
  array: number[];
  highlights?: Highlights;
  onReorder?: (next: number[]) => void;
  height?: number | string;
  colors?: Colors;
  panModeExternal?: boolean;
  dragEnabled?: boolean;
  onViewChange?: (s: {
    grid: boolean;
    snap: boolean;
    pan: boolean;
    drag: boolean;
  }) => void;
  viewMode?: View;
  colorMode?: ColorMode;
  showPlane?: boolean;
  showLabels?: boolean;
};

export default forwardRef<ArrayCanvasHandle, Props>(function ArrayCanvas(
  {
    array,
    highlights,
    onReorder,
    height = "100%",
    colors,
    panModeExternal,
    dragEnabled = true,
    onViewChange,
    viewMode = "bars",
    colorMode = "plain",
    showPlane = true,
    showLabels = true,
  },
  ref
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);
  const didCenter = useRef(false);
  const userInteracted = useRef(false);

  // zoom/pan
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [grid, setGrid] = useState(true);
  const [snap, setSnap] = useState(true);
  const [angle, setAngle] = useState(0);
  const [panMode, setPanMode] = useState(false);
  const [dragOn, setDragOn] = useState(dragEnabled);

  // drag
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [tempArray, setTempArray] = useState<number[] | null>(null);

  // geometry
  const BAR_W = 24;
  const GAP = 8;
  const COL_W = BAR_W + GAP;
  const LEFT_PAD = 48;
  const RIGHT_PAD = 28;
  const EXTRA_LEFT = 16;
  const TOP_PAD = 6;
  const BOTTOM_PAD = 22;
  const CH = 220;

  const contentW = Math.max(0, array.length * COL_W - GAP);
  const axisWidth = LEFT_PAD + contentW + RIGHT_PAD;
  const axisHeight = TOP_PAD + CH + BOTTOM_PAD;
  // zoom & events
  const zoomAt = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      const wrap = wrapperRef.current;
      if (!wrap) return;
      userInteracted.current = true;

      let mx = cx,
        my = cy;
      if (mx == null || my == null) {
        const rect = wrap.getBoundingClientRect();
        mx = (rect.width / 2 - tx) / scale;
        my = (rect.height / 2 - ty) / scale;
      }

      const prev = scale;
      const next = Math.min(5, Math.max(0.2, prev * factor));
      setTx(tx + (mx as number) * (next - prev));
      setTy(ty + (my as number) * (next - prev));
      setScale(next);
    },
    [tx, ty, scale]
  );
  // external toggles
  useEffect(() => {
    if (typeof panModeExternal === "boolean") setPanMode(panModeExternal);
  }, [panModeExternal]);
  useEffect(() => {
    onViewChange?.({ grid, snap, pan: panMode, drag: dragOn });
  }, [grid, snap, panMode, dragOn, onViewChange]);

  const centerBars = useCallback(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const totalW = axisWidth * scale;
    const totalH = axisHeight * scale;

    setTx(Math.max(0, Math.round((rect.width - totalW) / 2)));
    setTy(Math.max(0, Math.round((rect.height - totalH) / 2)));
  }, [axisWidth, axisHeight, scale]);

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => zoomAt(1.2),
      zoomOut: () => zoomAt(1 / 1.2),
      resetView: () => {
        setScale(1);
        setTx(0);
        setTy(0);
        userInteracted.current = false;
        centerBars();
      },
      toggleGrid: () => setGrid((g) => !g),
      toggleSnap: () => setSnap((s) => !s),
      setPanMode: (on: boolean) => setPanMode(on),
      rotate90: () => setAngle((a) => (a + 90) % 360),
      setDragEnabled: (on: boolean) => setDragOn(on),
      centerBars: () => centerBars(),
    }),
    [centerBars, zoomAt]
  );

  useLayoutEffect(() => {
    if (!didCenter.current) {
      centerBars();
      didCenter.current = true;
    }
  }, [centerBars]);

  useEffect(() => {
    if (!userInteracted.current) centerBars();
  }, [array.length, centerBars]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver(() => {
      if (!userInteracted.current) centerBars();
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [centerBars]);

  // domain/ticks
  const vmin = Math.min(0, ...array);
  const vmax = Math.max(0, ...array);
  const span = Math.max(1, vmax - vmin);
  const niceStep = (s: number, target = 6) => {
    const raw = s / target;
    const pow10 = Math.pow(10, Math.floor(Math.log10(raw)));
    return [1, 2, 5]
      .map((m) => m * pow10)
      .reduce((a, b) => (Math.abs(raw - a) < Math.abs(raw - b) ? a : b));
  };
  const step = niceStep(span);
  const domainMin = Math.floor(vmin / step) * step - step;
  const domainMax = Math.ceil(vmax / step) * step + step;
  const ticks: number[] = [];
  for (let t = domainMin; t <= domainMax + 1e-9; t += step) {
    ticks.push(Math.round((t + Number.EPSILON) * 100) / 100);
  }

  const yFor = (v: number) =>
    Math.round(TOP_PAD + ((domainMax - v) / (domainMax - domainMin || 1)) * CH);
  const xAxisY = yFor(0);
  const yAxisX = LEFT_PAD;
  const colLeft = (i: number) => Math.round(LEFT_PAD + i * COL_W);
  const colCenter = (i: number) => colLeft(i) + Math.round(BAR_W / 2);

  function clientToLocal(e: { clientX: number; clientY: number }) {
    const rect = wrapperRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - tx) / scale;
    const y = (e.clientY - rect.top - ty) / scale;
    return { x, y };
  }
  function pickIndex(xLocal: number) {
    const x = xLocal - LEFT_PAD;
    if (x < 0) return 0;
    return Math.max(0, Math.min(array.length - 1, Math.floor(x / COL_W)));
  }
  function onWheel(e: React.WheelEvent) {
    const wantPan = panMode || e.shiftKey || e.altKey || e.buttons === 2;
    if (wantPan) {
      e.preventDefault();
      userInteracted.current = true;
      setTx((t) => t - e.deltaX);
      setTy((t) => t - e.deltaY);
      return;
    }
    e.preventDefault();
    const { x, y } = clientToLocal(e);
    const factor = Math.pow(1.0015, -e.deltaY);
    zoomAt(factor, x, y);
  }
  function onMouseDown(e: React.MouseEvent) {
    const start = { x: e.clientX, y: e.clientY };
    const orig = { tx, ty };
    const local = clientToLocal(e);
    const idx = pickIndex(local.x);
    const inside = local.x >= LEFT_PAD && local.x <= LEFT_PAD + contentW;
    const canDrag = dragOn && angle % 360 === 0 && viewMode !== "table";

    if (!panMode && canDrag && inside) {
      setDragIdx(idx);
      setDragOffset(local.x - colLeft(idx));
      setTempArray(array.slice());
    } else {
      const move = (ev: MouseEvent) => {
        userInteracted.current = true;
        setTx(orig.tx + (ev.clientX - start.x));
        setTy(orig.ty + (ev.clientY - start.y));
      };
      const up = () => {
        if (snap) {
          const stepPx = COL_W * scale;
          setTx(Math.round(tx / stepPx) * stepPx);
          setTy(Math.round(ty / stepPx) * stepPx);
        }
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    }
  }
  function onMouseMove(e: React.MouseEvent) {
    if (dragIdx === null || !tempArray) return;
    const { x } = clientToLocal(e);
    let target = Math.round((x - LEFT_PAD - dragOffset) / COL_W);
    target = Math.max(0, Math.min(tempArray.length - 1, target));
    if (target !== dragIdx) {
      const next = tempArray.slice();
      const [v] = next.splice(dragIdx, 1);
      next.splice(target, 0, v);
      setDragIdx(target);
      setTempArray(next);
    }
  }
  function onMouseUp() {
    if (dragIdx !== null && tempArray && onReorder) onReorder(tempArray);
    setDragIdx(null);
    setTempArray(null);
  }

  // visuals
  const innerTransform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  const gridStyle = grid
    ? {
        backgroundImage: `
      linear-gradient(to right, var(--canvas-grid, rgba(0,0,0,.06)) 1px, transparent 1px),
      linear-gradient(to bottom, var(--canvas-grid, rgba(0,0,0,.06)) 1px, transparent 1px)
    `,
        backgroundSize: `${COL_W * scale}px ${COL_W * scale}px`,
      }
    : {};

  useEffect(() => {
    if (!rotatorRef.current || !wrapperRef.current) return;
    const r = rotatorRef.current;
    r.style.transformOrigin = "50% 50%";
    r.style.transform = `rotate(${angle}deg)`;
  }, [angle]);

  const palette = {
    base: colors?.base ?? "#1667b7",
    compared: colors?.compared ?? "#eab308",
    swapped: colors?.swapped ?? "#ef4444",
    pivot: colors?.pivot ?? "#3b82f6",
    hi: colors?.highlighted ?? "#a855f7",
  };

  const renderArray = tempArray ?? array;
  const minVal = renderArray.length ? Math.min(...renderArray) : 0;
  const maxVal = renderArray.length ? Math.max(...renderArray) : 1;

  const fillFor = (i: number, v: number) => {
    const h = tempArray ? undefined : highlights;
    if (h?.swapped?.includes(i)) return palette.swapped;
    if (h?.compared?.includes(i)) return palette.compared;
    if (h?.pivot === i) return palette.pivot;
    if (h?.indices?.includes(i)) return palette.hi;
    if (colorMode === "rainbow") {
      const H = Math.round((i / Math.max(1, renderArray.length - 1)) * 360);
      return `hsl(${H}deg 70% 50%)`;
    }
    if (colorMode === "value") {
      const t = (v - minVal) / Math.max(1, maxVal - minVal);
      const H = Math.round(t * 240);
      return `hsl(${H}deg 70% 45%)`;
    }
    return palette.base;
  };

  // simple bg for table highlight (readable in both themes)
  const rowBgFor = (i: number) => {
    const h = highlights;
    if (!h) return undefined;
    if (h.swapped && h.swapped.includes(i)) return "rgba(239,68,68,.14)";
    if (h.compared && h.compared.includes(i)) return "rgba(234,179,8,.14)";
    if (h.pivot === i) return "rgba(59,130,246,.14)";
    if (h.indices && h.indices.includes(i)) return "rgba(168,85,247,.14)";
    return undefined;
  };

  const canvasBg = "var(--canvas-bg, #ffffff)";
  const axisColor = "var(--canvas-axis, #0f172a)";
  const axisText = "var(--canvas-fg, #0f172a)";
  const chipBg = "var(--canvas-chip-bg, rgba(255,255,255,.9))";
  const chipFg = "var(--canvas-chip-fg, #111827)";
  const canvasBorder = "var(--canvas-border, rgba(0,0,0,.12))";

  return (
    <div
      ref={wrapperRef}
      className="viz-canvas no-select relative overflow-hidden rounded border"
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        height,
        background: canvasBg,
        borderColor: canvasBorder,
        cursor:
          dragOn && !panMode && viewMode !== "table"
            ? dragIdx !== null
              ? "grabbing"
              : "grab"
            : panMode
              ? "grab"
              : "default",
      }}
    >
      {/* status */}
      <div
        className="absolute top-1 left-1 z-10 text-[11px] border rounded px-2 py-0.5 shadow"
        style={{
          background: "var(--canvas-status-bg, rgba(255,255,255,.85))",
          color: axisText,
          borderColor: canvasBorder,
        }}
      >
        Grid {grid ? "On" : "Off"} · Snap {snap ? "On" : "Off"} · Pan{" "}
        {panMode ? "On" : "Off"} · Drag {dragOn ? "On" : "Off"}
      </div>

      {/* Zoom buttons */}
      <div className="absolute top-1 right-1 z-10 flex flex-col gap-1">
        <button
          title="Zoom in"
          className="w-8 h-8 rounded border shadow hover:bg-slate-50 dark:hover:bg-slate-800"
          style={{
            background: chipBg,
            color: axisText,
            borderColor: canvasBorder,
          }}
          onClick={() => zoomAt(1.2)}
        >
          +
        </button>
        <button
          title="Zoom out"
          className="w-8 h-8 rounded border shadow hover:bg-slate-50 dark:hover:bg-slate-800"
          style={{
            background: chipBg,
            color: axisText,
            borderColor: canvasBorder,
          }}
          onClick={() => zoomAt(1 / 1.2)}
        >
          −
        </button>
      </div>

      <div className="absolute inset-0" style={{ ...gridStyle }}>
        <div ref={rotatorRef} className="absolute inset-0">
          <div
            className="relative"
            style={{
              transform: innerTransform,
              transformOrigin: "0 0",
              willChange: "transform",
            }}
          >
            <div
              className="relative"
              style={{ width: axisWidth, height: axisHeight }}
            >
              {/* ===== Bars/Dots/Table ===== */}
              {viewMode !== "table" ? (
                <div
                  className="absolute left-0 top-0"
                  style={{ width: axisWidth, height: axisHeight }}
                >
                  {renderArray.map((v, i) => {
                    const y = yFor(v);
                    const base = xAxisY;
                    const h = Math.max(2, Math.abs(base - y));
                    const isDragged = dragIdx === i;
                    const fill = fillFor(i, v);
                    const left = colLeft(i);
                    const barTop = Math.min(base, y);
                    const dotTop = y - 6;

                    return (
                      <div
                        key={i}
                        className="absolute"
                        style={{ left, width: BAR_W }}
                      >
                        {viewMode === "bars" ? (
                          <>
                            <div
                              className="rounded-sm"
                              style={{
                                position: "absolute",
                                top: barTop - TOP_PAD,
                                height: h,
                                width: BAR_W,
                                background: fill,
                                outline: isDragged
                                  ? "2px solid #111827"
                                  : undefined,
                                boxShadow: isDragged
                                  ? "0 0 0 3px rgba(59,130,246,.35)"
                                  : undefined,
                              }}
                              // title={`a[${i}]=${v}`}
                            />
                            {showLabels && (
                              <div
                                className="absolute text-[11px] border rounded px-1 leading-4 shadow-sm"
                                style={{
                                  top: barTop - 16 - TOP_PAD,
                                  left: BAR_W / 2 - 8,
                                  background: chipBg,
                                  color: chipFg,
                                  borderColor: canvasBorder,
                                  pointerEvents: "none",
                                }}
                              >
                                {v}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div
                              className="rounded-full"
                              style={{
                                position: "absolute",
                                top: dotTop - TOP_PAD,
                                left: (BAR_W - 12) / 2,
                                width: 12,
                                height: 12,
                                background: fill,
                                outline: isDragged
                                  ? "2px solid #111827"
                                  : undefined,
                                boxShadow: isDragged
                                  ? "0 0 0 3px rgba(59,130,246,.35)"
                                  : undefined,
                              }}
                              // title={`a[${i}]=${v}`}
                            />
                            {showLabels && (
                              <div
                                className="absolute text-[11px] border rounded px-1 leading-4 shadow-sm"
                                style={{
                                  top: dotTop + 14 - TOP_PAD,
                                  left: BAR_W / 2 - 8,
                                  background: chipBg,
                                  color: chipFg,
                                  borderColor: canvasBorder,
                                  pointerEvents: "none",
                                }}
                              >
                                {v}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Table view – fills most of the space, highlights animated rows
                <div className="absolute inset-0 grid place-items-center">
                  <div
                    className="w-[92%] max-h-[92%] overflow-auto rounded border"
                    style={{ borderColor: canvasBorder }}
                  >
                    <table
                      className="text-sm w-full"
                      style={{ color: axisText }}
                    >
                      <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                        <tr>
                          <th
                            className="px-3 py-2 border"
                            style={{ borderColor: canvasBorder }}
                          >
                            Index
                          </th>
                          <th
                            className="px-3 py-2 border"
                            style={{ borderColor: canvasBorder }}
                          >
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderArray.map((v, i) => (
                          <tr key={i} style={{ background: rowBgFor(i) }}>
                            <td
                              className="px-3 py-1 border"
                              style={{ borderColor: canvasBorder }}
                            >
                              {i}
                            </td>
                            <td
                              className="px-3 py-1 border"
                              style={{ borderColor: canvasBorder }}
                            >
                              {v}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===== Axes & ticks ===== */}
              {showPlane && viewMode !== "table" && (
                <svg
                  className="absolute inset-0"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="none"
                  style={{ pointerEvents: "none", zIndex: 5 }}
                  shapeRendering="crispEdges"
                >
                  <defs>
                    <marker
                      id="axis-arrow"
                      viewBox="0 0 10 10"
                      refX="10"
                      refY="5"
                      markerWidth="8"
                      markerHeight="8"
                      orient="auto"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill={axisColor} />
                    </marker>
                  </defs>

                  {/* Y axis with arrow */}
                  <line
                    x1={yAxisX}
                    y1={TOP_PAD + CH}
                    x2={yAxisX}
                    y2={TOP_PAD - 2}
                    stroke={axisColor}
                    strokeWidth={1.6}
                    markerEnd="url(#axis-arrow)"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* X axis with arrow */}
                  <line
                    x1={Math.max(2, yAxisX - EXTRA_LEFT)}
                    y1={xAxisY}
                    x2={LEFT_PAD + contentW + RIGHT_PAD - 4}
                    y2={xAxisY}
                    stroke={axisColor}
                    strokeWidth={1.6}
                    markerEnd="url(#axis-arrow)"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Y ticks + labels */}
                  {ticks.map((t, k) => {
                    const y = yFor(t);
                    return (
                      <g key={k}>
                        <line
                          x1={yAxisX - 6}
                          y1={y}
                          x2={yAxisX}
                          y2={y}
                          stroke={axisColor}
                          strokeWidth={1}
                          vectorEffect="non-scaling-stroke"
                        />
                        <text
                          x={yAxisX - 8}
                          y={y + 3}
                          textAnchor="end"
                          fontSize="11"
                          fill={axisText}
                        >
                          {t}
                        </text>
                      </g>
                    );
                  })}

                  {/* X ticks */}
                  {renderArray.map((_, i) => {
                    const cx = colCenter(i);
                    return (
                      <g key={i}>
                        <line
                          x1={cx}
                          y1={xAxisY - 4}
                          x2={cx}
                          y2={xAxisY + 4}
                          stroke={axisColor}
                          strokeWidth={1}
                          vectorEffect="non-scaling-stroke"
                        />
                        <text
                          x={cx}
                          y={xAxisY + 16}
                          textAnchor="middle"
                          fontSize="11"
                          fill={axisText}
                        >
                          {i + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
