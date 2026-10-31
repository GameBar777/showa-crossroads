// Reports how many cards (events + history records) get scene sound, and the distribution of SFX / moods.
import D from '../src/data/content.json';
import { pickSound, SFX_IDS } from '../src/ui/soundmap';
import { existsSync } from 'node:fs';
const cards = [...(D as any).events.map((e: any) => ({ kind: 'event', ev: e, lines: e.lines, letter: e.letter, date: e.date, mode: e.cond?.modes?.[0] || 'civ' })),
  ...(D as any).hist.map((h: any) => ({ kind: 'news', hist: h, lines: h.lines || [], date: h.date, mode: 'civ' }))];
const sf: Record<string, number> = {}, md: Record<string, number> = {}; let withSfx = 0, kw = 0;
for (const c of cards) { const p = pickSound(c, c.mode, c.date); if (p.sfx.length) withSfx++; p.sfx.forEach(s => (sf[s] = (sf[s] || 0) + 1)); md[p.mood] = (md[p.mood] || 0) + 1; }
const missing = SFX_IDS.filter(i => !existsSync(`public/audio/sfx/${i}.ogg`) || !existsSync(`public/audio/sfx/${i}.mp3`));
console.log(JSON.stringify({ cards: cards.length, withSfx, pct: +(100 * withSfx / cards.length).toFixed(1), sfx: Object.entries(sf).sort((a, b) => b[1] - a[1]), moods: md, missing }, null, 0));
