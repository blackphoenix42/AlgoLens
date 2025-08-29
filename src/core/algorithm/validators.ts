export function assertNonEmpty<T>(arr: T[]): void {
  if (!arr.length) throw new Error("Dataset must not be empty");
}

export function assertSorted(arr: number[]): void {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) {
      throw new Error("Array is not sorted");
    }
  }
}
