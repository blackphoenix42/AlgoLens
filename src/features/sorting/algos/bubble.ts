import type { AlgoGenerator, Step, AlgoMeta } from "@/core/algorithm/types";

export const bubbleSort: AlgoGenerator<number[]> = function* (input) {
  const a = input.slice();
  const n = a.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const step: Step = { array: a.slice(), compared: [j, j + 1] };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        step.swapped = [j, j + 1];
      }
      step.array = a.slice();
      yield step;
    }
  }
  yield { array: a.slice(), message: "sorted" };
};

export const bubbleMeta: AlgoMeta = {
  slug: "bubble",
  title: "Bubble Sort",
  run: bubbleSort,
  pseudocode: [] as string[],
};
