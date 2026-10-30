// Authoring helpers. Content is authored compactly here and compiled to src/data/*.json by build.mjs.
export const SRC = {
  ndl: { title: '史料にみる日本の近代', publisher: '国立国会図書館', url: 'https://www.ndl.go.jp/modern/', kind: '公的機関' },
  jacar: { title: 'アジア歴史資料センター（公文書デジタルアーカイブ）', publisher: '国立公文書館アジア歴史資料センター', url: 'https://www.jacar.go.jp/', kind: '一次史料' },
  nara_jp: { title: '国立公文書館 所蔵資料', publisher: '国立公文書館', url: 'https://www.archives.go.jp/', kind: '一次史料' },
  nids: { title: '戦史叢書・戦史史料（防衛研究所）', publisher: '防衛省防衛研究所', url: 'https://www.nids.mod.go.jp/military_history_search/', kind: '公的研究' },
  jitsu: { title: '『昭和天皇実録』（宮内庁編、東京書籍 2015–2019）', publisher: '宮内庁', url: 'https://www.kunaicho.go.jp/', kind: '公的編纂' },
  mofa_jc: { title: '日中歴史共同研究 報告書（2010年公表）', publisher: '外務省', url: 'https://www.mofa.go.jp/mofaj/area/china/rekishi_kk.html', kind: '学術', note: 'URLは自動取得で403（ボット遮断）。要ブラウザ確認' },
  mofa_qa: { title: '歴史問題Q&A', publisher: '外務省', url: 'https://www.mofa.go.jp/mofaj/area/taisen/qa/index.html', kind: '公的見解', note: 'URLは自動取得で403。要ブラウザ確認' },
  hiro: { title: '広島平和記念資料館', publisher: '広島平和記念資料館', url: 'https://hpmmuseum.jp/', kind: '公的機関' },
  naga: { title: '長崎原爆資料館', publisher: '長崎市', url: 'https://nagasakipeace.jp/', kind: '公的機関' },
  oki: { title: '沖縄県平和祈念資料館', publisher: '沖縄県', url: 'https://www.peace-museum.okinawa.jp/', kind: '公的機関' },
  sensai: { title: '東京大空襲・戦災資料センター', publisher: '公益財団法人 政治経済研究所', url: 'https://tokyo-sensai.net/', kind: '研究機関' },
  const: { title: '日本国憲法の誕生', publisher: '国立国会図書館', url: 'https://www.ndl.go.jp/constitution/', kind: '公的機関' },
  mhlw: { title: '戦没者慰霊・援護', publisher: '厚生労働省', url: 'https://www.mhlw.go.jp/seisakunitsuite/bunya/hokabunya/senbotsusha/', kind: '公的機関' },
  usna: { title: 'World War II records', publisher: 'U.S. National Archives', url: 'https://www.archives.gov/research/military/ww2', kind: '一次史料' },
};
export const src = (...keys) => keys.map(k => { if (!SRC[k]) throw new Error('unknown source ' + k); return { key: k, ...SRC[k] }; });
// Line: "sp|text" ; sp = narr | npc role key (partner, mother, father, child, friend, boss, sergeant, aide...) | real person id; '*' prefix marks invented dialogue (創作)
export const L = (s) => s.split('\n').map(x => x.trim()).filter(Boolean).map(x => { const i = x.indexOf('|'); let sp = i > 0 ? x.slice(0, i) : 'narr'; const t = i > 0 ? x.slice(i + 1) : x; const created = sp.startsWith('*'); if (created) sp = sp.slice(1); return { sp, t, ...(created ? { created: true } : {}) }; });
// choice: [icon, label, tone(safe|cost|gamble), effects string, opts]
export const C = (i, t, tone, e = '', o = {}) => ({ icon: i, label: t, tone, effects: e, ...o });
// E(id, category, cond, lines, choices, extra). cond keys: modes, sex, from, to, flags(all), any(any), not, age[min,max], bg, branch, w(weight), once(default true), cd(cooldown months)
export const E = (id, category, cond, lines, choices, x = {}) => ({ id, type: 'event', category, cond, lines: L(lines), choices, hist: x.hist || '架空', ...x });
