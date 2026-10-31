import './style.css';
import { D, newGame, advance, choose, postTurn, succeed, serialize, deserialize, KEY, compareTimeline, age, rankName, fill, State, Card, Mode } from './engine/game';
import { fmtJa, fmtShort, yearOf } from './engine/date';
import { sfx, sound, setSound, setVolume, setMood, playScene, stopScene } from './ui/audio';
import { pickSound } from './ui/soundmap';
import { AUDIO_CREDITS } from './ui/audio-credits';
import { loadManifest, pickAsset, pictureHtml, clipHtml, url, manifestNow } from './ui/media';

const app = document.getElementById('app')!;
let st: State | null = null;
let pending: { lines: string[]; deltas: any[]; ok?: boolean; died?: boolean } | null = null;
const esc = (s: any) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as any)[c]);
const $ = (sel: string, root: ParentNode = document) => root.querySelector(sel) as HTMLElement;
const MODES: { id: Mode; icon: string; name: string; sub: string }[] = [
  { id: 'civ', icon: '🏠', name: '一般人', sub: '暮らし・恋・家族・徴兵' },
  { id: 'mil', icon: '🪖', name: '軍人', sub: '陸軍・海軍・陸海航空' },
  { id: 'cmd', icon: '🧭', name: '指揮官', sub: '部隊を預かる（抽象）' },
  { id: 'state', icon: '🏛️', name: '国家', sub: '制度の中の決断' },
];
const SL: Record<string, string> = { hp: '体力', yen: '円', spirit: '気力', bond: '絆', rep: '評判', consc: '良心' };
const UL: Record<string, string> = { men: '兵員', morale: '士気', supply: '補給', train: '練度', fatigue: '疲労', trust: '信頼' };
const NL: Record<string, string> = { cab: '内閣', army: '陸軍', navy: '海軍', elders: '重臣', privy: '枢密院', diet: '議会', opinion: '世論', intl: '国際', econ: '経済', war: '戦火' };
const CAT: Record<string, string> = { romance: '恋', family: '家族', letter: '手紙', daily: '暮らし', work: '仕事', conscription: '徴兵', training: '訓練', front: '戦地', military: '軍', career: '経歴', civilian: '銃後', colonial: '植民地', warcrime: '戦争犯罪', postwar: '戦後', unit: '部隊', ops: '作戦', state: '国家', alt: '改変世界' };
const ART_TAGS: Record<string, string> = {};

// ---------- save ----------
const save = () => { if (st) try { localStorage.setItem(KEY, serialize(st)); } catch { /* quota */ } };
const loadSaved = (): State | null => { try { const s = localStorage.getItem(KEY); return s ? deserialize(s) : null; } catch { return null; } };

// ---------- screens ----------
function title() {
  const saved = loadSaved();
  app.innerHTML = `<main class="title">
    <figure class="title-art"><img src="${url('art/title.webp')}" alt="" decoding="async"><figcaption><b>AI再現</b>イメージ</figcaption></figure>
    <h1>岐路の十年<small>TEN YEARS AT THE CROSSROADS<br>1936–1945</small></h1>
    <p class="lead">二・二六事件の朝から、新しい憲法の日まで。<br>一人の人生として、あの十年を生きる。</p>
    <div class="btns">
      ${saved ? `<button class="big" id="cont">▶ 続きから<small>${esc(saved.p.name)}・${fmtShort(saved.date)}</small></button>` : ''}
      <button class="big primary" id="new">新しく始める</button>
      <button class="ghost" id="about">この作品について・出典</button>
      <button class="ghost" id="snd0">${sound.on ? '🔊 音あり（タップで消音）' : '🔇 音なし（タップでBGM・効果音を出す）'}</button>
    </div>
    <p class="fine">史実は出典つき。改変は明示。実在人物の台詞は「創作」と表示。<br>戦争の加害と被害を、誇張も美化もせずに描きます。</p>
  </main>`;
  $('#new').onclick = () => { sfx.tap(); setup(); };
  if (saved) $('#cont').onclick = () => { sfx.tap(); st = saved; play(); };
  $('#about').onclick = () => panel('about');
  $('#snd0').onclick = () => { setSound(!sound.on); setMood('title'); title(); };
  stopScene(); setMood('title');
}

