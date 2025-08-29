import { useMemo, useState } from "react";
import { CATALOG } from "@/engine/registry";
import AlgoCard, { AlgoItem } from "@/components/home/AlgoCard";
import ThemeToggle from "@/components/ui/ThemeToggle";

type SortKey = "relevance" | "titleAsc" | "titleDesc" | "diffAsc" | "diffDesc";

const normDiff = (v?: AlgoItem["difficulty"]) =>
  v == null
    ? 3
    : typeof v === "number"
    ? v
    : v === "Easy"
    ? 1
    : v === "Medium"
    ? 3
    : 5;

const pretty = (t: string) =>
  t.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

/** topic → emoji + accent color for the thumbnail */
const TOPIC_META: Record<string, { icon: string; color: string }> = {
  sorting: { icon: "↕️", color: "emerald" },
  "data-structures": { icon: "🧱", color: "violet" },
  arrays: { icon: "📊", color: "sky" },
  searching: { icon: "🔎", color: "indigo" },
  graph: { icon: "🕸️", color: "cyan" },
  trees: { icon: "🌲", color: "green" },
  dp: { icon: "🧩", color: "fuchsia" },
  geometry: { icon: "📐", color: "rose" },
  "number-theory": { icon: "🔢", color: "amber" },
};

function useSafeCatalog(): Record<string, AlgoItem[]> {
  return useMemo(() => {
    const safe: Record<string, AlgoItem[]> = {};
    for (const [topic, items] of Object.entries(CATALOG ?? {})) {
      safe[topic] = Array.isArray(items) ? (items as AlgoItem[]) : [];
    }
    return safe;
  }, []);
}

