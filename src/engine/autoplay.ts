import { advance, choose, newGame, postTurn, succeed, State, NewOpts, D } from './game';
import { next } from './rng';
export interface Trace { st: State; cards: { date: string; kind: string; id?: string; cat?: string }[]; deaths: number; reachedEnd: boolean }
export function autoplay(o: NewOpts, pol: 'random' | 'first' | 'safe' = 'random', max = 3000): Trace {
  const st = newGame(o); const cards: Trace['cards'] = []; let deaths = 0;
  for (let i = 0; i < max; i++) {
    const c = advance(st);
    cards.push({ date: st.date, kind: c.kind, id: c.id, cat: c.ev?.category });
    if (c.kind === 'end') return { st, cards, deaths, reachedEnd: true };
    if (c.kind === 'death') { deaths++; const ch = c.choices!; const s = ch[0] as any; st.card = null; succeed(st, s.succ); continue; }
    const en = (c.choices || []).filter((x: any) => !x.disabled);
    let pickI = en[0]?.i ?? 0;
    if (pol === 'random') pickI = en[Math.floor(next({ rng: st.seed + i } as any) * en.length)]?.i ?? 0;
    if (pol === 'safe') pickI = (en.find((x: any) => x.tone === 'safe' && !x.risky) || en[0])?.i ?? 0;
    choose(st, pickI); postTurn(st);
  }
  return { st, cards, deaths, reachedEnd: false };
}
export const ALL_STARTS = () => [
  ...D.settings.backgrounds.map((b: any) => ({ mode: 'civ' as const, start: b.id })),
  ...D.settings.milStarts.map((b: any) => ({ mode: 'mil' as const, start: b.id })),
  ...D.settings.cmdStarts.map((b: any) => ({ mode: 'cmd' as const, start: b.id })),
  { mode: 'state' as const, start: 'state' },
];
