export type DatasetFactory<T> = (...args: any[]) => T;

export interface DatasetRegistry {
  arrays: DatasetFactory<number[]>[];
  graphs: DatasetFactory<any>[];
  strings: DatasetFactory<string>[];
}

export const DATASETS: DatasetRegistry = {
  arrays: [],
  graphs: [],
  strings: [],
};
