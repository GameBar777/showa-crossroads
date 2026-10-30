// Playwright e2e: mobile 390x844 + desktop. Usage: node scripts/e2e.mjs [baseURL]
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.argv[2] || 'http://localhost:4180/';
const OUT = 'docs/screenshots'; mkdirSync(OUT, { recursive: true });
const results = []; const ok = (name, pass, info = '') => { results.push({ name, pass, info }); console.log((pass ? 'PASS ' : 'FAIL ') + name + (info ? ' — ' + info : '')); };
const browser = await chromium.launch();
async function run(label, viewport, mode, start, shots) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, locale: 'ja-JP', hasTouch: label === 'mobile', isMobile: label === 'mobile' });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await page.addInitScript(() => { localStorage.setItem('kiro10.calm', '1'); localStorage.setItem('kiro10.sound', '0'); });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('#new');
  if (shots) await page.screenshot({ path: `${OUT}/${label}-01-title.png` });
  await page.click('#new');
  await page.click(`.modes button[data-m="${mode}"]`);
  await page.click(`.starts button[data-s="${start}"]`);
  if (shots) await page.screenshot({ path: `${OUT}/${label}-02-setup.png` });
  await page.click('#go');
  const seen = new Set(); let steps = 0, lastDate = '', dateOk = true, shotEvent = false, shotNews = false, shotResult = false, shotLetter = false, shotDeath = false;
  for (; steps < 900; steps++) {
    await page.waitForSelector('.ch, #nx', { timeout: 5000 });
    const nx = await page.$('#nx');
    if (nx) { if (shots && !shotResult) { await page.screenshot({ path: `${OUT}/${label}-05-result.png` }); shotResult = true; } await nx.click(); continue; }
    const kind = await page.$eval('.stage .card', el => el.className);
    for (const k of ['news', 'letter', 'death', 'end', 'flash', 'event']) if (kind.includes(k)) seen.add(k);
    const d = await page.$eval('.date small', el => el.textContent).catch(() => '');
    if (d && lastDate && d < lastDate) dateOk = false; lastDate = d || lastDate;
    if (shots && !shotEvent && kind.includes('event') && await page.$('.say')) { await page.screenshot({ path: `${OUT}/${label}-03-event.png` }); shotEvent = true; }
    if (shots && !shotNews && kind.includes('news')) { await page.screenshot({ path: `${OUT}/${label}-04-news.png` }); shotNews = true; }
    if (shots && !shotLetter && kind.includes('letter')) { await page.screenshot({ path: `${OUT}/${label}-06-letter.png` }); shotLetter = true; }
    if (shots && !shotDeath && kind.includes('death')) { await page.screenshot({ path: `${OUT}/${label}-07-death.png` }); shotDeath = true; }
    if (kind.includes('end')) break;
    const btns = await page.$$('.ch:not([disabled])');
    await btns[steps % btns.length].click();
  }
  const ended = seen.has('end');
  ok(`${label} ${mode}/${start}: reaches ending through UI`, ended, `${steps} steps, cards: ${[...seen].join(',')}`);
  ok(`${label} ${mode}/${start}: header year never goes backwards`, dateOk);
  if (shots) await page.screenshot({ path: `${OUT}/${label}-08-end.png` });
  // timeline panel
  await page.click('.ch'); await page.waitForSelector('.tl');
  if (shots) await page.screenshot({ path: `${OUT}/${label}-09-timeline.png` });
  ok(`${label}: timeline panel lists 史実 rows`, (await page.$$('.tl li')).length > 50);
  await page.click('.close');
  // save round-trip via reload
  await page.reload({ waitUntil: 'networkidle' });
  ok(`${label}: autosave offers 続きから after reload`, !!(await page.$('#cont')));
  // horizontal overflow check (mobile)
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(`${label}: no horizontal overflow`, ov <= 1, `overflow ${ov}px`);
  ok(`${label} ${mode}: no console/page errors`, errs.length === 0, errs.slice(0, 3).join(' | '));
  await ctx.close();
}
await run('mobile', { width: 390, height: 844 }, 'civ', 'farm_f', true);
await run('desktop', { width: 1366, height: 900 }, 'mil', 'navy_air_yokaren', true);
await run('mobile', { width: 390, height: 844 }, 'cmd', 'cmd_army_coy', false);
await run('mobile', { width: 390, height: 844 }, 'state', 'state', false);
await run('mobile', { width: 390, height: 844 }, 'mil', 'army_conscript', false);
await browser.close();
writeFileSync('docs/e2e-results.json', JSON.stringify({ base: BASE, at: new Date().toISOString(), results }, null, 1));
const fails = results.filter(r => !r.pass).length; console.log(`\n${results.length - fails}/${results.length} passed`); process.exit(fails ? 1 : 0);
