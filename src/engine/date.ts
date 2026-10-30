export const pad = (n: number) => String(n).padStart(2, '0');
export const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
export const parts = (s: string) => s.split('-').map(Number) as [number, number, number];
export function addMonths(s: string, n: number): string {
  const [y, m, d] = parts(s); const t = (y * 12 + (m - 1)) + n; const yy = Math.floor(t / 12), mm = (t % 12) + 1;
  const dim = new Date(Date.UTC(yy, mm, 0)).getUTCDate(); return ymd(yy, mm, Math.min(d, dim));
}
export const monthIndex = (s: string) => { const [y, m] = parts(s); return y * 12 + m - 1; };
export const monthsBetween = (a: string, b: string) => monthIndex(b) - monthIndex(a);
export const yearOf = (s: string) => parts(s)[0];
export function ageAt(birth: string, s: string) { const [by, bm, bd] = parts(birth), [y, m, d] = parts(s); return y - by - ((m < bm || (m === bm && d < bd)) ? 1 : 0); }
const ERA = (y: number) => `昭和${y - 1925}年`;
export function fmtJa(s: string) { const [y, m, d] = parts(s); return `${y}年（${ERA(y)}）${m}月${d}日`; }
export function fmtShort(s: string) { const [y, m] = parts(s); return `${ERA(y)}${m}月`; }
