import AlgoTile from "./AlgoCard";
import TopicIcon from "./TopicIcon";
import type { AlgoMeta } from "@/algorithms/types";

type Props = { topic: string; items: AlgoMeta[] };

export default function TopicSection({ topic, items }: Props) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        <TopicIcon topic={topic as any} className="w-6 h-6 text-gray-700" />
        <h2 className="text-xl font-semibold capitalize">{topic}</h2>
      </div>
      {items.length === 0 ? (
        <div className="text-sm text-gray-500 pl-8">Coming soon…</div>
      ) : (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {items.map((a) => (
            <AlgoTile key={a.slug} topic={topic} algo={a} />
          ))}
        </div>
      )}
    </section>
  );
}
