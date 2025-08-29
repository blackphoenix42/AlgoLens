import type { AlgoMeta } from "@/algorithms/types";
import { sortingAlgos } from "@/algorithms/sorting";

export const CATALOG: Record<string, AlgoMeta[]> = {
  sorting: sortingAlgos,
  arrays: [],
  graphs: [],
};

export function findAlgo(topic: string, slug: string): AlgoMeta | null {
  const group = (CATALOG as any)[topic] as AlgoMeta[] | undefined;
  return group?.find((a) => a.slug === slug) ?? null;
}
