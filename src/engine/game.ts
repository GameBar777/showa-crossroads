import DATA from '../data/content.json';
import { addMonths, ageAt, monthIndex, monthsBetween, yearOf } from './date';
import { chance, hashSeed, next, pick, weighted } from './rng';

export const D: any = DATA;
export const START = '1936-02-20';
export const END = '1947-05-03';
export const SAVE_VERSION = 1;
export type Mode = 'civ' | 'mil' | 'cmd' | 'state';
const EV: Record<string, any> = Object.fromEntries(D.events.map((e: any) => [e.id, e]));
const HI: Record<string, any> = Object.fromEntries(D.hist.map((h: any) => [h.id, h]));
const ON: Record<string, any[]> = {};
for (const e of D.events) if (e.on) (ON[e.on] ||= []).push(e);
const LATER = new Set<string>(D.events.flatMap((e: any) => e.choices.flatMap((c: any) => [c.later?.[1], c.win?.later?.[1], c.lose?.later?.[1]].filter(Boolean))));
const AUTO = D.events.filter((e: any) => !e.on && (e.cond.auto || ((e.cond.w ?? 1) === 0 && !LATER.has(e.id))));
const POOL = D.events.filter((e: any) => !e.on && (e.cond.w ?? 1) > 0 && !e.cond.auto);
export const getEvent = (id: string) => EV[id];
export const getHist = (id: string) => HI[id];

export interface Npc { id: string; role: string; name: string; sex: 'm' | 'f'; birth: string; rel: number; alive: boolean; trait?: string; wish?: string; job?: string; kidTrait?: string }
export interface State {
  v: number; seed: number; rng: number; mode: Mode; start: string; histMode: 'branch' | 'fixed'; date: string;
  p: { name: string; sex: 'm' | 'f'; birth: string; bg: string; branch?: string; rank: number; place: string; label: string; grade?: string };
  s: Record<string, number>; u: Record<string, number> | null; n: Record<string, number>;
  npcs: Record<string, Npc>; kids: Npc[]; flags: Record<string, number>; items: string[];
  fired: Record<string, string>; histFired: Record<string, 1>; queue: { at: string; id: string; from: { date: string; label: string; ev: string } }[];
  tl: { date: string; kind: '史実' | '改変' | '人生'; title: string; id: string; cause?: string }[];
  log: { date: string; id: string; choice: string }[]; lives: any[]; gen: number; over: boolean; dead: any; turns: number; card: any; lastMonth: number;
}
const clamp = (x: number, a = 0, b = 100) => Math.max(a, Math.min(b, x));
const has = (st: State, f: string) => !!st.flags[f];

