// src/lib/exporter.ts
export type View = "bars" | "dots" | "table";
export type ColorMode = "plain" | "rainbow" | "value" | "custom";
export type Colors = {
  base: string;
  compared: string;
  swapped: string;
  pivot: string;
  highlighted: string;
};

export type DrawOptions = {
  array: number[];
  view: View;
  colorMode: ColorMode;
  colors: Colors;
  showPlane: boolean;
  showLabels: boolean;
  width?: number;
  height?: number;

  // NEW: watermark image (always used if provided)
  watermarkImage?: CanvasImageSource; // used for Canvas/GIF/MP4
  watermarkUrlForSvg?: string; // used for SVG <image href="...">
};

type TickConf = {
  domainMin: number;
  domainMax: number;
  step: number;
  ticks: number[];
};

const BAR_W = 24,
  GAP = 8,
  COL_W = BAR_W + GAP;
const LEFT_PAD = 48,
  RIGHT_PAD = 28,
  EXTRA_LEFT = 16,
  TOP_PAD = 6,
  BOTTOM_PAD = 22;

function niceStep(spanNum: number, target = 6) {
  const raw = Math.max(1e-6, spanNum / target);
  const pow10 = Math.pow(10, Math.floor(Math.log10(raw)));
  const candidates = [1, 2, 5].map((m) => m * pow10);
  return candidates.reduce((a, b) =>
    Math.abs(raw - a) < Math.abs(raw - b) ? a : b
  );
}
function ticksFor(values: number[]): TickConf {
  const vmin = Math.min(0, ...values);
  const vmax = Math.max(0, ...values);
  const span = Math.max(1, vmax - vmin);
  const step = niceStep(span);
  const domainMin = Math.floor(vmin / step) * step - step;
  const domainMax = Math.ceil(vmax / step) * step + step;
  const ticks: number[] = [];
  for (let t = domainMin; t <= domainMax + 1e-9; t += step) {
    ticks.push(Math.round((t + Number.EPSILON) * 100) / 100);
  }
  return { domainMin, domainMax, step, ticks };
}
function makeGeom(values: number[], W: number, H: number) {
  const contentW = Math.max(0, values.length * COL_W - GAP);
  const innerW = LEFT_PAD + contentW + RIGHT_PAD;
  const CH = Math.max(120, Math.round(H - (TOP_PAD + BOTTOM_PAD)));
  return { contentW, innerW, CH };
}
function mapY(v: number, domainMin: number, domainMax: number, CH: number) {
  return TOP_PAD + ((domainMax - v) / (domainMax - domainMin || 1)) * CH;
}
function colorFor(
  i: number,
  v: number,
  arr: number[],
  mode: ColorMode,
  colors: Colors
) {
  if (mode === "rainbow") {
    const H = Math.round((i / Math.max(1, arr.length - 1)) * 360);
    return `hsl(${H}deg 70% 50%)`;
  }
  if (mode === "value") {
    const mn = Math.min(...arr),
      mx = Math.max(...arr);
    const t = (v - mn) / Math.max(1, mx - mn);
    const H = Math.round(t * 240);
    return `hsl(${H}deg 70% 45%)`;
  }
  return colors.base;
}

