export type DatasetSlice = {
  array: number[];
};

export function createDatasetSlice(initial: number[] = []): DatasetSlice {
  return { array: initial };
}