function mkNpc(st: State, role: string, sex: 'm' | 'f', birthY: number, extra: Partial<Npc> = {}): Npc {
  const fam = pick(st, D.npc.family), given = pick(st, sex === 'm' ? D.npc.maleGiven : D.npc.femaleGiven);
  return { id: role + '_' + Math.floor(next(st) * 1e6), role, name: `${fam} ${given}`, sex, birth: `${birthY}-0${1 + Math.floor(next(st) * 9)}-1${Math.floor(next(st) * 9)}`, rel: 40, alive: true, ...extra };
}
export interface NewOpts { mode: Mode; start: string; sex?: 'm' | 'f'; name?: string; seed?: number | string; histMode?: 'branch' | 'fixed' }
export function newGame(o: NewOpts): State {
  const seed = typeof o.seed === 'string' ? hashSeed(o.seed) : (o.seed ?? (Date.now() >>> 0));
  const set = D.settings;
  const st: State = { v: SAVE_VERSION, seed, rng: seed, mode: o.mode, start: o.start, histMode: o.histMode || 'branch', date: START,
    p: { name: '', sex: 'm', birth: '1915-05-01', bg: o.start, rank: 0, place: '東京', label: '' },
    s: { hp: 80, yen: 50, spirit: 60, bond: 30, rep: 40, consc: 60 }, u: null,
    n: { cab: 45, army: 70, navy: 55, elders: 55, privy: 50, diet: 40, opinion: 50, intl: 40, econ: 50, war: 10 },
    npcs: {}, kids: [], flags: {}, items: [], fired: {}, histFired: {}, queue: [], tl: [], log: [], lives: [], gen: 1, over: false, dead: null, turns: 0, card: null, lastMonth: monthIndex(START) };
  let sex: 'm' | 'f' = o.sex || 'm', birthY = 1915;
  if (o.mode === 'civ') { const b = set.backgrounds.find((x: any) => x.id === o.start) || set.backgrounds[0]; sex = b.sex; birthY = b.birth; st.p.place = b.place; st.p.label = b.label; st.s.yen = b.yen; st.p.bg = b.id; }
  else if (o.mode === 'mil') { const b = set.milStarts.find((x: any) => x.id === o.start) || set.milStarts[0]; sex = 'm'; birthY = b.birth; st.p.branch = b.branch; st.p.rank = b.rank; st.p.label = b.label; st.p.place = b.branch.startsWith('navy') ? '呉' : '東京'; st.flags.in_service = 1; st.s.yen = 20; }
  else if (o.mode === 'cmd') { const b = set.cmdStarts.find((x: any) => x.id === o.start) || set.cmdStarts[0]; sex = 'm'; birthY = b.birth; st.p.branch = b.branch; st.p.rank = b.rank; st.p.label = b.label; st.s.yen = 120; st.s.rep = 55;
    st.u = { men: b.men, morale: 60, supply: 60, train: 55, fatigue: 20, trust: 50 }; st.flags.in_service = 1; }
  else { st.p.label = '宮中・国家中枢'; st.p.place = '東京'; birthY = 1901; }
  st.p.sex = sex; st.p.birth = `${birthY}-05-01`;
  st.p.name = o.name || (o.mode === 'state' ? '（あなた）' : mkNpc(st, 'me', sex, birthY).name);
  const fam = st.p.name.split(' ')[0];
  const ps: 'm' | 'f' = sex === 'm' ? 'f' : 'm';
  const tr: any = pick(st, D.npc.traits), wi: any = pick(st, D.npc.wishes);
  st.npcs.partner = mkNpc(st, 'partner', o.mode === 'state' ? 'm' : ps, birthY + (ps === 'f' ? 2 : -2), { trait: tr.id, wish: wi.id, job: wi.job });
  st.npcs.mother = { ...mkNpc(st, 'mother', 'f', birthY - 26), name: fam + ' ' + pick(st, D.npc.femaleGiven), rel: 60 };
  st.npcs.father = { ...mkNpc(st, 'father', 'm', birthY - 29), name: fam + ' ' + pick(st, D.npc.maleGiven), rel: 50 };
  st.npcs.friend = mkNpc(st, 'friend', sex, birthY, { rel: 45 });
  st.npcs.boss = mkNpc(st, 'boss', 'm', birthY - 15);
  st.npcs.sib = { ...mkNpc(st, 'sib', next(st) < 0.5 ? 'm' : 'f', birthY + 3), name: '' };
  st.npcs.sib.name = fam + ' ' + pick(st, st.npcs.sib.sex === 'm' ? D.npc.maleGiven : D.npc.femaleGiven);
  if (o.mode === 'cmd') { st.flags.rom_met = st.flags.rom_court = st.flags.rom_engaged = st.flags.married = 1; st.npcs.partner.rel = 60; addKid(st, 1930); }
  if (o.mode === 'mil' && st.p.rank >= 5) { st.flags.rom_met = 1; }
  if (o.mode === 'civ' && ageAt(st.p.birth, START) >= 21 && sex === 'm') { examine(st, true); }
  for (const h of D.hist) if (h.prologue) { st.histFired[h.id] = 1; st.tl.push({ date: h.date, kind: '史実', title: h.title, id: h.id }); }
  return st;
}
function addKid(st: State, y?: number) {
  const sex: 'm' | 'f' = next(st) < 0.5 ? 'm' : 'f';
  const k = mkNpc(st, 'child', sex, y || yearOf(st.date), { kidTrait: pick(st, D.npc.kidTraits), rel: 50 });
  k.name = st.p.name.split(' ')[0] + ' ' + k.name.split(' ')[1]; if (!y) k.birth = st.date;
  st.kids.push(k); st.npcs.child = st.kids[0];
}
// ---------- conditions ----------
export const age = (st: State) => ageAt(st.p.birth, st.date);
function kidAge(st: State) { const k = st.kids.find(k => k.alive); return k ? ageAt(k.birth, st.date) : -1; }
function statVal(st: State, k: string): number {
  if (k.startsWith('u.')) return st.u?.[k.slice(2)] ?? 50;
  if (k.startsWith('n.')) return st.n[k.slice(2)] ?? 50;
  if (k.startsWith('r.')) return st.npcs[k.slice(2)]?.rel ?? 0;
  return st.s[k] ?? 0;
}
export function eligible(st: State, e: any, ignoreOnce = false): boolean {
  const c = e.cond;
  if (!c.modes.includes(st.mode)) return false;
  if (c.sex && c.sex !== st.p.sex) return false;
  if (c.from && st.date < c.from) return false;
  if (c.to && st.date > c.to) return false;
  if (c.flags && !c.flags.every((f: string) => has(st, f))) return false;
  if (c.any && !c.any.some((f: string) => has(st, f))) return false;
  if (c.not && c.not.some((f: string) => has(st, f))) return false;
  if (c.bg && !c.bg.includes(st.p.bg)) return false;
  if (c.branch && !c.branch.includes(st.p.branch)) return false;
  if (c.age) { const a = age(st); if (a < c.age[0] || a > c.age[1]) return false; }
  if (c.kidAge) { const a = kidAge(st); if (a < c.kidAge[0] || a > c.kidAge[1]) return false; }
  if (e.items && !e.items.every((i: string) => st.items.includes(i))) return false;
  if (c.items && !c.items.every((i: string) => st.items.includes(i))) return false;
  if (c.stat) for (const [k, [a, b]] of Object.entries<any>(c.stat)) { const v = statVal(st, k); if (v < a || v > b) return false; }
  if (e.onlyIf?.place && !e.onlyIf.place.includes(st.p.place)) return false;
  if (c.modes.length === 1 && c.modes[0] === 'cmd' && !st.u) return false;
  if (!ignoreOnce) {
    const last = st.fired[e.id];
    if (last) { if (!c.cd) return false; if (monthsBetween(last, st.date) < c.cd) return false; }
  }
  return true;
}
function histOk(st: State, h: any) {
  if (st.histFired[h.id]) return false;
  if (h.hist === '改変') return h.flags.every((f: string) => has(st, f));
  if (h.not && h.not.some((f: string) => has(st, f))) return false;
  return true;
}
// ---------- text ----------
export function fill(st: State, s: string): string {
  const pw = D.npc.wishes.find((w: any) => w.id === st.npcs.partner?.wish);
  const k = st.kids.find(k => k.alive);
  return s.replace(/\{(\w+)\}/g, (_, k2) => {
    switch (k2) {
      case 'partner': return st.npcs.partner?.name.split(' ')[1] || '';
      case 'child': return k?.name.split(' ')[1] || 'こども';
      case 'friend': return st.npcs.friend?.name.split(' ')[1] || '友';
      case 'boss': return (st.npcs.boss?.name.split(' ')[0] || '') + 'さん';
      case 'mother': return '母'; case 'father': return '父'; case 'me': return st.p.name;
      case 'pwish': return pw?.text || '自分の仕事を持ちたい'; case 'pjob': return pw?.job || '仕事';
      case 'ctrait': return k?.kidTrait || '元気な';
      case 'rice': { const p = D.settings.prices.find((x: any) => x.year === yearOf(st.date)) || D.settings.prices[0]; return String(Math.round(p.rice10kg * 100 / 6.67)); }
    }
    return '';
  });
}
// ---------- effects ----------
export interface Delta { k: string; label: string; v: number }
const LBL: Record<string, string> = { hp: '体力', yen: '円', spirit: '気力', bond: '絆', rep: '評判', consc: '良心', men: '兵員', morale: '士気', supply: '補給', train: '練度', fatigue: '疲労', trust: '信頼', cab: '内閣', army: '陸軍', navy: '海軍', elders: '重臣', privy: '枢密院', diet: '議会', opinion: '世論', intl: '国際', econ: '経済', war: '戦火' };
function setFlag(st: State, f: string, v: number) {
  if (st.histMode === 'fixed' && f.startsWith('alt_')) return;
  if (v) st.flags[f] = 1; else delete st.flags[f];
}
export function applyOps(st: State, ops: any[], deltas: Delta[]) {
  for (const o of ops) {
    switch (o[0]) {
      case 's': st.s[o[1]] = o[1] === 'yen' ? st.s.yen + o[2] : clamp(st.s[o[1]] + o[2]); deltas.push({ k: o[1], label: LBL[o[1]], v: o[2] }); break;
      case 'u': if (st.u) { st.u[o[1]] = clamp(st.u[o[1]] + o[2], 0, o[1] === 'men' ? 999 : 100); deltas.push({ k: o[1], label: LBL[o[1]], v: o[2] }); } break;
      case 'n': st.n[o[1]] = clamp(st.n[o[1]] + o[2]); deltas.push({ k: 'n.' + o[1], label: LBL[o[1]], v: o[2] }); break;
      case 'r': { const n = st.npcs[o[1]]; if (n) { n.rel = clamp(n.rel + o[2]); deltas.push({ k: 'r.' + o[1], label: fill(st, `{${o[1]}}`) || o[1], v: o[2] }); } break; }
      case 'f': setFlag(st, o[1], o[2]); if (o[1] === 'married' && o[2]) lifeTl(st, '結婚'); if (o[1] === 'rom_engaged' && o[2]) lifeTl(st, '婚約'); break;
      case 'item': if (!st.items.includes(o[1])) { st.items.push(o[1]); deltas.push({ k: 'item', label: '🎁 ' + fill(st, D.items[o[1]]), v: 0 }); } break;
      case 'kid': addKid(st); lifeTl(st, (o[1] === 1 ? '第一子' : '第二子') + '誕生'); break;
      case 'kt': { const k = st.kids[0]; if (k) k.kidTrait = ({ curious: '本の好きな', bold: '外遊びの好きな', gentle: '絵の上手な' } as any)[o[1]] || k.kidTrait; break; }
      case 'npc': { const n = st.npcs[o[1]]; if (n && o[2] === 'dead') n.alive = false; break; }
      case 'rank': st.p.rank += o[1]; deltas.push({ k: 'rank', label: '階級', v: o[1] }); break;
    }
  }
}
const lifeTl = (st: State, title: string) => st.tl.push({ date: st.date, kind: '人生', title, id: 'life_' + st.tl.length });
// ---------- monthly simulation ----------
const REDPAPER: Record<number, number> = { 1936: 0.002, 1937: 0.03, 1938: 0.02, 1939: 0.015, 1940: 0.015, 1941: 0.03, 1942: 0.025, 1943: 0.035, 1944: 0.06, 1945: 0.08 };
function priceIdx(st: State) { const p = D.settings.prices.find((x: any) => x.year === yearOf(st.date)) || D.settings.prices.at(-1); return p.rice10kg / 2.5; }
function examine(st: State, silent = false) {
  const r = next(st) + (st.s.hp - 70) / 200;
  const g = r > 0.55 ? '甲種' : r > 0.3 ? '第一乙種' : r > 0.15 ? '第二乙種' : r > 0.04 ? '丙種' : '丁種';
  st.p.grade = g; st.flags.examined = 1;
  const y = yearOf(st.date);
  const pEnlist = g === '甲種' ? (y >= 1941 ? 0.95 : y >= 1937 ? 0.7 : 0.45) : g === '第一乙種' ? (y >= 1941 ? 0.6 : 0.2) : 0;
  if (!silent && chance(st, pEnlist)) st.flags.to_barracks = 1;
  else if (g !== '丁種') st.flags.reserve = 1;
  return g;
}
function monthTick(st: State) {
  const y = yearOf(st.date), pi = priceIdx(st);
  // economy
  const base = st.mode === 'civ' ? (D.settings.backgrounds.find((b: any) => b.id === st.p.bg)?.yen ?? 40) * 0.09 : st.mode === 'state' ? 0 : 3 + st.p.rank * 0.8;
  const inflate = y >= 1946 ? Math.pow(pi, 0.85) : 1;
  const cost = st.mode === 'state' ? 0 : 1.6 * pi * (st.flags.deployed ? 0.4 : 1) * (1 + (has(st, 'married') ? 0.5 : 0) + st.kids.filter(k => k.alive).length * 0.3);
  st.s.yen = Math.round((st.s.yen + base * inflate * (has(st, 'p_working') ? 1.3 : 1) - cost) * 10) / 10;
  if (st.s.yen < 0 && st.mode !== 'state') { st.s.hp = clamp(st.s.hp - 2); st.s.spirit = clamp(st.s.spirit - 2); st.s.yen = 0; }
  if (y >= 1944 && st.mode !== 'state' && !has(st, 'war_over')) st.s.hp = clamp(st.s.hp - 0.5);
  if (st.s.hp < 70 && (has(st, 'war_over') || y < 1942)) st.s.hp = clamp(st.s.hp + 1);
  // conscription (civilian men)
  if (st.mode === 'civ' && st.p.sex === 'm' && !has(st, 'deployed')) {
    const a = age(st);
    const minAge = y >= 1944 ? 19 : 20;
    const studentDefer = st.p.bg === 'student_m' && !has(st, 'gakuto');
    if (!has(st, 'examined') && a >= minAge && !studentDefer) st.flags.exam_due = 1;
    if (has(st, 'reserve') && !has(st, 'war_over') && !has(st, 'alt_us_deal_peace')) {
      let p = REDPAPER[y] ?? 0;
      if (st.p.grade === '丙種') p *= y >= 1944 ? 0.8 : 0.15;
      if (st.p.grade === '第二乙種') p *= y >= 1942 ? 0.8 : 0.4;
      if (has(st, 'defer_job')) p *= 0.3;
      if (a > 35) p *= 0.5; if (a > 40) p *= 0.3;
      if (has(st, 'alt_us_deal') || has(st, 'alt_china_truce')) p *= 0.35;
      if (chance(st, p)) st.flags.redpaper_due = 1;
    }
  }
  if (st.mode === 'mil' && st.flags.at_front === undefined && st.date >= '1937-10-01' && !has(st, 'alt_china_truce') && st.p.branch === 'army') { /* handled by auto event */ }
  // promotions
  if ((st.mode === 'mil' || st.mode === 'cmd') && st.s.rep > 60 && chance(st, 0.025)) { st.p.rank += 1; st.s.rep -= 10; lifeTl(st, '昇進：' + rankName(st)); }
  // unit drift
  if (st.u) { const u = st.u; u.fatigue = clamp(u.fatigue - 3); u.supply = clamp(u.supply - (y >= 1943 ? 4 : 1) + (has(st, 'war_over') ? 5 : 0)); u.morale = clamp(u.morale + Math.sign(u.trust - u.morale)); if (u.supply < 20) { u.men = Math.max(0, u.men - 3); u.morale = clamp(u.morale - 3); } }
  // nation drift
  if (st.mode === 'state') { const n = st.n; if (!has(st, 'war_over')) { n.econ = clamp(n.econ - (n.war > 50 ? 1 : 0)); n.opinion = clamp(n.opinion + (n.war > 60 ? -0.5 : 0)); } }
  // NPC aging & independent life
  const p = st.npcs.partner;
  if (p && p.alive && has(st, 'married') && has(st, 'p_wish_ok') && !has(st, 'p_working') && chance(st, 0.03)) { st.flags.p_working = 1; }
  if (st.npcs.father?.alive && ageAt(st.npcs.father.birth, st.date) > 60 && chance(st, 0.004)) st.flags.father_frail = 1;
}
export const rankName = (st: State) => { const R = D.settings.ranks[st.p.branch || 'army']; return R[Math.min(R.length - 1, st.p.rank)]; };
function setDate(st: State, d: string) {
  if (d < st.date) return; st.date = d;
  const mi = monthIndex(d);
  while (st.lastMonth < mi) { st.lastMonth++; monthTick(st); }
}
// ---------- turn flow ----------
const STEP: Record<Mode, number> = { civ: 1, mil: 1, cmd: 1, state: 2 };
export interface Card { kind: 'event' | 'news' | 'flash' | 'death' | 'end' | 'exam'; id?: string; hist?: any; ev?: any; from?: any; lines: any[]; choices?: any[]; more?: any[] }
function evCard(st: State, e: any, hist?: any, from?: any): Card {
  const ch = e.choices.map((c: any, i: number) => ({ i, icon: c.icon, label: fill(st, c.label), tone: c.tone, risky: !!c.risk, check: !!c.check, disabled: (c.need && !c.need.every((f: string) => has(st, f))) || (c.need_rel && Object.entries<any>(c.need_rel).some(([k, v]) => (st.npcs[k]?.rel ?? 0) < v)) }));
  if (ch.every((c: any) => c.disabled)) ch.forEach((c: any) => (c.disabled = false));
  return { kind: from ? 'flash' : 'event', id: e.id, ev: e, hist, from, lines: e.lines.map((l: any) => ({ ...l, t: fill(st, l.t) })), choices: ch };
}
function fireHist(st: State, h: any) {
  st.histFired[h.id] = 1; setDate(st, h.date);
  for (const f of h.setFlags || []) st.flags[f] = 1;
  st.tl.push({ date: h.date, kind: h.hist as any, title: h.title, id: h.id, cause: h.cause });
}
export function advance(st: State): Card {
  if (st.card) return st.card;
  st.turns++;
  if (st.over) return (st.card = endCard(st));
  for (let guard = 0; guard < 400; guard++) {
    if (st.date >= END) { st.over = true; return (st.card = endCard(st)); }
    // 1) engine-driven triggers
    if (has(st, 'exam_due') && !has(st, 'examined')) { delete st.flags.exam_due; return (st.card = evCard(st, EV.consc_exam)); }
    // 2) auto events
    const auto = AUTO.find((e: any) => eligible(st, e));
    if (auto) { st.fired[auto.id] = st.date; return (st.card = evCard(st, auto)); }
    // 3) delayed consequences due
    const qi = st.queue.findIndex(q => q.at <= st.date);
    if (qi >= 0) { const q = st.queue.splice(qi, 1)[0]; const e = EV[q.id]; if (e && eligible(st, e)) { st.fired[e.id] = st.date; return (st.card = evCard(st, e, undefined, q.from)); } continue; }
    // 4) history within horizon
    const target = addMonths(st.date, STEP[st.mode]);
    const h = D.hist.find((h: any) => h.date <= (target > END ? END : target) && !h.prologue && histOk(st, h));
    if (h) {
      fireHist(st, h);
      const hook = (ON[h.id] || []).find((e: any) => eligible(st, e));
      if (hook) { st.fired[hook.id] = st.date; return (st.card = evCard(st, hook, h)); }
      if (h.final) { st.over = true; return (st.card = endCard(st)); }
      const more: any[] = [];
      while (more.length < 2) {
        const h2 = D.hist.find((x: any) => x.date <= (target > END ? END : target) && !x.prologue && histOk(st, x));
        if (!h2 || h2.final || (ON[h2.id] || []).some((e: any) => eligible(st, e))) break;
        fireHist(st, h2); more.push(h2);
      }
      return (st.card = { kind: 'news' as const, id: h.id, hist: h, more, lines: h.news.map((l: any) => ({ ...l, t: fill(st, l.t) })), choices: [{ i: 0, icon: '📰', label: '紙面を閉じる', tone: 'safe' }] });
    }
    // 5) pool event between now and target (choose a date inside the window)
    const q2 = st.queue.length ? st.queue.reduce((a, b) => (a.at < b.at ? a : b)).at : null;
    const t2 = q2 && q2 < target ? q2 : target;
    setDate(st, t2 > END ? END : t2);
    const cands = POOL.filter((e: any) => eligible(st, e)).map((e: any) => [e, (e.cond.w ?? 1) * (e.category === 'romance' || e.category === 'family' ? 1.4 : 1)] as [any, number]);
    if (cands.length && chance(st, 0.85)) { const e: any = weighted(st, cands.map(([x, w]) => [x, st.fired[x.id] ? w * 0.35 : w] as [any, number]))!; st.fired[e.id] = st.date; return (st.card = evCard(st, e)); }
  }
  st.over = true; return (st.card = endCard(st));
}
export interface Result { lines: string[]; deltas: Delta[]; ok?: boolean; died?: boolean; flashNote?: string }
export function choose(st: State, idx: number): Result {
  const card = st.card; if (!card) throw new Error('no card');
  st.card = null;
  const deltas: Delta[] = [], lines: string[] = [];
  if (card.kind === 'news' || !card.ev) { return { lines, deltas }; }
  const e = card.ev, c = e.choices[idx] ?? e.choices[0];
  st.log.push({ date: st.date, id: e.id, choice: c.label });
  applyOps(st, c.ops, deltas);
  let ok: boolean | undefined;
  let laterSpec = c.later;
  if (c.check) {
    let p = c.check.base;
    for (const [k, w] of Object.entries<any>(c.check.add || {})) p += w * (statVal(st, k) - 50);
    for (const [f, b] of Object.entries<any>(c.check.flagBonus || {})) if (has(st, f)) p += b;
    p = clamp(p, 5, 95); ok = next(st) * 100 < p;
    const br = ok ? c.win : c.lose;
    if (br) { applyOps(st, br.ops, deltas); if (br.res) lines.push(fill(st, br.res)); if (br.later) laterSpec = br.later; }
    else if (ok && c.res) lines.push(fill(st, c.res));
    if (ok && !c.win && c.res && lines.length === 0) lines.push(fill(st, c.res));
  } else if (c.res) lines.push(fill(st, c.res));
  if (laterSpec) st.queue.push({ at: addMonths(st.date, laterSpec[0]), id: laterSpec[1], from: { date: st.date, label: c.label, ev: e.id } });
  // special mechanics
  if (c.conscript === 'exam') { const g = examine(st); lines.push(`判定：${g}${has(st, 'to_barracks') ? '。現役兵として入営が決まった。' : g === '丁種' ? '。兵役免除。' : '。補充兵役・予備に編入。いつ赤紙が来るかは分からない。'}`); }
  if (e.id === 'consc_redpaper') delete st.flags.redpaper_due;
  if (c.become === 'mil') { st.mode = 'mil'; st.p.branch = 'army'; st.p.rank = 0; st.flags.in_service = 1; delete st.flags.to_barracks; delete st.flags.reserve; lifeTl(st, '入営'); }
  if (c.become === 'civ_post') { st.mode = 'civ'; delete st.flags.deployed; delete st.flags.at_front; delete st.flags.in_service; st.u = null; lifeTl(st, '復員'); }
  if (c.fate === 'partner') partnerFate(st, lines);
  if (c.fate === 'tokko') { if (addMonths(st.date, 1) < '1945-08-15') return die(st, '特別攻撃隊として出撃し、戻らなかった', lines, deltas); lines.push('出撃予定日の前に、戦争が終わった。'); delete st.flags.tokko; }
  if (c.risk) { const r = c.risk * (st.s.hp < 30 ? 1.6 : st.s.hp < 50 ? 1.2 : 1) * (st.mode === 'cmd' ? 0.5 : 1); if (next(st) * 100 < r) return die(st, causeOf(e), lines, deltas); if (c.surviveOps) applyOps(st, c.surviveOps, deltas); }
  if (st.mode !== 'state' && st.s.hp <= 0) return die(st, '飢えと病で体が持たなかった', lines, deltas);
  if (st.u && st.u.men <= 0) { st.u.men = 0; if (chance(st, 0.5)) return die(st, '部隊とともに', lines, deltas); lines.push('部隊は壊滅した。生き残ったのは、あなたを含めわずかだった。'); st.u.men = 20; }
  if (['rom_wedding', 'fam_birth', 'fam_reunion', 'civ_death_notice', 'civ_husband_back', 'fam_farewell', 'fam_resent_break', 'fam_parent_death'].includes(e.id) && !st.tl.some(t => t.id === 'ev_' + e.id)) st.tl.push({ date: st.date, kind: '人生', title: ({ rom_wedding: '婚礼', fam_birth: '子の誕生', fam_reunion: '再会', civ_death_notice: '戦死公報', civ_husband_back: '夫の帰還', fam_farewell: '出征の別れ', fam_resent_break: '夫婦の危機', fam_parent_death: '父の死' } as any)[e.id], id: 'ev_' + e.id });
  return { lines, deltas, ok };
}
function causeOf(e: any) {
  const m: Record<string, string> = { airraid: '空襲で', navy: '海で', airfield: '空で', refugees: '戦地で', barracks: '病で' };
  return m[e.art] ? m[e.art] + '命を落とした' : e.category === 'postwar' ? '戦後の窮乏の中で病に倒れた' : '命を落とした';
}
function partnerFate(st: State, lines: string[]) {
  const y = yearOf(st.date);
  const pDie = has(st, 'alt_us_deal') ? 0.12 : y >= 1944 ? 0.55 : y >= 1942 ? 0.4 : 0.25;
  if (chance(st, pDie)) { st.flags.partner_dead_notice = 1; st.npcs.partner.alive = false; lines.push('戦死の知らせだった。'); }
  else { lines.push('「所在不明・調査中」——生きているとも、死んだとも書いていない。'); st.flags.partner_wait = 1; }
}
// world flag hooks to resolve waiting partner when the war ends
export function postTurn(st: State) {
  if (has(st, 'war_over') && has(st, 'partner_wait') && !has(st, 'partner_back') && !has(st, 'partner_dead')) {
    if (!st.flags.pw_rolled) { st.flags.pw_rolled = 1; if (chance(st, 0.75)) st.flags.partner_back = 1; else { st.flags.partner_dead_notice = 1; st.npcs.partner.alive = false; } }
  }
  if (has(st, 'war_over') && st.mode === 'mil' && st.p.place !== '内地' && st.p.branch === 'army' && has(st, 'china_front') && !st.flags.ms_rolled) { st.flags.ms_rolled = 1; if (chance(st, 0.25)) st.flags.manchuria_post = 1; }
  if (has(st, 'manchuria_post') && st.fired.mil_siberia && !has(st, 'demobbed')) { delete st.flags.manchuria_post; }
}
// ---------- death & succession ----------
function die(st: State, cause: string, lines: string[], deltas: Delta[]): Result {
  st.dead = { cause, date: st.date, age: age(st), name: st.p.name, mode: st.mode, label: st.p.label };
  st.tl.push({ date: st.date, kind: '人生', title: `${st.p.name} 死去`, id: 'death_' + st.gen });
  st.card = { kind: 'death', lines: afterStory(st), choices: successors(st).map((s, i) => ({ i, icon: s.icon, label: s.label, tone: 'safe', succ: s.key })) };
  if (!st.card.choices!.length) st.card.choices = [{ i: 0, icon: '📖', label: '物語を閉じる', tone: 'safe', succ: 'none' }];
  return { lines, deltas, died: true };
}
export function afterStory(st: State): any[] {
  const p = st.npcs.partner, k = st.kids.find(k => k.alive), out: any[] = [];
  const pn = fill(st, '{partner}'), kn = fill(st, '{child}');
  const married = has(st, 'married') && p?.alive;
  out.push({ sp: 'narr', t: `${st.dead.date.replace(/-/g, '/')}　${st.p.name}、${st.dead.age}歳。${st.dead.cause}。` });
  if (married) {
    out.push({ sp: 'partner', t: '知らせを受けた日、わたしは洗濯物を取り込んでいました。' });
    if (st.items.includes('wedding_photo')) out.push({ sp: 'partner', t: '婚礼の写真を、ずっと鏡台の引き出しに入れています。' });
    if (st.items.includes('last_letter')) out.push({ sp: 'partner', t: '最後の手紙は、何百回読んだか分かりません。' });
    if (has(st, 'p_wish_ok')) out.push({ sp: 'partner', t: `あの人が「応援する」と言ってくれたから、わたしは今も${p.job || '仕事'}を続けています。` });
    if (has(st, 'p_resent')) out.push({ sp: 'partner', t: '言えずにいたことが、たくさんあった。今なら、もっと素直に話せたのに。' });
  } else if (has(st, 'rom_engaged') || has(st, 'rom_court')) out.push({ sp: 'partner', t: `${pn}は、のちに別の人と家庭を持った。それでも毎年、命日には花が届いたという。` });
  else if (has(st, 'regret_love')) out.push({ sp: 'narr', t: 'あの日、駅で見送った人は、この知らせを知らない。' });
  if (k) {
    out.push({ sp: 'child', t: `${kn}です。父（母）のことは、${ageAt(k.birth, st.date) < 6 ? 'ほとんど覚えていません' : 'よく覚えています'}。` });
    if (st.items.includes('child_drawing')) out.push({ sp: 'child', t: '遺品の手帳に、わたしの描いた絵が挟まっていました。' });
    if (st.items.includes('father_diary')) out.push({ sp: 'child', t: '祖父の帳面と一緒に、それを今も持っています。' });
    out.push({ sp: 'child', t: st.s.consc >= 60 ? 'あの時代に、それでも誰かに優しくあろうとした人だった、と聞いています。' : 'あの時代のことを、わたしは自分で調べ始めました。' });
  }
  if (!married && !k) out.push({ sp: 'mother', t: '……あの子の茶碗は、まだ棚にあります。' });
  return out;
}
export function successors(st: State) {
  const r: { key: string; label: string; icon: string }[] = [];
  if (has(st, 'married') && st.npcs.partner?.alive) r.push({ key: 'partner', label: `${fill(st, '{partner}')}として生きる`, icon: '💞' });
  const k = st.kids.find(k => k.alive); if (k) r.push({ key: 'child', label: `${fill(st, '{child}')}として生きる`, icon: '🧒' });
  if (st.npcs.friend?.alive) r.push({ key: 'friend', label: `友・${fill(st, '{friend}')}として生きる`, icon: '🤝' });
  if (st.npcs.sib?.alive) r.push({ key: 'sib', label: `${st.npcs.sib.sex === 'm' ? '弟' : '妹'}・${st.npcs.sib.name.split(' ')[1]}として生きる`, icon: '🫂' });
  return r;
}
export function succeed(st: State, key: string) {
  st.lives.push({ ...st.dead, gen: st.gen });
  if (key === 'none' || !key) { st.over = true; st.card = endCard(st); return; }
  const n = key === 'child' ? st.kids.find(k => k.alive)! : st.npcs[key];
  const prev = st.p;
  st.gen++; st.dead = null; st.mode = 'civ'; st.u = null;
  st.p = { name: n.name, sex: n.sex, birth: n.birth, bg: 'heir_' + key, rank: 0, place: prev.place, label: ({ partner: '遺された伴侶', child: '遺された子', friend: '遺された友', sib: '遺されたきょうだい' } as any)[key] };
  for (const f of ['deployed', 'at_front', 'in_service', 'china_front', 'south_front', 'tokko', 'to_barracks', 'reserve', 'redpaper_due', 'examined', 'call_up', 'farewell_done', 'p_resent', 'p_wish_denied', 'tokko_asked']) delete st.flags[f];
  st.s = { hp: 75, yen: Math.max(10, st.s.yen), spirit: 40, bond: st.s.bond, rep: 40, consc: st.s.consc };
  const old = { name: prev.name, sex: prev.sex, birth: prev.birth };
  if (key === 'partner') { st.flags.partner_dead = 1; st.npcs.partner = { ...st.npcs.partner, name: old.name, sex: old.sex, birth: old.birth, alive: false, rel: 80 }; st.flags.heir_partner = 1; }
  else if (key === 'child') { const pn = st.npcs.partner; st.kids = st.kids.filter(k => k !== n); st.npcs.child = st.kids[0]; delete st.flags.married; delete st.flags.rom_met; delete st.flags.rom_court; delete st.flags.rom_engaged; if (pn?.alive) st.npcs.mother = { ...pn, role: 'mother' }; st.npcs.partner = mkNpc(st, 'partner', n.sex === 'm' ? 'f' : 'm', yearOf(n.birth)); st.flags.heir_child = 1; for (const f of ['kid1', 'kid2', 'pregnant', 'pregnant2', 'omiai_done', 'omiai_yes', 'love_declared', 'rom_closed', 'regret_love']) delete st.flags[f]; }
  else if (key === 'sib') { st.npcs.sib = { ...st.npcs.sib, alive: false }; for (const f of ['married', 'rom_met', 'rom_court', 'rom_engaged', 'kid1', 'kid2', 'rom_closed', 'omiai_done', 'omiai_yes', 'regret_love', 'love_declared', 'pregnant', 'pregnant2']) delete st.flags[f]; st.kids = []; st.npcs.child = undefined as any; st.npcs.partner = mkNpc(st, 'partner', n.sex === 'm' ? 'f' : 'm', yearOf(n.birth)); st.flags.heir_sib = 1; }
  else { st.npcs.friend = { ...st.npcs.friend, name: old.name, alive: false }; for (const f of ['married', 'rom_met', 'rom_court', 'rom_engaged', 'kid1', 'kid2', 'rom_closed', 'omiai_done', 'omiai_yes', 'regret_love', 'love_declared', 'pregnant', 'pregnant2']) delete st.flags[f]; st.kids = []; st.npcs.child = undefined as any; st.npcs.partner = mkNpc(st, 'partner', n.sex === 'm' ? 'f' : 'm', yearOf(n.birth)); st.flags.heir_friend = 1; }
  st.tl.push({ date: st.date, kind: '人生', title: `${n.name} が物語を継ぐ`, id: 'heir_' + st.gen });
  st.card = null;
}
// ---------- ending ----------
function endCard(st: State): Card {
  const L: any[] = [{ sp: 'narr', t: '1947年5月3日。日本国憲法が施行された。' }];
  if (has(st, 'alt_us_deal')) L[0] = { sp: 'narr', t: '1947年5月3日。太平洋戦争の起きなかった世界。だが軍部と植民地支配は残り、別の課題が待っている。' };
  else if (has(st, 'alt_early_peace')) L.push({ sp: 'narr', t: '停戦が1944年末に成ったこの世界では、東京大空襲も、沖縄戦も、原爆投下も起きなかった。' });
  if (st.lives.length) L.push({ sp: 'narr', t: `この十年で、${st.lives.length}つの命が物語を受け渡した。` });
  if (has(st, 'married') && st.npcs.partner?.alive) L.push({ sp: 'partner', t: '……生きて、ここまで来たね。' });
  if (st.kids.some(k => k.alive)) L.push({ sp: 'child', t: 'わたしは、この時代のことを忘れない。' });
  if (st.items.length) L.push({ sp: 'narr', t: '残ったもの：' + st.items.map(i => fill(st, D.items[i])).join('、') });
  L.push({ sp: 'narr', t: st.s.consc >= 65 ? 'あなたは、あの時代の中で、できる限り人に優しくあろうとした。' : st.s.consc <= 35 ? 'あなたは、時代の流れに逆らわなかった。それが何を意味したのか、問いは残る。' : 'あなたは迷いながら、あの十年を生き抜いた。' });
  return { kind: 'end', lines: L, choices: [{ i: 0, icon: '🗺️', label: '年表で振り返る', tone: 'safe' }] };
}
// ---------- timeline comparison ----------
export function compareTimeline(st: State) {
  const real: any[] = D.hist.filter((h: any) => h.hist === '史実');
  return real.map((h: any) => {
    const happened = !!st.histFired[h.id];
    const alt = !happened && h.not ? D.hist.find((a: any) => a.hist === '改変' && st.histFired[a.id] && a.flags.some((f: string) => h.not.includes(f))) : null;
    return { date: h.date, title: h.title, happened, pending: !happened && h.date > st.date, alt: alt ? { title: alt.title, cause: alt.cause } : null };
  }).concat(D.hist.filter((a: any) => a.hist === '改変' && st.histFired[a.id]).map((a: any) => ({ date: a.date, title: a.title, happened: true, isAlt: true, cause: a.cause })))
    .sort((a: any, b: any) => a.date.localeCompare(b.date));
}
// ---------- save ----------
export const KEY = 'kiro10.save.v1';
export function serialize(st: State) { return JSON.stringify({ app: 'kiro-no-junen', v: SAVE_VERSION, st }); }
export function deserialize(s: string): State {
  const o = JSON.parse(s); if (o.app !== 'kiro-no-junen') throw new Error('このゲームのセーブデータではありません');
  return migrate(o.v, o.st);
}
export function migrate(v: number, st: any): State { if (v > SAVE_VERSION) throw new Error('新しいバージョンのセーブデータです'); st.v = SAVE_VERSION; st.queue ||= []; st.lives ||= []; return st; }
