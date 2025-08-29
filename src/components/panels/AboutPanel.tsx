// src/components/panels/AboutPanel.tsx
import { useState } from "react";
import type { AlgoMeta } from "@/algorithms/types";
import Modal from "@/components/ui/Modal";
import ExpandIcon from "@/components/ui/ExpandIcon";
import Markdown from "@/components/ui/Markdown";

/** Simple chevron that rotates when collapsed/expanded */
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

export default function AboutPanel({ meta }: { meta: AlgoMeta }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { complexity: c } = meta;

  return (
    <div className="card relative text-sm min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          className="inline-flex items-center gap-2 text-left"
          onClick={() => setCollapsed((v) => !v)}
          aria-expanded={!collapsed}
          aria-controls="about-body"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <Chevron open={!collapsed} />
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {meta.title} — About
          </span>
        </button>

        <button
          className="px-2 py-1 rounded border
                     bg-white border-slate-200 hover:bg-slate-100
                     dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800/70"
          onClick={() => setModalOpen(true)}
          title="Open in modal"
        >
          <ExpandIcon />
        </button>
      </div>

      {/* Body (collapsible) */}
      {!collapsed && (
        <div id="about-body" className="space-y-3">
          {/* About content (markdown) or summary fallback */}
          {meta.about ? (
            <Markdown>{meta.about}</Markdown>
          ) : (
            <p className="text-slate-800 dark:text-slate-100">{meta.summary}</p>
          )}

          {/* Compact stats table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr>
                  <td className="text-slate-500 dark:text-slate-400 pr-4">
                    Best time
                  </td>
                  <td className="text-slate-900 dark:text-slate-100">
                    {c.time.best}
                  </td>
                </tr>
                <tr>
                  <td className="text-slate-500 dark:text-slate-400 pr-4">
                    Average time
                  </td>
                  <td className="text-slate-900 dark:text-slate-100">
                    {c.time.average}
                  </td>
                </tr>
                <tr>
                  <td className="text-slate-500 dark:text-slate-400 pr-4">
                    Worst time
                  </td>
                  <td className="text-slate-900 dark:text-slate-100">
                    {c.time.worst}
                  </td>
                </tr>
                <tr>
                  <td className="text-slate-500 dark:text-slate-400 pr-4">
                    Space
                  </td>
                  <td className="text-slate-900 dark:text-slate-100">
                    {c.space}
                  </td>
                </tr>
                {typeof c.stable === "boolean" && (
                  <tr>
                    <td className="text-slate-500 dark:text-slate-400 pr-4">
                      Stable
                    </td>
                    <td className="text-slate-900 dark:text-slate-100">
                      {c.stable ? "Yes" : "No"}
                    </td>
                  </tr>
                )}
                {typeof c.inPlace === "boolean" && (
                  <tr>
                    <td className="text-slate-500 dark:text-slate-400 pr-4">
                      In-place
                    </td>
                    <td className="text-slate-900 dark:text-slate-100">
                      {c.inPlace ? "Yes" : "No"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {meta.pros?.length ? (
            <div>
              <div className="text-sm font-semibold mb-1 text-slate-900 dark:text-slate-100">
                Advantages
              </div>
              <ul className="list-disc list-inside text-slate-800 dark:text-slate-100 space-y-1">
                {meta.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {meta.cons?.length ? (
            <div>
              <div className="text-sm font-semibold mb-1 text-slate-900 dark:text-slate-100">
                Disadvantages
              </div>
              <ul className="list-disc list-inside text-slate-800 dark:text-slate-100 space-y-1">
                {meta.cons.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {/* Modal (unchanged) */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`About ${meta.title}`}
      >
        <AboutPanelContent meta={meta} />
      </Modal>
    </div>
  );
}

function AboutPanelContent({ meta }: { meta: AlgoMeta }) {
  const c = meta.complexity;
  return (
    <div className="grid gap-4 text-sm modal-body">
      {meta.about ? (
        <Markdown>{meta.about}</Markdown>
      ) : (
        <p className="text-slate-800 dark:text-slate-100">{meta.summary}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr>
              <td className="text-slate-500 dark:text-slate-400 pr-4">
                Best time
              </td>
              <td className="text-slate-900 dark:text-slate-100">
                {c.time.best}
              </td>
            </tr>
            <tr>
              <td className="text-slate-500 dark:text-slate-400 pr-4">
                Average time
              </td>
              <td className="text-slate-900 dark:text-slate-100">
                {c.time.average}
              </td>
            </tr>
            <tr>
              <td className="text-slate-500 dark:text-slate-400 pr-4">
                Worst time
              </td>
              <td className="text-slate-900 dark:text-slate-100">
                {c.time.worst}
              </td>
            </tr>
            <tr>
              <td className="text-slate-500 dark:text-slate-400 pr-4">Space</td>
              <td className="text-slate-900 dark:text-slate-100">{c.space}</td>
            </tr>
            {typeof c.stable === "boolean" && (
              <tr>
                <td className="text-slate-500 dark:text-slate-400 pr-4">
                  Stable
                </td>
                <td className="text-slate-900 dark:text-slate-100">
                  {c.stable ? "Yes" : "No"}
                </td>
              </tr>
            )}
            {typeof c.inPlace === "boolean" && (
              <tr>
                <td className="text-slate-500 dark:text-slate-400 pr-4">
                  In-place
                </td>
                <td className="text-slate-900 dark:text-slate-100">
                  {c.inPlace ? "Yes" : "No"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta.pros?.length ? (
        <div>
          <div className="text-sm font-semibold mb-1 text-slate-900 dark:text-slate-100">
            Advantages
          </div>
          <ul className="list-disc list-inside text-slate-800 dark:text-slate-100 space-y-1">
            {meta.pros.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {meta.cons?.length ? (
        <div>
          <div className="text-sm font-semibold mb-1 text-slate-900 dark:text-slate-100">
            Disadvantages
          </div>
          <ul className="list-disc list-inside text-slate-800 dark:text-slate-100 space-y-1">
            {meta.cons.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