function setup(mode: Mode = 'civ', histMode: 'branch' | 'fixed' = 'branch') {
  const S = D.settings;
  const list = mode === 'civ' ? S.backgrounds : mode === 'mil' ? S.milStarts : mode === 'cmd' ? S.cmdStarts : [{ id: 'state', icon: '🏛️', label: '宮中・政府の中枢（制度の制約の中で）' }];
  app.innerHTML = `<main class="setup">
    <header class="bar"><button class="ghost" id="back">←</button><h2>誰として生きるか</h2></header>
    <nav class="modes">${MODES.map(m => `<button data-m="${m.id}" class="${m.id === mode ? 'on' : ''}"><span>${m.icon}</span>${m.name}<small>${m.sub}</small></button>`).join('')}</nav>
    ${mode === 'state' ? `<p class="note">国家モードでは、天皇・内閣・軍・重臣・枢密院・議会・世論などの<b>制度的制約</b>の中で決断します。一つの命令で歴史が変わることはありません。天皇の役割と戦争責任の評価には<b>研究上の議論</b>があります。</p>` : ''}
    ${mode === 'cmd' ? `<p class="note">指揮官モードは部隊の<b>士気・補給・練度・信頼</b>を預かる抽象的な運営です。戦術や兵器の詳細は扱いません。</p>` : ''}
    <ul class="starts">${list.map((b: any, i: number) => `<li><button data-s="${b.id}" class="${i === 0 ? 'on' : ''}"><span class="ic">${b.icon || '•'}</span><span>${esc(b.label)}${b.place ? `<small>${esc(b.place)}・${b.birth}年生</small>` : b.birth ? `<small>${b.birth}年生</small>` : ''}</span></button></li>`).join('')}</ul>
    <label class="toggle"><input type="checkbox" id="hm" ${histMode === 'fixed' ? 'checked' : ''}> 史実固定（改変分岐を起こさない）</label>
    <p class="fine">改変分岐は「国家」モードでの決断からのみ起こります。他のモードは常に史実の流れの中を生きます。</p>
    <button class="big primary" id="go">この人生を始める</button>
  </main>`;
  let start = list[0].id;
  app.querySelectorAll<HTMLElement>('.modes button').forEach(b => (b.onclick = () => { sfx.tap(); setup(b.dataset.m as Mode, ($('#hm') as HTMLInputElement).checked ? 'fixed' : 'branch'); }));
  app.querySelectorAll<HTMLElement>('.starts button').forEach(b => (b.onclick = () => { sfx.tap(); app.querySelectorAll('.starts button').forEach(x => x.classList.remove('on')); b.classList.add('on'); start = b.dataset.s!; }));
  $('#back').onclick = title;
  $('#go').onclick = () => { sfx.good(); st = newGame({ mode, start, histMode: ($('#hm') as HTMLInputElement).checked ? 'fixed' : 'branch' }); save(); play(); };
}

// ---------- HUD ----------
function hud() {
  const s = st!; const a = s.mode === 'state' ? '' : `${age(s)}歳`;
  const stats = s.mode === 'state' ? Object.entries(NL).filter(([k]) => k !== 'war').map(([k, l]) => meter(l, s.n[k])) .join('') + meter('戦火', s.n.war, true)
    : ['hp', 'spirit', 'bond', 'consc'].map(k => meter(SL[k], s.s[k])).join('') + `<span class="yen">¥${Math.round(s.s.yen)}</span>` + (s.u ? '<i class="sep"></i>' + Object.entries(UL).filter(([k]) => k !== 'men').map(([k, l]) => meter(l, s.u![k], k === 'fatigue')).join('') + `<span class="yen">兵${s.u.men}</span>` : '');
  return `<header class="hud">
    <div class="who"><b>${esc(s.p.name)}</b><span>${a}${s.p.branch && s.mode !== 'civ' ? '・' + esc(rankName(s)) : ''}・${esc(s.p.place)}</span>${s.gen > 1 ? `<em>第${s.gen}の人生</em>` : ''}</div>
    <div class="date">${fmtShort(s.date)}<small>${yearOf(s.date)}</small></div>
    <div class="stats">${stats}</div>
    <nav class="tools">
      <button data-p="timeline" title="年表">📜<span>年表</span></button><button data-p="map" title="地図">🗺️<span>地図</span></button>
      <button data-p="people" title="人物">👥<span>人物</span></button><button data-p="family" title="家族">🏮<span>家族</span></button>
      <button data-p="glossary" title="用語">📖<span>用語</span></button><button data-p="save" title="保存">💾<span>保存</span></button><button data-p="settings" title="設定">⚙️<span>設定</span></button><button id="sndq" title="音">${sound.on ? '🔊' : '🔇'}<span>音</span></button>
    </nav></header>`;
}
const meter = (l: string, v: number, inv = false) => `<span class="m ${(inv ? v > 65 : v < 30) ? 'low' : ''}" title="${l} ${v}"><i>${l}</i><b style="--v:${Math.max(0, Math.min(100, v))}%"></b></span>`;

