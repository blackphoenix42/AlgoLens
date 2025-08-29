import { Link } from "react-router-dom";

export type AlgoItem = {
  slug: string;
  title: string;
  summary: string;
  tags?: string[];
  difficulty?: "Easy" | "Medium" | "Hard" | number;
  related?: string[];
  badge?: "Training" | "Beta" | "New"; // optional small badge
};

function DifficultyPill({ v }: { v?: AlgoItem["difficulty"] }) {
  if (v == null) return null;
  const label =
    typeof v === "number" ? (v <= 2 ? "Easy" : v <= 3 ? "Medium" : "Hard") : v;
  const styles =
    label === "Easy"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
      : label === "Medium"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
      : "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300";
  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${styles}`}>
      {label}
    </span>
  );
}

/** tiny bars for the thumbnail (stable per slug) */
function TinyBars({ seed = 1 }: { seed?: number }) {
  // deterministic pseudo-random heights (0.25..1) based on seed
  const rand = (i: number) => {
    const x = Math.sin(seed * 997 + i * 131) * 43758.5453;
    return 0.25 + (x - Math.floor(x));
  };
  const hs = [0, 1, 2, 3, 4].map((i) => rand(i));
  return (
    <div className="absolute inset-0 flex items-end gap-2 p-6">
      {hs.map((t, i) => (
        <div
          key={i}
          className="bg-white/95 rounded-sm"
          style={{ width: 18, height: `${Math.round(64 + t * 56)}px` }}
        />
      ))}
    </div>
  );
}

export default function AlgoCard({
  topic,
  item,
  titleMap,
  accent = "emerald", // tailwind color name for header bg
}: {
  topic: string;
  item: AlgoItem;
  titleMap: Record<string, { title: string; topic: string }>;
  accent?: string;
}) {
  const seed = [...item.slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const headerBg = `bg-${accent}-500`; // e.g., bg-emerald-500

  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition dark:bg-slate-900 dark:border-slate-700">
      {/* thumbnail */}
      <div className={`relative h-36 ${headerBg}`}>
        <TinyBars seed={seed} />
        {/* badge row (right) */}
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {item.badge ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/90 text-slate-900 dark:bg-slate-900/80 dark:text-slate-100 border border-white/60 dark:border-slate-700">
              {item.badge}
            </span>
          ) : null}
          {/* bell icon as subtle square */}
          {/* <span className="w-6 h-6 grid place-items-center rounded bg-white/80 text-slate-800 dark:bg-slate-900/70 dark:text-slate-200 border border-white/60 dark:border-slate-700">
            🔔
          </span> */}
        </div>
      </div>

      {/* content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-tight text-slate-900 dark:text-slate-100">
            <Link to={`/viz/${topic}/${item.slug}`} className="hover:underline">
              {item.title}
            </Link>
          </h3>
          <DifficultyPill v={item.difficulty} />
        </div>

        <p className="text-sm mt-1 text-slate-600 dark:text-slate-300 line-clamp-2">
          {item.summary}
        </p>

        {item.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* related shortcuts */}
        {item.related?.length ? (
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Related
            </div>
            <div className="flex flex-wrap gap-1">
              {item.related.slice(0, 6).map((slug) => {
                const rel = titleMap[slug];
                if (!rel) return null;
                return (
                  <Link
                    key={slug}
                    to={`/viz/${rel.topic}/${slug}`}
                    className="px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300"
                  >
                    {rel.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
