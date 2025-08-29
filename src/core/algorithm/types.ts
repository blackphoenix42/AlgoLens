export type AlgoContext = Record<string, any>;

export interface Step {
  array: number[];
  compared?: [number, number];
  swapped?: [number, number];
  pivot?: number;
  message?: string;
}

export type AlgoGenerator<I = number[], S = Step> = (
  input: I,
  ctx?: AlgoContext
) => Generator<S>;

export interface AlgoMeta<I = number[], S = Step> {
  slug: string;
  title: string;
  run: AlgoGenerator<I, S>;
  summary?: string;
  tags?: string[];
  difficulty?: "Easy" | "Medium" | "Hard" | number;
  pseudocode: string[];
  code?: Partial<Record<"cpp" | "java" | "python" | "javascript", string>>;
  codeLineMap?: Partial<Record<"cpp" | "java" | "python" | "javascript", number[]>>;
  about?: string;
  pros?: string[];
  cons?: string[];
  complexity?: {
    time?: string;
    space?: string;
  };
}