// -------------------- Canvas drawing (PNG/JPG/GIF/MP4) --------------------
export function drawFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  opts: DrawOptions,
  bg = "#ffffff"
) {
  const W = Math.round(opts.width ?? 1200);
  const H = Math.round(opts.height ?? 360);
  const values = opts.array;
  const { domainMin, domainMax, ticks } = ticksFor(values);
  const { contentW, innerW, CH } = makeGeom(values, W, H);

  const canvas = ctx.canvas;
  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;

  ctx.save();
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const tx = Math.max(0, Math.floor((W - innerW) / 2));
  ctx.translate(tx, 0);

  const xAxisY = mapY(0, domainMin, domainMax, CH);
  const yAxisX = LEFT_PAD;

  if (opts.showPlane) {
    ctx.strokeStyle = "rgba(0,0,0,.9)";
    ctx.lineWidth = 1.6;
    // y-axis
    ctx.beginPath();
    ctx.moveTo(yAxisX, TOP_PAD + CH);
    ctx.lineTo(yAxisX, TOP_PAD - 2);
    ctx.stroke();
    // x-axis (extended)
    ctx.beginPath();
    ctx.moveTo(Math.max(2, yAxisX - EXTRA_LEFT), xAxisY);
    ctx.lineTo(LEFT_PAD + contentW + RIGHT_PAD - 4, xAxisY);
    ctx.stroke();

    // ticks + labels
    ctx.fillStyle = "#0f172a";
    ctx.font = "11px ui-sans-serif, system-ui,-apple-system,Segoe UI,Roboto";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 1;
    for (const t of ticks) {
      const y = mapY(t, domainMin, domainMax, CH);
      ctx.beginPath();
      ctx.moveTo(yAxisX - 6, y);
      ctx.lineTo(yAxisX, y);
      ctx.stroke();
      ctx.fillText(String(t), yAxisX - 8, y);
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    for (let i = 0; i < values.length; i++) {
      const cx = LEFT_PAD + i * COL_W + BAR_W / 2;
      ctx.beginPath();
      ctx.moveTo(cx, xAxisY - 4);
      ctx.lineTo(cx, xAxisY + 4);
      ctx.stroke();
      ctx.fillText(String(i + 1), cx, xAxisY + 16);
    }
  }

  // bars/dots
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const y = mapY(v, domainMin, domainMax, CH);
    const base = xAxisY;
    const h = Math.max(2, Math.abs(base - y));
    const left = LEFT_PAD + i * COL_W;
    const fill = colorFor(i, v, values, opts.colorMode, opts.colors);

    if (opts.view === "bars") {
      const top = Math.min(base, y);
      ctx.fillStyle = fill;
      ctx.fillRect(left, top - TOP_PAD, BAR_W, h);
      if (opts.showLabels) {
        ctx.fillStyle = "rgba(0,0,0,.85)";
        ctx.font = "11px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(String(v), left + BAR_W / 2, top - TOP_PAD - 4);
      }
    } else if (opts.view === "dots") {
      ctx.fillStyle = fill;
      const r = 6;
      ctx.beginPath();
      ctx.arc(left + BAR_W / 2, y - TOP_PAD, r, 0, Math.PI * 2);
      ctx.fill();
      if (opts.showLabels) {
        ctx.fillStyle = "rgba(0,0,0,.85)";
        ctx.font = "11px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(String(v), left + BAR_W / 2, y - TOP_PAD + r + 2);
      }
    }
  }

  // ALWAYS draw watermark image if provided
  if (opts.watermarkImage) {
    const scaleRef = (opts.width ?? 1200) / 1200; // keep similar size at different scales
    const w = 120 * scaleRef; // ~120px wide
    const h = w; // square logo
    const { contentW } = makeGeom(values, W, H);
    const x = LEFT_PAD + contentW + RIGHT_PAD - 8 - w;
    const y =
      TOP_PAD + Math.max(120, Math.round(H - (TOP_PAD + BOTTOM_PAD))) - 8 - h;
    ctx.globalAlpha = 0.95;
    ctx.drawImage(
      opts.watermarkImage,
      Math.round(x),
      Math.round(y),
      Math.round(w),
      Math.round(h)
    );
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// -------------------- SVG (single frame) --------------------
export function frameToSVG(opts: DrawOptions): string {
  const W = Math.round(opts.width ?? 1200),
    H = Math.round(opts.height ?? 360);
  const values = opts.array;
  const { domainMin, domainMax, ticks } = ticksFor(values);
  const { contentW, innerW, CH } = makeGeom(values, W, H);
  const tx = Math.max(0, Math.floor((W - innerW) / 2));
  const xAxisY = mapY(0, domainMin, domainMax, CH);
  const yAxisX = LEFT_PAD;

  const out: string[] = [];
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
  );
  out.push(`<rect width="100%" height="100%" fill="white"/>`);
  out.push(`<g transform="translate(${tx},0)">`);

  if (opts.showPlane) {
    out.push(`<g stroke="rgba(0,0,0,.9)" stroke-width="1.6" fill="none">`);
    out.push(
      `<line x1="${yAxisX}" y1="${TOP_PAD + CH}" x2="${yAxisX}" y2="${
        TOP_PAD - 2
      }"/>`
    );
    out.push(
      `<line x1="${Math.max(2, yAxisX - EXTRA_LEFT)}" y1="${xAxisY}" x2="${
        LEFT_PAD + contentW + RIGHT_PAD - 4
      }" y2="${xAxisY}"/>`
    );
    out.push(`</g>`);
    for (const t of ticks) {
      const y = mapY(t, domainMin, domainMax, CH);
      out.push(
        `<line x1="${
          yAxisX - 6
        }" y1="${y}" x2="${yAxisX}" y2="${y}" stroke="rgba(0,0,0,.9)" stroke-width="1"/>`
      );
      out.push(
        `<text x="${yAxisX - 8}" y="${
          y + 3
        }" text-anchor="end" font-size="11" fill="#0f172a" font-family="system-ui,-apple-system,Segoe UI,Roboto">${t}</text>`
      );
    }
    for (let i = 0; i < values.length; i++) {
      const cx = LEFT_PAD + i * COL_W + BAR_W / 2;
      out.push(
        `<line x1="${cx}" y1="${xAxisY - 4}" x2="${cx}" y2="${
          xAxisY + 4
        }" stroke="rgba(0,0,0,.9)" stroke-width="1"/>`
      );
      out.push(
        `<text x="${cx}" y="${
          xAxisY + 16
        }" text-anchor="middle" font-size="11" fill="#0f172a" font-family="system-ui,-apple-system,Segoe UI,Roboto">${
          i + 1
        }</text>`
      );
    }
  }

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const y = mapY(v, domainMin, domainMax, CH);
    const base = xAxisY;
    const h = Math.max(2, Math.abs(base - y));
    const left = LEFT_PAD + i * COL_W;
    const fill = colorFor(i, v, values, opts.colorMode, opts.colors);

    if (opts.view === "bars") {
      const top = Math.min(base, y) - TOP_PAD;
      out.push(
        `<rect x="${left}" y="${top}" width="${BAR_W}" height="${h}" fill="${fill}"/>`
      );
      if (opts.showLabels)
        out.push(
          `<text x="${left + BAR_W / 2}" y="${
            top - 4
          }" text-anchor="middle" font-size="11" fill="#111827" font-family="system-ui,-apple-system,Segoe UI,Roboto">${v}</text>`
        );
    } else {
      const cy = y - TOP_PAD;
      out.push(
        `<circle cx="${left + BAR_W / 2}" cy="${cy}" r="6" fill="${fill}"/>`
      );
      if (opts.showLabels)
        out.push(
          `<text x="${left + BAR_W / 2}" y="${
            cy + 14
          }" text-anchor="middle" font-size="11" fill="#111827" font-family="system-ui,-apple-system,Segoe UI,Roboto">${v}</text>`
        );
    }
  }

  if (opts.watermarkUrlForSvg) {
    const w = 120,
      h = 120;
    const x = LEFT_PAD + contentW + RIGHT_PAD - 8 - w;
    const y = TOP_PAD + CH - 8 - h;
    out.push(
      `<image href="${opts.watermarkUrlForSvg}" x="${x}" y="${y}" width="${w}" height="${h}" opacity="0.95"/>`
    );
  }

  out.push(`</g></svg>`);
  return out.join("");
}

