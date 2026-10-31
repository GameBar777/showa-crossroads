#!/usr/bin/env python3
"""Procedurally synthesize the game's original BGM and SFX (self-made, released CC0).
Usage: python3 scripts/synth-audio.py OUTDIR   -> writes 44.1kHz WAVs. Deterministic (fixed seeds)."""
import sys, os, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt
SR = 44100
OUT = sys.argv[1] if len(sys.argv) > 1 else 'synth'; os.makedirs(OUT, exist_ok=True)
R = np.random.default_rng(1936)
t_ = lambda d: np.arange(int(d * SR)) / SR
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
noise = lambda d: R.standard_normal(int(d * SR))
def env(n, a=0.005, r=0.3, d=None):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r); return e
def place(buf, x, at, g=1.0):
    i = int(at * SR); j = min(len(buf), i + len(x)); buf[i:j] += g * x[:j - i]
def fade(x, fi=0.02, fo=0.2):
    n = len(x); a = min(n, int(fi * SR)); b = min(n, int(fo * SR))
    x[:a] *= np.linspace(0, 1, a); x[n - b:] *= np.linspace(1, 0, b); return x
def norm(x, peak=0.89):
    m = np.max(np.abs(x)) or 1; return x / m * peak
def reverb(x, dec=1.6, wet=0.3):
    n = int(dec * SR); ir = R.standard_normal(n) * np.exp(-np.arange(n) / SR * 6.9 / dec); ir = lp(ir, 5000)
    y = np.convolve(x, ir)[:len(x) + n // 2] / np.sqrt(n) * 4; z = np.zeros_like(y); z[:len(x)] = x
    return z * (1 - wet) + y * wet
def save(name, x, stereo=None):
    x = norm(np.nan_to_num(x));
    data = np.stack([x, stereo if stereo is not None else x], 1) if stereo is not None else x
    wavfile.write(f'{OUT}/{name}.wav', SR, (data * 32767).astype(np.int16)); print(name, round(len(x) / SR, 1), 's')

# ---------- SFX ----------
def shot(d=0.5, body=900, crack=1.0):
    n = noise(d); c = hp(n, 2000) * env(len(n), 0.0005, 0.012) * crack
    b = lp(n, body) * env(len(n), 0.001, 0.09); boom = np.sin(2 * np.pi * 70 * t_(d)) * env(len(n), 0.001, 0.12)
    return c + b * 1.5 + boom * 0.6
def rifle():
    b = np.zeros(int(2.6 * SR)); place(b, shot(1.0), 0.05); place(b, reverb(shot(0.5) * 0.3, 1.5, 0.9), 0.1, 0.5); return fade(b)
def firefight():
    d = 9; b = np.zeros(int(d * SR)); t = 0.1
    while t < d - 0.8:
        if R.random() < 0.25:  # MG burst
            k = R.integers(4, 12)
            for i in range(k): place(b, shot(0.25, 700, 0.6), t + i * 0.085, 0.35 * R.uniform(.5, 1)); t += k * 0.085 + R.uniform(.2, .6)
        else: place(b, shot(0.6), t, R.uniform(.15, .7)); t += R.uniform(.12, .7)
    b = reverb(b, 1.8, 0.35)[:len(b)]; return fade(b, 0.3, 1)
def mg():
    b = np.zeros(int(3.2 * SR))
    for i in range(30): place(b, shot(0.2, 800, 0.8), 0.05 + i * 0.09, R.uniform(.7, 1))
    return fade(reverb(b, 1.2, .3)[:len(b)])
def explosion(d=4.5, size=1.0):
    n = noise(d); x = lp(n, 300 * size + 100, 4) * env(len(n), 0.003, 0.7 * size) * 3
    x += lp(n, 2500) * env(len(n), 0.001, 0.08); x += np.sin(2 * np.pi * (40 + 30 * np.exp(-t_(d) * 6)) * t_(d)) * env(len(n), 0.002, 0.5) * 1.5
    x += lp(noise(d), 1500) * (R.random(len(n)) > 0.9985) * env(len(n), 0.2, 1.0) * 6  # debris
    return fade(x, 0.001, 0.8)
def bombing():
    d = 14; b = np.zeros(int(d * SR))
    # whistle falls then hits, plus distant drone
    for k, at in enumerate([0.5, 3.6, 6.2, 8.8]):
        w = 2.2; tt = t_(w); f = 1400 - 900 * tt / w; ph = 2 * np.pi * np.cumsum(f) / SR
        place(b, np.sin(ph) * np.linspace(.05, .35, len(tt)), at); place(b, explosion(4.5, 1.2), at + w, 1.0 - k * 0.12)
    b += plane_drone(d, 4, 0.25)
    return fade(b, 0.5, 1.5)
def artillery():
    d = 12; b = np.zeros(int(d * SR))
    for at in [0.2, 2.4, 3.1, 5.8, 8.0, 9.1]:
        place(b, lp(explosion(3.5, 1.6), 600), at, R.uniform(.5, 1))
    return fade(reverb(b, 3, .4)[:len(b)], 0.2, 1.5)
def plane_drone(d, engines=2, g=1.0, base=95):
    tt = t_(d); x = np.zeros(len(tt))
    for e in range(engines):
        f = base * (1 + 0.012 * e) * (1 + 0.004 * np.sin(2 * np.pi * 0.3 * tt + e)); ph = 2 * np.pi * np.cumsum(f) / SR
        x += sum(np.sign(np.sin(h * ph)) / h for h in (1, 2, 3))
    x = lp(x, 900) + lp(noise(d), 400) * 0.4
    return x / engines * g
def fighter():
    d = 7; tt = t_(d); c = d / 2
    dop = 1 + 0.18 * np.tanh(-(tt - c) * 1.6); amp = 1 / (1 + ((tt - c) * 1.4) ** 2)
    f = 140 * dop; ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sign(np.sin(h * ph)) / h for h in (1, 2, 3, 5)); x = lp(x, 2500) + hp(noise(d), 1500) * 0.3
    pan = np.tanh((tt - c) * 1.2)
    y = fade(x * amp); return y * (1 - pan) / 2, y * (1 + pan) / 2
