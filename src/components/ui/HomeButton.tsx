import React from "react";

export function HomeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M3 10.5L12 3l9 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 10v9a2 2 0 0 0 2 2h3v-5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v5h3a2 2 0 0 0 2-2v-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomeButton() {
  return (
    <a
      href="/"
      className="inline-flex items-center gap-2 px-2 py-1 rounded border
                 bg-white text-slate-900 border-slate-200 hover:bg-slate-100
                 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800/70
                 transition-colors"
      aria-label="Go to Home"
      title="Home"
    >
      <HomeIcon />
      <span className="hidden sm:inline">Home</span>
    </a>
  );
}
