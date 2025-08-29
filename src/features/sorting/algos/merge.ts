import type { AlgoGenerator, AlgoMeta, Step } from "@/core/algorithm/types";

function* mergeSortRec(a: number[], l: number, r: number): Generator<Step> {
  if (r - l <= 1) return;
  const m = Math.floor((l + r) / 2);
  yield* mergeSortRec(a, l, m);
  yield* mergeSortRec(a, m, r);
  const left = a.slice(l, m);
  const right = a.slice(m, r);
  let i = 0,
    j = 0,
    k = l;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      a[k++] = left[i++];
    } else {
      a[k++] = right[j++];
    }
    yield { array: a.slice() } as Step;
  }
  while (i < left.length) {
    a[k++] = left[i++];
    yield { array: a.slice() } as Step;
  }
  while (j < right.length) {
    a[k++] = right[j++];
    yield { array: a.slice() } as Step;
  }
}

export const mergeSort: AlgoGenerator<number[]> = function* (input) {
  const a = input.slice();
  yield* mergeSortRec(a, 0, a.length);
  yield { array: a.slice(), message: "sorted" } as Step;
};

export const mergeMeta: AlgoMeta = {
  slug: "merge",
  title: "Merge Sort",
  run: mergeSort,
  pseudocode: [] as string[],
};
