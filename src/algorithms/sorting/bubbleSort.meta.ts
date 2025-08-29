import type { AlgoMeta } from "@/algorithms/types";

export const bubbleSortMeta: AlgoMeta = {
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
  load: () => import("./bubbleSort").then((m) => ({ run: m.run })),
};
