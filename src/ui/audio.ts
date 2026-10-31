// Sound: BGM (two <audio> elements crossfaded by mood) + scene SFX (lazy-loaded <audio>, ambience loops + one-shots)
// + tiny WebAudio UI tones. Nothing plays until the player turns sound on (default off; respects autoplay policy).
import { LOOP, Mood, Pick } from './soundmap';
const K = 'kiro10.sound', KV = 'kiro10.vol';
const saved = (() => { try { return JSON.parse(localStorage.getItem(KV) || '{}'); } catch { return {}; } })();
export const sound = { on: localStorage.getItem(K) === '1', bgm: saved.bgm ?? 0.5, sfx: saved.sfx ?? 0.7 };
const persist = () => { localStorage.setItem(K, sound.on ? '1' : '0'); localStorage.setItem(KV, JSON.stringify({ bgm: sound.bgm, sfx: sound.sfx })); };
const BASE = (import.meta as any).env?.BASE_URL || '/';
let ext: 'ogg' | 'mp3' | null = null;
const fmt = () => (ext ||= new Audio().canPlayType('audio/ogg; codecs=opus') ? 'ogg' : 'mp3');
export const audioUrl = (kind: 'bgm' | 'sfx', id: string) => `${BASE}audio/${kind}/${id}.${fmt()}`;
export const audioErrors: string[] = [];
function el(src: string, loop = false) { const a = new Audio(); a.preload = 'none'; a.loop = loop; a.src = src; a.onerror = () => audioErrors.push(src + ' code' + a.error?.code); return a; }
function drop(a: HTMLAudioElement) { a.onerror = null; a.pause(); a.removeAttribute('src'); a.load(); }
function ramp(a: HTMLAudioElement, to: number, ms = 1200, done?: () => void) {
  const from = a.volume, t0 = performance.now(); (a as any)._r && cancelAnimationFrame((a as any)._r);
  const step = (t: number) => { const k = Math.min(1, (t - t0) / ms); a.volume = Math.max(0, Math.min(1, from + (to - from) * k)); if (k < 1) (a as any)._r = requestAnimationFrame(step); else done?.(); };
  (a as any)._r = requestAnimationFrame(step);
}
// ---- BGM ----
let cur: { mood: Mood; a: HTMLAudioElement } | null = null; let wantMood: Mood | null = null;
const BGM_GAIN: Partial<Record<Mood, number>> = { gunkan: 0.55, kimigayo: 0.6, battle: 0.8 };
export function setMood(m: Mood) {
  wantMood = m; if (!sound.on || cur?.mood === m) return;
  const old = cur; if (old) ramp(old.a, 0, 1500, () => { drop(old.a); });
  const a = el(audioUrl('bgm', m), m !== 'gunkan' && m !== 'kimigayo'); a.volume = 0; cur = { mood: m, a };
  a.play().then(() => ramp(a, sound.bgm * (BGM_GAIN[m] ?? 1) * 0.6, 2000)).catch(() => { /* autoplay blocked: retried on next gesture */ cur = old?.mood === m ? old : null; });
  a.onended = () => { if (cur?.a === a) { cur = null; setMood(m === 'gunkan' || m === 'kimigayo' ? 'home' : m); } };
}
// ---- SFX ----
const live: HTMLAudioElement[] = []; let lastPick: Pick | null = null; const timers: number[] = [];
export function stopScene() { timers.splice(0).forEach(clearTimeout); for (const a of live.splice(0)) ramp(a, 0, 600, () => drop(a)); }
export function playScene(p: Pick) {
  lastPick = p; setMood(p.mood); stopScene(); if (!sound.on || sound.sfx <= 0) return;
  p.sfx.forEach((id, i) => {
    const loop = LOOP.has(id), v = sound.sfx * (loop ? 0.35 : 0.8) * (i ? 0.75 : 1);
    timers.push(window.setTimeout(() => { const a = el(audioUrl('sfx', id), loop); a.volume = loop ? 0 : v; live.push(a); a.play().then(() => loop && ramp(a, v, 1500)).catch(() => {}); }, 250 + i * 900));
  });
}
// ---- UI tones (WebAudio) ----
let ctx: AudioContext | null = null;
function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.05, delay = 0) {
  if (!sound.on || !sound.sfx) return;
  try {
    ctx ||= new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + delay; vol *= sound.sfx;
    o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur);
  } catch { /* audio unavailable */ }
}
export function setSound(v: boolean) {
  sound.on = v; persist();
  if (!v) { stopScene(); if (cur) { const a = cur.a; ramp(a, 0, 500, () => a.pause()); cur = null; } }
  else { if (lastPick) playScene(lastPick); else if (wantMood) setMood(wantMood); }
}
export function setVolume(kind: 'bgm' | 'sfx', v: number) {
  sound[kind] = v; persist();
  if (kind === 'bgm' && cur) cur.a.volume = v * (BGM_GAIN[cur.mood] ?? 1) * 0.6;
  if (kind === 'sfx') live.forEach(a => (a.volume = Math.min(a.volume, v)));
}
// first user gesture unlocks playback if sound is on (autoplay policy)
const unlock = () => { if (sound.on && !cur && wantMood) setMood(wantMood); };
['pointerdown', 'keydown'].forEach(e => addEventListener(e, unlock, { passive: true }));
document.addEventListener('visibilitychange', () => { if (document.hidden) { cur?.a.pause(); live.forEach(a => a.pause()); } else if (sound.on) { cur?.a.play().catch(() => {}); live.forEach(a => a.loop && a.play().catch(() => {})); } });
(window as any).__audioErrors = () => audioErrors;
(window as any).__audioPlaying = () => [cur?.mood, ...live.map(a => a.src.split('/').pop())].filter(Boolean);
export const sfx = {
  tap: () => tone(660, 0.06, 'triangle', 0.03),
  good: () => { tone(523, 0.12, 'triangle'); tone(784, 0.18, 'triangle', 0.05, 0.08); },
  bad: () => { tone(220, 0.25, 'sawtooth', 0.03); tone(165, 0.3, 'sawtooth', 0.03, 0.1); },
  news: () => { tone(880, 0.08, 'square', 0.02); tone(880, 0.08, 'square', 0.02, 0.12); },
  flash: () => { tone(392, 0.5, 'sine', 0.04); tone(587, 0.6, 'sine', 0.03, 0.2); },
  death: () => { tone(110, 1.4, 'sine', 0.06); tone(98, 1.6, 'sine', 0.04, 0.4); },
};
