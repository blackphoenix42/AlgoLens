import type { AlgoGenerator, AlgoMeta, Step } from "@/core/algorithm/types";

export const selectionSort: AlgoGenerator<number[]> = function* (input) {
  const a = input.slice();
  const n = a.length;
  for (let i = 0; i < n; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      yield { array: a.slice(), compared: [min, j] } as Step;
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      yield { array: a.slice(), swapped: [i, min] } as Step;
    }
  }
  yield { array: a.slice(), message: "sorted" };
};

export const selectionMeta: AlgoMeta = {
  slug: "selection",
  title: "Selection Sort",
  run: selectionSort,
  pseudocode: [] as string[],
};