def dogfight():
    d = 10; L = np.zeros(int(d * SR)); Rr = np.zeros_like(L)
    for at, g in [(0, 1), (2.8, .7)]:
        l, r = fighter(); place(L, l, at, g); place(Rr, r, at, g)
        if at == 2.8: l, r = r, l
    for t0 in [2.6, 5.4, 6.0]:
        for i in range(10): s = shot(0.15, 1200, .5); place(L, s, t0 + i * 0.06, .25); place(Rr, s, t0 + i * 0.06, .25)
    return fade(L, .2, 1), fade(Rr, .2, 1)
def bombers():
    d = 12; tt = t_(d); return fade(plane_drone(d, 4, 1, 80) * (0.3 + 0.7 * np.sin(np.pi * tt / d)), 1.5, 2)
def flak():
    d = 8; b = np.zeros(int(d * SR))
    for i in range(14): place(b, hp(explosion(1.2, .3), 200), R.uniform(0, d - 1.3), R.uniform(.3, .8))
    return fade(reverb(b, 2, .5)[:len(b)] + plane_drone(d, 4, 0.15, 80)[:len(b)], .3, 1)
def waves():
    d = 16; tt = t_(d); x = lp(noise(d), 800) * (0.5 + 0.5 * np.sin(2 * np.pi * tt / 5.3) ** 2) + hp(lp(noise(d), 4000), 1000) * 0.15 * (np.sin(2 * np.pi * tt / 5.3 + 1) ** 8)
    return loopfade(x)
def ship():
    d = 16; tt = t_(d); eng = lp(sum(np.sin(2 * np.pi * f * tt) for f in (31, 62, 93)) + noise(d) * .3, 200)
    w = waves(); return loopfade(eng[:len(w)] * 0.6 + w * 0.5)
def loopfade(x, ov=1.0):  # crossfade tail into head so it loops seamlessly
    n = int(ov * SR); y = x[:-n].copy(); w = np.linspace(0, 1, n); y[:n] = y[:n] * w + x[-n:] * (1 - w); return y
def rain():
    d = 16; x = bp(noise(d), 400, 6000) * 0.4; drops = (R.random(int(d * SR)) > 0.997) * R.standard_normal(int(d * SR))
    x += hp(np.convolve(drops, np.exp(-np.arange(200) / 30))[:int(d * SR)], 1500) * 0.5; return loopfade(x)