// -------------------- Encoders --------------------
export async function exportPNG(opts: DrawOptions): Promise<Blob> {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  drawFrameToCanvas(ctx, opts);
  return await new Promise((res) => c.toBlob((b) => res(b!), "image/png"));
}
export async function exportJPG(
  opts: DrawOptions,
  quality = 0.92
): Promise<Blob> {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  drawFrameToCanvas(ctx, opts, "#ffffff");
  return await new Promise((res) =>
    c.toBlob((b) => res(b!), "image/jpeg", quality)
  );
}
export function exportSVG(opts: DrawOptions): Blob {
  const svg = frameToSVG(opts);
  return new Blob([svg], { type: "image/svg+xml" });
}

export async function exportGIF(
  frames: DrawOptions[],
  fps = 30
): Promise<Blob> {
  const { default: GIFEncoder } = await import("gif-encoder-2");
  const W = Math.round(frames[0].width ?? 1200);
  const H = Math.round(frames[0].height ?? 360);
  const enc = new GIFEncoder(W, H, "neuquant", true);
  enc.setDelay(Math.max(16, Math.round(1000 / fps)));
  enc.setRepeat(0);
  enc.start();

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  for (const f of frames) {
    drawFrameToCanvas(ctx, { ...f, width: W, height: H });
    enc.addFrame(ctx.getImageData(0, 0, W, H).data);
  }
  enc.finish();
  return new Blob([enc.out.getData()], { type: "image/gif" });
}

export async function exportMP4(
  frames: DrawOptions[],
  fps = 30
): Promise<{ blob: Blob; suggestedExt: "mp4" | "webm" }> {
  const W = Math.round(frames[0].width ?? 1200);
  const H = Math.round(frames[0].height ?? 360);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const mimeMp4 = "video/mp4";
  const mimeWebm = "video/webm;codecs=vp9,opus";
  const canMp4 = window.MediaRecorder?.isTypeSupported?.(mimeMp4) ?? false;
  const mime = canMp4 ? mimeMp4 : mimeWebm;

  const stream = (c as HTMLCanvasElement).captureStream?.(fps);
  if (!stream || !window.MediaRecorder) {
    throw new Error("MediaRecorder not supported in this browser.");
  }

  const rec = new MediaRecorder(stream, {
    mimeType: mime,
    videoBitsPerSecond: 6_000_000,
  });
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => e.data && chunks.push(e.data);
  const done = new Promise<Blob>(
    (r) => (rec.onstop = () => r(new Blob(chunks, { type: mime })))
  );

  rec.start();

  const frameDelay = 1000 / fps;
  let i = 0;
  while (i < frames.length) {
    const start = performance.now();
    drawFrameToCanvas(ctx, { ...frames[i], width: W, height: H });
    i++;
    const spent = performance.now() - start;
    const wait = Math.max(0, frameDelay - spent);
    await new Promise((res) => setTimeout(res, wait));
  }
  rec.stop();
  await done;
  const video = await done;
  return { blob: video, suggestedExt: canMp4 ? "mp4" : "webm" };
}
