export function makeRandomArray(
  n: number,
  min = 0,
  max = 100,
  seed = Math.random()
): number[] {
  const rng = mulberry32(seed);
  return Array.from({ length: n }, () =>
    Math.floor(rng() * (max - min + 1) + min)
  );
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