def thunder():
    d = 7; n = noise(d); x = lp(n, 120, 4) * env(len(n), 0.3, 1.8) * 3 + lp(n, 1500) * env(len(n), 0.01, 0.15)
    return fade(x, .01, 1.5)
def wind():
    d = 16; tt = t_(d); m = 0.5 + 0.5 * np.sin(2 * np.pi * tt / 7) * np.sin(2 * np.pi * tt / 3.1); return loopfade(bp(noise(d), 200, 1200) * m)
def fire():
    d = 14; x = lp(noise(d), 500) * 0.6
    cr = (R.random(int(d * SR)) > 0.9993) * R.standard_normal(int(d * SR)); x += hp(np.convolve(cr, np.exp(-np.arange(300) / 40))[:len(x)], 1200) * 2
    return loopfade(x)
def crowd(cheer=False):
    d = 12; tt = t_(d); x = np.zeros(len(tt))
    for v in range(40):  # murmuring 'voices': formant-filtered buzz, no speech
        f0 = R.uniform(90, 230); ph = 2 * np.pi * np.cumsum(f0 * (1 + 0.05 * np.sin(2 * np.pi * R.uniform(2, 5) * tt))) / SR
        s = np.sign(np.sin(ph)) * (0.5 + 0.5 * np.sin(2 * np.pi * R.uniform(.3, 1.5) * tt + R.uniform(0, 6))) ** 3
        x += bp(s, R.uniform(400, 700), R.uniform(900, 2200), 1)
    x = x / 40 + bp(noise(d), 300, 3000) * 0.05
    if cheer:  # three rising shouts swells (banzai-like rhythm, wordless)
        for k in range(3):
            g = np.exp(-((tt - (3 + k * 2.6)) / 0.5) ** 2); x *= 1 + 2.5 * g
    return fade(x, .5, 1.5)
def static():
    d = 12; tt = t_(d); x = bp(noise(d), 300, 3500) * (0.4 + 0.3 * np.sin(2 * np.pi * 0.4 * tt) ** 2)
    x += np.sin(2 * np.pi * 1000 * tt) * 0.05 * (np.sin(2 * np.pi * .13 * tt) > .7); x += (R.random(len(tt)) > .9995) * 3
    return loopfade(x)
def chime():  # NHK-style radio time-signal-like chime (original)
    b = np.zeros(int(3 * SR))
    for i, f in enumerate([880, 880, 880, 1760]):
        n = int((0.1 if i < 3 else 1.0) * SR); tt = np.arange(n) / SR; place(b, np.sin(2 * np.pi * f * tt) * env(n, .003, .15 if i < 3 else .6), i * 0.8)
    return fade(b)
def paper():
    d = 2.5; x = np.zeros(int(d * SR))
    for i in range(12): L = R.uniform(.05, .2); s = hp(noise(L), 1500); s = s * env(len(s), .01, .04); place(x, s, R.uniform(0, d - .3), R.uniform(.3, 1))
    return fade(x)
def bell(f0=110, d=9):  # temple bell: inharmonic partials with beating
    tt = t_(d); x = np.zeros(len(tt))
    for r, a, dec in [(0.5, .6, 5), (1, 1, 4), (1.19, .5, 3), (1.56, .4, 2.5), (2.0, .3, 2), (2.74, .2, 1.2), (3.76, .12, .8)]:
        x += a * np.sin(2 * np.pi * f0 * r * tt) * (1 + 0.15 * np.sin(2 * np.pi * 1.3 * tt)) * np.exp(-tt / dec)
    x += lp(noise(d), 300) * env(len(tt), .001, .05)  # striker thud
    return fade(x, .001, .8)
def crickets():
    d = 12; tt = t_(d); x = np.zeros(len(tt))
    for k in range(5):
        f = R.uniform(3800, 5200); rate = R.uniform(14, 22); ph = R.uniform(0, 6)
        gate = (np.sin(2 * np.pi * rate * tt + ph) > 0.3) * (np.sin(2 * np.pi * R.uniform(.3, .7) * tt + ph) > -0.2)
        x += np.sin(2 * np.pi * f * tt) * lp(gate.astype(float), 200) * R.uniform(.3, 1)
    return loopfade(x)
