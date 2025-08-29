// src/pages/VisualizerPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { find } from "@/core/algorithm/registry";
import { usePlayer } from "@/core/runner/player";
import ArrayCanvas, { ArrayCanvasHandle } from "@/features/sorting/ui/ArrayCanvas";
import CanvasToolbar from "@/features/sorting/ui/Toolbar";
import Transport from "@/components/controls/Transport";
import CodePanel from "@/components/panels/CodePanel";
import AboutPanel from "@/components/panels/AboutPanel";
import DatasetPanel from "@/components/controls/DatasetPanel";
import ArrayViewPanel from "@/components/controls/ArrayViewPanel";
import { makeRandomArray } from "@/lib/arrays";
import { DrawOptions } from "@/lib/exporter";
import * as url from "@/lib/urlState";
import ThemeToggle from "@/components/ui/ThemeToggle";
import HomeButton from "@/components/ui/HomeButton";

export default function VisualizerPage() {
  const { topic = "", slug = "" } = useParams();
  const meta = find(topic, slug);

  const params = useMemo(() => url.read(), []);
  const initialN = Number(params.get("n") ?? 16);
  const initialSeed = Number(params.get("seed") ?? 42);
  const initialSpeed = Number(params.get("speed") ?? 1);

  const [frames, setFrames] = useState<any[]>([]);
  const [input, setInput] = useState<number[]>(() =>
    makeRandomArray(initialN, 5, 99, initialSeed)
  );
  const [colors, setColors] = useState({
    base: "#1667b7",
    compared: "#eab308",
    swapped: "#ef4444",
    pivot: "#3b82f6",
    highlighted: "#a855f7",
  });
  const [panMode, setPanMode] = useState(false);
  const [dragging, setDragging] = useState(true);
  const [gridOn, setGridOn] = useState(true);
  const [snapOn, setSnapOn] = useState(true);
  const [view, setView] = useState<"bars" | "dots" | "table">("bars");
  const [colorMode, setColorMode] = useState<
    "plain" | "rainbow" | "value" | "custom"
  >("rainbow");
  const [showPlane, setShowPlane] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    if (!meta) return;
    let mounted = true;
    (async () => {
      const it = meta.run(input, { seed: initialSeed });
      const all: any[] = [];
      for (let f = it.next(); !f.done; f = it.next()) all.push(f.value);
      if (mounted) setFrames(all);
    })();
    return () => {
      mounted = false;
    };
  }, [meta, input, initialSeed]);

  const total = frames.length;
  const runner = usePlayer(total, initialSpeed);
  const frame = frames[runner.idx] ?? {};

  useEffect(() => {
    url.write({
      step: runner.idx,
      speed: runner.speed,
      n: input.length,
      seed: initialSeed,
    });
  }, [runner.idx, runner.speed, input.length, initialSeed]);

  if (!meta) return <div className="p-4">Algorithm not found.</div>;

  const surfaceRef = useRef<HTMLDivElement>(null);
  const canvasHandle = useRef<ArrayCanvasHandle>(null);
  const framesProvider = (): DrawOptions[] => {
    const seq: DrawOptions[] = (
      frames.length ? frames : [{ array: input } as any]
    ).map((f: any) => ({
      array: f.array ?? input,
      view,
      colorMode,
      colors,
      showPlane,
      showLabels,
    }));
    return seq;
  };

  return (
    <div className="h-screen overflow-hidden grid grid-rows-[auto_1fr] gap-3 p-3">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <HomeButton />
        <h1 className="text-2xl font-bold tracking-tight">
          {meta.title || "Visualizer"}
        </h1>
        <ThemeToggle />
      </div>

      {/* 3-column surface. Single row; center stretches. */}
      <div
        ref={surfaceRef}
        className="viz-surface min-h-0 grid grid-cols-[320px_minmax(0,1fr)_360px] items-stretch gap-3"
      >
        {/* LEFT COLUMN (panels scroll, player pinned bottom) */}
        <div className="min-h-0 flex flex-col min-w-0 overflow-hidden">
          {/* scrollable stack */}
          <div className="min-h-0 overflow-auto grid content-start gap-3 pr-1">
            <DatasetPanel
              value={input}
              onChange={(a) => {
                setInput(a);
                runner.toStart();
              }}
            />
            <ArrayViewPanel
              view={view}
              onView={setView}
              colorMode={colorMode}
              onColorMode={setColorMode}
              colors={colors}
              onColorsChange={setColors}
              showLabels={showLabels}
              onShowLabels={setShowLabels}
              showPlane={showPlane}
              onShowPlane={setShowPlane}
            />
            <CanvasToolbar
              surfaceRef={surfaceRef}
              canvasHandle={canvasHandle}
              panMode={panMode}
              onPanMode={setPanMode}
              dragging={dragging}
              onDragging={setDragging}
              gridOn={gridOn}
              snapOn={snapOn}
            />
          </div>

          {/* player pinned at the very bottom of LEFT */}
          <div className="pt-3 shrink-0">
            <Transport
              playing={runner.playing}
              direction={runner.direction}
              onPlayForward={runner.playForward}
              onPlayBackward={runner.playBackward}
              onPause={runner.pause}
              onPrev={runner.stepPrev}
              onNext={runner.stepNext}
              onToStart={runner.toStart}
              onToEnd={runner.toEnd}
              speed={runner.speed}
              onSpeedChange={runner.setSpeed}
              idx={runner.idx}
              total={total}
              onSeek={runner.setIdx}
            />
          </div>
        </div>

        {/* CENTER (canvas fills full height) */}
        <div className="min-h-0 flex flex-col">
          <div className="min-h-0 flex-1">
            <ArrayCanvas
              ref={canvasHandle}
              array={frame.array ?? input}
              highlights={frame.highlights}
              onReorder={(next) => {
                setInput(next);
                runner.toStart();
              }}
              height="100%"
              colors={colors}
              panModeExternal={panMode}
              dragEnabled={dragging}
              onViewChange={(s) => {
                setGridOn(s.grid);
                setSnapOn(s.snap);
              }}
              viewMode={view}
              colorMode={colorMode}
              showPlane={showPlane}
              showLabels={showLabels}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="min-h-0 flex flex-col gap-3 overflow-hidden">
          <div className="shrink-0 max-h-[65vh] overflow-auto">
            <CodePanel
              meta={meta}
              activePcLine={frame.pcLine}
              explain={frame.explain}
              fillHeight={false}
            />
          </div>
          {/* <ExportPanel
            array={frame.array ?? input}
            view={view}
            colorMode={colorMode}
            colors={colors}
            showPlane={showPlane}
            showLabels={showLabels}
            framesProvider={framesProvider} // returns FULL timeline
            watermarkUrl={watermarkUrl}
          /> */}
          <div className="min-h-0 flex-1 overflow-auto grid gap-3 content-start">
            <AboutPanel meta={meta} />
          </div>
        </div>
      </div>
    </div>
  );
}
