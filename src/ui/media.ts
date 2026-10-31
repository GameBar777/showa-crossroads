// Tag-matched media manifest (public/media/manifest.json). Lazy, cached.
export interface Asset { id: string; type: 'image' | 'clip'; tags: string[]; src: string; avif?: string; poster?: string; label: string; license: string; source: string; rights: string; ai: boolean; bytes?: number; title?: string; date?: string }
const BASE = import.meta.env.BASE_URL;
let man: Asset[] | null = null; let loading: Promise<Asset[]> | null = null;
export function loadManifest(): Promise<Asset[]> {
  if (man) return Promise.resolve(man);
  return (loading ||= fetch(BASE + 'media/manifest.json').then(r => r.json()).then(j => (man = j.assets as Asset[])).catch(() => (man = [])));
}
export const manifestNow = () => man || [];
/** best asset for wanted tags; ties broken deterministically by key so a card always shows the same image */
export function pickAsset(tags: string[], key = '', type: 'image' | 'clip' = 'image', exact?: string): Asset | null {
  const pool = manifestNow().filter(a => a.type === type);
  if (exact) { const x = pool.find(a => a.id === exact); if (x) return x; }
  let best: Asset | null = null, bs = 0;
  for (const a of pool) {
    let s = 0; tags.forEach((t, i) => { if (a.tags.includes(t)) s += i === 0 ? 10 : 3; });
    if (s > 0) s += (a.ai ? 0 : 2) + (hash(key + a.id) % 100) / 1000;
    if (s > bs) { bs = s; best = a; }
  }
  return best;
}
const hash = (s: string) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
export const url = (p: string) => BASE + p.replace(/^\//, '');
export function pictureHtml(a: Asset, cls = 'art') {
  return `<figure class="${cls}"><picture>${a.avif ? `<source type="image/avif" srcset="${url(a.avif)}">` : ''}<img src="${url(a.src)}" alt="${escA(a.label)}" loading="lazy" decoding="async"></picture>${cap(a, '写真')}</figure>`;
}
export function clipHtml(a: Asset) {
  return `<figure class="art clip"><video src="${url(a.src)}" ${a.poster ? `poster="${url(a.poster)}"` : ''} muted loop playsinline autoplay preload="none"></video>${cap(a, '映像')}</figure>`;
}
const escA = (s = '') => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as any)[c]);
function cap(a: Asset, kind: string) {
  if (a.ai) return `<figcaption><b>AI再現</b>${kind === '映像' ? '動くイメージ' : 'イメージ'}・実在の${kind === '映像' ? '映像' : '写真'}ではありません</figcaption>`;
  return `<figcaption class="real"><b class="realtag">実${kind}</b>${escA(a.label)}<small>${escA(a.rights)}／${escA(a.license)}／<a href="${escA(a.source)}" target="_blank" rel="noopener">Wikimedia Commons</a></small></figcaption>`;
}
