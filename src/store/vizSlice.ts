export type VizSlice = {
  feature: string;
  algo: string;
};

export function createVizSlice(feature = "sorting", algo = "bubble"): VizSlice {
  return { feature, algo };
}
