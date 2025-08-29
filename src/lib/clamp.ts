export function clamp(x: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, x))
}
