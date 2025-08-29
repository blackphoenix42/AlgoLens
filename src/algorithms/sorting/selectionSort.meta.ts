import type { AlgoMeta } from "@/algorithms/types";

export const selectionSortMeta: AlgoMeta = {
  slug: "selection-sort",
  title: "Selection Sort",
  topic: "sorting",
  summary: "Select the minimum from the unsorted suffix and swap it into place.",
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
  about: `**Idea.** Repeatedly select the smallest element from the unsorted suffix \`[i..n-1]\` and swap it with position $i$. After $n-1$ passes, the array is sorted.`,
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
  codeLineMap: {
    cpp: [6, 7, 8, 9, 13],
    java: [4, 5, 6, 7, 11],
    python: [3, 4, 5, 6, 8],
    javascript: [3, 4, 5, 6, 10],
  },
  load: () => import("./selectionSort").then((m) => ({ run: m.run })),
};
