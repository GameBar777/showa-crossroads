// mulberry32 – deterministic; state is a uint32 stored in the save.
export function next(st: { rng: number }): number {
  let t = (st.rng = (st.rng + 0x6d2b79f5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export const chance = (st: { rng: number }, p: number) => next(st) < p;
export const pick = <T>(st: { rng: number }, a: T[]): T => a[Math.floor(next(st) * a.length)];
export function weighted<T>(st: { rng: number }, items: [T, number][]): T | undefined {
  const tot = items.reduce((s, [, w]) => s + w, 0); if (tot <= 0) return undefined;
  let r = next(st) * tot; for (const [x, w] of items) { r -= w; if (r < 0) return x; } return items[items.length - 1][0];
}
export const hashSeed = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
