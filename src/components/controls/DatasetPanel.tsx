import { useEffect, useMemo, useState } from "react";

import {
  makeRandomArray,
  makeGaussianArray,
  makeNearlySortedArrayDir,
  makeReversedArray,
  makeFewUniqueArray,
  makeDuplicatesArray,
  makeSawtoothArray,
  makeSortedArray,
  parseCustomInput,
} from "@/lib/arrays";

/** Small icon button that shows a toast near the icon */
function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void | string | Promise<void | string>;
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState<string | null>(null);
  async function handle() {
    const res = await onClick();
    setToast(typeof res === "string" ? res : "Done");
    setTimeout(() => setToast(null), 1200);
  }
  return (
    <span className="relative inline-flex">
      <button title={title} onClick={handle} className="icon-btn">
        {children}
      </button>
      {toast && (
        <span
          aria-live="polite"
          className="absolute -top-6 right-0 text-[11px] px-2 py-[2px] rounded shadow
                     bg-black/80 text-white"
        >
          {toast}
        </span>
      )}
    </span>
  );
}

const CopySvg = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
    <path
      d="M9 9a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V9Z"
      fill="currentColor"
      opacity=".2"
    />
    <path
      d="M15 5H7a2 2 0 0 0-2 2v10"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="9"
      y="9"
      width="10"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const PasteSvg = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
    <path d="M8 4h8v3H8z" fill="currentColor" opacity=".2" />
    <rect
      x="6"
      y="4"
      width="12"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M9 12h6m-6 4h6m-6-8h6" stroke="currentColor" strokeWidth="2" />
  </svg>
);

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

type Props = { value: number[]; onChange: (next: number[]) => void };
type Dist =
  | "random"
  | "gaussian"
  | "sortedInc"
  | "sortedDec"
  | "nearlyInc"
  | "nearlyDec"
  | "reversed"
  | "few"
  | "duplicates"
  | "sawtooth"
  | "custom";

type SeedMode = "fixed" | "random";

