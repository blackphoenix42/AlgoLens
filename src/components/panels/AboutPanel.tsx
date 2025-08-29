import type { AlgoMeta } from "@/core/algorithm/types";

export default function AboutPanel({ meta }: { meta: AlgoMeta }) {
  return <div className="card p-2">About {meta.title}</div>;
}
