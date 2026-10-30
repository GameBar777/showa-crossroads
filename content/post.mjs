import { E, C } from './lib.mjs';
const ALL = ['civ', 'mil', 'cmd', 'state'];
export const POST = [
  E('post_blackmarket', 'postwar', { modes: ['civ'], flags: ['war_over'], w: 5, cd: 6 }, `焼け跡の闇市。芋一本が配給の何倍もの値段だ。
narr|復員兵も、戦争孤児も、みんなここにいる。`, [C('💴', '着物を売って米を買う', 'cost', 'yen+10 hp+5'), C('🧺', '自分も露店を出す', 'gamble', 'yen+15 rep-2'), C('🍠', '配給だけで耐える', 'gamble', 'hp-8', { risk: 2 })], { art: 'postwar' }),
  E('post_orphan', 'postwar', { modes: ['civ'], flags: ['war_over'], w: 3 }, `上野の地下道。靴磨きの少年がいる。
orphan|おじさん（おばさん）、磨こうか。……親？ 三月十日に、いなくなった。`, [C('🍙', '弁当を分ける', 'cost', 'hp-3 consc+6'), C('🏠', '家に連れて帰る', 'gamble', 'yen-10 bond+10 +took_orphan', { res: 'その子は、のちに家族になった。' })], { art: 'postwar', note: '戦災孤児は1948年の厚生省調査で約12万人（史実）。' }),
  E('post_vote', 'postwar', { modes: ['civ'], sex: 'f', on: 'h_election46', w: 0 }, `生まれて初めての投票所。
mother|あんたの一票と、旦那の一票は同じなんだってさ。`, [C('🗳️', '自分の考えで書く', 'safe', 'spirit+10 consc+3'), C('🗳️', '家の言うとおりに書く', 'safe', 'spirit+2')], { art: 'postwar' }),
  E('post_return_kid', 'family', { modes: ['civ'], flags: ['kid_evacuated', 'war_over'], w: 0, auto: 1 }, `疎開先から{child}が帰ってきた。背が伸びて、ひどく痩せている。
child|ただいま。……家、どこ？`, [C('🫂', '抱きしめる', 'safe', 'bond+15 r.child+15 -kid_evacuated')], { art: 'postwar' }),
  E('post_land_reform', 'postwar', { modes: ['civ'], bg: ['farm_m', 'farm_f'], from: '1946-10', w: 5 }, `農地改革。小作地が、安い値で小作人に渡されるという。
father|……うちの田んぼに、なるのか。`, [C('🌾', '申請する', 'safe', 'yen+15 spirit+10')], { art: 'village' }),
  E('post_bc_trial', 'postwar', { modes: ['mil', 'cmd'], flags: ['war_over'], from: '1946-01', w: 3 }, `BC級戦犯の容疑で、元部隊の者が呼び出されている。
narr|命令した者と、実行した者と。裁きの線引きは、たやすくない。`, [C('🗣️', '知っていることを証言する', 'gamble', 'consc+8 rep-4'), C('🤐', '口を閉ざす', 'safe', 'consc-4')], { art: 'council', note: 'BC級戦犯裁判は連合国各国によりアジア各地で行われた（史実）。朝鮮・台湾出身の軍属も裁かれた。' }),
  E('post_kr_soldier', 'colonial', { modes: ['mil', 'cmd'], flags: ['war_over'], w: 2 }, `収容所で会った、朝鮮出身の元捕虜監視員。
guard_kr|日本人として裁かれ、戦後は日本人ではないと言われる。……私は誰なんだ。`, [C('👂', '黙って話を聞く', 'safe', 'consc+6')], { art: 'barracks', perspective: '朝鮮・台湾出身の軍人・軍属' }),
  E('post_okinawa_voice', 'colonial', { modes: ALL, flags: ['war_over'], from: '1945-09', w: 2, not: ['alt_us_deal', 'alt_early_peace'] }, `沖縄から本土に来た人の話。
okinawan|島の人の四人に一人が死んだ。壕から追い出された家族もいた。`, [C('🙏', '耳を傾ける', 'safe', 'consc+6')], { art: 'refugees', perspective: '沖縄の住民', note: '沖縄戦では住民約9万4千人が犠牲になったとされる（沖縄県）。' }),
  E('post_alt_world', 'postwar', { modes: ALL, flags: ['war_over'], any: ['alt_us_deal', 'alt_early_peace'], w: 4, once: true }, `【改変世界】戦争のない（あるいは早く終わった）日本。
narr|街には焼け跡が少ない。だが軍部は残り、植民地支配も続いている。
narr|「救われたもの」と「救われなかったもの」の両方が、ここにある。`, [C('🧭', 'この世界の行方を見つめる', 'safe', 'spirit+4')], { art: 'title', hist: '改変' }),
  E('post_ending_soon', 'postwar', { modes: ALL, from: '1947-03', w: 3, once: true }, `春。新しい憲法の施行が近い。
narr|あの十年を振り返る。`, [C('📖', '思い出を整理する', 'safe', 'spirit+3')], { art: 'postwar' }),
  E('post_kid_question', 'family', { modes: ALL, flags: ['war_over', 'kid1'], kidAge: [7, 30], w: 4 }, `child|ねえ、戦争って、なんで始まったの？`, [C('🗣️', '分かる範囲で正直に話す', 'safe', 'r.child+10 consc+4'), C('🤐', '「大人の事情だ」とごまかす', 'safe', 'r.child-4')], { art: 'postwar' }),
];
