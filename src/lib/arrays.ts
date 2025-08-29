// src/lib/arrays.ts

// Deterministic PRNG (mulberry32)
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRandomArray(
  n: number,
  min = 1,
  max = 99,
  seed = Date.now()
) {
  const R = rng(seed);
  return Array.from({ length: n }, () =>
    Math.floor(min + R() * (max - min + 1))
  );
}

export function makeGaussianArray(
  n: number,
  min = 1,
  max = 99,
  seed = Date.now()
) {
  const R = rng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const u = 1 - R();
    const v = 1 - R();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); // ~N(0,1)
    z = 0.5 + 0.15 * z; // center around 0.5 with small variance
    const val = Math.round(min + Math.min(1, Math.max(0, z)) * (max - min));
    out.push(val);
  }
  return out;
}

export function makeSortedArray(
  n: number,
  min = 1,
  max = 99,
  seed = Date.now(),
  dir: "inc" | "dec" = "inc"
) {
  const arr = makeRandomArray(n, min, max, seed).sort((a, b) => a - b);
  return dir === "inc" ? arr : arr.slice().reverse();
}

export function makeNearlySortedArray(
  n: number,
  min = 1,
  max = 99,
  seed = Date.now()
) {
  // legacy: “mixed” nearly sorted
  return makeNearlySortedArrayDir(n, min, max, seed, "inc");
}

export function makeNearlySortedArrayDir(
  n: number,
  min = 1,
  max = 99,
  seed = Date.now(),
  dir: "inc" | "dec" = "inc"
) {
  const base = makeSortedArray(n, min, max, seed, dir);
  const R = rng(seed ^ 1337);
  const swaps = Math.max(1, Math.floor(n * 0.1)); // 10% adjacent randomness
  for (let s = 0; s < swaps; s++) {
    const i = Math.floor(R() * (n - 1));
    const j = Math.max(0, Math.min(n - 1, i + (R() < 0.5 ? -1 : 1)));
    [base[i], base[j]] = [base[j], base[i]];
  }
  return base;
}

export function makeReversedArray(
  n: number,
  min = 1,
  max = 99,
  seed = Date.now()
) {
  return makeRandomArray(n, min, max, seed).sort((a, b) => b - a);
}

export function makeFewUniqueArray(
  n: number,
  min = 1,
  max = 99,
  seed = Date.now(),
  uniques = 5
) {
  const R = rng(seed);
  const pool = Array.from({ length: uniques }, () =>
    Math.floor(min + R() * (max - min + 1))
  );
  return Array.from({ length: n }, () => pool[Math.floor(R() * uniques)]);
}

export function makeDuplicatesArray(
  n: number,
  min = 1,
  max = 99,
  seed = Date.now(),
  uniques = 2
) {
  // heavy duplicates (e.g., 2–3 values dominate)
  return makeFewUniqueArray(n, min, max, seed, Math.max(2, uniques));
}

export function makeSawtoothArray(n: number, min = 1, max = 99, period = 5) {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i % period;
    const val = Math.round(min + (t / (period - 1)) * (max - min));
    out.push(val);
  }
  return out;
}

export function parseCustomInput(text: string) {
  const nums = text
    .replace(/[,\n\r\t]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x));
  return nums;
}
