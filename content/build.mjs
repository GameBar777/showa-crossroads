// Compile authored content -> src/data/content.json ; validate schema strictly. Exit non-zero on any error.
import fs from 'node:fs';
import { SRC } from './lib.mjs';
import { HIST, ALT } from './hist.mjs';
import { ROMANCE } from './romance.mjs';
import { CIV } from './civ.mjs';
import { MIL } from './mil.mjs';
import { CHINA, MANCHU, PACIFIC, PHIL, FRONT_TAIL } from './front.mjs';
import { HOME_CHAIN, HOME_POOL } from './home.mjs';
import { CMD } from './cmd.mjs';
import { STATE } from './state.mjs';
import { POST } from './post.mjs';
import { ALM_CIV } from './almanac-civ.mjs';
import { ALM_MIL } from './almanac-mil.mjs';
import { REAL, NPC } from './people.mjs';
import { BACKGROUNDS, MIL_STARTS, CMD_STARTS, RANKS, REGIONS, PRICES, GLOSSARY } from './settings.mjs';

const root = new URL('..', import.meta.url).pathname;
const errs = [];
const err = (m) => errs.push(m);
export const SPEAKERS = {
  narr: ['', ''], partner: ['{partner}', '想'], mother: ['母', '母'], father: ['父', '父'], child: ['{child}', '子'], friend: ['{friend}', '友'],
  neighbor: ['近所の人', '隣'], officer: ['上官', '官'], senior: ['古参兵', '古'], medic: ['衛生兵', '衛'], mech: ['整備兵', '整'], nco: ['下士官', '曹'],
  staff: ['参謀', '参'], chamberlain: ['侍従（架空）', '侍'], army_min: ['陸軍大臣', '陸'], army_staff: ['参謀本部員', '参'], diplomat: ['外務官僚', '外'],
  diet_member: ['衆議院議員', '議'], navy_min: ['海軍大臣', '海'], minister: ['閣僚', '閣'], suzuki: ['鈴木貫太郎', '鈴'], soldier: ['若い兵', '兵'], boss: ['{boss}', '上'],
  farmer_cn: ['中国人の農民', '農'], worker_kr: ['朝鮮出身の若者', '朝'], teacher_kr: ['朝鮮出身の教員', '朝'], friend_tw: ['台湾の友人', '台'], woman_ph: ['フィリピンの女性', '比'],
  mother_f: ['戦友の母', '母'], witness: ['元捕虜の証人', '証'], orphan: ['靴磨きの少年', '孤'], guard_kr: ['朝鮮出身の元軍属', '朝'], okinawan: ['沖縄出身の人', '沖'],
  child_ch: ['侍従の息子', '息'], radio: ['ラジオ', '📻'],
  kempei: ['憲兵', '憲'], tonari: ['隣組長', '組'], postman: ['郵便配達', '〒'], clerk: ['役場の兵事係', '兵'], nurse: ['看護婦', '看'], comrade: ['戦友', '戦'], sister: ['妹', '妹'], villager_cn: ['中国の老人', '老'], soldier_us: ['米兵', '米'], settler: ['開拓団の女性', '拓'],
};
const STAT = ['hp', 'yen', 'spirit', 'bond', 'rep', 'consc'];
const USTAT = ['men', 'morale', 'supply', 'train', 'fatigue', 'trust'];
const NSTAT = ['cab', 'army', 'navy', 'elders', 'privy', 'diet', 'opinion', 'intl', 'econ', 'war'];
const ROLES = ['partner', 'mother', 'father', 'child', 'friend', 'boss'];
const ITEMS = { wedding_photo: '婚礼の写真', omamori: 'お守り', father_diary: '父の帳面', senninbari: '千人針', partner_photo: '{partner}の写真', child_drawing: '{child}の絵', last_letter: '最後の手紙', radio: 'ラジオ', iron_kettle: '祖母の鉄瓶', my_diary: '自分の日記', senninbari_made: '縫い上げた千人針', family_photo: '家族写真', soldier_letter: '代筆した手紙', true_draft: '載らなかった原稿', romusha_note: '聞き書きのメモ', uniform_photo: '制服の写真', friend_letter: '戦友の手紙' };
export function parseEffects(s, ctx) {
  const ops = [];
  for (const t of (s || '').split(/\s+/).filter(Boolean)) {
    let m;
    if ((m = t.match(/^(hp|yen|spirit|bond|rep|consc)([+-]\d+)$/))) ops.push(['s', m[1], +m[2]]);
    else if ((m = t.match(/^u\.(\w+)([+-]\d+)$/)) && USTAT.includes(m[1])) ops.push(['u', m[1], +m[2]]);
    else if ((m = t.match(/^n\.(\w+)([+-]\d+)$/)) && NSTAT.includes(m[1])) ops.push(['n', m[1], +m[2]]);
    else if ((m = t.match(/^r\.(\w+)([+-]\d+)$/)) && ROLES.includes(m[1])) ops.push(['r', m[1], +m[2]]);
    else if ((m = t.match(/^rank([+-]\d+)$/))) ops.push(['rank', +m[1]]);
    else if ((m = t.match(/^([+-])([a-z]\w*)$/))) ops.push(['f', m[2], m[1] === '+' ? 1 : 0]);
    else if ((m = t.match(/^item:(\w+)$/))) { if (!ITEMS[m[1]]) err(`${ctx}: unknown item ${m[1]}`); ops.push(['item', m[1]]); }
    else if ((m = t.match(/^kid:(\d)$/))) ops.push(['kid', +m[1]]);
    else if ((m = t.match(/^kidtrait:(\w+)$/))) ops.push(['kt', m[1]]);
    else if ((m = t.match(/^npc:(\w+):(\w+)$/))) ops.push(['npc', m[1], m[2]]);
    else err(`${ctx}: bad effect token "${t}"`);
  }
  return ops;
}
const checkAdd = (add, ctx) => { for (const k of Object.keys(add || {})) { const [a, b] = k.includes('.') ? k.split('.') : ['s', k]; const ok = a === 's' ? STAT.includes(b) : a === 'u' ? USTAT.includes(b) : a === 'n' ? NSTAT.includes(b) : a === 'r' ? ROLES.includes(b) : false; if (!ok) err(`${ctx}: bad check key ${k}`); } };
const srcObj = (arr, ctx) => (arr || []).map(x => typeof x === 'string' ? (SRC[x] ? { key: x, ...SRC[x] } : (err(`${ctx}: unknown src ${x}`), null)) : x).filter(Boolean);

