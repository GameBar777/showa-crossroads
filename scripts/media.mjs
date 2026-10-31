// Builds public/media/manifest.json from content/media-meta.mjs (AI) + content/media-real.json (real PD/licensed) and the files on disk.
import { statSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { IMAGES, LABELS, CLIPS, AI } from '../content/media-meta.mjs';
const P = p => new URL('../public/' + p, import.meta.url);
const size = p => (existsSync(P(p)) ? statSync(P(p)).size : 0);
const REAL = JSON.parse(readFileSync(new URL('../content/media-real.json', import.meta.url), 'utf8'));
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
const realMeta = r => ({ label: r.label, license: r.license, source: r.page, rights: r.artist, title: r.title.replace(/^File:/, ''), ai: false });
for (const r of REAL.photos) {
  const src = `media/photos/${r.key}.webp`, avif = `media/photos/${r.key}.avif`;
  if (!size(src)) throw new Error('missing ' + src);
  if (!r.license || !r.page) throw new Error('no license/source: ' + r.key);
  assets.push({ id: r.key, type: 'image', tags: r.tags, src, avif: size(avif) ? avif : undefined, ...realMeta(r), date: r.date, bytes: size(src), avifBytes: size(avif) });
}
for (const r of REAL.clips) {
  const src = `media/clips/${r.key}.mp4`; const b = size(src); if (!b) throw new Error('missing ' + src); if (b > 1_000_000) throw new Error('clip over 1MB: ' + src);
  assets.push({ id: r.key, type: 'clip', tags: r.tags, src, poster: `media/clips/${r.key}.webp`, ...realMeta(r), bytes: b, muted: true, loop: true, seconds: 8 });
}
writeFileSync(P('media/manifest.json'), JSON.stringify({ version: 2, generated: new Date().toISOString(), assets }, null, 1));
// human-readable credits
const lines = ['# 写真・映像の出典（自動生成: scripts/media.mjs）', '', '実写素材はすべて Wikimedia Commons 上でパブリックドメイン／CC0／自由利用（No restrictions）／CC BY 2.0 と表示されているもの。各ファイルページのライセンス表示に依拠しています。AI再現画像は別記。', '',
  '| ID | 種別 | 内容 | 作者・撮影 | ライセンス | 出典 |', '|---|---|---|---|---|---|'];
for (const a of assets.filter(a => !a.ai)) lines.push(`| ${a.id} | ${a.type === 'clip' ? '映像' : '写真'} | ${a.label} | ${(a.rights || '').replace(/\|/g, '/')} | ${a.license} | [${a.title.replace(/[|\]]/g, ' ')}](${a.source}) |`);
lines.push('', '## AI再現（実在の写真ではない）', '', ...assets.filter(a => a.ai).map(a => `- ${a.id}: ${a.label}`));
writeFileSync(new URL('../docs/MEDIA_SOURCES.md', import.meta.url), lines.join('\n') + '\n');
const real = assets.filter(a => !a.ai);
console.log(`media manifest: ${assets.filter(a => a.type === 'image').length} images (${real.filter(a => a.type === 'image').length} real), ${assets.filter(a => a.type === 'clip').length} clips (${real.filter(a => a.type === 'clip').length} real)`);