def suzumushi():
    d = 10; tt = t_(d); f = 4300; gate = (np.sin(2 * np.pi * 2.0 * tt) > 0.2).astype(float)
    return loopfade(np.sin(2 * np.pi * f * tt) * (0.5 + 0.5 * np.sin(2 * np.pi * 45 * tt)) * lp(gate, 50))
def furin():
    d = 8; b = np.zeros(int(d * SR))
    for at in [0.2, 1.9, 2.3, 4.8, 6.1]:
        n = int(2.5 * SR); tt = np.arange(n) / SR; f = R.choice([2600, 2930, 3300])
        place(b, sum(np.sin(2 * np.pi * f * r * tt) * np.exp(-tt / (1.2 / r)) * a for r, a in [(1, 1), (2.76, .3), (5.4, .1)]), at, R.uniform(.4, .8))
    return fade(b)
def steps(surface='gravel', d=6, rate=1.9, march=False):
    b = np.zeros(int(d * SR)); t = 0.1
    while t < d - .3:
        s = (bp(noise(.15), 300, 3000) if surface == 'gravel' else lp(noise(.12), 600)) * env(int(.15 * SR), .002, .03)[:int((.15 if surface == 'gravel' else .12) * SR)]
        n = 12 if march else 1
        for k in range(n): place(b, s, t + R.uniform(0, .03 if march else 0), R.uniform(.5, 1) / (1 if not march else 3))
        t += 1 / rate
    return fade(b)
def heartbeat():
    d = 8; b = np.zeros(int(d * SR))
    for i in range(9):
        for o, g in [(0, 1), (.28, .7)]:
            n = int(.15 * SR); tt = np.arange(n) / SR; place(b, np.sin(2 * np.pi * 50 * tt) * env(n, .005, .04) + lp(noise(.15), 120) * env(n, .003, .03), .2 + i * .85 + o, g)
    return fade(b)
def clock():
    d = 8; b = np.zeros(int(d * SR))
    for i in range(16): n = int(.03 * SR); place(b, bp(noise(.03), 2000, 5000) * env(n, .0005, .004), .1 + i * .5, 1 if i % 2 else .7)
    return b
def bugle():  # original bugle-call-like figure on harmonic series (not the actual Japanese call)
    notes = [(392, .25), (523, .25), (659, .5), (523, .25), (659, .25), (784, .9)]; out = []
    for f, du in notes:
        tt = t_(du); vib = 1 + .006 * np.sin(2 * np.pi * 5.5 * tt)
        ph = 2 * np.pi * np.cumsum(f * vib) / SR; s = sum(np.sin(h * ph) / h ** 1.3 for h in range(1, 8)); out.append(s * env(len(tt), .03, du * 2) * np.minimum(1, (du - tt) * 20 + .05))
    return fade(reverb(np.concatenate(out), 2, .3))
def drum_taiko(d=0.9, f=70):
    tt = t_(d); return np.sin(2 * np.pi * (f + 50 * np.exp(-tt * 20)) * tt) * env(len(tt), .002, .25) + lp(noise(d), 800) * env(len(tt), .001, .02)
def click(): return fade(hp(noise(.04), 1500) * env(int(.04 * SR), .0005, .006), .001, .01)
def telegraph():
    b = np.zeros(int(3 * SR)); t = .1
    for sym in '-.-. --.- -.. .': 
        if sym == ' ': t += .25; continue
        du = .09 if sym == '.' else .27; n = int(du * SR); place(b, np.sin(2 * np.pi * 750 * np.arange(n) / SR) * .6, t); t += du + .09
    return fade(b, .001, .05)
def door():
    b = np.zeros(int(1.5 * SR)); place(b, lp(noise(.5), 400) * env(int(.5 * SR), .002, .1), .05); place(b, bp(noise(.6), 800, 2500) * np.linspace(0, .3, int(.6 * SR)) * env(int(.6 * SR), .05, .3), .3)
    return fade(b)
def sting_bad():
    tt = t_(2.5); x = sum(np.sin(2 * np.pi * f * tt) for f in (110, 116.5, 164.8)) * env(len(tt), .05, 1.0); return fade(reverb(x, 2, .4))

