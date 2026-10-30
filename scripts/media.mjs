// Builds public/media/manifest.json from content/media-meta.mjs and the files on disk.
import { statSync, existsSync, writeFileSync } from 'node:fs';
import { IMAGES, LABELS, CLIPS, AI } from '../content/media-meta.mjs';
const P = p => new URL('../public/' + p, import.meta.url);
const size = p => (existsSync(P(p)) ? statSync(P(p)).size : 0);
const assets = [];
for (const [k, tags] of Object.entries(IMAGES)) {
  const src = `art/${k}.webp`, avif = `media/avif/${k}.avif`;
  if (!size(src)) throw new Error('missing ' + src);
  assets.push({ id: 'img_' + k, type: 'image', tags, src, avif: size(avif) ? avif : undefined, label: (LABELS[k] || k) + '（AI再現）', ...AI, bytes: size(src), avifBytes: size(avif) });
}
for (const [k, tags] of Object.entries(CLIPS)) {
  const src = `media/clips/${k}.mp4`; const b = size(src); if (!b) throw new Error('missing ' + src); if (b > 1_000_000) throw new Error('clip over 1MB: ' + src);
  assets.push({ id: 'clip_' + k, type: 'clip', tags, src, poster: `art/${k}.webp`, label: (LABELS[k] || k) + '（AI再現・静止画から生成した6秒の動き）', ...AI, derivedFrom: 'img_' + k, bytes: b, muted: true, loop: true, seconds: 6 });
}
writeFileSync(P('media/manifest.json'), JSON.stringify({ version: 1, generated: new Date().toISOString(), assets }, null, 1));
console.log(`media manifest: ${assets.filter(a => a.type === 'image').length} images, ${assets.filter(a => a.type === 'clip').length} clips`);
