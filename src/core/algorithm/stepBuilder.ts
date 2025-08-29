import type { Step } from "./types";

export function createStep(partial: Partial<Step>): Step {
  return {
    array: [],
    ...partial,
  } as Step;
}
