import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex"; // render math
import remarkGfm from "remark-gfm"; // tables, lists, strikethrough
import remarkMath from "remark-math"; // $...$ and $$...$$
import "katex/dist/katex.min.css";

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown text-slate-900 dark:text-slate-100">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Shift markdown headings down one level so pages retain a single
          // top-level <h1> and maintain proper heading order for a11y.
          h1: (p) => <h2 className="text-xl font-bold mt-2 mb-2" {...p} />,
          h2: (p) => <h3 className="text-lg font-semibold mt-3 mb-2" {...p} />,
          h3: (p) => (
            <h4 className="text-base font-semibold mt-3 mb-2" {...p} />
          ),
          h4: (p) => (
            <h5 className="text-base font-semibold mt-3 mb-2" {...p} />
          ),
          h5: (p) => (
            <h6 className="text-sm font-semibold mt-3 mb-2" {...p} />
          ),
          h6: (p) => (
            <h6 className="text-sm font-semibold mt-3 mb-2" {...p} />
          ),
          p: (p) => <p className="leading-7 mb-2" {...p} />,
          ul: (p) => <ul className="list-disc pl-5 space-y-1 mb-2" {...p} />,
          ol: (p) => <ol className="list-decimal pl-5 space-y-1 mb-2" {...p} />,
          code: ({ inline, ...p }: { inline?: boolean } & React.HTMLAttributes<HTMLElement>) =>
            inline ? (
              <code
                className="px-1 rounded bg-slate-100 dark:bg-slate-800"
                {...p}
              />
            ) : (
              <code
                className="block p-2 rounded bg-slate-100 dark:bg-slate-800 overflow-x-auto"
                {...p}
              />
            ),
          table: (p) => (
            <table className="w-full border-collapse my-2" {...p} />
          ),
          th: (p) => (
            <th
              className="border px-2 py-1 text-left bg-slate-50 dark:bg-slate-800
                         border-slate-200 dark:border-slate-700"
              {...p}
            />
          ),
          td: (p) => (
            <td
              className="border px-2 py-1 align-top
                         border-slate-200 dark:border-slate-700"
              {...p}
            />
          ),
          blockquote: (p) => (
            <blockquote
              className="border-l-4 pl-3 italic text-slate-600 dark:text-slate-300
                         border-slate-300 dark:border-slate-700"
              {...p}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
