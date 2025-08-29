import type { Algorithm, Frame } from "@/engine/types";

export const run: Algorithm = function* (input: unknown) {
  const a = Array.isArray(input) ? input.slice() : [];
  const n = a.length;
  const counters = { comps: 0, swaps: 0 };

  yield <Frame>{
    array: a.slice(),
    pcLine: 1,
    counters: { ...counters },
    explain:
      "Start Bubble Sort – we will sweep and swap adjacent out-of-order pairs.",
  };

  for (let i = 0; i < n - 1; i++) {
    yield {
      array: a.slice(),
      pcLine: 1,
      counters: { ...counters },
      explain: `Outer loop i=${i}. The last ${i} elements are in place.`,
    };
    for (let j = 0; j < n - 1 - i; j++) {
      counters.comps++;
      yield {
        array: a.slice(),
        pcLine: 2,
        counters: { ...counters },
        highlights: { compared: [j, j + 1] },
        explain: `Compare a[${j}] (${a[j]}) vs a[${j + 1}] (${a[j + 1]}).`,
      };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        counters.swaps++;
        yield {
          array: a.slice(),
          pcLine: 3,
          counters: { ...counters },
          highlights: { swapped: [j, j + 1] },
          explain: `Swap them because ${a[j + 1]} < ${a[j]}.`,
        };
      }
    }
  }

  yield {
    array: a.slice(),
    pcLine: 0,
    counters: { ...counters },
    explain: "Done. Array is sorted.",
  };
};
