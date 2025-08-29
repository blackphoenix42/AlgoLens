import { register } from "@/core/algorithm/registry";
import { bubbleMeta } from "./algos/bubble";
import { selectionMeta } from "./algos/selection";
import { mergeMeta } from "./algos/merge";
import routes from "./ui/routes";

export function registerFeature() {
  [bubbleMeta, selectionMeta, mergeMeta].forEach((m) => register("sorting", m));
}

export { routes };
