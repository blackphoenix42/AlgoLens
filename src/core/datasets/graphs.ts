export type GraphEdge = [number, number];

export function makeSimpleGraph(n: number): GraphEdge[] {
  const edges: GraphEdge[] = [];
  for (let i = 0; i < n - 1; i++) {
    edges.push([i, i + 1]);
  }
  return edges;
}