export default function DatasetPanel({ value, onChange }: Props) {
  const [n, setN] = useState<number>(value.length || 16);
  const [min, setMin] = useState(5);
  const [max, setMax] = useState(99);
  const [seed, setSeed] = useState<number>(42);

  // DEFAULT: new random on every Generate
  const [seedMode, setSeedMode] = useState<SeedMode>("random");

  const [dist, setDist] = useState<Dist>("random");
  const [uniques, setUniques] = useState(5);
  const [period, setPeriod] = useState(5);
  const [customText, setCustomText] = useState("");

  // Collapse / expand
  const [open, setOpen] = useState(true);

  useEffect(() => setN(value.length || 16), [value.length]);

  const previewText = useMemo(() => value.join(", "), [value]);

  function nextRandomSeed() {
    return Math.floor(Math.random() * 1_000_000_000);
  }

  function gen() {
    const effSeed = seedMode === "fixed" ? seed : nextRandomSeed();

    let arr: number[] = [];
    switch (dist) {
      case "random":
        arr = makeRandomArray(n, min, max, effSeed);
        break;
      case "gaussian":
        arr = makeGaussianArray(n, min, max, effSeed);
        break;
      case "sortedInc":
        arr = makeSortedArray(n, min, max, effSeed, "inc");
        break;
      case "sortedDec":
        arr = makeSortedArray(n, min, max, effSeed, "dec");
        break;
      case "nearlyInc":
        arr = makeNearlySortedArrayDir(n, min, max, effSeed, "inc");
        break;
      case "nearlyDec":
        arr = makeNearlySortedArrayDir(n, min, max, effSeed, "dec");
        break;
      case "reversed":
        arr = makeReversedArray(n, min, max, effSeed);
        break;
      case "few":
        arr = makeFewUniqueArray(n, min, max, effSeed, Math.max(2, uniques));
        break;
      case "duplicates":
        arr = makeDuplicatesArray(n, min, max, effSeed, 2);
        break;
      case "sawtooth":
        arr = makeSawtoothArray(n, min, max, Math.max(2, period)); // period-driven
        break;
      case "custom":
        arr = parseCustomInput(customText);
        setN(arr.length);
        break;
    }

    if (seedMode === "random") setSeed(effSeed);
    onChange(arr);
  }

  async function copyNumbers() {
    try {
      await navigator.clipboard.writeText(previewText);
      return "Copied!";
    } catch {
      return "Copy blocked";
    }
  }

  async function pasteToCustom() {
    try {
      const t = await navigator.clipboard.readText();
      const sanitized = (t ?? "").replace(/[^\d,\s-]+/g, "");
      setCustomText(sanitized);
      setDist("custom");
      return "Pasted!";
    } catch {
      return "Paste blocked";
    }
  }

  function onCustomChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const s = e.target.value.replace(/[^\d,\s-]+/g, "");
    setCustomText(s);
  }

  return (
    <div className="card text-sm min-w-0">
      {/* Header with collapse/expand */}
      <div className="flex items-center justify-between">
        <div className="font-medium panel-title">Dataset</div>
        <button
          className="px-2 py-1 rounded border
             bg-white border-slate-200 hover:bg-slate-100
             dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800/70
             inline-flex items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="dataset-body"
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
        <div id="dataset-body" className="grid gap-2 mt-2 min-w-0">
          {/* Size */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 min-w-0">
            <span className="w-24 shrink-0 panel-muted">Size</span>
            <input
              type="range"
              min={4}
              max={256}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min={1}
              max={1024}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="ui-input w-16 shrink-0"
            />
          </div>

          {/* Range */}
          <label className="flex items-center gap-2 min-w-0">
            <span className="w-24 shrink-0 panel-muted">Range</span>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="ui-input w-16 shrink-0"
            />
            <span className="shrink-0 panel-muted">to</span>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="ui-input w-16 shrink-0"
            />
          </label>

          {/* Seed */}
          <label className="flex items-center gap-2 min-w-0">
            <span className="w-24 shrink-0 panel-muted">Seed</span>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              className="ui-input w-28 shrink-0"
            />
          </label>

          <div className="flex items-center gap-2 flex-wrap min-w-0 pl-24">
            <span className="text-xs font-semibold panel-muted">Mode</span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                className={`seg-btn ${seedMode === "fixed" ? "on" : ""}`}
                onClick={() => setSeedMode("fixed")}
                title="Use the same seed every time you Generate"
                aria-pressed={seedMode === "fixed"}
              >
                Fixed
              </button>
              <button
                className={`seg-btn ${seedMode === "random" ? "on" : ""}`}
                onClick={() => setSeedMode("random")}
                title="Use a new random seed on every Generate"
                aria-pressed={seedMode === "random"}
              >
                Random
              </button>
            </div>
          </div>

          {/* Type */}
          <div className="grid gap-2 min-w-0">
            <div className="text-xs font-semibold panel-muted">Type</div>
            <select
              value={dist}
              onChange={(e) => setDist(e.target.value as Dist)}
              className="ui-select w-full"
            >
              <optgroup label="Basic">
                <option value="random">Random</option>
                <option value="gaussian">Gaussian</option>
                <option value="reversed">Reversed</option>
              </optgroup>
              <optgroup label="Sorted">
                <option value="sortedInc">Sorted (inc)</option>
                <option value="sortedDec">Sorted (dec)</option>
                <option value="nearlyInc">Nearly sorted (inc)</option>
                <option value="nearlyDec">Nearly sorted (dec)</option>
              </optgroup>
              <optgroup label="Duplicates">
                <option value="few">Few-unique</option>
                <option value="duplicates">Duplicates (2 values)</option>
              </optgroup>
              <optgroup label="Patterns">
                <option value="sawtooth">Sawtooth</option>
              </optgroup>
              <optgroup label="Custom">
                <option value="custom">Custom</option>
              </optgroup>
            </select>
          </div>

          {dist === "few" && (
            <label className="flex items-center gap-2 min-w-0">
              <span className="w-24 shrink-0 panel-muted">Uniques</span>
              <input
                type="number"
                min={2}
                max={20}
                value={uniques}
                onChange={(e) => setUniques(Number(e.target.value))}
                className="ui-input w-16 shrink-0"
              />
            </label>
          )}
          {dist === "sawtooth" && (
            <label className="flex items-center gap-2 min-w-0">
              <span className="w-24 shrink-0 panel-muted">Period</span>
              <input
                type="number"
                min={2}
                max={64}
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="ui-input w-16 shrink-0"
              />
            </label>
          )}

          {dist === "custom" && (
            <div className="grid gap-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="panel-title">Custom numbers</span>
                <IconButton
                  title="Paste from clipboard"
                  onClick={pasteToCustom}
                >
                  <PasteSvg />
                </IconButton>
              </div>
              <textarea
                className="ui-textarea"
                placeholder="e.g. 5, 12, 9, 3  (numbers, commas, spaces, minus)"
                value={customText}
                onChange={onCustomChange}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
              onClick={gen}
              title={
                seedMode === "fixed"
                  ? `Generate (seed ${seed})`
                  : "Generate (random seed each time)"
              }
            >
              Generate
            </button>
          </div>

          {/* Preview */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold panel-muted">Numbers</div>
            <IconButton title="Copy numbers" onClick={copyNumbers}>
              <CopySvg />
            </IconButton>
          </div>
          <div
            className="font-mono text-xs p-2 max-h-28 overflow-auto whitespace-pre-wrap break-words w-full box-border
                       rounded border bg-slate-50 text-slate-700
                       dark:bg-slate-800 dark:text-slate-200"
          >
            {previewText || "—"}
          </div>
        </div>
      )}
    </div>
  );
}
