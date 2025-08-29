import type { Algorithm } from "@/engine/types";

export type AlgoCode = {
  cpp?: string;
  java?: string;
  python?: string;
  javascript?: string;
};

export type CodeLineMap = Partial<
  Record<"cpp" | "java" | "python" | "javascript", number[]>
>;

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
