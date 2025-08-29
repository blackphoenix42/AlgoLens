import type { Algorithm } from "@/engine/types";

// pcLine is 1-based, mapped to registry.codeLineMap for each language

export const run: Algorithm = function* (input: unknown) {
  const a = (input as number[]).slice();
  const n = a.length;

  // Optional: initial frame
  yield { array: a.slice(), pcLine: 1, explain: "Start Selection Sort." };

  for (let i = 0; i < n - 1; i++) {
    let m = i;

    // Begin pass i
    yield {
      array: a.slice(),
      pcLine: 1,
      explain: `Pass ${i + 1}/${n - 1}: find the minimum in [${i}..${n - 1}]`,
      highlights: { indices: [i], pivot: m },
    };

    for (let j = i + 1; j < n; j++) {
      // Compare a[j] with current minimum a[m]
      yield {
        array: a.slice(),
        pcLine: 3,
        explain: `Compare a[${j}] (${a[j]}) with current min a[${m}] (${a[m]})`,
        highlights: { indices: [i], pivot: m, compared: [j, m] },
      };

      if (a[j] < a[m]) {
        m = j;
        // New minimum candidate chosen
        yield {
          array: a.slice(),
          pcLine: 4,
          explain: `New minimum at index ${m} (value ${a[m]})`,
          highlights: { indices: [i], pivot: m },
        };
      }
    }

    if (m !== i) {
      // Do the single swap for this pass
      [a[i], a[m]] = [a[m], a[i]];
      yield {
        array: a.slice(),
        pcLine: 5,
        explain: `Swap a[${i}] and a[${m}]`,
        highlights: { swapped: [i, m] },
      };
    } else {
      // No swap this pass
      yield {
        array: a.slice(),
        pcLine: 5,
        explain: `Position ${i} already holds the minimum; no swap.`,
        highlights: { indices: [i], pivot: m },
      };
    }
  }

  // Final frame
  yield { array: a.slice(), explain: "Sorted!" };
};
