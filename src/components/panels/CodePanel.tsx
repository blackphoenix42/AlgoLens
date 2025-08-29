// src/components/panels/CodePanel.tsx
import { useMemo, useState, useEffect } from "react";
import hljs from "highlight.js/lib/core";
import cpp from "highlight.js/lib/languages/cpp";
import java from "highlight.js/lib/languages/java";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";

import "highlight.js/styles/github.css";
import "@/styles/hljs-dark-overrides.css";
import "@/styles/codepanel.css";

import type { AlgoMeta } from "@/algorithms/types";

hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("java", java);
hljs.registerLanguage("python", python);
hljs.registerLanguage("javascript", javascript);

type Lang = "cpp" | "java" | "python" | "javascript";

function CopyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
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
}
function WrapIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M3 6h18M3 10h11a4 4 0 0 1 0 8h-4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M9 14l-3 3l3 3"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-4 h-4 transition-transform ${
        open ? "-rotate-180" : "rotate-0"
      }`}
      aria-hidden
    >
      <path
        d="M8 10l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CodePanel({
  meta,
  activePcLine,
  explain,
  fillHeight = true,
  onTabChange,
}: {
  meta: AlgoMeta;
  activePcLine?: number;
  explain?: string;
  fillHeight?: boolean;
  onTabChange?: (tab: "pseudocode" | "code") => void;
}) {
  const [tab, setTab] = useState<"pseudocode" | "code">("pseudocode");
  const [lang, setLang] = useState<Lang>("cpp");
  const [copied, setCopied] = useState(false);
  const [wrap, setWrap] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // NEW

  useEffect(() => {
    onTabChange?.(tab);
  }, [tab, onTabChange]);

  const raw = (meta.code as any)[lang] || "";
  const html = useMemo(
    () => hljs.highlight(raw, { language: lang, ignoreIllegals: true }).value,
    [raw, lang]
  );
  const lines = useMemo(() => html.split("\n"), [html]);

  const codeLine = meta.codeLineMap?.[lang]?.[(activePcLine ?? 0) - 1];

  async function copy() {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <div
      className={`card overflow-hidden relative ${fillHeight ? "h-full" : ""} 
        bg-white border border-slate-200 
        dark:bg-slate-900 dark:border-slate-700`}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-2 py-1 border-b
                   bg-slate-50 border-slate-200
                   dark:bg-slate-800 dark:border-slate-700"
      >
        <div className="flex items-center gap-2">
          <button
            className="px-1.5 py-1 rounded border
                       bg-white border-slate-200 hover:bg-slate-100
                       dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800/70"
            onClick={() => setCollapsed((v) => !v)}
            aria-expanded={!collapsed}
            aria-controls="codepanel-body"
            title={collapsed ? "Expand" : "Collapse"}
          >
            <Chevron open={!collapsed} />
          </button>

          <div className="flex gap-2">
            <button
              className={`px-2 py-1 rounded 
                ${
                  tab === "pseudocode"
                    ? "bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              onClick={() => setTab("pseudocode")}
            >
              Pseudocode
            </button>
            <button
              className={`px-2 py-1 rounded
                ${
                  tab === "code"
                    ? "bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              onClick={() => setTab("code")}
            >
              Code
            </button>
          </div>
        </div>

        {!collapsed && tab === "code" && (
          <select
            className="rounded border px-2 py-1 text-sm
                       bg-white border-slate-200 text-slate-900
                       dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        )}
      </div>

      {/* Body (collapsible) */}
      {!collapsed && (
        <div id="codepanel-body">
          {tab === "pseudocode" ? (
            <div
              className="overflow-auto"
              style={{ maxHeight: fillHeight ? "100%" : "auto" }}
            >
              <ol className="font-mono text-sm leading-6 p-2">
                {meta.pseudocode.map((line, i) => {
                  const isActive = (activePcLine ?? -1) - 1 === i;
                  return (
                    <li
                      key={i}
                      className={`px-2 rounded mb-1 transition-colors
                        ${
                          isActive
                            ? "bg-yellow-100 ring-1 ring-yellow-300 dark:bg-yellow-900/30 dark:ring-yellow-700"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800/70"
                        }`}
                    >
                      <div>
                        <span className="text-gray-400 dark:text-gray-500 select-none mr-2">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-slate-900 dark:text-slate-200">
                          {line}
                        </span>
                      </div>
                      {isActive && explain && (
                        <div
                          className="mt-1 text-xs text-gray-800 bg-yellow-50 border border-yellow-200 rounded px-2 py-1
                                     dark:text-yellow-50 dark:bg-yellow-900/40 dark:border-yellow-800"
                        >
                          {explain}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : (
            <div
              className={`codeblock overflow-auto relative ${
                wrap ? "code-wrap" : "code-nowrap"
              } bg-white dark:bg-slate-900`}
              style={{ maxHeight: fillHeight ? "100%" : "auto" }}
            >
              {/* inline toolbar */}
              <div
                className="sticky top-0 z-10 flex justify-end gap-2 p-2
                           bg-gradient-to-b from-white/90 to-transparent
                           dark:from-slate-900/90"
              >
                <button
                  className="px-2 py-1 rounded border inline-flex items-center
                             border-slate-200 hover:bg-slate-100
                             dark:border-slate-700 dark:hover:bg-slate-800/70"
                  onClick={() => setWrap((w) => !w)}
                  title="Toggle word wrap"
                  aria-pressed={wrap}
                >
                  <WrapIcon />
                </button>
                <button
                  className="px-2 py-1 rounded border inline-flex items-center
                             border-slate-200 hover:bg-slate-100
                             dark:border-slate-700 dark:hover:bg-slate-800/70"
                  onClick={copy}
                  title="Copy code"
                >
                  <CopyIcon />
                </button>
              </div>

              {lines.map((l, i) => (
                <div
                  key={i}
                  className={`code-row ${
                    codeLine === i + 1 ? "active" : ""
                  } text-slate-900 dark:text-slate-200`}
                >
                  <span className="ln text-slate-400 dark:text-slate-500">
                    {i + 1}
                  </span>
                  <span
                    className="code"
                    dangerouslySetInnerHTML={{ __html: l || "&nbsp;" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {copied && (
        <div
          className="absolute top-2 right-2 px-2 py-1 rounded
                     bg-black/80 text-white text-xs shadow
                     dark:bg-black/70"
          role="status"
          aria-live="polite"
        >
          Code copied!
        </div>
      )}
    </div>
  );
}
