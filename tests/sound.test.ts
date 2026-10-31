import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import D from '../src/data/content.json';
import { pickSound, SFX_IDS } from '../src/ui/soundmap';
import { AUDIO_CREDITS } from '../src/ui/audio-credits';
const MOODS = ['title', 'home', 'night', 'tension', 'battle', 'grief', 'gunkan', 'kimigayo'];
describe('sound', () => {
  it('every SFX and BGM file exists in ogg+mp3', () => {
    for (const id of SFX_IDS) for (const e of ['ogg', 'mp3']) expect(existsSync(`public/audio/sfx/${id}.${e}`), id + e).toBe(true);
    for (const m of MOODS) for (const e of ['ogg', 'mp3']) expect(statSync(`public/audio/bgm/${m}.${e}`).size).toBeGreaterThan(1000);
  });
  it('every card gets known SFX and a mood', () => {
    for (const e of (D as any).events) { const p = pickSound({ kind: 'event', ev: e, lines: e.lines }, 'civ'); expect(p.sfx.length).toBeGreaterThan(0); p.sfx.forEach(s => expect(SFX_IDS as readonly string[]).toContain(s)); expect(MOODS).toContain(p.mood); }
  });
  it('combat scenes get combat sound', () => {
    const p = pickSound({ kind: 'event', ev: { art: 'refugees' }, lines: [{ t: '機関銃の音。突撃！' }] }, 'mil');
    expect(p.sfx).toContain('mg'); expect(p.mood).toBe('battle');
    expect(pickSound({ kind: 'event', ev: {}, lines: [{ t: '空襲警報。B-29の編隊。' }] }, 'civ').sfx.slice(0, 2)).toEqual(['siren', 'bombers']);
  });
  it('recorded audio is credited with a free license', () => {
    for (const c of AUDIO_CREDITS) expect(['Public domain', 'CC0', 'CC BY 4.0']).toContain(c.license);
  });
});
