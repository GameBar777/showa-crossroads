import { autoplay, ALL_STARTS } from '../src/engine/autoplay';
const pre: Record<string, string> = { cn_: 'china', mn_: 'manchu', pc_: 'pacific', ph_: 'phil', hw_: 'home' };
const tot: Record<string, number[]> = {};
let runs = 0;
for (const s of ALL_STARTS().filter(s => s.mode === 'mil' || s.mode === 'civ')) for (let seed = 1; seed <= 30; seed++) for (const pol of ['random', 'safe', 'bold'] as any[]) {
  let t; try { t = autoplay({ ...s, seed }, pol, 3000); } catch { continue; }
  runs++;
  const c: Record<string, number> = {};
  for (const card of t.cards) { const k = pre[(card.id || '').slice(0, 3)]; if (k) c[k] = (c[k] || 0) + 1; }
  for (const k in c) (tot[k] ||= []).push(c[k]);
}
console.log('runs', runs);
for (const k in tot) { const a = tot[k]; console.log(k, 'runs', a.length, 'avg', (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1), 'max', Math.max(...a)); }
