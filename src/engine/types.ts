export type Counters = Record<string, number>;

export type Highlights = {
  indices?: number[];
  compared?: [number, number];
  swapped?: [number, number];
  pivot?: number;
};

export type Frame = {
  array?: number[];
  pcLine?: number; // 1-based
  highlights?: Highlights;
  counters?: Counters;
  message?: string;
  explain?: string; // <— NEW: human text about this step
};

export type Algorithm = (
  input: unknown,
  opts?: { seed?: number }
) => Generator<Frame>;
