// Honest content/media counter. Run: npx vite-node scripts/counts.ts
import fs from 'node:fs';
import { D } from '../src/engine/game';
import { autoplay, ALL_STARTS } from '../src/engine/autoplay';
const GOAL = 10000;
const ev = D.events as any[], hist = D.hist as any[];
const later = new Set(ev.flatMap(e => e.choices.flatMap((c: any) => [c.later?.[1], c.win?.later?.[1], c.lose?.later?.[1]].filter(Boolean))));
const referenced = ev.filter(e => (e.w ?? 1) > 0 || later.has(e.id) || e.flash || e.on).length;
const seen = new Set<string>();
for (const s of ALL_STARTS()) for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) for (const p of ['random', 'first', 'safe'] as const) for (const c of autoplay({ ...s, seed }, p).cards) { if (c.id) seen.add(c.id); for (const m of (c as any).more || []) seen.add(m.id); }
const lines = ev.reduce((n, e) => n + (e.lines?.length || 0), 0) + hist.reduce((n, h) => n + (h.lines?.length || 0), 0);
const choices = ev.reduce((n, e) => n + e.choices.length, 0);
const n = (x: any) => x ? (Array.isArray(x) ? x.length : Object.keys(x).length) : 0;
const S = (D as any).settings || {}; const settingsBy = Object.fromEntries(Object.entries(S).map(([k, v]) => [k, n(v)])); const settingsRecs = Object.values(settingsBy).reduce((a: number, b: any) => a + b, 0) as number;
const records = hist.length + ev.length + n(D.people) + n((D as any).items) + n(D.speakers) + n((D as any).npc) + n((D as any).sources) + settingsRecs;
const evTested = ev.filter(e => seen.has(e.id)).length, hTested = hist.filter(h => seen.has(h.id)).length;
const man = JSON.parse(fs.readFileSync('public/media/manifest.json', 'utf8'));
const bytes = (p: string) => { try { return fs.statSync('public' + p.replace(/^\.?\/?/, '/')).size; } catch { return 0; } };
const I = man.assets.filter((a: any) => a.type === 'image'), C = man.assets.filter((a: any) => a.type !== 'image');
const imgs = I.length, clips = C.length;
const out = {
  generatedAt: new Date().toISOString(),
  goal: GOAL,
  content: { records, hist: hist.length, events: ev.length, people: D.people.length, items: n((D as any).items), speakers: n(D.speakers), sources: n((D as any).sources), settings: settingsBy, dialogueLines: lines, choices,
    referenced, reachedInAutoplay: evTested + hTested, eventsReached: evTested, histReached: hTested,
    unimplementedTowardGoal: Math.max(0, GOAL - records), progress: +(records / GOAL * 100).toFixed(2) },
  media: { images: imgs, clips, total: imgs + clips, bytes: man.assets.reduce((n: number, a: any) => n + bytes(a.src) + (a.avif ? bytes(a.avif) : 0), 0),
    unimplementedTowardGoal: Math.max(0, GOAL - imgs - clips), progress: +((imgs + clips) / GOAL * 100).toFixed(2) },
};
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/counts.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
