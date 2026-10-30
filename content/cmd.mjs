import { E, C } from './lib.mjs';
const K = ['cmd'];
const c = (o) => ({ modes: K, ...o });
// Commander mode: abstract unit management only (men, morale, supply, train, fatigue, trust). No tactical/weapon detail.
export const CMD = [
  E('cmd_inspect', 'unit', c({ w: 4, cd: 8 }), `部隊の点検。下士官が報告する。
nco|兵の士気、まずまず。ただ、靴と毛布が足りません。`, [
    C('📦', '補給を強く要求する', 'safe', 'u.supply+10 u.trust+2 rep-1'),
    C('🏋️', '訓練を増やす', 'safe', 'u.train+8 u.fatigue+10 u.morale-3'),
    C('🍙', '休養日を設ける', 'safe', 'u.fatigue-15 u.morale+6 rep-1'),
  ], { art: 'barracks' }),
  E('cmd_nco_violence', 'unit', c({ w: 4, cd: 18 }), `古参兵の私的制裁で、初年兵が一人、脱走しかけた。
nco|隊長、規律のためです。`, [
    C('🚫', '私的制裁を禁じる', 'gamble', 'u.trust+10 u.morale+5 consc+5 rep-3'),
    C('🙈', '黙認する', 'safe', 'u.morale-4 consc-4 u.trust-4'),
  ], { art: 'barracks' }),
  E('cmd_order_advance', 'ops', c({ w: 5, cd: 4, not: ['war_over'], from: '1937-08' }), `上級司令部から前進命令。
staff|三日以内に目標地点を確保せよ。
narr|部隊の疲労は限界に近い。`, [
    C('⚔️', '命令どおり前進', 'gamble', 'rep+4', { check: { base: 50, add: { 'u.morale': 0.3, 'u.supply': 0.3, 'u.train': 0.2, 'u.fatigue': -0.3 } }, win: { e: 'u.morale+6 u.fatigue+10 u.men-3', res: '目標を確保。損害は軽微。' }, lose: { e: 'u.men-15 u.morale-12 u.fatigue+15 rep-4', res: '大きな損害を出した。名簿の名前に線を引く夜。' } }),
    C('⏳', '一日の休養を具申する', 'safe', 'u.fatigue-10 u.trust+5 rep-3'),
    C('🧭', '迂回して損害を抑える', 'gamble', 'u.fatigue+6', { check: { base: 55, add: { 'u.train': 0.4 } }, win: { e: 'u.men-1 rep+3', res: '損害を抑えて到達した。' }, lose: { e: 'rep-6', res: '期限に遅れた。' } }),
  ], { art: 'hq' }),
  E('cmd_supply_cut', 'ops', c({ w: 4, from: '1942-06', cd: 6, not: ['alt_us_deal', 'war_over'] }), `補給船が沈んだ。米は残り10日分。
nco|兵が痩せていきます。`, [
    C('🍚', '配食を減らし、公平に分ける', 'safe', 'u.supply+5 u.morale-6 u.trust+6'),
    C('🌾', '現地徴発を命じる', 'gamble', 'u.supply+15 consc-10 u.morale+2', { res: '村の人々の目が冷たい。' }),
    C('📻', '撤退を上申する', 'gamble', 'rep-6', { check: { base: 35, add: { rep: 0.4 } }, win: { e: 'u.men+0 u.morale+8', res: '上申が通った。' }, lose: { e: 'rep-8 u.trust+5', res: '「臆病」と叱責された。兵はあなたを見ていた。' } }),
  ], { art: 'hq' }),
  E('cmd_disease', 'unit', c({ w: 3, from: '1938-01', cd: 10 }), `赤痢が出た。兵の三割が下痢と高熱。
medic|水を煮沸させてください。薪も薬も足りない。`, [C('🔥', '衛生を最優先する', 'safe', 'u.men-2 u.supply-6 u.morale+3'), C('⏩', '行動を続ける', 'gamble', 'u.men-10 u.fatigue+10')], { art: 'barracks' }),
  E('cmd_prisoners', 'warcrime', c({ w: 3, from: '1937-09', not: ['alt_china_truce', 'war_over'], cd: 24 }), `捕虜を二十名とった。
staff|連れて歩く余裕はない。処置は隊長に任せる、だそうです。
narr|この「任せる」が何を意味するか、誰もが知っていた。`, [
    C('⚖️', '後方の収容所へ送る手配をする', 'gamble', 'consc+12 rep-5 u.supply-5', { later: [96, 'post_trial_witness'] }),
    C('📝', '文書で正式な命令を要求する', 'gamble', 'consc+6 rep-3', { res: '命令書は来なかった。捕虜は後方へ送られた。' }),
  ], { art: 'hq', note: '捕虜の不法殺害は戦後の裁判で裁かれた（史実）。ゲームは加害行為を選択肢として提示しない。' }),
  E('post_trial_witness', 'postwar', { modes: ['cmd', 'civ'], flags: ['war_over'], w: 0 }, `戦犯裁判。かつての捕虜の一人が証言台に立った。
witness|この人は、私たちを後方へ送った。
narr|あの日の選択が、証言として返ってきた。`, [C('🙇', '頭を下げる', 'safe', 'consc+5 spirit+8')], { art: 'council', echo: true }),
  E('cmd_trust_crisis', 'unit', c({ w: 0, auto: 1, stat: { 'u.trust': [-1, 25] } }), `兵の間に、命令への不信が広がっている。
nco|隊長は俺たちを使い捨てると……`, [C('🗣️', '兵の前で率直に話す', 'gamble', 'u.trust+15', { check: { base: 50, add: { rep: 0.2 } }, lose: { e: 'u.morale-8', res: '言葉は届かなかった。' } }), C('🍶', '酒保を開ける', 'cost', 'u.morale+8 u.supply-6')], { art: 'barracks' }),
  E('cmd_navy_escort', 'ops', c({ branch: ['navy'], w: 5, cd: 4, from: '1942-01', not: ['alt_us_deal', 'war_over'] }), `駆逐艦は輸送船団の護衛。燃料は帰りの分しかない。
staff|速度を上げるか、船団に合わせるか。`, [
    C('🐢', '遅い船に合わせる', 'gamble', 'rep+2', { check: { base: 50, add: { 'u.train': 0.4 } }, win: { e: 'u.morale+6', res: '全船、入港。' }, lose: { e: 'u.morale-10 consc+0', res: '一隻が雷撃で沈んだ。' } }),
    C('🏁', '燃料を優先し、先行する', 'cost', 'u.supply+6 consc-6 rep-2'),
  ], { art: 'navy' }),
  E('cmd_navy_rescue', 'ops', c({ branch: ['navy'], w: 3, from: '1942-06', not: ['alt_us_deal', 'war_over'] }), `沈没した船の乗員が、油の海に浮いている。敵潜水艦はまだ近くにいるかもしれない。`, [
    C('🛟', '停止して救助する', 'gamble', 'consc+10 u.trust+8', { check: { base: 55 }, win: { e: 'u.men+10', res: '三百名を引き上げた。' }, lose: { e: 'u.men-10 u.morale-8', res: '雷撃を受けた。' } }),
    C('➡️', '任務を続行する', 'cost', 'consc-8 u.morale-5'),
  ], { art: 'navy' }),
  E('cmd_air_pilots', 'ops', c({ branch: ['army_air'], w: 5, cd: 4, not: ['war_over'], from: '1942-01' }), `戦隊の搭乗員は、半分が飛行時間の足りない若者だ。
staff|上は、全機出撃を求めています。`, [
    C('🛩️', '全機出撃', 'gamble', 'rep+4', { check: { base: 40, add: { 'u.train': 0.5 } }, win: { e: 'u.morale+4', res: '全機帰還。奇跡だった。' }, lose: { e: 'u.men-15 u.morale-12', res: '若い搭乗員が、四人帰らなかった。' } }),
    C('📖', '熟練者だけで出し、若者は訓練', 'safe', 'u.train+10 rep-4 u.trust+6'),
  ], { art: 'airfield' }),
  E('cmd_tokko_order', 'ops', c({ branch: ['army_air', 'navy'], from: '1944-10', to: '1945-08', not: ['war_over', 'tokko_order'], w: 0, auto: 2 }), `上級司令部から、特攻隊の編成命令。
staff|志願を募れ、とのことです。
narr|部下の顔が、ひとりずつ浮かぶ。`, [
    C('📋', '命令どおり名簿を作る', 'safe', '+tokko_order u.men-10 u.morale-15 consc-10', { later: [60, 'post_tokko_parent'] }),
    C('🗣️', '「技量不足で出せない」と時間を稼ぐ', 'gamble', '+tokko_order consc+12', { check: { base: 35, add: { rep: 0.3 } }, win: { e: 'u.trust+15', res: '終戦まで、出撃命令は来なかった。' }, lose: { e: 'rep-15 u.men-6', res: '更迭され、後任が名簿を作った。' } }),
  ], { art: 'airfield', note: '特攻に反対した指揮官の事例（例：芙蓉部隊）も記録されている（史実）。' }),
  E('post_tokko_parent', 'postwar', { modes: ['cmd'], flags: ['war_over'], w: 0 }, `戦後。部下の母親が訪ねてきた。
mother_f|あの子は、最期にどんな顔をしていましたか。`, [C('🙇', '畳に額をつける', 'safe', 'spirit-10 consc+6')], { art: 'village', echo: true }),
  E('cmd_promotion', 'career', c({ w: 2, cd: 30, stat: { rep: [60, 999] } }), `昇進の内示。
staff|おめでとうございます。部隊は増強されます。`, [C('🎖️', '拝命する', 'safe', 'rank+1 u.men+20 rep+4')], { art: 'hq' }),
  E('cmd_letter_men', 'family', c({ w: 3, cd: 12 }), `戦死した部下の家族へ手紙を書く。今月、三通目だ。`, [C('✍️', '一人ひとりの思い出を書く', 'cost', 'spirit-4 consc+5 u.trust+4'), C('📄', '定型文で済ませる', 'safe', 'consc-3')], { art: 'letters' }),
  E('cmd_surrender', 'ops', c({ on: 'h_0815', w: 0 }), `停戦命令。部下が問う。
nco|隊長、我々は……どうすれば。`, [C('🫡', '整然と武装解除し、全員を連れ帰ると誓う', 'safe', 'u.trust+15 spirit+5'), C('😶', '一人になりたい', 'cost', 'u.morale-10')], { art: 'postwar' }),
];
