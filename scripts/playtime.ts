// Playthrough-time estimate. 630 autoplay runs (every start x 10 seeds x 3 policies).
// strict: counts only text actually shown (card lines, choice labels, news incl. extra items, the picked result lines, death afterstory, ending).
// Reading 500 JP chars/min + 5 s per real choice (>=2 enabled options).
import { advance, choose, newGame, postTurn, succeed } from '../src/engine/game';
import { next } from '../src/engine/rng';
import { ALL_STARTS } from '../src/engine/autoplay';
const jp = (s: string) => (s.match(/[\u3000-\u9fff\uff00-\uffef]/g) || []).length;
const lines = (a: any[] | undefined) => (a || []).reduce((n, l) => n + jp(typeof l === 'string' ? l : l.t || ''), 0);
export function runOne(s: any, seed: number, pol: string) {
  const st = newGame({ ...s, seed } as any); let cards = 0, ch = 0, chars = 0; const seen = new Set<string>(); let repeats = 0;
  for (let i = 0; i < 4000; i++) {
    const c: any = advance(st); cards++;
    if (c.id) { if (seen.has(c.id)) repeats++; seen.add(c.id); }
    chars += lines(c.lines) + (c.choices || []).reduce((n: number, x: any) => n + jp(x.label || ''), 0);
    for (const h of c.more || []) chars += jp(h.title || '') + lines(h.news);
    if (c.kind === 'news') chars += jp(c.hist?.title || '');
    if (c.kind === 'end') break;
    if (c.kind === 'death') { succeed(st, (c.choices[0] as any).succ); st.card = null; continue; }
    const en = (c.choices || []).filter((x: any) => !x.disabled); if (en.length > 1) ch++;
    let pi = en[0]?.i ?? 0;
    if (pol === 'random') pi = en[Math.floor(next({ rng: st.seed + i } as any) * en.length)]?.i ?? 0;
    if (pol === 'safe') pi = (en.find((x: any) => x.tone === 'safe' && !x.risky) || en[0])?.i ?? 0;
    const r = choose(st, pi); chars += r.lines.reduce((n, l) => n + jp(l), 0); postTurn(st);
  }
  return { cards, ch, chars, repeats, min: chars / 500 + ch * 5 / 60, mode: s.mode, start: s.start };
}
const med = (a: number[]) => { a = [...a].sort((x, y) => x - y); return a[a.length >> 1]; };
const R: Record<string, any[]> = {};
for (const s of ALL_STARTS()) for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) for (const pol of ['random', 'first', 'safe']) (R[s.mode] ||= []).push(runOne(s, seed, pol));
const out: any = {};
for (const [m, a] of Object.entries(R)) {
  const f = (k: string) => { const v = a.map(x => x[k]); return { med: +med(v).toFixed(1), min: +Math.min(...v).toFixed(1), max: +Math.max(...v).toFixed(1) }; };
  out[m] = { runs: a.length, cards: f('cards'), choices: f('ch'), chars: f('chars'), repeats: f('repeats'), minutes: f('min') };
  const worst = a.reduce((x, y) => (x.min < y.min ? x : y)); out[m].worst = worst.start;
}
if (process.argv.includes('--starts')) { const by: any = {}; for (const a of Object.values(R)) for (const x of a) (by[x.start] ||= []).push(x.min); for (const [k, v] of Object.entries<any>(by)) console.log(k.padEnd(14), Math.min(...v).toFixed(0), med(v).toFixed(0)); }
console.log(JSON.stringify(out, null, 1));