export default function HomePage() {
  const catalog = useSafeCatalog();

  const [q, setQ] = useState("");
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState({
    Easy: true,
    Medium: true,
    Hard: true,
  });
  const [sort, setSort] = useState<SortKey>("relevance");

  const topics = useMemo(() => Object.keys(catalog), [catalog]);

  const allItems = useMemo(
    () =>
      Object.entries(catalog).flatMap(([topic, items]) =>
        (items ?? []).map((item) => ({ topic, item }))
      ),
    [catalog]
  );

  const tagUniverse = useMemo(() => {
    const s = new Set<string>();
    allItems.forEach(({ item }) => item.tags?.forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [allItems]);

  const titleMap = useMemo(() => {
    const m: Record<string, { title: string; topic: string }> = {};
    for (const [topic, items] of Object.entries(catalog)) {
      (items ?? []).forEach((it) => (m[it.slug] = { title: it.title, topic }));
    }
    return m;
  }, [catalog]);

  const filteredGrouped = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const activeTagSet = new Set(selectedTags);
    const allow = (d?: AlgoItem["difficulty"]) => {
      const label =
        typeof d === "number"
          ? d <= 2
            ? "Easy"
            : d <= 3
            ? "Medium"
            : "Hard"
          : d ?? "Medium";
      return (difficulties as any)[label];
    };

    const score = (t: string, it: AlgoItem) => {
      if (!ql) return 0;
      let s = 0;
      const title = it.title.toLowerCase();
      const summary = (it.summary || "").toLowerCase();
      const tags = (it.tags || []).join(" ").toLowerCase();
      if (title === ql) s += 500;
      if (title.startsWith(ql)) s += 250;
      if (title.includes(ql)) s += 120;
      if (summary.includes(ql)) s += 60;
      if (tags.includes(ql)) s += 80;
      if (t.toLowerCase().includes(ql)) s += 20;
      return s;
    };

    const out: Record<
      string,
      Array<{ topic: string; item: AlgoItem; _score: number }>
    > = {};

    for (const [topic, items] of Object.entries(catalog)) {
      if (activeTopic !== "all" && topic !== activeTopic) continue;

      const pool = Array.isArray(items) ? items : [];
      const keep = pool.filter((it) => {
        if (!allow(it.difficulty)) return false;
        if (activeTagSet.size) {
          const t = new Set(it.tags || []);
          for (const tag of activeTagSet) if (!t.has(tag)) return false;
        }
        if (!ql) return true;
        const hay = `${it.title} ${it.summary} ${(it.tags || []).join(
          " "
        )} ${topic}`.toLowerCase();
        return hay.includes(ql);
      });

      const adorned = keep.map((it) => ({
        topic,
        item: it,
        _score: score(topic, it),
      }));

      adorned.sort((a, b) => {
        if (sort === "titleAsc")
          return a.item.title.localeCompare(b.item.title);
        if (sort === "titleDesc")
          return b.item.title.localeCompare(a.item.title);
        if (sort === "diffAsc")
          return normDiff(a.item.difficulty) - normDiff(b.item.difficulty);
        if (sort === "diffDesc")
          return normDiff(b.item.difficulty) - normDiff(a.item.difficulty);
        return b._score - a._score || a.item.title.localeCompare(b.item.title);
      });

      if (adorned.length) out[topic] = adorned;
    }
    return out;
  }, [q, activeTopic, selectedTags, difficulties, sort, catalog]);

  const totalShown = useMemo(
    () =>
      Object.values(filteredGrouped).reduce(
        (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
        0
      ),
    [filteredGrouped]
  );

  const topicChips = useMemo(() => {
    const list = topics.map((t) => ({
      key: t,
      label: pretty(t),
      count: (catalog[t] ?? []).length,
      meta: TOPIC_META[t],
    }));
    return list;
  }, [topics, catalog]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="px-4 py-6 md:py-8 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Algorithm Visualizer
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Learn data structures & algorithms visually. Search, filter, and
              jump into an animation.
            </p>

            {/* Search row */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search algorithms… (e.g., bubble, BFS)"
                className="ui-input md:w-[520px]"
              />

              {/* Difficulty next to search */}
              <div className="flex items-center gap-1 rounded-xl border p-1 bg-white dark:bg-slate-900 dark:border-slate-700">
                {(["Easy", "Medium", "Hard"] as const).map((d) => {
                  const on = (difficulties as any)[d];
                  return (
                    <button
                      key={d}
                      onClick={() =>
                        setDifficulties((prev) => ({
                          ...prev,
                          [d]: !prev[d as keyof typeof prev],
                        }))
                      }
                      className={`px-2.5 py-1 rounded-lg text-sm font-medium transition ${
                        on
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              {/* Sort (kept) */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="ui-select"
                title="Sort by"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="titleAsc">Title A → Z</option>
                <option value="titleDesc">Title Z → A</option>
                <option value="diffAsc">Difficulty ↑</option>
                <option value="diffDesc">Difficulty ↓</option>
              </select>

              <button
                onClick={() => {
                  setQ("");
                  setActiveTopic("all");
                  setSelectedTags([]);
                  setDifficulties({ Easy: true, Medium: true, Hard: true });
                  setSort("relevance");
                }}
                className="px-3 py-2 rounded-lg border shadow-sm bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Clear
              </button>
            </div>

            {/* All topics chips BELOW search */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTopic("all")}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  activeTopic === "all"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
                }`}
              >
                🌐 All ({allItems.length})
              </button>
              {topicChips.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTopic(t.key)}
                  className={`px-3 py-1.5 rounded-full border text-sm flex items-center gap-2 ${
                    activeTopic === t.key
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
                  }`}
                  title={pretty(t.key)}
                >
                  <span>{t.meta?.icon ?? "📘"}</span>
                  <span className="whitespace-nowrap">
                    {pretty(t.key)}{" "}
                    <span className="opacity-70">({t.count})</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Tag filter row (optional) */}
      {tagUniverse.length ? (
        <div className="px-4 py-3 border-b bg-white/70 dark:bg-slate-900/60 dark:border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">
              Tags:
            </div>
            {tagUniverse.map((t) => {
              const on = selectedTags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(t)
                        ? prev.filter((x) => x !== t)
                        : [...prev, t]
                    )
                  }
                  className={`px-2.5 py-1 rounded-full text-xs border ${
                    on
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
                  }`}
                >
                  #{t}
                </button>
              );
            })}
            <div className="ml-auto text-sm text-slate-600 dark:text-slate-300">
              Showing <span className="font-semibold">{totalShown}</span> result
              {totalShown === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      ) : null}

      {/* Catalog */}
      <main className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {Object.keys(filteredGrouped).length === 0 && (
            <div className="text-slate-600 dark:text-slate-300">
              No results. Try removing some filters.
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Object.entries(filteredGrouped).flatMap(([topic, rows]) =>
              (rows ?? []).map(({ item }) => (
                <AlgoCard
                  key={`${topic}/${item.slug}`}
                  topic={topic}
                  item={item}
                  titleMap={titleMap}
                  accent={TOPIC_META[topic]?.color}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
