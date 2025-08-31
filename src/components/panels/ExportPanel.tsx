// src/components/panels/ExportPanel.tsx
import { useEffect, useMemo, useState } from "react";

import type { DrawOptions, View, ColorMode, Colors } from "@/lib/exporter";
import {
  exportGIF,
  exportJPG,
  exportMP4,
  exportPNG,
  exportSVG,
} from "@/lib/exporter";

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function ExportPanel({
  array,
  view,
  colorMode,
  colors,
  showPlane,
  showLabels,
  framesProvider,
  watermarkUrl,
}: {
  array: number[];
  view: View;
  colorMode: ColorMode;
  colors: Colors;
  showPlane: boolean;
  showLabels: boolean;
  framesProvider: () => DrawOptions[]; // returns ALL frames in order
  watermarkUrl: string; // REQUIRED – the logo to stamp bottom-right
}) {
  const [fmt, setFmt] = useState<"png" | "jpg" | "svg" | "gif" | "mp4">("png");
  const [scale, setScale] = useState(1);
  const [fps, setFps] = useState(30);
  const [busy, setBusy] = useState(false);
  const baseW = 1200,
    baseH = 360;

  // Preload watermark image once
  const [wmImg, setWmImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setWmImg(img);
    img.src = watermarkUrl;
  }, [watermarkUrl]);

  const baseOpts = useMemo<DrawOptions>(
    () => ({
      array,
      view,
      colorMode,
      colors,
      showPlane,
      showLabels,
      width: baseW * scale,
      height: baseH * scale,
      watermarkImage: wmImg ?? undefined,
      watermarkUrlForSvg: watermarkUrl,
    }),
    [
      array,
      view,
      colorMode,
      colors,
      showPlane,
      showLabels,
      wmImg,
      watermarkUrl,
      scale,
    ]
  );

  async function doExport() {
    try {
      setBusy(true);
      if (fmt === "png") {
        download(await exportPNG(baseOpts), "visualization.png");
      } else if (fmt === "jpg") {
        download(await exportJPG(baseOpts, 0.92), "visualization.jpg");
      } else if (fmt === "svg") {
        download(exportSVG(baseOpts), "visualization.svg");
      } else if (fmt === "gif") {
        // ALWAYS full animation
        const frames = framesProvider().map((f) => ({ ...f, ...baseOpts }));
        download(await exportGIF(frames, fps), "visualization.gif");
      } else if (fmt === "mp4") {
        // ALWAYS full animation
        const frames = framesProvider().map((f) => ({ ...f, ...baseOpts }));
        const { blob, suggestedExt } = await exportMP4(frames, fps);
        download(blob, `visualization.${suggestedExt}`);
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card text-sm min-w-0 w-full box-border">
      <div className="font-medium mb-1">Export</div>

      <div className="grid gap-2">
        <label className="flex items-center gap-2 min-w-0">
          <span className="w-28 shrink-0">Format</span>
          <select
            className="border rounded px-2 py-1 min-w-0"
            value={fmt}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFmt(e.currentTarget.value as typeof fmt)
            }
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="svg">SVG</option>
            <option value="gif">GIF (full animation)</option>
            <option value="mp4">MP4 (full animation)</option>
          </select>
        </label>

        <label className="flex items-center gap-2 min-w-0">
          <span className="w-28 shrink-0">Scale</span>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="min-w-0"
          />
          <div className="w-8 text-right">{scale}×</div>
        </label>

        {(fmt === "gif" || fmt === "mp4") && (
          <label className="flex items-center gap-2 min-w-0">
            <span className="w-28 shrink-0">FPS</span>
            <input
              className="w-20 border rounded px-1 py-0.5"
              type="number"
              min={1}
              max={60}
              value={fps}
              onChange={(e) => setFps(Number(e.target.value) || 30)}
            />
          </label>
        )}

        <button
          className="mt-1 px-3 py-1.5 rounded bg-indigo-600 text-white disabled:opacity-60"
          onClick={doExport}
          disabled={busy || !wmImg}
          title={!wmImg ? "Loading watermark…" : "Export"}
        >
          {busy ? "Exporting…" : "Export"}
        </button>

        <p className="text-xs text-gray-500">
          Watermark is always stamped (bottom-right) using your logo image.
        </p>
      </div>
    </div>
  );
}
