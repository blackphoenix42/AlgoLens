import type { AlgoMeta } from "@/core/algorithm/types";

export default function TopicSection({
  topic,
  items,
}: {
  topic: string;
  items: AlgoMeta[];
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold capitalize mb-2">{topic}</h2>
      <ul className="list-disc pl-5">
        {items.map((a) => (
          <li key={a.slug}>{a.title}</li>
        ))}
      </ul>
    </section>
  );
}
