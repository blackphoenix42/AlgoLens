import type { AlgoMeta } from "./types";

const catalog: Record<string, AlgoMeta[]> = {};

export function register(topic: string, algo: AlgoMeta) {
  catalog[topic] = catalog[topic] ?? [];
  catalog[topic].push(algo);
}

export function list(topic: string): AlgoMeta[] {
  return catalog[topic] ?? [];
}

export function find(topic: string, slug: string): AlgoMeta | undefined {
  return catalog[topic]?.find((a) => a.slug === slug);
}

export function getCatalog() {
  return catalog;
}

export const CATALOG = catalog;