S = dict(rifle=rifle, firefight=firefight, mg=mg, explosion=lambda: explosion(), bombing=bombing, artillery=artillery,
         bombers=bombers, flak=flak, waves=waves, ship=ship, rain=rain, thunder=thunder, wind=wind, fire=fire,
         crowd=lambda: crowd(False), cheer=lambda: crowd(True), static=static, chime=chime, paper=paper, bell=lambda: bell(),
         crickets=crickets, suzumushi=suzumushi, furin=furin, steps=lambda: steps(), march=lambda: steps('gravel', 8, 2.0, True),
         steps_in=lambda: steps('wood', 5, 1.6), heartbeat=heartbeat, clock=clock, bugle=bugle, telegraph=telegraph, door=door, sting=sting_bad,
         taiko=lambda: fade(drum_taiko(1.2)))
for k, f in S.items():
    if only := os.environ.get('ONLY'):
        if k not in only.split(','): continue
    save('sfx_' + k, f())
if not os.environ.get('ONLY') or 'fighter' in os.environ['ONLY']:
    l, r = fighter(); save('sfx_fighter', l, r)
    l, r = dogfight(); save('sfx_dogfight', l, r)

# ---------- BGM (original compositions, procedural) ----------
def pluck(f, d, bright=.5):  # Karplus-Strong (koto/shamisen-ish)
    n = int(d * SR); p = int(SR / f); buf = R.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n): out[i] = buf[i % p]; buf[i % p] = (bright * buf[i % p] + (1 - bright) * buf[(i + 1) % p]) * .996 if True else 0
    return out
def ks(f, d, damp=.996):
    n = int(d * SR); p = max(2, int(SR / f)); y = np.zeros(n + p); y[:p] = R.uniform(-1, 1, p)
    # vectorized-ish KS: process in chunks of p
    for s in range(p, n + p, p):
        e = min(n + p, s + p); seg = y[s - p:e - p]; nxt = np.roll(y[s - p:s], -1)[:e - s]
        y[s:e] = damp * 0.5 * (seg + nxt)
    return y[p:]
def pad(freqs, d, g=1.0):
    tt = t_(d); x = sum(np.sin(2 * np.pi * f * tt * (1 + .002 * np.sin(2 * np.pi * .2 * tt + i))) for i, f in enumerate(freqs))
    return lp(x, 1500) * g
def flute(f, d, vib=.01):
    tt = t_(d); ph = 2 * np.pi * np.cumsum(f * (1 + vib * np.sin(2 * np.pi * 5 * tt) * np.minimum(1, tt))) / SR
    x = np.sin(ph) + .2 * np.sin(2 * ph) + bp(noise(d), f * .8, f * 3) * .25
    e = np.minimum(1, tt / .25) * np.minimum(1, (d - tt) / .4); return x * e
def stereo_of(x, w=0.012):
    k = int(w * SR); return x, np.concatenate([np.zeros(k), x[:-k]])
PEN = [293.66, 329.63, 392.0, 440.0, 493.88]  # D major pentatonic-ish (yo scale-ish)
MIY = [293.66, 311.13, 392.0, 440.0, 466.16]  # miyako-bushi (in scale) D Eb G A Bb
def bgm_home(d=72):
    b = np.zeros(int(d * SR)); beat = 0.75; t = 0.5
    chords = [[146.8, 220, 293.7], [130.8, 196, 261.6], [110, 164.8, 220], [146.8, 220, 293.7]]
    for ci in range(int(d / 6)): place(b, fade(pad(chords[ci % 4], 6.4, .12), 1, 1.2), ci * 6)
    while t < d - 3:
        f = PEN[R.integers(0, 5)] * R.choice([1, 2], p=[.7, .3]); place(b, ks(f, 2.5, .997), t, R.uniform(.25, .45)); t += beat * R.choice([1, 1, 2, .5])
    return loopfade(reverb(b, 2.2, .3)[:len(b)], 3)