const histAll = [...HIST, ...ALT];
const HFLAGS = { h_soviet: ['soviet_in'], h_pearl: ['pacific_war'], h_0815: ['war_over'], h_surrender: ['war_over'], a_us_deal_45: ['war_over'], a_early_armistice: ['war_over'] };
for (const h of histAll) {
  h.setFlags = [...new Set([...(h.setFlags || []), ...(HFLAGS[h.id] || []), ...(h.endsWar ? ['war_over'] : [])])];
  if (h.date > '1945-08-15' && !h.final && h.id !== 'h_const_enforce') h.not = [...new Set([...(h.not || []), 'alt_us_deal', 'alt_early_peace'])];
  if (h.id === 'h_const_enforce') h.not = [...new Set([...(h.not || []), 'alt_us_deal', 'alt_early_peace'])];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(h.date)) err(`${h.id}: bad date`);
  if (h.hist === '史実' && !(h.sources || []).length) err(`${h.id}: 史実 without sources`);
  if (h.hist === '改変' && (!h.cause || !(h.flags || []).length)) err(`${h.id}: 改変 needs cause+flags`);
  for (const l of h.news || []) if (!SPEAKERS[l.sp] && !REAL.find(p => p.id === l.sp)) err(`${h.id}: unknown speaker ${l.sp}`);
}
const events = [...CHINA, ...MANCHU, ...PACIFIC, ...PHIL, ...HOME_CHAIN, ...ROMANCE, ...CIV, ...HOME_POOL, ...MIL, ...FRONT_TAIL, ...CMD, ...STATE, ...POST, ...ALM_CIV, ...ALM_MIL];
const ids = new Set();
for (const r of [...histAll, ...events, ...REAL, ...REGIONS, ...PRICES, ...GLOSSARY]) { if (ids.has(r.id)) err(`duplicate id ${r.id}`); ids.add(r.id); }
const evIds = new Set(events.map(e => e.id)), hIds = new Set(histAll.map(h => h.id));
const MEDIA_REAL = JSON.parse(fs.readFileSync(new URL('./media-real.json', import.meta.url), 'utf8'));
const PHOTO_KEYS = new Set(MEDIA_REAL.photos.map(p => p.key)), CLIP_KEYS = new Set(MEDIA_REAL.clips.map(p => p.key));
// Per-card real-media assignments (generated by scripts/assign-media.mjs, curated keyword→photo mapping). Source fields win.
if (!process.env.NO_ASSIGN && fs.existsSync(new URL('./media-assign.json', import.meta.url))) {
  const AS = JSON.parse(fs.readFileSync(new URL('./media-assign.json', import.meta.url), 'utf8'));
  for (const x of [...events, ...histAll]) { const a = AS[x.id]; if (!a || x.img || x.clip) continue; if (a.img) x.img = a.img; if (a.clip) x.clip = a.clip; }
}
for (const h of histAll) { if (h.img && !PHOTO_KEYS.has(h.img)) err(`${h.id}: unknown img ${h.img}`); if (h.clip && !CLIP_KEYS.has(h.clip)) err(`${h.id}: unknown clip ${h.clip}`); }
const ARTS = ['title', 'village', 'factory', 'station', 'barracks', 'navy', 'airfield', 'refugees', 'airraid', 'letters', 'council', 'hq', 'postwar', 'wedding', 'family', 'hospital', 'ration', 'couple'];
for (const e of events) {
  const c = e.cond; c.modes ||= ['civ', 'mil', 'cmd', 'state'];
  if (c.from && c.from.length === 7) c.from += '-01';
  if (c.to && c.to.length === 7) c.to += '-31';
  if (e.on && !hIds.has(e.on)) err(`${e.id}: on unknown hist ${e.on}`);
  if (c.on) { e.on = c.on; delete c.on; if (!hIds.has(e.on)) err(`${e.id}: on unknown hist ${e.on}`); }
  if (!ARTS.includes(e.art)) err(`${e.id}: bad art ${e.art}`);
  if (e.img && !PHOTO_KEYS.has(e.img)) err(`${e.id}: unknown img ${e.img}`);
  if (e.clip && !CLIP_KEYS.has(e.clip)) err(`${e.id}: unknown clip ${e.clip}`);
  for (const l of e.lines) if (!SPEAKERS[l.sp]) err(`${e.id}: unknown speaker ${l.sp}`);
  if (!e.choices?.length) err(`${e.id}: no choices`);
  e.sources = srcObj(e.sources, e.id);
  e.choices.forEach((ch, i) => {
    const ctx = `${e.id}#${i}`;
    if (!['safe', 'cost', 'gamble'].includes(ch.tone)) err(`${ctx}: tone`);
    ch.ops = parseEffects(ch.effects, ctx); delete ch.effects;
    if (ch.check) { checkAdd(ch.check.add, ctx); for (const k of ['win', 'lose']) if (ch[k]) { ch[k].ops = parseEffects(ch[k].e, ctx + k); delete ch[k].e; if (ch[k].later && !evIds.has(ch[k].later[1])) err(`${ctx}: later ${ch[k].later[1]}`); } }
    if (ch.later && !evIds.has(ch.later[1])) err(`${ctx}: later -> unknown ${ch.later[1]}`);
    if (ch.setOnSurvive) { ch.surviveOps = parseEffects(ch.setOnSurvive, ctx); delete ch.setOnSurvive; }
  });
}
// referenced-ness: an event is "referenced" when the engine can reach it: w>0 (pool), on-hook, auto, or target of a later.
const laterTargets = new Set(events.flatMap(e => e.choices.flatMap(ch => [ch.later?.[1], ch.win?.later?.[1], ch.lose?.later?.[1]].filter(Boolean))));
const internal = new Set(['civ_husband_fate', 'civ_death_notice', 'civ_husband_back', 'consc_exam', 'consc_enlist', 'consc_redpaper', 'fam_farewell', 'fam_reunion', 'fam_reunion_child', 'mil_demob', 'mil_siberia', 'mil_pow_camp', 'col_settler_1945', 'fam_parents_object', 'post_return_kid', 'cmd_trust_crisis', 'rom_parents_object', 'mil_tokko_ask', 'cmd_tokko_order']);
for (const e of events) {
  const reach = (e.cond.w ?? 1) > 0 || e.on || e.cond.auto || laterTargets.has(e.id) || internal.has(e.id);
  if (!reach) err(`${e.id}: unreachable (w=0, no hook/later)`);
}
const data = {
  version: 1, built: new Date().toISOString(), speakers: SPEAKERS, items: ITEMS,
  hist: histAll.sort((a, b) => a.date.localeCompare(b.date)), events, people: REAL, npc: NPC,
  settings: { backgrounds: BACKGROUNDS, milStarts: MIL_STARTS, cmdStarts: CMD_STARTS, ranks: RANKS, regions: REGIONS, prices: PRICES, glossary: GLOSSARY },
  sources: SRC,
};
if (errs.length) { console.error(errs.join('\n')); console.error(`\n${errs.length} content errors`); process.exit(1); }
fs.mkdirSync(root + 'src/data', { recursive: true });
fs.writeFileSync(root + 'src/data/content.json', JSON.stringify(data));
console.log(`content ok: hist ${histAll.length}, events ${events.length}, people ${REAL.length}, regions ${REGIONS.length}, glossary ${GLOSSARY.length}`);
