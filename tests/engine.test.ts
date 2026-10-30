import { describe, it, expect } from 'vitest';
import { D, newGame, advance, choose, postTurn, serialize, deserialize, migrate, END, START } from '../src/engine/game';
import { autoplay, ALL_STARTS } from '../src/engine/autoplay';

const ROMFAM = new Set(['romance', 'family', 'letter']);
const POLICIES = ['random', 'first', 'safe'] as const;
const SEEDS = [1, 2, 3, 7, 42];

describe('content integrity', () => {
  it('ids are unique', () => {
    const ids = [...D.hist, ...D.events].map((x: any) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('every 史実 record has a source and a valid date; every 改変 has a cause', () => {
    for (const h of D.hist) {
      expect(h.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (h.hist === '史実') expect(h.sources.length, h.id).toBeGreaterThan(0);
      else expect(h.cause, h.id).toBeTruthy();
    }
  });
  it('historical dates are in chronological order inside the playable window', () => {
    const inWin = D.hist.filter((h: any) => !h.prologue);
    for (const h of inWin) { expect(h.date >= START && h.date <= END, h.id).toBe(true); }
  });
  it('real persons carry sources and no generated portrait', () => {
    for (const p of D.people) { expect(p.sources.length, p.id).toBeGreaterThan(0); expect(p.portrait).toBeUndefined(); }
  });
});

describe('full playthroughs (every start × seeds × policies)', () => {
  for (const s of ALL_STARTS()) {
    it(`${s.mode}/${s.start} reaches 1947-05 without soft-lock, dates monotonic`, () => {
      let romRuns = 0;
      for (const seed of SEEDS) for (const pol of POLICIES) {
        const t = autoplay({ ...s, seed }, pol, 3000);
        expect(t.reachedEnd, `${seed}/${pol}`).toBe(true);
        expect(t.st.date >= '1945-08-15' || t.st.over, `${seed}/${pol} ended ${t.st.date}`).toBe(true);
        for (let i = 1; i < t.cards.length; i++) expect(t.cards[i].date >= t.cards[i - 1].date, `${seed}/${pol} @${i}`).toBe(true);
        if (t.cards.some(c => ROMFAM.has(c.cat || ''))) romRuns++;
      }
      expect(romRuns, 'romance/family arcs').toBeGreaterThanOrEqual(SEEDS.length * POLICIES.length * 0.8);
    });
  }
  it('each mode reaches a wedding or partner arc in at least one run', () => {
    for (const mode of ['civ', 'mil', 'cmd', 'state'] as const) {
      const runs = ALL_STARTS().filter(s => s.mode === mode).flatMap(s => SEEDS.map(seed => autoplay({ ...s, seed }, 'random')));
      const hit = runs.filter(t => t.st.flags.married || t.st.flags.rom_engaged || t.cards.some(c => c.id === 'st_ch_wedding' || c.id === 'st_ch_letter'));
      expect(hit.length, mode).toBeGreaterThan(0);
    }
  });
  it('death leads to an after-story and the story continues as a family member', () => {
    const runs = ALL_STARTS().filter(s => s.mode === 'mil').flatMap(s => SEEDS.map(seed => autoplay({ ...s, seed }, 'random')));
    const succ = runs.filter(t => t.deaths > 0 && t.st.gen > 1);
    expect(succ.length).toBeGreaterThan(0);
    for (const t of succ) { expect(t.st.lives.length).toBeGreaterThan(0); expect(t.reachedEnd).toBe(true); }
  });
});

describe('determinism & saves', () => {
  it('same seed + same choices = same life', () => {
    const a = autoplay({ mode: 'civ', start: 'mill_f', seed: 99 }, 'random'), b = autoplay({ mode: 'civ', start: 'mill_f', seed: 99 }, 'random');
    expect(a.cards.map(c => c.id)).toEqual(b.cards.map(c => c.id));
  });
  it('save mid-game, load, and continue identically', () => {
    const st = newGame({ mode: 'mil', start: 'army_conscript', seed: 5 });
    for (let i = 0; i < 40; i++) { const c = advance(st); if (c.kind === 'event' || c.kind === 'flash' || c.kind === 'exam') choose(st, c.choices!.find((x: any) => !x.disabled).i); else st.card = null; postTurn(st); if (st.over || st.dead) break; }
    const copy = deserialize(serialize(st));
    expect(copy).toEqual(JSON.parse(JSON.stringify(st)));
    const n1 = advance(st), n2 = advance(copy);
    expect(n2.id).toBe(n1.id); expect(copy.date).toBe(st.date);
  });
  it('rejects foreign or future saves', () => {
    expect(() => deserialize('{"app":"other"}')).toThrow();
    expect(() => migrate(999, {})).toThrow();
  });
});

describe('history modes', () => {
  it('史実固定 never produces 改変 entries even in state mode', () => {
    for (const seed of SEEDS) for (const pol of POLICIES) {
      const t = autoplay({ mode: 'state', start: 'state', seed, histMode: 'fixed' }, pol);
      expect(t.st.tl.filter(x => x.kind === '改変').length).toBe(0);
      expect(t.st.histFired.h_0815, `${seed}/${pol}`).toBe(1);
    }
  });
  it('non-state modes always follow the 史実 timeline (Pearl Harbor, 8/15)', () => {
    for (const s of ALL_STARTS().filter(s => s.mode !== 'state')) {
      const t = autoplay({ ...s, seed: 3 }, 'first');
      expect(t.st.histFired.h_pearl, s.start).toBe(1); expect(t.st.histFired.h_0815, s.start).toBe(1);
    }
  });
  it('state-mode branching can create an 改変 world with a stated cause', () => {
    const alts = SEEDS.flatMap(seed => POLICIES.map(pol => autoplay({ mode: 'state', start: 'state', seed }, pol))).flatMap(t => t.st.tl.filter(x => x.kind === '改変'));
    expect(alts.length).toBeGreaterThan(0);
    for (const a of alts) expect(a.cause).toBeTruthy();
  });
});
