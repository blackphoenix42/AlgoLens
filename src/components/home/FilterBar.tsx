import React from "react";

export type SortKey =
  | "relevance"
  | "title"
  | "difficulty"
  | "recent"
  | "popularity";

type Props = {
  q: string;
  setQ: (v: string) => void;
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
  tags: string[];
  selectedTags: string[];
  setSelectedTags: (v: string[]) => void;
  difficulties: string[];
  selectedDifficulties: string[];
  setSelectedDifficulties: (v: string[]) => void;
  sortKey: SortKey;
  setSortKey: (s: SortKey) => void;
  onClear: () => void;
};

export default function FilterBar(props: Props) {
  const {
    q,
    setQ,
    categories,
    selectedCategories,
    setSelectedCategories,
    tags,
    selectedTags,
    setSelectedTags,
    difficulties,
    selectedDifficulties,
    setSelectedDifficulties,
    sortKey,
    setSortKey,
    onClear,
  } = props;

  const toggleIn = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div
      className="rounded-2xl border bg-white/70 dark:bg-gray-900/60 backdrop-blur px-4 py-4 md:px-6 md:py-5
                    shadow-sm dark:border-gray-800"
    >
      <div className="flex flex-col gap-4">
        {/* Search + Sort */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search algorithms… (e.g., bubble, bfs)"
            className="w-full md:w-[420px] rounded-xl border px-4 py-2.5 shadow-sm focus:outline-none
                       focus:ring-2 focus:ring-indigo-500 dark:bg-gray-950 dark:border-gray-800"
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-xl border px-3 py-2 text-sm dark:bg-gray-950 dark:border-gray-800"
            title="Sort"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="title">Sort: Title (A→Z)</option>
            <option value="difficulty">Sort: Difficulty</option>
            <option value="recent">Sort: Recently added</option>
            <option value="popularity">Sort: Popularity</option>
          </select>
          <button
            onClick={onClear}
            className="ml-auto rounded-xl border px-3 py-2 text-sm hover:bg-gray-50
                       dark:hover:bg-gray-800 dark:border-gray-800"
          >
            Clear
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase text-gray-500">
            Categories
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategories(toggleIn(selectedCategories, cat))
              }
              className={`rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800
                ${
                  selectedCategories.includes(cat)
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-900"
                    : "dark:border-gray-800"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase text-gray-500">
            Tags
          </span>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTags(toggleIn(selectedTags, tag))}
              className={`rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800
                ${
                  selectedTags.includes(tag)
                    ? "bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-900"
                    : "dark:border-gray-800"
                }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase text-gray-500">
            Difficulty
          </span>
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() =>
                setSelectedDifficulties(toggleIn(selectedDifficulties, d))
              }
              className={`rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800
                ${
                  selectedDifficulties.includes(d)
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-900"
                    : "dark:border-gray-800"
                }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
