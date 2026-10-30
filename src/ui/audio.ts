let ctx: AudioContext | null = null;
export const sound = { on: localStorage.getItem('kiro10.sound') !== '0' };
export function setSound(v: boolean) { sound.on = v; localStorage.setItem('kiro10.sound', v ? '1' : '0'); }
function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.05, delay = 0) {
  if (!sound.on) return;
  try {
    ctx ||= new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + delay;
    o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur);
  } catch { /* audio unavailable */ }
}
export const sfx = {
  tap: () => tone(660, 0.06, 'triangle', 0.03),
  good: () => { tone(523, 0.12, 'triangle'); tone(784, 0.18, 'triangle', 0.05, 0.08); },
  bad: () => { tone(220, 0.25, 'sawtooth', 0.03); tone(165, 0.3, 'sawtooth', 0.03, 0.1); },
  news: () => { tone(880, 0.08, 'square', 0.02); tone(880, 0.08, 'square', 0.02, 0.12); },
  flash: () => { tone(392, 0.5, 'sine', 0.04); tone(587, 0.6, 'sine', 0.03, 0.2); },
  death: () => { tone(110, 1.4, 'sine', 0.06); tone(98, 1.6, 'sine', 0.04, 0.4); },
};