// ---------- cards ----------
function avatar(sp: string) { const v = D.speakers[sp] || ['', '・']; return v[1]; }
function spName(sp: string) { const v = D.speakers[sp]; return v ? fill(st!, v[0]) : ''; }
function linesHtml(lines: any[]) {
  return lines.map((l, i) => l.sp === 'narr' ? `<p class="ln narr" style="--d:${i}">${esc(l.t)}</p>`
    : `<div class="ln say ${l.sp}" style="--d:${i}"><span class="av" aria-hidden="true">${esc(avatar(l.sp))}</span><div><small>${esc(spName(l.sp))}${l.created ? '<em class="cre">創作</em>' : ''}</small><p>${esc(l.t.replace(/^（創作）/, ''))}</p></div></div>`).join('');
}
function artFor(c: Card) {
  const art = c.ev?.art || c.hist?.art || (st!.mode === 'state' ? 'council' : 'village');
  const tags = [art, c.ev?.category || c.hist?.category || '', st!.mode];
  const want = c.ev?.img || c.hist?.img; const wantClip = c.ev?.clip || c.hist?.clip;
  if (want && !wantClip) { const x = pickAsset([], '', 'image', want); if (x) return pictureHtml(x); }
  // News cards only get a clip assigned per place (content/media-assign.json); front events auto-pick a clip only on a specific tag/art match, never on the generic 'front' category.
  const clip = wantClip ? pickAsset([], '', 'clip', wantClip) : c.ev?.category === 'front' && !want ? pickAsset([...(c.ev?.tags || []), art], c.id || '', 'clip') : null;
  if (clip && !matchMedia('(prefers-reduced-motion: reduce)').matches) return clipHtml(clip);
  const a = pickAsset([...(c.ev?.tags || []), ...tags], c.id || '');
  return a ? pictureHtml(a) : `<figure class="art"><img src="${url('art/' + art + '.webp')}" alt="" loading="lazy"><figcaption><b>AI再現</b>イメージ</figcaption></figure>`;
}
function srcHtml(x: any) {
  const ss = x?.sources || []; if (!ss.length && !x?.note) return '';
  return `<details class="src"><summary>出典・注記</summary>${x.note ? `<p>${esc(x.note)}</p>` : ''}${x.contested ? `<p class="contested">⚖️ 論争あり：${esc(x.contested)}</p>` : ''}<ul>${ss.map((s: any) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a><small>${esc(s.publisher)}・${esc(s.kind)}</small></li>`).join('')}</ul></details>`;
}
function play() {
  if (!st) return title();
  const c = advance(st); save();
  const kind = c.kind === 'event' && c.ev?.letter ? 'letter' : c.kind;
  if (kind === 'news') sfx.news(); else if (kind === 'flash') sfx.flash(); else if (kind === 'death') sfx.death();
  playScene(pickSound({ ...c, letter: kind === 'letter' }, st.mode, st.date));
  let body = '';
  if (kind === 'news') {
    const h = c.hist;
    body = `<article class="card news ${h.hist === '改変' ? 'alt' : ''}">
      <div class="paper"><div class="mast">号外<small>${fmtJa(h.date)}</small></div>
      <span class="tag ${h.hist === '改変' ? 'alt' : 'real'}">${h.hist}</span>
      <h2>${esc(h.title)}</h2>${h.art || h.img || h.clip ? artFor(c) : ''}<div class="lines">${linesHtml(c.lines)}</div>
      ${h.hist === '改変' && h.cause ? `<p class="cause">🔀 分岐の原因：${esc(h.cause)}</p>` : ''}
      ${(c.more || []).map((m: any) => `<div class="more"><span class="tag ${m.hist === '改変' ? 'alt' : 'real'}">${m.hist}</span><b>${fmtShort(m.date)}</b> ${esc(m.title)}${srcHtml(m)}</div>`).join('')}
      ${srcHtml(h)}</div></article>`;
  } else if (kind === 'death') {
    body = `<article class="card death"><div class="kicker">訃報</div><h2>${esc(st.dead?.name)}</h2><p class="sub">${esc(st.dead?.label || '')}</p><div class="lines">${linesHtml(c.lines)}</div><p class="ask">物語を、誰が引き継ぎますか。</p></article>`;
  } else if (kind === 'end') {
    body = `<article class="card end">${pictureOr('postwar')}<div class="kicker">終章</div><h2>${fmtJa('1947-05-03')}</h2><div class="lines">${linesHtml(c.lines)}</div></article>`;
  } else {
    const e = c.ev, h = c.hist;
    body = `<article class="card ${kind} cat-${e.category}">
      ${c.from ? `<div class="flashhead">⏪ 回想　${fmtShort(c.from.date)}、あなたは「${esc(c.from.label)}」を選んだ。</div>` : ''}
      ${h ? `<div class="hook"><span class="tag ${h.hist === '改変' ? 'alt' : 'real'}">${h.hist}</span>${fmtJa(h.date)}　<b>${esc(h.title)}</b></div>` : ''}
      ${kind === 'letter' ? '' : artFor(c)}
      <div class="meta"><span class="chip">${CAT[e.category] || e.category}</span><span>${fmtJa(st.date)}</span></div>
      <div class="lines ${kind === 'letter' ? 'paperlines' : ''}">${kind === 'letter' ? '<div class="stamp">軍事郵便</div>' : ''}${linesHtml(c.lines)}</div>
      ${srcHtml(e.note || e.sources?.length ? { note: e.note, contested: e.contested, sources: (e.sources || []).map((k: any) => typeof k === 'string' ? D.sources[k] : k).filter(Boolean) } : null)}${h ? srcHtml(h) : ''}
    </article>`;
  }
  const ch = (c.choices || []).map((x: any) => `<button class="ch ${x.tone}" data-i="${x.i}" ${x.disabled ? 'disabled' : ''}><span class="ic">${x.icon}</span><span class="lb">${esc(x.label)}</span>${x.check ? '<span class="bd" title="能力判定">🎲</span>' : ''}${x.risky ? '<span class="bd risk" title="命の危険">☠</span>' : ''}</button>`).join('');
  app.innerHTML = `<div class="play mode-${st.mode}">${hud()}<section class="stage">${body}</section><footer class="choices">${ch}</footer></div>`;
  bindTools();
  app.querySelectorAll<HTMLButtonElement>('.ch').forEach(b => (b.onclick = () => onChoice(c, +b.dataset.i!)));
  $('.stage').scrollTop = 0;
}
const pictureOr = (art: string) => { const a = pickAsset([art], art); return a ? pictureHtml(a) : `<figure class="art"><img src="${url('art/' + art + '.webp')}" alt="" loading="lazy"><figcaption><b>AI再現</b>イメージ</figcaption></figure>`; };

function onChoice(c: Card, i: number) {
  if (!st) return;
  if (c.kind === 'news') { sfx.tap(); st.card = null; postTurn(st); return play(); }
  if (c.kind === 'death') { const ch = c.choices!.find((x: any) => x.i === i); sfx.good(); succeed(st, ch.succ); save(); return st.over ? play() : play(); }
  if (c.kind === 'end') { sfx.tap(); return panel('timeline'); }
  const r = choose(st, i); postTurn(st); save();
  const good = r.ok === true || (r.ok === undefined && r.deltas.reduce((a, d) => a + (d.k === 'consc' ? 0 : d.v), 0) >= 0);
  r.died ? sfx.death() : good ? sfx.good() : sfx.bad();
  if (!r.lines.length) r.lines.push('——' + (c.choices!.find((x: any) => x.i === i)?.label || '') + '。'); pending = r; showResult(c);
}
function showResult(c: Card) {
  const r = pending!; pending = null;
  const ds = r.deltas.filter(d => d.v).map(d => `<span class="dl ${d.v > 0 ? (d.k === 'fatigue' || d.k === 'war' ? 'neg' : 'pos') : (d.k === 'fatigue' || d.k === 'war' ? 'pos' : 'neg')}">${esc(d.label)} ${d.v > 0 ? '+' : ''}${d.v}</span>`).join('');
  const res = document.createElement('div'); res.className = 'result ' + (r.died ? 'died' : r.ok === false ? 'fail' : r.ok ? 'win' : '');
  res.innerHTML = `<div class="sheet">${r.ok !== undefined ? `<div class="verdict">${r.ok ? '成功' : '失敗'}</div>` : ''}${r.lines.map(l => `<p>${esc(l)}</p>`).join('')}${ds ? `<div class="deltas">${ds}</div>` : ''}${c.ev?.later || r.lines.some(l => l.includes('いつか')) ? '' : ''}<button class="big primary" id="nx">${r.died ? '……' : '次へ'}</button></div>`;
  app.querySelector('.play')!.appendChild(res);
  const b = $('#nx'); b.focus(); b.onclick = () => { sfx.tap(); play(); };
}

// ---------- panels ----------
function bindTools() {
  app.querySelectorAll<HTMLElement>('.tools button[data-p]').forEach(b => (b.onclick = () => { sfx.tap(); panel(b.dataset.p!); }));
  const q = app.querySelector<HTMLElement>('#sndq'); if (q) q.onclick = () => { setSound(!sound.on); q.firstChild!.textContent = sound.on ? '🔊' : '🔇'; };
}
function panel(kind: string) {
  const o = document.createElement('div'); o.className = 'overlay'; let h = '';
  if (kind === 'timeline' && st) {
    const rows = compareTimeline(st);
    h = `<h2>年表 — 史実と、あなたの世界</h2><p class="fine">左：史実　右：この世界。<span class="tag real">史実</span><span class="tag alt">改変</span></p>
    <ol class="tl">${rows.map((r: any) => `<li class="${r.isAlt ? 'isalt' : r.happened ? 'done' : r.pending ? 'pend' : 'skip'}"><time>${r.date.slice(0, 7)}</time><div>${r.isAlt ? `<span class="tag alt">改変</span>${esc(r.title)}<small>🔀 ${esc(r.cause || '')}</small>` : `${esc(r.title)}${r.happened ? '' : r.pending ? '<small>（まだ先）</small>' : '<small class="x">この世界では起きなかった</small>'}${r.alt ? `<small>→ ${esc(r.alt.title)}（${esc(r.alt.cause || '')}）</small>` : ''}`}</div></li>`).join('')}</ol>
    <h3>あなたの人生</h3><ol class="tl life">${st.tl.filter(t => t.kind === '人生').map(t => `<li><time>${t.date.slice(0, 7)}</time><div>${esc(t.title)}</div></li>`).join('') || '<li><div>まだ記録はない</div></li>'}</ol>
    ${st.over ? '<button class="big primary" id="again">もう一度、別の人生を</button>' : ''}`;
  } else if (kind === 'map' && st) {
    const R = D.settings.regions, seen = new Set(D.hist.filter((x: any) => st!.histFired[x.id]).map((x: any) => x.region));
    const X = (lon: number) => ((lon - 95) / 75) * 360, Y = (lat: number) => ((55 - lat) / 70) * 300;
    h = `<h2>地図</h2><svg class="map" viewBox="0 0 360 300" role="img" aria-label="東アジア・太平洋の概略図"><rect width="360" height="300" fill="#1f2a30"/>
      ${R.map((r: any) => `<g class="${r.name === st!.p.place ? 'me' : seen.has(r.name) ? 'seen' : ''}"><circle cx="${X(r.lon)}" cy="${Y(r.lat)}" r="${r.name === st!.p.place ? 5 : 2.6}"/><text x="${X(r.lon) + 5}" y="${Y(r.lat) + 3}">${esc(r.name)}</text></g>`).join('')}</svg>
      <p class="fine">● 現在地：${esc(st.p.place)}　● 出来事の起きた場所。地形は略図（正確な国境線ではありません）。</p>`;
  } else if (kind === 'people') {
    h = `<h2>実在の人物</h2><p class="fine">役職と事実のみ。肖像の生成はしていません。ゲーム内の台詞は「創作」と表示します。</p><ul class="people">${D.people.map((p: any) => `<li><span class="emb">${esc(p.emblem || '・')}</span><div><b>${esc(p.name)}</b><small>${esc(p.years || '')}</small><p>${esc(p.role)}</p>${srcHtml(p)}</div></li>`).join('')}</ul>`;
  } else if (kind === 'family' && st) {
    const n = st.npcs, rows = [['partner', '想い人・伴侶'], ['mother', '母'], ['father', '父'], ['friend', '友'], ['sib', 'きょうだい']].filter(([k]) => n[k]);
    h = `<h2>家族とつながり</h2><ul class="fam">${rows.map(([k, l]) => `<li class="${n[k].alive ? '' : 'gone'}"><span class="av">${avatar(k === 'sib' ? 'friend' : k)}</span><div><b>${esc(n[k].name)}</b><small>${l}${n[k].alive ? '' : '・故人'}</small><b class="rel" style="--v:${n[k].rel}%"></b>${k === 'partner' && n[k].wish ? `<p>夢：${esc(fill(st!, '{pwish}'))}</p>` : ''}</div></li>`).join('')}
      ${st.kids.map(k => `<li class="${k.alive ? '' : 'gone'}"><span class="av">子</span><div><b>${esc(k.name)}</b><small>${age({ ...st!, p: { ...st!.p, birth: k.birth } } as any)}歳${k.kidTrait ? '・' + esc(k.kidTrait) : ''}</small></div></li>`).join('')}</ul>
      <h3>形見と持ち物</h3><p>${st.items.map(i => esc(fill(st!, D.items[i] || i))).join('、') || 'まだない'}</p>`;
  } else if (kind === 'glossary') {
    h = `<h2>用語</h2><dl class="gl">${D.settings.glossary.map((g: any) => `<dt>${esc(g.term)}</dt><dd>${esc(g.def)}</dd>`).join('')}</dl>`;
  } else if (kind === 'save') {
    h = `<h2>保存</h2><p class="fine">進行は自動保存されます（この端末のブラウザ内）。別の端末へ移すときは書き出してください。</p>
      <button class="big" id="exp">💾 セーブを書き出す（.json）</button><label class="big filebtn">📂 セーブを読み込む<input type="file" id="imp" accept=".json,application/json"></label>
      <textarea id="txt" placeholder="またはセーブデータを貼り付け"></textarea><button id="imptxt">貼り付けたデータを読み込む</button><p id="msg" role="status"></p>
      <button class="ghost danger" id="del">この端末のセーブを消してタイトルへ</button>`;
  } else if (kind === 'settings') {
    h = `<h2>設定</h2><label class="toggle"><input type="checkbox" id="snd" ${sound.on ? 'checked' : ''}> 音（BGM・効果音）</label><label class="vol">BGM <input type="range" id="vb" min="0" max="1" step="0.05" value="${sound.bgm}"></label><label class="vol">効果音 <input type="range" id="vs" min="0" max="1" step="0.05" value="${sound.sfx}"></label><label class="toggle"><input type="checkbox" id="rm" ${document.body.classList.contains('calm') ? 'checked' : ''}> 演出を控えめに</label>
      <p class="fine">史実モード：${st ? (st.histMode === 'fixed' ? '史実固定' : '改変あり（国家モードの決断で分岐）') : '-'}</p><button class="ghost" id="ab">この作品について・出典</button><button class="ghost" id="ttl">タイトルへ戻る</button>`;
  } else if (kind === 'about') {
    const srcs = Object.values<any>(D.sources);
    h = `<h2>この作品について</h2><p>『岐路の十年』は、1936〜1945年の日本を一人の人生として体験する歴史ライフシミュレーションです。</p>
      <ul class="rules"><li><span class="tag real">史実</span>出来事は日付と出典つき。解釈に議論があるものは「論争あり」と明記。</li><li><span class="tag alt">改変</span>もしもの分岐は、原因となった決断と共に表示。</li><li><em class="cre">創作</em>実在人物の台詞は創作であることを明記。肖像は生成しません。</li><li><b>AI再現</b>画像はAIで作ったイメージで、実在の写真ではありません。</li><li>日本の加害、アジア・太平洋の人々の被害、銃後の苦しみを、美化せずに描きます。</li></ul>
      <h3>主な出典</h3><ul class="srcs">${srcs.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a><small>${esc(s.publisher)}</small></li>`).join('')}</ul>
      <h3>写真・映像のクレジット</h3><p class="fine">実写真・実映像はWikimedia Commons等のパブリックドメイン／自由ライセンス素材です（一覧は docs/MEDIA_SOURCES.md）。AI再現素材は架空のイメージです。</p><ul class="srcs credits">${manifestNow().filter(m => !m.ai).map(m => `<li><a href="${esc(m.source)}" target="_blank" rel="noopener">${m.type === 'clip' ? '🎞 ' : ''}${esc(m.label)}</a><small>${esc(m.rights || '')}・${esc(m.license)}</small></li>`).join('')}</ul>
      <h3>音楽・効果音のクレジット</h3><p class="fine">録音素材はWikimedia CommonsのパブリックドメインまたはCC BY 4.0素材（一覧は docs/MEDIA_SOURCES.md）。「自作合成」は本作のために手続き的に合成したオリジナル音源（CC0）です。</p><ul class="srcs credits">${AUDIO_CREDITS.map(a => `<li>${a.url ? `<a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.label)}</a>` : esc(a.label)}<small>${esc(a.by)}・${esc(a.license)}</small></li>`).join('')}</ul>
      <p class="fine">AI再現素材: ${manifestNow().filter(m => m.ai).length}点（画面上に「AI再現」と表示）</p>
      <p class="fine">v${esc(D.version)}・内容 ${D.hist.length}史実/改変記録・${D.events.length}イベント</p>`;
  }
  o.innerHTML = `<div class="sheet panel"><button class="close" aria-label="閉じる">×</button>${h}</div>`;
  document.body.appendChild(o);
  const close = () => o.remove();
  o.onclick = e => { if (e.target === o) close(); };
  $('.close', o).onclick = close;
  const q = (s: string) => o.querySelector(s) as HTMLElement | null;
  q('#again') && (q('#again')!.onclick = () => { close(); localStorage.removeItem(KEY); st = null; setup(); });
  q('#snd') && ((q('#snd') as HTMLInputElement).onchange = e => { setSound((e.target as HTMLInputElement).checked); const b = document.querySelector('#sndq'); if (b) b.firstChild!.textContent = sound.on ? '🔊' : '🔇'; });
  q('#vb') && ((q('#vb') as HTMLInputElement).oninput = e => setVolume('bgm', +(e.target as HTMLInputElement).value));
  q('#vs') && ((q('#vs') as HTMLInputElement).oninput = e => setVolume('sfx', +(e.target as HTMLInputElement).value));
  q('#rm') && ((q('#rm') as HTMLInputElement).onchange = e => { document.body.classList.toggle('calm', (e.target as HTMLInputElement).checked); localStorage.setItem('kiro10.calm', (e.target as HTMLInputElement).checked ? '1' : '0'); });
  q('#ab') && (q('#ab')!.onclick = () => { close(); panel('about'); });
  q('#ttl') && (q('#ttl')!.onclick = () => { close(); title(); });
  q('#exp') && (q('#exp')!.onclick = () => { if (!st) return; const b = new Blob([serialize(st)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `kiro10-${st.date}.json`; a.click(); URL.revokeObjectURL(a.href); });
  const doImport = (txt: string) => { try { st = deserialize(txt); save(); close(); play(); } catch (err: any) { q('#msg')!.textContent = '読み込めませんでした：' + err.message; } };
  q('#imp') && ((q('#imp') as HTMLInputElement).onchange = async e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) doImport(await f.text()); });
  q('#imptxt') && (q('#imptxt')!.onclick = () => doImport((q('#txt') as HTMLTextAreaElement).value));
  q('#del') && (q('#del')!.onclick = () => { if (confirm('セーブを消しますか？')) { localStorage.removeItem(KEY); st = null; close(); title(); } });
}

if (localStorage.getItem('kiro10.calm') === '1') document.body.classList.add('calm');
loadManifest().finally(title);
(window as any).__kiro = { get st() { return st; } };
void ART_TAGS;
