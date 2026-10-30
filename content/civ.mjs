import { E, C } from './lib.mjs';
const civ = ['civ'];
export const CIV = [
  // ---- daily life ----
  E('civ_226_morning', 'daily', { modes: civ, from: '1936-02', to: '1936-03', w: 0, on: 'h_226' }, `朝、ラジオが途切れがちだ。
neighbor|兵隊が永田町を占領したってよ。
narr|雪の中、市電が止まっている。`, [
    C('🏠', '家にこもって様子を見る', 'safe', 'spirit-1'),
    C('📰', '号外を買いに走る', 'gamble', 'yen-1 rep+1 +news_reader', { res: '紙面は伏字だらけだった。' }),
    C('💼', 'いつも通り職場へ', 'safe', 'yen+2', { res: '職場の誰もが、声をひそめていた。' }),
  ], { art: 'title' }),
  E('civ_payday', 'daily', { modes: civ, w: 4, cd: 12 }, `給料日。袋の中の札を数える。
narr|米一升が{rice}銭。今月はどうにかなりそうだ。`, [
    C('🏦', '郵便貯金に回す', 'safe', 'yen+6 spirit+1'),
    C('🎬', '映画と鰻で贅沢する', 'safe', 'yen-4 spirit+6'),
    C('👪', '実家へ仕送り', 'safe', 'yen-5 r.mother+8'),
  ], { art: 'title' }),
  E('civ_radio', 'daily', { modes: civ, from: '1936-04', to: '1940-06', w: 3 }, `近所で一番早くラジオを買った家に、人が集まっている。
narr|双葉山の取組が始まる。`, [C('📻', '一緒に聞く', 'safe', 'spirit+4 rep+2'), C('💴', '自分も月賦で買う', 'cost', 'yen-12 spirit+6 item:radio')], { art: 'title' }),
  E('civ_cafe', 'daily', { modes: civ, from: '1936-03', to: '1940-06', w: 3 }, `銀座のカフェー。レコードからジャズが流れている。
friend|こういうのも、そのうち駄目になるのかね。`, [C('☕', 'もう一杯頼む', 'safe', 'yen-2 spirit+5'), C('🚶', '早めに帰る', 'safe', 'yen+1')], { art: 'title' }),
  E('civ_berlin_olympics', 'daily', { modes: civ, from: '1936-08', to: '1936-08', w: 8 }, `ラジオから「前畑がんばれ」の絶叫。ベルリン五輪だ。
neighbor|勝った！ 勝ったぞ！`, [C('🙌', '隣近所と喜び合う', 'safe', 'spirit+6 rep+2')], { art: 'title', hist: '史実', note: '1936年8月、前畑秀子が200m平泳ぎで金メダル（史実）' }),
  E('civ_flood', 'daily', { modes: civ, w: 2, cd: 36, bg: ['farm_m', 'farm_f'] }, `長雨で川が溢れた。田んぼが泥に沈んでいる。`, [
    C('🌾', '家族総出で泥をかき出す', 'cost', 'hp-5 yen-5 bond+6'),
    C('🏛️', '村役場に救済を願い出る', 'gamble', 'yen+5 rep-2'),
  ], { art: 'village' }),
  E('civ_tenant', 'daily', { modes: civ, bg: ['farm_m', 'farm_f'], from: '1936-09', w: 4 }, `地主の使いが来た。今年の小作料を上げるという。
father|うちは、もう余裕がない。`, [
    C('🙇', '頭を下げて据え置きを頼む', 'safe', 'rep-1', { check: { base: 45, add: { rep: 0.3 } }, lose: { e: 'yen-10', res: '聞き入れられなかった。' }, res: '今年だけ、という条件で据え置かれた。' }),
    C('✊', '村の小作人と団結して交渉', 'gamble', 'rep+3 +tenant_union', { check: { base: 50 }, lose: { e: 'rep-5 yen-6', res: '警察が来て、世話役が連れて行かれた。' }, res: '地主が折れた。' }),
    C('🏭', '出稼ぎに出る', 'cost', 'yen+10 bond-4 r.mother-3'),
  ], { art: 'village' }),
  E('civ_manchu_settler', 'colonial', { modes: civ, bg: ['farm_m', 'farm_f'], from: '1937-01', to: '1942-12', w: 3, not: ['settler'] }, `村に「満州開拓団」募集のポスターが貼られた。
officer|二十町歩の土地がもらえる。王道楽土だ。
narr|その土地には、もともと誰かが住んでいたはずだ。`, [
    C('🚢', '開拓団に応募する', 'gamble', 'yen+10 +settler', { res: '一家で海を渡ることにした。', later: [18, 'col_settler_land'] }),
    C('🏡', '村に残る', 'safe', 'bond+2'),
  ], { art: 'village', hist: '架空', note: '満州開拓移民は国策として推進された（史実）。敗戦時、約27万人の開拓民の多くが悲惨な逃避行を強いられた。' }),
  E('col_settler_land', 'colonial', { modes: civ, flags: ['settler'], w: 0 }, `開拓団に割り当てられた畑は、すでに耕されていた。
narr|元の持ち主の中国人農民は、安い値で立ち退かされたと聞いた。
farmer_cn|（通訳を介して）ここは父の代からの畑だった。`, [
    C('🤝', '元の持ち主を雇い、正当な賃金を払う', 'cost', 'yen-8 consc+8 +settler_fair'),
    C('🙈', '団の決まりに従う', 'safe', 'consc-6 yen+5'),
  ], { art: 'village', perspective: '中国東北の農民' }),
  E('col_settler_1945', 'colonial', { modes: civ, flags: ['settler', 'soviet_in'], w: 0, auto: 1 }, `ソ連軍が来る。男たちは根こそぎ召集されて、もういない。
narr|団長は「南へ逃げる」と言った。`, [
    C('🚶', '子と年寄りを連れて歩く', 'gamble', 'hp-25 bond+5', { risk: 15, res: 'ひと月歩いた。途中で多くの人が倒れた。' }),
    C('🏠', '中国人の知人を頼る', 'gamble', 'hp-10', { need: ['settler_fair'], res: 'かつて雇った元の持ち主が、一家をかくまってくれた。' }),
  ], { art: 'refugees', echo: true }),
  E('civ_tonarigumi', 'daily', { modes: civ, from: '1940-10', w: 5 }, `隣組の常会。回覧板が回ってくる。
neighbor|防空演習には全戸出ること。欠席は組長に届け出。`, [
    C('🪣', 'バケツリレーに率先して出る', 'safe', 'rep+4 hp-1'),
    C('🙄', '仕事を理由に休む', 'cost', 'rep-4 yen+2'),
  ], { art: 'airraid' }),
  E('civ_ration_line', 'daily', { modes: civ, from: '1941-04', w: 5, cd: 10 }, `配給所の行列。今日は芋と豆かすだけだった。
child|お腹すいた……`, [
    C('🍠', '自分の分を子にやる', 'cost', 'hp-4 bond+5 r.child+5', { need: ['kid1'] }),
    C('🥬', '闇で米を買う', 'gamble', 'yen-15 hp+4', { check: { base: 70 }, lose: { e: 'rep-8 yen-10', res: '経済警察に見つかり、米は没収された。' } }),
    C('🌱', '庭を掘ってかぼちゃを植える', 'safe', 'hp+2 spirit+2'),
  ], { art: 'ration' }),
  E('civ_metal', 'daily', { modes: civ, from: '1941-09', w: 3 }, `金属類回収令。鍋も、寺の鐘も、供出せよという。
mother|あの鉄瓶は、おばあちゃんの嫁入り道具なのに。`, [C('🫖', '供出する', 'safe', 'rep+4 r.mother-5'), C('🕳️', '床下に隠す', 'gamble', 'r.mother+6 rep-2 item:iron_kettle')], { art: 'village', hist: '架空', note: '金属類回収令は1941年8月公布（史実）' }),
  E('civ_pearl_news', 'daily', { modes: civ, on: 'h_pearl', w: 0 }, `朝7時、ラジオの臨時ニュース。
radio|帝国陸海軍は本八日未明、西太平洋において米英軍と戦闘状態に入れり。
narr|どよめく人。黙り込む人。`, [
    C('🎌', '万歳の輪に加わる', 'safe', 'rep+3'),
    C('😶', '黙って家に帰る', 'safe', 'consc+2'),
    C('📝', '日記に「これからどうなる」と書く', 'safe', 'item:my_diary spirit-2', { res: 'その日記は、あとで誰かが読むことになる。' }),
  ], { art: 'title' }),
  E('civ_singapore_lantern', 'daily', { modes: civ, on: 'h_singapore', w: 0 }, `シンガポール陥落の祝賀。提灯行列が町を練り歩く。
narr|子どもたちにはゴムまりが配られた。`, [C('🏮', '行列に加わる', 'safe', 'rep+2 spirit+2'), C('🏠', '家で静かに過ごす', 'safe', 'consc+1')], { art: 'title' }),
  E('civ_midway_rumor', 'daily', { modes: civ, from: '1942-07', to: '1943-06', w: 3 }, `friend|海軍の知り合いが、帰ってこないんだ。
friend|大勝利って新聞は書いてるのに、変だろ。`, [C('🤫', '「滅多なことを言うな」と止める', 'safe', 'rep+1'), C('🗞️', '新聞を疑う', 'gamble', 'consc+4 +doubt_press')], { art: 'navy' }),
  E('civ_tokko_police', 'daily', { modes: civ, flags: ['doubt_press'], w: 3 }, `特高警察の刑事が訪ねてきた。
officer|あなた、最近おかしなことを言っているそうだね。`, [
    C('🙇', '平謝りする', 'safe', 'rep-3 spirit-5'),
    C('🗣️', '「事実を言っただけ」と答える', 'gamble', 'consc+6', { risk: 0, check: { base: 40, add: { rep: 0.3 } }, lose: { e: 'hp-10 rep-10 +detained', res: '三週間、留置場に入れられた。' } }),
  ], { art: 'council' }),
  E('civ_gakuto', 'daily', { modes: civ, bg: ['student_m'], on: 'h_gakuto', w: 0 }, `雨の神宮外苑。銃を担いだ学生が行進する。
friend|俺たちの番が来たんだな。
narr|スタンドの女学生たちが泣いている。`, [C('🚶', '行進する', 'safe', '+call_up +gakuto'), C('📚', '最後の夜に本を読み切る', 'safe', 'spirit+3 +call_up +gakuto')], { art: 'station' }),
  E('civ_teishin', 'daily', { modes: civ, sex: 'f', on: 'h_teishin', w: 0 }, `女子挺身隊として軍需工場に行くことになった。
narr|旋盤の前に立つ。油の匂い。`, [C('🔧', '腕を磨く', 'safe', 'hp-3 rep+3 +factory_f'), C('🤒', '体調を理由に免除を願う', 'gamble', 'rep-5', { check: { base: 35 }, lose: { e: '+factory_f', res: '通らなかった。' } })], { art: 'factory' }),
  E('civ_factory_korean', 'colonial', { modes: civ, from: '1942-01', w: 3, any: ['factory_f'], bg: ['worker_m', 'mill_f', 'shop_m', 'clerk_f'] }, `工場に朝鮮半島から来た若者たちがいる。
worker_kr|故郷には母がいます。来たくて来たわけでは……
narr|宿舎は寒く、外出も制限されていた。`, [
    C('🍙', 'こっそり食べ物を分ける', 'gamble', 'consc+8 rep-2 +helped_kr', { later: [30, 'col_kr_return'] }),
    C('🙈', '関わらない', 'safe', 'consc-3'),
  ], { art: 'factory', perspective: '朝鮮半島からの動員労働者', note: '朝鮮半島からの労務動員（募集・官斡旋・徴用）は史実。呼称・強制性の評価は日韓で議論がある。' }),
  E('col_kr_return', 'colonial', { modes: ['civ', 'mil', 'cmd'], flags: ['helped_kr'], from: '1945-09', w: 0 }, `博多港。帰国船を待つ人波の中で、あの若者が手を振っていた。
worker_kr|あの時のおにぎり、忘れません。
narr|小さな選択が、何年も後に戻ってきた。`, [C('👋', '手を振り返す', 'safe', 'spirit+12 consc+5')], { art: 'postwar', echo: true }),
  E('civ_sokai_kids', 'family', { modes: civ, flags: ['kid1'], on: 'h_sokai', kidAge: [6, 12], w: 0 }, `学童疎開の通知。{child}は先生と一緒に山の寺へ行く。
child|すぐ帰れる？`, [
    C('🎒', '送り出す', 'safe', 'r.child-3 +kid_evacuated', { res: '列車の窓から、小さな手がいつまでも振られていた。' }),
    C('🏡', '縁故疎開で田舎の親戚に預ける', 'cost', 'yen-10 r.child+3 +kid_evacuated'),
    C('🫂', '手元に置く', 'gamble', 'r.child+8 +kid_home'),
  ], { art: 'station' }),
  E('civ_sokai_letter', 'letter', { modes: civ, flags: ['kid_evacuated'], w: 6, letter: true }, `child|おかあさん（おとうさん）へ
child|ぼく（わたし）はげんきです。ごはんはすこしです。
child|夜になるとかえりたくなります。`, [C('✉️', '返事と炒り豆を送る', 'safe', 'yen-2 r.child+10'), C('🚂', '面会に行く', 'cost', 'yen-8 r.child+15 spirit+4')], { art: 'letters' }),
  E('civ_tokyo_raid', 'civilian', { modes: civ, on: 'h_tokyo_raid', w: 0, region: '東京' }, `夜中、空襲警報。空が赤い。
neighbor|川へ逃げろ！ いや、川は駄目だ！
narr|風が、火を連れてくる。`, [
    C('🏃', '風上の広い場所へ逃げる', 'gamble', 'hp-10', { risk: 6 }),
    C('🧯', '隣組の指示どおり消火に残る', 'gamble', 'hp-20 rep+5', { risk: 20 }),
    C('🫂', '家族の手を離さず走る', 'gamble', 'hp-12 bond+10', { risk: 8 }),
  ], { art: 'airraid', onlyIf: { place: ['東京'] } }),
  E('civ_air_raid_generic', 'civilian', { modes: civ, from: '1944-12', to: '1945-08', w: 4, cd: 4, not: ['war_over'] }, `B-29の編隊。焼夷弾が雨のように落ちてくる。
narr|防空壕の中で、誰かが念仏を唱えている。`, [
    C('🕳️', '防空壕で耐える', 'gamble', 'hp-8 spirit-6', { risk: 4 }),
    C('🏃', '郊外へ逃げる', 'gamble', 'hp-6 yen-8', { risk: 3 }),
  ], { art: 'airraid' }),
  E('civ_hiroshima', 'civilian', { modes: civ, on: 'h_hiroshima', w: 0 }, `ラジオは「新型爆弾」とだけ伝えた。
narr|広島に親戚がいる人が、黙って座り込んでいる。`, [C('🙏', 'ただ祈る', 'safe', 'spirit-5'), C('🚂', '救援に行く人を手伝う', 'cost', 'hp-3 consc+5 rep+2')], { art: 'airraid' }),
  E('civ_0815', 'daily', { modes: civ, on: 'h_0815', w: 0 }, `正午。雑音の多いラジオに、皆が頭を垂れる。
narr|言葉は難しくて、よく分からなかった。
neighbor|……負けたのか。`, [
    C('😭', '泣き崩れる', 'safe', 'spirit-5'),
    C('🌤️', '空を見上げる。今夜から灯火管制がない', 'safe', 'spirit+8'),
    C('🧺', '黙って夕飯の支度をする', 'safe', 'bond+4'),
  ], { art: 'postwar' }),
  // ---- husband called up (female civ) ----
  E('civ_husband_called', 'family', { modes: civ, sex: 'f', flags: ['married'], not: ['partner_away', 'partner_dead'], from: '1937-08', w: 4 }, `夕方、役場の兵事係が来た。赤い紙。
partner|……来たか。
narr|{partner}は、意外なほど落ち着いて茶を飲み干した。`, [
    C('🧵', '千人針を集めに町角に立つ', 'safe', 'r.partner+10 item:senninbari_made +partner_away', { later: [30, 'civ_husband_fate'] }),
    C('📷', '写真館で家族写真を撮る', 'cost', 'yen-6 item:family_photo +partner_away', { later: [30, 'civ_husband_fate'] }),
  ], { art: 'station', note: '召集令状（いわゆる赤紙）は在郷軍人（予備役・後備役・補充兵役）に対して出された（史実）。' }),
  E('civ_letter_from_front', 'letter', { modes: civ, flags: ['partner_away'], w: 7, letter: true }, `partner|拝啓
partner|こちらは元気にしている。食事も十分だ。
partner|子どもたちに、父は元気だと伝えてくれ。
narr|ところどころ、検閲の墨が塗られていた。`, [C('✍️', '家のことは心配いらないと書く', 'safe', 'r.partner+6'), C('📸', '子の写真を同封する', 'cost', 'yen-2 r.partner+10')], { art: 'letters' }),
  E('civ_husband_fate', 'family', { modes: civ, flags: ['partner_away'], w: 0 }, `郵便受けに、役場からの封筒。
narr|手が震えて、すぐには開けられない。`, [C('✉️', '開ける', 'gamble', '', { fate: 'partner' })], { art: 'letters' }),
  E('civ_death_notice', 'family', { modes: civ, flags: ['partner_dead_notice'], w: 0, auto: 1 }, `戦死公報。
narr|白木の箱が届いた。中には、名前を書いた紙が一枚だけ入っていた。
mother|……骨も、帰ってこないのかい。`, [
    C('🕯️', '箱を仏壇に置き、子と手を合わせる', 'safe', 'spirit-20 bond+5 +partner_dead'),
    C('📦', '最後の手紙と一緒にしまう', 'safe', 'spirit-15 item:last_letter +partner_dead'),
  ], { art: 'letters', note: '遺骨が還らず、白木の箱に紙や石だけが入っていた例は多数記録されている（史実）。' }),
  E('civ_husband_back', 'family', { modes: civ, flags: ['partner_back'], w: 0, auto: 1 }, `玄関に、痩せた男が立っていた。
partner|……ただいま。
narr|声で分かった。顔は、知らない人のようだった。`, [C('🫂', '駆け寄る', 'safe', 'spirit+20 bond+15 r.partner+15 -partner_away'), C('🍚', '黙って一番いい茶碗にご飯をよそう', 'safe', 'spirit+15 bond+15 -partner_away')], { art: 'postwar', tags: ['reunion'] }),
  // ---- jobs & work ----
  E('civ_job_teacher', 'work', { modes: civ, bg: ['teacher_f'], from: '1938-01', w: 4 }, `校長が言う。
boss|子どもたちに、もっと戦意を持たせる授業を。
narr|教室の子らは、紙芝居の兵隊に夢中だ。`, [C('📘', '指示どおり教える', 'safe', 'rep+4 consc-4'), C('🌸', '詩と算数の時間を守る', 'gamble', 'consc+5 rep-3', { later: [80, 'post_teacher_memory'] })], { art: 'village' }),
  E('post_teacher_memory', 'postwar', { modes: civ, bg: ['teacher_f'], flags: ['war_over'], w: 0 }, `戦後、墨で教科書を塗りつぶす日。
narr|教え子の一人が言った。
child|先生の詩の時間だけは、塗らなくていいね。`, [C('🖌️', '一緒に墨を塗る', 'safe', 'spirit+10 consc+3')], { art: 'village', echo: true }),
  E('civ_job_nurse', 'work', { modes: civ, bg: ['nurse_f'], from: '1937-09', w: 4 }, `日赤から従軍看護婦の召集が来た。
mother|女のあんたまで行くことはないよ。`, [C('🩺', '応じる', 'gamble', '+deployed +nurse_front rep+6', { res: '病院船に乗った。' }), C('🏥', '内地の陸軍病院を希望する', 'safe', 'rep+2')], { art: 'station', note: '日本赤十字社の救護看護婦は戦時召集を受けた（史実）。' }),
  E('civ_nurse_ward', 'military', { modes: civ, flags: ['nurse_front'], w: 5, cd: 6 }, `病院船の船室。十九の兵が、母を呼びながら熱にうなされている。
soldier|看護婦さん……手、握ってて。`, [C('🤝', '朝まで手を握る', 'cost', 'hp-3 spirit-3 consc+6'), C('📝', '彼の母への手紙を代筆する', 'safe', 'consc+5 item:soldier_letter')], { art: 'hospital' }),
  E('civ_job_reporter', 'work', { modes: civ, bg: ['reporter_m'], from: '1937-12', w: 4 }, `デスクが原稿を突き返す。
boss|「苦戦」は駄目だ。検閲で通らん。「激闘」にしろ。`, [C('✏️', '書き直す', 'safe', 'yen+3 consc-4'), C('🗄️', '元原稿を自宅に保管する', 'gamble', 'consc+6 item:true_draft', { later: [90, 'post_reporter_draft'] })], { art: 'council' }),
  E('post_reporter_draft', 'postwar', { modes: civ, bg: ['reporter_m'], flags: ['war_over'], items: ['true_draft'], w: 0 }, `押入れから、あの日の原稿が出てきた。
narr|載せられなかった言葉が、そこにあった。`, [C('🗞️', '戦後の新聞に寄稿する', 'gamble', 'rep+8 consc+8'), C('🔥', '燃やす', 'cost', 'spirit-6')], { art: 'letters', echo: true }),
  E('civ_job_worker', 'work', { modes: civ, bg: ['worker_m', 'mill_f'], from: '1936-06', w: 4, cd: 18 }, `工場で賃下げの噂。
friend|組合を作ろうって話がある。お前も来るか。`, [C('✊', '集会に出る', 'gamble', 'rep+3 +union', { check: { base: 50 }, lose: { e: 'yen-10 rep-4', res: '首謀者として解雇された。' } }), C('🔩', '黙って働く', 'safe', 'yen+3')], { art: 'factory' }),
  E('civ_job_munitions', 'work', { modes: civ, bg: ['worker_m', 'shop_m', 'student_m'], from: '1939-01', w: 3 }, `軍需工場から誘いが来た。給料は倍だ。
boss|ここで働けば、召集も延期になりやすい。`, [C('🏭', '移る', 'safe', 'yen+15 +defer_job'), C('🏪', '家業を守る', 'cost', 'r.father+8 yen-3')], { art: 'factory', note: '軍需産業の熟練工には召集延期の措置があった（史実）。' }),
  E('civ_shop_control', 'work', { modes: civ, bg: ['shop_m'], from: '1940-07', w: 4 }, `統制で品物が入らない。店の棚が空いていく。
father|もう、商売にならん。`, [C('🧾', '配給の取扱店になる', 'safe', 'yen+5 rep+2'), C('🌙', '闇で仕入れる', 'gamble', 'yen+15', { check: { base: 60 }, lose: { e: 'yen-20 rep-10', res: '摘発された。' } }), C('🔒', '店を畳む', 'cost', 'yen-10 r.father-10 spirit-8')], { art: 'title' }),
  E('civ_student_reading', 'daily', { modes: civ, bg: ['student_m'], from: '1936-04', to: '1940-12', w: 4 }, `下宿の友人が、発禁の本を回してきた。
friend|読んだら次へ。誰にも言うなよ。`, [C('📕', '読む', 'gamble', 'spirit+4 consc+3'), C('🙅', '断る', 'safe', 'rep+1')], { art: 'letters' }),
  E('civ_clerk_typing', 'work', { modes: civ, bg: ['clerk_f'], w: 4, cd: 24 }, `丸の内の商社でタイプを打つ。
boss|君は英語ができるね。南方の資料を頼むよ。`, [C('⌨️', '引き受ける', 'safe', 'yen+5 rep+3'), C('🏠', '結婚退職を考える', 'safe', 'spirit+1')], { art: 'council' }),
  // ---- conscription system (civ male) ----
  E('consc_exam', 'military', { modes: civ, sex: 'm', age: [20, 26], not: ['examined'], w: 0, auto: 1 }, `徴兵検査の日。褌一つで並ばされる。
officer|身長、体重、視力。次！
narr|結果で、人生が分かれる。`, [C('🧍', '検査を受ける', 'gamble', '', { conscript: 'exam' })], { art: 'barracks', note: '兵役法（1927年）により男子は満20歳で徴兵検査を受けた。1943年12月の特例で1944年から19歳に（史実）。' }),
  E('consc_enlist', 'military', { modes: civ, flags: ['to_barracks'], w: 0, auto: 1 }, `入営の日。村の人が駅まで送ってくれる。
mother|体に気をつけてね。……ちゃんと食べるんだよ。`, [C('🎌', '入営する', 'safe', '+deployed +call_up', { become: 'mil' })], { art: 'station' }),
  E('consc_redpaper', 'military', { modes: civ, sex: 'm', flags: ['reserve', 'redpaper_due'], not: ['deployed', 'to_barracks'], w: 0, auto: 1 }, `役場の兵事係が来た。
officer|おめでとうございます。
narr|赤い紙。臨時召集令状。入営は五日後。`, [C('📜', '受け取る', 'safe', '+to_barracks +call_up')], { art: 'station', note: '召集は年齢・兵役区分・健康・職業・時期によって大きく異なった（史実）。' }),
  // ---- affected peoples perspectives ----
  E('col_korea_school', 'colonial', { modes: civ, from: '1938-04', w: 2, bg: ['teacher_f'] }, `朝鮮から来た教員仲間が言う。
teacher_kr|向こうでは、学校で朝鮮語を使うと罰を受けるんです。
narr|1938年の教育令改正で、朝鮮語は随意科目にされた。`, [C('👂', '話をじっくり聞く', 'safe', 'consc+6 +knows_korea'), C('🤐', '話題を変える', 'safe', 'consc-2')], { art: 'village', perspective: '朝鮮半島の人々', hist: '架空', note: '第三次朝鮮教育令（1938）による朝鮮語の随意科目化は史実。' }),
  E('col_taiwan_letter', 'colonial', { modes: civ, from: '1941-01', w: 2 }, `台湾の友人からの便り。
friend_tw|改姓名をすれば、配給がよくなると役人に言われました。
friend_tw|名前は、祖父がくれたものなのに。`, [C('✍️', '気持ちを汲んだ返事を書く', 'safe', 'consc+5')], { art: 'letters', perspective: '台湾の人々', note: '台湾でも皇民化政策の一環として改姓名が進められた（史実）。' }),
  E('col_sea_romusha', 'colonial', { modes: ['civ', 'mil'], from: '1943-01', w: 2 }, `ジャワから帰った商社員の話。
friend|「ロームシャ」として連れて行かれた村人は、戻ってこないそうだ。
narr|インドネシアでは、多数の労務者が各地の工事に動員された。`, [C('🗒️', 'その話を書き留める', 'safe', 'consc+5 item:romusha_note'), C('🙉', '聞かなかったことにする', 'safe', 'consc-3')], { art: 'refugees', perspective: '東南アジアの人々' }),
  E('col_philippines', 'colonial', { modes: ['mil'], from: '1942-03', w: 2, not: ['alt_us_deal'] }, `占領下のマニラ。物資不足で米の値段は何倍にもなった。
woman_ph|（英語で）子どもに食べさせるものがないの。`, [C('🍚', '乾パンを分ける', 'gamble', 'consc+6 rep-2'), C('🚶', '通り過ぎる', 'safe', 'consc-2')], { art: 'refugees', perspective: 'フィリピンの人々' }),
  E('col_china_village', 'warcrime', { modes: ['mil', 'cmd'], from: '1937-09', to: '1945-08', w: 3, not: ['alt_china_truce'], cd: 18 }, `徴発の命令。村の食糧を「調達」せよという。
farmer_cn|（身振りで）これを持っていかれたら、冬を越せない。`, [
    C('💴', '軍票で対価を払う', 'cost', 'consc+6 rep-2'),
    C('📦', '命令どおり持ち去る', 'safe', 'consc-8 u.supply+5'),
    C('🙅', '半分だけにするよう上官に掛け合う', 'gamble', 'consc+4', { check: { base: 40, add: { rep: 0.3 } }, lose: { e: 'rep-6', res: '殴られた。' } }),
  ], { art: 'refugees', perspective: '中国の農民', note: '現地徴発による住民の困窮は日中双方の史料に見られる。' }),
];