def bgm_title(d=80):
    b = np.zeros(int(d * SR))
    for ci in range(int(d / 8)): place(b, fade(pad([73.4, 110, 146.8, 220] if ci % 2 == 0 else [77.8, 116.5, 155.6, 233.1], 8.6, .14), 2, 2), ci * 8)
    t = 2
    phrase = [(MIY[2], 2.5), (MIY[3], 1.5), (MIY[4], 3), (MIY[3], 1), (MIY[2], 2), (MIY[1], 1.5), (MIY[0], 4)]
    while t < d - 12:
        for f, du in phrase: place(b, flute(f * 2, du), t, .35); t += du
        t += 4; R.shuffle(phrase[:-1])
    for at in range(0, int(d) - 6, 16): place(b, bell(73.4, 8) * .25, at + 1)
    return loopfade(reverb(b, 3.5, .45)[:len(b)], 4)
def bgm_tension(d=64):
    b = np.zeros(int(d * SR)); tt = t_(d)
    b += lp(np.sign(np.sin(2 * np.pi * 55 * tt)) * .3 + np.sin(2 * np.pi * 58.3 * tt) * .3, 300) * (.6 + .4 * np.sin(2 * np.pi * tt / 16))
    for i in range(int(d / 1.0)): place(b, drum_taiko(.6, 55) * .3, i * 1.0 + .1); 
    for i in range(int(d / 4)): place(b, flute(MIY[1] * 2 if i % 2 else MIY[4], 2.6, .02) * .12, i * 4 + 2)
    b += hp(noise(d), 3000) * .01
    return loopfade(reverb(b, 2.5, .3)[:len(b)], 3)
def bgm_battle(d=60):
    b = np.zeros(int(d * SR)); bpm = 132; beat = 60 / bpm; tt = t_(d)
    pat = [1, 0, .5, 0, .8, .4, .5, 0]
    for i in range(int(d / beat * 2)):
        g = pat[i % 8]
        if g: place(b, drum_taiko(.5, 60) * g * .6, i * beat / 2)
        if i % 4 == 2: place(b, hp(noise(.08), 2000) * env(int(.08 * SR), .001, .02) * .15, i * beat / 2)
    bass = [73.4, 73.4, 77.8, 69.3]
    for k in range(int(d / (beat * 8))):
        f = bass[k % 4]; seg = t_(beat * 8); ph = 2 * np.pi * f * seg
        place(b, lp(np.sign(np.sin(ph)) * .3 + np.sign(np.sin(1.5 * ph)) * .15, 700) * np.minimum(1, seg * 4), k * beat * 8)
    for k in range(int(d / (beat * 16))): place(b, bugle()[: int(beat * 8 * SR)] * .12, k * beat * 16 + beat * 8)
    return loopfade(reverb(b, 1.5, .2)[:len(b)], 2)
def bgm_grief(d=80):
    b = np.zeros(int(d * SR))
    chords = [[146.8, 174.6, 220], [116.5, 146.8, 174.6], [130.8, 155.6, 196], [110, 138.6, 164.8]]
    for ci in range(int(d / 8)): place(b, fade(pad(chords[ci % 4], 8.8, .14), 2.5, 2.5), ci * 8)
    mel = [440, 392, 349.2, 329.6, 293.7, 349.2, 329.6, 277.2, 293.7]; t = 3
    while t < d - 8:
        for f in mel[:R.integers(3, len(mel))]:
            place(b, ks(f, 4, .9985) * .35 + ks(f * 2, 4, .995) * .08, t); t += R.choice([1.5, 2, 3])
        t += 3
    return loopfade(reverb(b, 4, .5)[:len(b)], 4)
def bgm_night(d=72):  # quiet home-front night: low pad + crickets + sparse shamisen
    b = np.zeros(int(d * SR))
    for ci in range(int(d / 9)): place(b, fade(pad([98, 146.8, 196], 9.6, .1), 2, 2), ci * 9)
    t = 4
    while t < d - 4: place(b, ks(MIY[R.integers(0, 5)], 3, .995) * .3, t); t += R.choice([2.5, 3.5, 5])
    b += np.tile(crickets(), 10)[:len(b)] * .04
    return loopfade(reverb(b, 3, .4)[:len(b)], 3)
B = dict(title=bgm_title, home=bgm_home, tension=bgm_tension, battle=bgm_battle, grief=bgm_grief, night=bgm_night)
for k, f in B.items():
    if (only := os.environ.get('ONLY')) and k not in only.split(','): continue
    x = f(); l, r = stereo_of(x); save('bgm_' + k, l, r)
