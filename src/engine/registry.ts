import type { Algorithm } from "@/engine/types";

export type AlgoCode = {
  cpp?: string;
  java?: string;
  python?: string;
  javascript?: string;
};
export type CodeLineMap = Partial<
  Record<"cpp" | "java" | "python" | "javascript", number[]>
>; // maps pcLine(1-based) -> code line number (1-based)

export type AlgoMeta = {
  slug: string;
  title: string;
  topic: "sorting" | "graphs" | "arrays";
  summary: string;
  pseudocode: string[];
  complexity: {
    time: { best: string; average: string; worst: string };
    space: string;
    stable?: boolean;
    inPlace?: boolean;
  };
  about: string;
  pros?: string[];
  cons?: string[];
  code: AlgoCode;
  codeLineMap?: CodeLineMap;
  load: () => Promise<{ run: Algorithm }>;
};

export const CATALOG: Record<string, AlgoMeta[]> = {
  sorting: [
    {
      slug: "bubble-sort",
      title: "Bubble Sort",
      topic: "sorting",
      summary: "Repeatedly swap adjacent out-of-order pairs.",
      pseudocode: [
        "for i ← 0..n-2",
        "  for j ← 0..n-2-i",
        "    if a[j] > a[j+1] swap a[j], a[j+1]",
      ],
      complexity: {
        time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
        space: "O(1)",
        stable: true,
        inPlace: true,
      },
      about:
        "Bubble Sort scans adjacent pairs and swaps if out of order. Simple and visual, but inefficient for large n.",
      pros: [
        "Very easy to implement and teach",
        "Stable and in-place",
        "Early-exit optimization when no swaps",
      ],
      cons: [
        "Quadratic average/worst time",
        "Poor practical performance vs Merge/Quick",
        "Not used for large datasets",
      ],
      code: {
        cpp: `#include <bits/stdc++.h>
using namespace std;

void bubbleSort(vector<int>& a) {
    int n = (int)a.size();
    bool swapped = true;
    for (int i = 0; i < n - 1 && swapped; ++i) {
        swapped = false;
        for (int j = 0; j < n - 1 - i; ++j) {
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                swapped = true;
            }
        }
    }
}`,
        java: `class Sorter {
    static void bubbleSort(int[] a) {
        int n = a.length;
        boolean swapped = true;
        for (int i = 0; i < n - 1 && swapped; i++) {
            swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (a[j] > a[j + 1]) {
                    int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                    swapped = true;
                }
            }
        }
    }
}`,
        python: `def bubble_sort(a):
    n = len(a)
    swapped = True
    i = 0
    while i < n - 1 and swapped:
        swapped = False
        j = 0
        while j < n - 1 - i:
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
            j += 1
        i += 1`,
        javascript: `export function bubbleSort(a) {
  const n = a.length;
  let swapped = true;
  for (let i = 0; i < n - 1 && swapped; i++) {
    swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
  }
}`,
      },
      // map pseudocode lines → specific code lines per language (1-based)
      codeLineMap: {
        cpp: [7, 9, 10],
        java: [6, 8, 9],
        python: [5, 8, 9],
        javascript: [4, 6, 7],
      },
      load: () =>
        import("@/algorithms/sorting/bubbleSort").then((m) => ({ run: m.run })),
    },
    {
      slug: "selection-sort",
      title: "Selection Sort",
      topic: "sorting",
      summary:
        "Select the minimum from the unsorted suffix and swap it into place.",
      pseudocode: [
        "for i ← 0..n-2",
        "  min ← i",
        "  for j ← i+1..n-1",
        "    if a[j] < a[min] then min ← j",
        "  if min ≠ i then swap a[i], a[min]",
      ],
      complexity: {
        time: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
        space: "O(1)",
        stable: false,
        inPlace: true,
      },
      about: `

**Idea.** Repeatedly select the smallest element from the unsorted suffix \`[i..n-1]\` and swap it with position $i$. After $n-1$ passes, the array is sorted.

## Properties
- **In-place:** Yes (constant extra space)
- **Stable:** No (equal keys can cross on swap)
- **Adaptive:** No (always scans full suffix)
- **Writes:** At most **$n-1$** swaps → good when writes are expensive

## Complexity
| Case            | Comparisons                 | Swaps        | Time     | Space |
|-----------------|-----------------------------|--------------|----------|-------|
| Best/Avg/Worst  | $\\frac{n(n-1)}{2}$         | $\\le n-1$   | $O(n^2)$ | $O(1)$ |

> Comparisons: $\\sum_{i=0}^{n-2}(n-1-i)=\\frac{n(n-1)}{2}$.
`,
      pros: [
        "Very simple to reason about",
        "At most n−1 swaps (few writes)",
        "Deterministic passes and work",
      ],
      cons: [
        "Quadratic comparisons regardless of input",
        "Not stable",
        "Not adaptive",
      ],
      code: {
        cpp: `#include <bits/stdc++.h>
using namespace std;

void selectionSort(vector<int>& a) {
    int n = (int)a.size();
    for (int i = 0; i < n - 1; ++i) {
        int m = i;
        for (int j = i + 1; j < n; ++j) {
            if (a[j] < a[m]) {
                m = j;
            }
        }
        if (m != i) {
            swap(a[i], a[m]);
        }
    }
}`,
        java: `class Sorter {
    static void selectionSort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            int m = i;
            for (int j = i + 1; j < n; j++) {
                if (a[j] < a[m]) {
                    m = j;
                }
            }
            if (m != i) {
                int t = a[i]; a[i] = a[m]; a[m] = t;
            }
        }
    }
}`,
        python: `def selection_sort(a):
    n = len(a)
    for i in range(n-1):
        m = i
        for j in range(i+1, n):
            if a[j] < a[m]:
                m = j
        if m != i:
            a[i], a[m] = a[m], a[i]`,
        javascript: `export function selectionSort(a) {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let m = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[m]) {
        m = j;
      }
    }
    if (m !== i) {
      [a[i], a[m]] = [a[m], a[i]];
    }
  }
}`,
      },
      // Map pseudocode lines (1..5) → code line numbers (1-based) per language
      codeLineMap: {
        cpp: [6, 7, 8, 9, 13],
        java: [4, 5, 6, 7, 11],
        python: [3, 4, 5, 6, 8],
        javascript: [3, 4, 5, 6, 10],
      },
      load: () =>
        import("@/algorithms/sorting/selectionSort").then((m) => ({
          run: m.run,
        })),
    },
  ],
  arrays: [],
  graphs: [],
};

export function findAlgo(topic: string, slug: string): AlgoMeta | null {
  const group = (CATALOG as any)[topic] as AlgoMeta[] | undefined;
  return group?.find((a) => a.slug === slug) ?? null;
}
