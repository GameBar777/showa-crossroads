// 季節の場面（multi-stage scenes）. Compact DSL compiled into chained events.
// Block: "@YYYY-MM|title|hist(史実|架空|改変)|sources(csv)|key=value;..." then stage lines; stages separated by a line "--".
// Choice line: "> icon|label|tone|effects|result". Every choice of stage k leads to stage k+1 in the same month (later [0, next]).
// Stage 1 fires automatically once inside [YYYY-MM, +1 month]. keys: not=a,b  flags=a,b  any=a,b  art=x  note=text  sex=m|f  win=months
import { E, C, src } from './lib.mjs';
const addM = (ym, n) => { let [y, m] = ym.split('-').map(Number); m += n; y += Math.floor((m - 1) / 12); m = ((m - 1) % 12) + 1; return `${y}-${String(m).padStart(2, '0')}`; };
export function almanac(prefix, modes, category, text, base = {}) {
  const out = [];
  for (const blk of text.split(/^@/m).map(s => s.trim()).filter(Boolean)) {
    const [head, ...rest] = blk.split('\n');
    const [ym, title, hist = '架空', srcs = '', kv = ''] = head.split('|').map(s => s.trim());
    const o = Object.fromEntries(kv.split(';').filter(Boolean).map(s => { const i = s.indexOf('='); return [s.slice(0, i).trim(), s.slice(i + 1).trim()]; }));
    const stages = rest.join('\n').split(/^--\s*$/m);
    const id0 = `${prefix}_${ym.replace(/-/g, '')}${o.id ? '_' + o.id : ''}`;
    const ids = stages.map((_, k) => (k ? `${id0}_${k + 1}` : id0));
    stages.forEach((sg, k) => {
      const ls = sg.split('\n').map(s => s.trim()).filter(Boolean);
      const lines = ls.filter(l => !l.startsWith('>')).join('\n');
      const ch = ls.filter(l => l.startsWith('>')).map(l => {
        const [icon, label, tone, eff = '', res = ''] = l.slice(1).trim().split('|').map(s => s.trim());
        return C(icon, label, tone, eff, { ...(res ? { res } : {}), ...(k + 1 < ids.length ? { later: [0, ids[k + 1]] } : {}) });
      });
      if (!ch.length) throw new Error(`${ids[k]}: no choices`);
      const cond = k ? { modes, w: 0 } : { modes, w: 0, auto: 1, from: ym, to: addM(ym.slice(0, 7), +(o.win || 1)), ...base };
      if (!k) for (const key of ['not', 'flags', 'any']) if (o[key]) cond[key] = [...(base[key] || []), ...o[key].split(',')];
      if (!k && o.sex) cond.sex = o.sex;
      const x = { art: o.art || 'village', hist, title: k ? `${title}（${k + 1}）` : title, scene: id0 };
      if (srcs) x.sources = src(...srcs.split(',').map(s => s.trim()));
      if (o.note && !k) x.note = o.note;
      out.push(E(ids[k], category, cond, lines, ch, x));
    });
  }
  return out;
}
