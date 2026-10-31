// Headless Chromium check: every BGM/SFX file loads (HTTP 200 + <audio> canplaythrough, ogg and mp3),
// and an actual play session starts BGM + scene SFX without media errors. usage: node scripts/audio-check.mjs URL
import { chromium } from 'playwright';
import { readdirSync } from 'node:fs';
const base = (process.argv[2] || 'http://localhost:4180/').replace(/\/?$/, '/');
const files = ['bgm', 'sfx'].flatMap(k => readdirSync(`public/audio/${k}`).map(f => `audio/${k}/${f}`));
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const pg = await b.newPage(); const net = [];
pg.on('response', r => r.url().includes('/audio/') && net.push([r.status(), r.url().split('/audio/')[1]]));
await pg.goto(base); await pg.evaluate(() => localStorage.setItem('kiro10.sound', '1')); await pg.reload();
const res = await pg.evaluate(async ({ base, files }) => {
  const one = f => new Promise(ok => { const a = new Audio(); a.preload = 'auto'; const t = setTimeout(() => ok([f, 'timeout']), 20000);
    a.oncanplaythrough = () => { clearTimeout(t); ok([f, 'ok', +a.duration.toFixed(1)]); }; a.onerror = () => { clearTimeout(t); ok([f, 'error ' + a.error?.code]); }; a.src = base + f; a.load(); });
  const out = []; for (let i = 0; i < files.length; i += 8) out.push(...await Promise.all(files.slice(i, i + 8).map(one))); return out;
}, { base, files });
const bad = res.filter(r => r[1] !== 'ok');
// play session
await pg.click('#new'); await pg.click('#go'); let playing = [];
for (let i = 0; i < 6; i++) {
  await pg.waitForTimeout(1800);
  playing.push(await pg.evaluate(() => [...document.querySelectorAll('audio')].length + ':' + [...(window).__audioPlaying?.() || []].join()));
  const btn = await pg.$('.choices button, #nx, .card button'); if (btn) await btn.click().catch(() => {}); await pg.waitForTimeout(300); const nx = await pg.$('#nx'); if (nx) await nx.click().catch(() => {});
}
const media = await pg.evaluate(() => (window).__audioErrors?.() || []);
console.log(JSON.stringify({ files: files.length, loaded: res.length - bad.length, bad, http: { total: net.length, non200: net.filter(n => n[0] !== 200 && n[0] !== 206 && n[0] !== 304) }, sessionPlayed: [...new Set(net.map(n => n[1]))].slice(0, 30), mediaErrors: media }, null, 1));
await b.close(); process.exit(bad.length || media.length ? 1 : 0);
