// Visual reuse stats: how many events/hist cards resolve to each asset (mirrors artFor in src/main.ts).
import fs from 'node:fs';
const D = JSON.parse(fs.readFileSync('src/data/content.json'));
const M = JSON.parse(fs.readFileSync('public/media/manifest.json')).assets;
const hash = (s) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const pick = (pool, tags, key) => { let best = null, bs = 0; for (const a of pool) { let s = 0; tags.forEach((t, i) => { if (a.tags.includes(t)) s += i === 0 ? 10 : 3; }); if (s > 0) s += (a.ai ? 0 : 2) + (hash(key + a.id) % 100) / 1000; if (s > bs) { bs = s; best = a; } } return best; };
const imgs = M.filter(a => a.type === 'image'), clips = M.filter(a => a.type === 'clip');
const use = {}; const mode = process.argv[2] || 'after';
const cards = [...D.events.map(e => ({ x: e, kind: 'ev' })), ...D.hist.map(h => ({ x: h, kind: 'news' }))];
for (const { x, kind } of cards) {
  const art = x.art || 'village'; let id;
  if (mode === 'before') id = 'art:' + art;
  else {
    const tags = [...(x.tags || []), art, x.category || '', (x.cond?.modes || ['civ'])[0]];
    if (x.clip) id = x.clip; else if (x.img) id = x.img;
    else { const c = (kind === 'news' || x.category === 'front') ? pick(clips, tags, x.id) : null; id = c ? c.id : (pick(imgs, tags, x.id)?.id || 'art:' + art); }
  }
  use[id] = (use[id] || 0) + 1;
}
const v = Object.values(use).sort((a, b) => b - a), real = new Set(M.filter(a => !a.ai).map(a => a.id));
const realCards = Object.entries(use).filter(([k]) => real.has(k)).reduce((s, [, n]) => s + n, 0);
console.log(JSON.stringify({ mode, cards: cards.length, distinctVisuals: v.length, maxUsesOfOneVisual: v[0], avgCardsPerVisual: +(cards.length / v.length).toFixed(2), cardsWithRealMedia: realCards, top5: Object.entries(use).sort((a, b) => b[1] - a[1]).slice(0, 5) }));
