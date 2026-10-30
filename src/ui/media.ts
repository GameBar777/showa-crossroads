// Tag-matched media manifest (public/media/manifest.json). Lazy, cached.
export interface Asset { id: string; type: 'image' | 'clip'; tags: string[]; src: string; avif?: string; poster?: string; label: string; license: string; source: string; rights: string; ai: boolean; bytes?: number }
const BASE = import.meta.env.BASE_URL;
let man: Asset[] | null = null; let loading: Promise<Asset[]> | null = null;
export function loadManifest(): Promise<Asset[]> {
  if (man) return Promise.resolve(man);
  return (loading ||= fetch(BASE + 'media/manifest.json').then(r => r.json()).then(j => (man = j.assets as Asset[])).catch(() => (man = [])));
}
export const manifestNow = () => man || [];
/** best asset for wanted tags; ties broken deterministically by key so a card always shows the same image */
export function pickAsset(tags: string[], key = '', type: 'image' | 'clip' = 'image'): Asset | null {
  const pool = manifestNow().filter(a => a.type === type);
  let best: Asset | null = null, bs = 0;
  for (const a of pool) {
    let s = 0; tags.forEach((t, i) => { if (a.tags.includes(t)) s += i === 0 ? 10 : 3; });
    if (s > 0) s += (hash(key + a.id) % 100) / 1000;
    if (s > bs) { bs = s; best = a; }
  }
  return best;
}
const hash = (s: string) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
export const url = (p: string) => BASE + p.replace(/^\//, '');
export function pictureHtml(a: Asset, cls = 'art') {
  return `<figure class="${cls}"><picture>${a.avif ? `<source type="image/avif" srcset="${url(a.avif)}">` : ''}<img src="${url(a.src)}" alt="${a.label}" loading="lazy" decoding="async"></picture><figcaption>${a.ai ? '<b>AI再現</b>イメージ・実在の人物ではありません' : a.label + '／' + a.license}</figcaption></figure>`;
}
export function clipHtml(a: Asset) {
  return `<figure class="art clip"><video src="${url(a.src)}" ${a.poster ? `poster="${url(a.poster)}"` : ''} muted loop playsinline autoplay preload="none"></video><figcaption><b>AI再現</b>動くイメージ</figcaption></figure>`;
}
