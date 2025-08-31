import { sortingAlgos } from "@/algorithms/sorting";
import type { AlgoMeta } from "@/algorithms/types";

export const CATALOG: Record<string, AlgoMeta[]> = {
  sorting: sortingAlgos,
  arrays: [],
  graphs: [],
};

export function findAlgo(topic: string, slug: string): AlgoMeta | null {
  const group = (CATALOG as Record<string, AlgoMeta[] | undefined>)[topic];
  return group?.find((a) => a.slug === slug) ?? null;
}
