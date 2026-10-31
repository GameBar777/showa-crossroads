// Multi-stage front chains (戦地の連続展開). Each node links to the next via `later`. 背景の戦役は史実、個人の物語は架空。
import { E, C } from './lib.mjs';
const A = ['army'];
// F: chain node (w:0, reached only through `later`). nx(id, m) = later link
const F = (id, lines, choices, x = {}, cond = {}) => E(id, 'front', { modes: ['mil'], w: 0, ...cond }, lines, choices, { art: 'refugees', ...x });
const nx = (id, m = 0) => ({ later: [m, id] });
const NB = (s) => ({ note: s, sources: ['nids', 'jacar'] });

// ================= 中国大陸（上海→徐州→武漢→警備） =================
export const CHINA = [
  F('cn_01', `輸送船の船倉。三段の蚕棚に、兵が詰め込まれている。
narr|行き先は「北支」とも「上海」とも噂された。誰も知らない。
senior|いいか、初年兵。向こうに着いたら、水は生で飲むな。死ぬぞ。
friend|……おふくろの千人針、腹に巻いとけって言われた。お前もか？`, [
    C('🧵', '千人針を腹に巻き、黙って目を閉じる', 'safe', 'spirit+4', nx('cn_02')),
    C('🃏', '古参兵の花札に誘われて加わる', 'gamble', 'yen-2 r.friend+4 spirit+2', { res: '古参兵が上陸地の噂を小声で教えてくれた。「呉淞（ウースン）だとよ」', ...nx('cn_02') }),
  ], { art: 'navy', img: 'cn_flagship', ...NB('1937年8月以降、上海派遣軍として多数の師団が輸送船で上海方面へ送られた（史実）。') }),
  F('cn_02', `夜明け前、上陸用の舟艇に移る。岸から機関銃の音。
narr|隣の舟艇に水柱が上がり、舟が傾いた。人が、黒い点になって海に落ちていく。
officer|頭を下げろ！ 着いたら走れ、止まるな！`, [
    C('🏃', '着岸と同時に土手まで走り抜ける', 'gamble', 'hp-4 rep+4', { risk: 4, ...nx('cn_03') }),
    C('🛟', '海に落ちた兵に銃床を差し出して引き上げる', 'gamble', 'hp-6 consc+6 r.friend+6', { risk: 7, res: '引き上げたのは、隣村の出の一等兵だった。', ...nx('cn_03') }),
  ], { img: 'cn_landing', ...NB('上海戦では呉淞・川沙口・白茆口などへの上陸作戦が行われ、上陸直後から大損害が出た（史実）。') }),
  F('cn_03', `上陸三日目。クリーク（水路）が縦横に走る平野。家々の土壁が銃眼に変わっている。
narr|夜、どこからともなく撃たれる。眠れば死ぬ、と古参兵が言う。
friend|……なあ、今の音、こっちに近づいてないか。`, [
    C('👂', '交代で寝ずの番をする', 'safe', 'hp-4 spirit-4 r.friend+6', nx('cn_04')),
    C('😴', '疲労に負けて眠る', 'gamble', 'hp+3', { check: { base: 60 }, win: { e: 'spirit+2', res: '何事もなく朝が来た。', later: [0, 'cn_04'] }, lose: { e: 'hp-10 rep-6 +wounded', res: '夜襲。肩に破片を受けた。班長に「寝ていたな」と殴られた。', later: [0, 'cn_04'] } }),
  ], { img: 'cn_baoshan', ...NB('上海周辺はクリークの多い地形で、中国軍のトーチカ陣地による頑強な抵抗があった（史実）。') }),
  F('cn_04', `前進命令。目の前のクリークの向こうに、敵のトーチカ。
officer|渡河して突撃する。第一分隊、前へ！
narr|水は胸まである。銃を頭の上に掲げて進むしかない。`, [
    C('🎌', '先頭で水に入る', 'gamble', 'rep+8 hp-8', { risk: 12, res: '向こう岸に這い上がったとき、後ろを振り返る勇気はなかった。', ...nx('cn_05') }),
    C('🛡️', '分隊の真ん中で、前の背中だけを見て進む', 'gamble', 'hp-6', { risk: 7, ...nx('cn_05') }),
    C('🧠', '上流の浅瀬を偵察してから渡ろうと進言する', 'gamble', 'rep+2', { check: { base: 45, add: { rep: 0.3 } }, win: { e: 'rep+6 r.friend+5', res: '浅瀬が見つかり、分隊の損害は少なかった。', later: [0, 'cn_05'] }, lose: { e: 'rep-8 hp-8', res: '「臆病者が」。結局、正面から渡らされた。', later: [0, 'cn_05'] } }),
  ], { img: 'cn_suzhou', ...NB('蘇州河など水路をめぐる渡河戦は上海戦の激戦の一つだった（史実）。') }),
  F('cn_05', `戦闘のあと。泥の中に、さっきまで話していた顔がある。
comrade|……分隊長が、やられた。
narr|遺体から小指を切り取り、焼いて遺骨にする。それが戦場の習わしだと教えられた。`, [
    C('🕯️', '遺骨袋を預かり、名前を手帳に書く', 'cost', 'spirit-10 consc+4 item:friend_letter', nx('cn_06', 1)),
    C('😶', '見ないようにして、次の命令を待つ', 'safe', 'spirit-6', nx('cn_06', 1)),
  ], { img: 'cn_sihang_north', note: '戦死者の遺骨を小指などで持ち帰る慣行は多くの従軍記に記されている（史実）。', sources: ['nids', 'mhlw'] }),
  F('cn_06', `燃える街。逃げ遅れた住民が、焼け跡の中に座り込んでいる。
villager_cn|（老人が、何かを繰り返し言っている。言葉は分からない）
narr|分隊の誰かが、老人の抱えた袋を取り上げようとした。`, [
    C('✋', '「やめろ」と止める', 'gamble', 'consc+10 rep-4', { check: { base: 50, add: { rep: 0.2 } }, win: { res: '相手は舌打ちして離れた。老人は袋を抱えたまま、何度も頭を下げた。', later: [0, 'cn_07'] }, lose: { e: 'hp-5 rep-4', res: '古参兵に殴られた。「支那人の肩を持つのか」', later: [0, 'cn_07'] } }),
    C('😶', '目をそらす', 'cost', 'consc-6 spirit-6', nx('cn_07', 1)),
  ], { img: 'cn_zhabei_fire', perspective: '上海の市民', note: '上海戦では閘北など市街地が大規模に焼失し、多数の民間人が犠牲・避難民となった（史実）。加害行為は選択肢として遊戯化しない。', sources: ['mofa_jc', 'nids'] }),
  F('cn_07', `一か月ぶりに軍事郵便が届いた。泥だらけの手で封を切る。
mother|「お前の無事を、毎朝氏神様に祈っています。こちらは皆元気です。稲刈りは隣組の皆さんが手伝ってくれました」
narr|検閲があるから、こちらからは場所も、戦闘のことも書けない。`, [
    C('✉️', '「元気です。心配無用」とだけ書く', 'safe', 'spirit+6 r.mother+6', nx('cn_08', 1)),
    C('✍️', '検閲をくぐるように「寒い。食べ物が足りない」と書き添える', 'gamble', 'r.mother+8', { check: { base: 55 }, win: { e: 'spirit+4', res: '手紙はそのまま出た。', later: [1, 'cn_08'] }, lose: { e: 'rep-6 spirit-4', res: '中隊長に呼ばれ、書き直しを命じられた。', later: [1, 'cn_08'] } }),
  ], { letter: true, art: 'letters', note: '軍事郵便は検閲され、部隊の所在や戦況を書くことは禁じられた（史実）。', sources: ['ndl', 'jacar'] }),
  F('cn_08', `上海が落ちても、戦争は終わらなかった。部隊は西へ、南京へ向かえと命じられる。
narr|補給が追いつかない。「現地調達」――村から食糧を取ってこいという意味だ。
friend|正月には帰れる、って言ってたよな……。`, [
    C('🥾', '黙って歩く', 'safe', 'hp-6 spirit-4', nx('cn_09', 1)),
    C('🍚', '自分の乾パンを{friend}と分け合う', 'cost', 'hp-4 r.friend+10', nx('cn_09', 1)),
  ], { img: 'cn_smokeflag', note: '上海戦後、中支那方面軍は統制線を越えて南京へ急進し、補給不足から徴発（略奪を含む）が横行した（史実）。', sources: ['mofa_jc', 'nids'] }),
  F('cn_09', `行軍の途中、足が上がらなくなる兵が続出する。
medic|赤痢だ。水だよ、水。生水を飲んだやつから倒れてる。
narr|自分も、腹の底が冷たく重い。`, [
    C('💊', '衛生兵に正直に申告する', 'gamble', 'hp-4', { check: { base: 55, add: { hp: 0.3 } }, win: { e: 'hp+4', res: '早めの手当てで、数日で歩けるようになった。', later: [0, 'cn_10'] }, lose: { e: 'hp-14 +sick', res: '野戦病院へ後送された。', later: [0, 'cn_09h'] } }),
    C('😤', '隠して歩き続ける', 'gamble', 'rep+3 hp-10', { risk: 5, ...nx('cn_10') }),
  ], { art: 'hospital', img: 'cn_hungjao', note: '日中戦争では戦病（赤痢・マラリア・脚気など）による死者・後送者が非常に多かった（史実）。', sources: ['nids'] }),
  F('cn_09h', `野戦病院。といっても、焼け残った寺の本堂に藁を敷いただけだ。
nurse|ここでは薬が足りないの。食べられるだけ、食べて。
narr|夜ごと、隣の寝床が空いていく。`, [
    C('🍵', '重湯を少しずつ流し込む', 'gamble', 'hp+10 -sick', { risk: 6, res: '二週間で原隊へ戻された。', ...nx('cn_10') }),
    C('✉️', '看護婦に家族への手紙の代筆を頼む', 'safe', 'r.mother+6 spirit+4 hp+4 -sick', nx('cn_10')),
  ], { art: 'hospital', note: '野戦病院・兵站病院の環境は劣悪で、戦病死が多かった（史実）。', sources: ['nids'] }),
  F('cn_10', `南京城外。城壁の向こうで砲声が続く。
officer|城内掃討。抵抗する者は容赦するな。
narr|命令は曖昧で、何を「敵」とするのかは、現場に投げ出されていた。`, [
    C('🙅', '投降した者は連行だけにとどめるよう、分隊に言う', 'gamble', 'consc+12 rep-6', { check: { base: 45, add: { rep: 0.2 } }, lose: { e: 'hp-6 rep-6', res: '上官に殴り倒された。' }, later: [1, 'cn_11'] }),
    C('😶', '何もできず、目を背ける', 'cost', 'consc-6 spirit-12 +saw_atrocity', nx('cn_11', 1)),
  ], { img: 'cn_north_station', perspective: '南京の市民・捕虜', note: '南京攻略戦（1937年12月）。南京事件の存在は日本政府も認めている。犠牲者数には諸説ある（外務省見解）。', sources: ['mofa_qa', 'mofa_jc'] }),
  F('cn_11', `年が明けた。南京で迎えた正月。餅の代わりに、配られた羊羹が一切れ。
narr|内地の新聞は「南京陥落」の提灯行列を伝えているらしい。
friend|俺たち、帰れるのか？ 終わったんだろ？
narr|誰も答えない。次は徐州だ、という噂が流れた。`, [
    C('🗾', '故郷の方角を向いて手を合わせる', 'safe', 'spirit+4', nx('cn_12', 3)),
    C('📓', '日記に、見たことを書き残す', 'gamble', 'consc+6 item:my_diary', { check: { base: 60 }, win: { res: '日記は背嚢の底に隠した。', later: [3, 'cn_12'] }, lose: { e: 'rep-6', res: '所持品検査で見つかり、数ページを破られた。', later: [3, 'cn_12'] } }),
  ], { img: 'cn_refugees', note: '南京陥落は内地で祝賀行事が行われたが、戦争は長期化した（史実）。', sources: ['ndl'] }),
  F('cn_12', `徐州作戦。地平線まで麦畑。昼は暑く、夜は凍える。
narr|台児荘では、友軍が大きな損害を出して退いたと聞いた。道端には焼けたトラックが転がっている。
senior|ここは、いつ囲まれるか分からん。弾は大事に使え。`, [
    C('🌾', '麦畑の中を匍匐で前進する', 'gamble', 'hp-6', { risk: 8, ...nx('cn_13') }),
    C('💧', '水筒の水を負傷兵に回す', 'cost', 'hp-6 consc+5 r.friend+5', { risk: 6, ...nx('cn_13') }),
  ], { img: 'cn_taierzhuang', note: '1938年3〜4月の台児荘の戦いで日本軍は損害を受け後退、その後徐州作戦が行われた（史実）。', sources: ['nids', 'mofa_jc'] }),
  F('cn_13', `迫撃砲弾が、すぐ近くで炸裂した。
narr|耳が聞こえない。{friend}の口が動いているが、何を言っているのか分からない。
narr|脚が、温かく濡れている。`, [
    C('🩸', '自分で止血し、這って壕へ戻る', 'gamble', 'hp-14 +wounded', { risk: 10, res: '衛生兵が「骨は無事だ」と言った。', ...nx('cn_14') }),
    C('🤝', '{friend}に担いでもらう', 'gamble', 'hp-10 r.friend+12 +wounded', { check: { base: 55, add: { 'r.friend': 0.3 } }, win: { res: '{friend}の背中で、気を失った。', later: [0, 'cn_14'] }, lose: { e: 'hp-10', res: '二人とも倒れ込み、夜まで動けなかった。', later: [0, 'cn_14'] } }),
  ], { img: 'cn_railway', note: '従軍者の多くが戦傷を負い、後送・帰還した（史実）。', sources: ['mhlw'] }),
  F('cn_14', `兵站病院。窓の外で、また別の部隊が前線へ向かう。
nurse|内地還送の名簿、あなたの名前はまだないわ。
narr|傷が治れば、また戻される。治らなければ、帰れる。そんなことを考えてしまう自分が怖い。`, [
    C('🙏', '治ったら原隊に戻ると軍医に言う', 'safe', 'rep+6 hp+8 -wounded', nx('cn_15', 4)),
    C('🤐', '痛みを大げさに訴え、還送を待つ', 'gamble', 'hp+6', { check: { base: 35 }, win: { e: '-wounded', res: '内地還送が決まった。', later: [0, 'cn_end_home'] }, lose: { e: 'rep-8 -wounded', res: '軍医は冷たく「原隊復帰」と書いた。', later: [4, 'cn_15'] } }),
  ], { art: 'hospital', img: 'cn_gasmask', note: '傷病兵の内地還送（史実）。', sources: ['mhlw'] }),
  F('cn_15', `武漢攻略のあと、戦線は動かなくなった。部隊は占領地の警備に回る。
narr|昼は静か。夜は、遊撃隊がどこからともなく線路を爆破する。村人の誰が敵なのか、分からない。
villager_cn|（村の老人が、黙って鶏を差し出した）`, [
    C('💴', '代金を払って受け取る', 'safe', 'yen-3 consc+6', nx('cn_16', 2)),
    C('🙅', '受け取らない', 'safe', 'consc+3', nx('cn_16', 2)),
  ], { img: 'cn_snlf', note: '1938年10月の武漢・広東攻略後、戦線は膠着し、日本軍は点と線の占領と治安戦に追われた（史実）。', sources: ['mofa_jc', 'nids'] }),
  F('cn_16', `中隊事務室に呼ばれた。准尉が名簿を指でなぞる。
officer|……お前の年次は、満期だ。だが、帰すとは言っておらん。
narr|帰れる者と、残される者。理由は誰にも分からない。`, [
    C('🚢', '帰還の知らせを待つ', 'gamble', '-chain +cn_done', { check: { base: 50 }, win: { res: '帰還部隊に名前があった。', later: [0, 'cn_end_home'] }, lose: { e: 'spirit-10', res: '残留。次の冬も、ここで越すことになった。' } }),
    C('🪖', '残って、分隊の若い兵を守ると決める', 'cost', '-chain +cn_done rep+6 spirit-6 consc+4', { res: '「馬鹿だな」と{friend}が笑い、肩を叩いた。' }),
  ], { art: 'barracks', img: 'cn_hungjao', note: '日中戦争期、満期兵の除隊延期と再召集は広く行われた（史実）。', sources: ['jacar'] }),
  F('cn_end_home', `帰還。故郷の駅。日の丸の小旗が揺れている。
mother|……よう帰った。よう帰った。
narr|あの街の煙の匂いが、まだ服に残っている気がする。在郷軍人名簿に、名前は残ったままだ。`, [
    C('🍚', '母の炊いた白米を食べる', 'safe', '-at_front -china_front -deployed -chain +cn_done +mankki_done spirit+12 hp+6 r.mother+10', { later: [24, 'mil_recall'] }),
  ], { art: 'station', img: 'hm_boy', note: '帰還兵の多くは後に再召集された（史実）。駅頭の写真は戦死した父の遺影を抱く少年（1939年）。', sources: ['jacar'] }),
];

// ================= 満洲・ソ連国境 =================
export const MANCHU = [
  E('mn_00', 'front', { modes: ['mil'], branch: A, from: '1938-07', to: '1941-10', not: ['at_front', 'chain'], w: 0, auto: 1 }, `配属先は、関東軍。満洲だ。
narr|貨車に揺られて朝鮮半島を北へ。窓の外の景色から、木が消えていく。
senior|ソ連は目と鼻の先だ。冬は零下30度。小便が凍るぞ。`, [
    C('🚂', '北へ向かう', 'safe', '+at_front +deployed +chain +manchu_front', nx('mn_01')),
  ], { art: 'station', img: 'hm_nagoya', note: '関東軍は1941年の関特演で約70万に増強された（史実）。', sources: ['nids'] }),
  E('mn_00b', 'front', { modes: ['mil'], branch: A, from: '1945-02', to: '1945-07', not: ['at_front', 'chain'], w: 0, auto: 1 }, `根こそぎ動員。四十を過ぎた者も、病み上がりも、満洲の部隊へ送られる。
narr|小銃は三人に一挺。銃剣のない者もいる。
comrade|精鋭は、みんな南方に引き抜かれたらしい。`, [
    C('🚂', '国境の陣地へ向かう', 'safe', '+at_front +deployed +chain +manchu_front +mn_late', nx('mn_05', 1)),
  ], { art: 'station', img: 'hm_nagoya', note: '1945年、南方転用で弱体化した関東軍は在満邦人の「根こそぎ動員」で兵員を補った（史実）。', sources: ['nids', 'mhlw'] }),
  F('mn_01', `国境の守備隊。地平線の向こうまで草原。監視哨から、ソ連側の監視塔が見える。
nco|向こうも双眼鏡でこっちを見とる。気を抜くな。
narr|一日中、何も起きない。何も起きないことが、神経をすり減らす。`, [
    C('🔭', '監視の当番を真面目に勤める', 'safe', 'rep+4 spirit-3', nx('mn_02', 1)),
    C('🃏', '交代時間に将棋を指して気を紛らす', 'safe', 'spirit+3 r.friend+5', nx('mn_02', 1)),
  ], { art: 'barracks', img: 'mn_aa', note: '満ソ国境では1930年代後半、国境紛争が頻発した（史実）。', sources: ['nids'] }),
  F('mn_02', `近くの開拓団の村へ、警備に出た。
settler|兵隊さん、ここの土は固くて。最初の冬に、子どもを二人亡くしました。
narr|村の女性たちが、銃の扱いを習っていた。`, [
    C('🧑‍🌾', '畑仕事を手伝う', 'safe', 'hp-2 consc+3 spirit+4', nx('mn_03')),
    C('🗣️', '「ここは安全です」と言ってしまう', 'safe', 'spirit+2', { res: 'そう言った自分の声が、ひどく空っぽに聞こえた。', ...nx('mn_03') }),
  ], { img: 'mn_settlers', note: '満蒙開拓団は約27万人が送出され、敗戦時の逃避行で多数が亡くなった（史実）。', sources: ['mhlw', 'ndl'] }),
  F('mn_03', `冬。歩哨に立つ。零下三十度。まつげが凍りつく。
medic|指を動かし続けろ。止めたら、凍傷で落ちる。
narr|隣の哨所の兵が、朝、立ったまま冷たくなっていたという。`, [
    C('🧤', '仲間と時間を決めて交代で暖を取る', 'safe', 'hp-4 r.friend+6', nx('mn_04', 3)),
    C('🥶', '規則どおり立ち続ける', 'gamble', 'rep+4', { check: { base: 55, add: { hp: 0.3 } }, win: { res: '耐え抜いた。', later: [3, 'mn_04'] }, lose: { e: 'hp-14 +wounded', res: '足の指が二本、黒く変わった。', later: [3, 'mn_04'] } }),
  ], { art: 'barracks', img: 'mn_capit', note: '満洲の冬季警備では凍傷が多発した（史実）。', sources: ['nids'] }),
  E('mn_nomon', 'front', { modes: ['mil'], flags: ['manchu_front', 'chain'], from: '1939-06', to: '1939-08', w: 0, auto: 1 }, `出動命令。ハルハ河。ノモンハンだ。
narr|トラックで草原を何百キロも走る。砂ぼこりで、前の車が見えない。
officer|ソ連軍など、一撃で追い返せる。`, [
    C('🚚', '荷台で銃を抱えて眠る', 'safe', 'hp-3', nx('mn_n1')),
  ], { art: 'refugees', img: 'mn_tanks', note: 'ノモンハン事件（1939年5〜9月）。日本軍は大損害を出して敗北した（史実）。', sources: ['nids'] }),
  F('mn_n1', `ハルハ河を渡る。舟橋が揺れる。
narr|対岸の丘に上がると、地平線いっぱいにソ連の戦車が並んでいた。
comrade|……あれ全部、戦車か？`, [
    C('🧨', '火炎瓶を持たされ、戦車壕に伏せる', 'gamble', 'hp-10 rep+8', { risk: 16, ...nx('mn_n2') }),
    C('🕳️', '蛸壺を深く掘る', 'gamble', 'hp-6', { risk: 10, ...nx('mn_n2') }),
  ], { img: 'mn_cross', note: '日本軍は火炎瓶や肉薄攻撃でソ連戦車に対抗したが、砲兵・機甲戦力の差は圧倒的だった（史実）。', sources: ['nids'] }),
  F('mn_n2', `八月。ソ連軍の総攻撃。砲弾が昼夜降り注ぐ。
narr|水がない。草原の太陽が、壕の底まで焼く。
friend|……水、あるか。一口でいい。
narr|水筒には、あと一口だけ残っている。`, [
    C('💧', '最後の一口を{friend}に渡す', 'cost', 'hp-10 r.friend+15 consc+5', { risk: 10, ...nx('mn_n3') }),
    C('🫗', '自分で飲む', 'safe', 'hp-2 r.friend-6', { risk: 10, ...nx('mn_n3') }),
  ], { img: 'mn_creep', note: '1939年8月20日からのソ連軍総攻撃で第23師団は壊滅的打撃を受けた（史実）。', sources: ['nids'] }),
  F('mn_n3', `撤退命令は、届かなかった。包囲の中で夜を待つ。
officer|夜陰に乗じて脱出する。負傷者は……置いていけ。
narr|壕の隅で、動けない兵がこちらを見ている。`, [
    C('🤝', '負傷兵を背負って脱出を試みる', 'gamble', 'hp-12 consc+12', { risk: 18, res: '朝、友軍の線にたどり着いた。背中の兵は、まだ息をしていた。', ...nx('mn_n4') }),
    C('🏃', '命令どおり、身一つで走る', 'gamble', 'hp-6 consc-8 spirit-10', { risk: 12, ...nx('mn_n4') }),
    C('🏳️', '動けない兵と残り、夜明けを待つ', 'gamble', 'consc+8', { risk: 25, res: 'ソ連兵の銃口に囲まれた。停戦後の捕虜交換で、仲間とともに戻された。', ...nx('mn_n4') }),
  ], { img: 'mn_captured', note: 'ノモンハンでは捕虜となった日本兵もおり、帰還後に自決を強いられたり処罰された例がある（史実）。', sources: ['nids'] }),
  F('mn_n4', `停戦。九月。
narr|部隊の名簿は、半分以上が赤線で消されていた。上層部は「敗北」と言わなかった。
officer|口外無用だ。家族への手紙にも書くな。`, [
    C('🤐', '黙る', 'safe', 'spirit-8'),
    C('📓', '戦死した仲間の名前を、手帳の裏に書き写す', 'safe', 'consc+6 spirit-4 item:my_diary'),
  ], { img: 'mn_armistice', note: 'ノモンハンの実態は国民に十分知らされなかった（史実）。', sources: ['nids'] }),
  E('mn_04', 'front', { modes: ['mil'], flags: ['manchu_front', 'chain'], from: '1941-07', to: '1944-12', w: 0, auto: 1 }, `関東軍特種演習。部隊はさらに膨れ上がった。対ソ開戦は近い、と誰もが言う。
narr|ところが冬が来ても命令は出ない。代わりに、精鋭の部隊が一つ、また一つと、どこかへ消えていく。
comrade|南方らしい。俺たちは、ここに置いていかれるのか、助かったのか。`, [
    C('✉️', '家族に「元気だ」と書く', 'safe', 'spirit+4 r.mother+5', nx('mn_05', 4)),
    C('🎖️', '南方転用部隊への志願を申し出る', 'gamble', 'rep+6', { check: { base: 50 }, win: { e: '-manchu_front +mn_done', res: '転属命令が出た。行き先は、南洋の島らしい。', later: [1, 'pc_01'] }, lose: { res: '却下された。', later: [4, 'mn_05'] } }),
  ], { art: 'barracks', img: 'mn_pilots', note: '1941年7月の関特演、その後1943〜44年に関東軍の主力は南方・本土へ転用された（史実）。', sources: ['nids'] }),
  F('mn_05', `満洲の日々は長い。食事は高粱飯。たまに届く内地の新聞は、勝ち戦ばかり。
narr|でも、手紙の行間がおかしい。「町内の○○さんの息子さんも名誉の戦死」――そんな文が増えていく。
mother|「こちらは配給が減り、さつまいもばかりです。お前は食べていますか」`, [
    C('✍️', '「こっちは食べている。心配するな」と返事を書く', 'safe', 'r.mother+8 spirit+3', nx('mn_06', 6)),
    C('💴', '俸給を貯めて、家に送金する', 'cost', 'yen-6 r.mother+10', nx('mn_06', 6)),
  ], { letter: true, art: 'letters', note: '戦局の悪化は内地の新聞では伏せられた（史実）。', sources: ['ndl'] }),
  F('mn_06', `国境は不気味なほど静かだ。だが、陣地の大砲が一門、また一門と外され、どこかへ運ばれていく。
nco|空っぽの陣地に、木で作った大砲を置いておけ。向こうからはわからん。
narr|自分たちは「案山子」なのだ、と誰かが言った。`, [
    C('🪵', '黙って偽の大砲を据える', 'safe', 'spirit-6'),
  ], { art: 'barracks', img: 'mn_aa', note: '関東軍の兵力抽出で国境陣地は空洞化した（史実）。', sources: ['nids'] }),
  E('mn_08', 'front', { modes: ['mil'], flags: ['manchu_front', 'chain'], from: '1945-08-09', w: 0, auto: 1 }, `深夜、轟音。国境の向こうが、昼のように明るい。
radio|ソ連軍、国境を越えて侵攻中――
narr|日ソ中立条約は、まだ有効のはずだった。`, [
    C('🔫', '陣地に入り、命令を待つ', 'gamble', 'hp-10', { risk: 18, ...nx('mn_09') }),
    C('🏃', '近くの開拓団へ急を知らせに走る', 'gamble', 'hp-8 consc+10', { risk: 14, ...nx('mn_09') }),
  ], { art: 'refugees', img: 'mn_paper', note: '1945年8月9日未明、ソ連は対日参戦し満洲へ侵攻した（史実）。', sources: ['nids', 'mhlw'] }),
  F('mn_09', `撤退。道は避難民で埋まっている。開拓団の女性と子ども、老人。
settler|兵隊さん、置いていかないで。……軍は、どこへ行くんですか。
narr|列車は軍と、関係者の家族を先に乗せて南へ去った、という噂。`, [
    C('🚶', '避難民の列と一緒に歩き、守ろうとする', 'gamble', 'hp-14 consc+12', { risk: 16, ...nx('mn_10') }),
    C('🪖', '部隊の命令に従い、先へ進む', 'cost', 'hp-6 consc-8 spirit-10', { risk: 10, ...nx('mn_10') }),
  ], { img: 'mn_harbin', perspective: '満洲の開拓団・避難民', note: 'ソ連侵攻時、関東軍の後退で多くの在満邦人が取り残され、集団自決や残留孤児の悲劇が生じた（史実）。', sources: ['mhlw'] }),
  F('mn_10', `八月十五日を過ぎて、ようやく停戦が伝わった。武装解除。
narr|ソ連兵が腕時計を集めている。「ダモイ（帰国）」と言う。
comrade|帰れるんだよな？ 東へ行くんだよな？`, [
    C('🚂', '貨車に乗る', 'safe', '-chain -manchu_front +mn_done +manchuria_post spirit-6', { res: '貨車は東ではなく、北へ向かった。' }),
  ], { img: 'mn_capit', note: '武装解除後、約57万人の日本人がシベリア等に抑留された（厚生労働省）。', sources: ['mhlw'] }),
];

// ================= 太平洋島嶼（サイパン） =================
export const PACIFIC = [
  E('pc_00', 'front', { modes: ['mil'], branch: A, from: '1942-04', to: '1944-03', not: ['at_front', 'chain', 'alt_us_deal'], w: 0, auto: 1 }, `動員。南洋の島の守備隊へ、と告げられた。
mother|南洋……暖かいところなら、少しは楽かねえ。
narr|母は笑おうとして、うまく笑えていなかった。`, [
    C('🚢', '港へ向かう', 'safe', '+at_front +deployed +chain', nx('pc_01')),
  ], { art: 'station', img: 'hm_nada', note: '1943〜44年、マリアナ諸島など「絶対国防圏」の守備に陸軍部隊が増派された（史実）。', sources: ['nids'] }),
  F('pc_01', `輸送船団。夜は灯火管制。甲板で寝る。
senior|潜水艦だ。救命胴衣は外すなよ。沈むときは三分だ。
narr|二日目の夜、後ろの船に火柱が立った。海に、人の叫び声が散らばる。船団は止まらない。`, [
    C('🛟', '舷側から浮き輪を投げる', 'gamble', 'consc+8', { risk: 6, res: '浮き輪が届いたかどうか、闇の中で分からなかった。', ...nx('pc_02') }),
    C('🙏', '目を閉じて、自分の船が狙われないよう祈る', 'safe', 'spirit-8', { risk: 5, ...nx('pc_02') }),
  ], { art: 'navy', img: 'pc_minesweeper', note: '米潜水艦の攻撃で多数の輸送船が沈み、海没した兵員・船員は膨大な数にのぼる（史実）。', sources: ['nids', 'mhlw'] }),
  F('pc_02', `島に着いた。サトウキビ畑と、珊瑚の白い道。町には日本人の商店が並び、沖縄出身の移民が大勢いる。
okinawan|兵隊さん、うちの畑のバナナ、持っていきなさい。
narr|戦争をしているとは思えない、穏やかな風景だった。`, [
    C('🍌', 'ありがたく受け取り、礼を言う', 'safe', 'hp+4 spirit+6 consc+2', nx('pc_03', 1)),
    C('🪖', '「軍の規律で受け取れない」と断る', 'safe', 'rep+2', nx('pc_03', 1)),
  ], { img: 'pc_garapan', perspective: 'サイパンの住民', note: 'サイパンには沖縄出身者を中心に約2万人の日本人民間人が暮らしていた（史実）。写真は戦闘後のガラパン市街。', sources: ['oki', 'usna'] }),
  F('pc_03', `毎日、陣地構築。珊瑚礁の岩盤はつるはしをはね返す。セメントも足りない。
nco|敵が来るのは、まだ先だ。……たぶんな。
narr|海の向こうから、ある日ふいに来るのだろう。それが、いつかが分からない。`, [
    C('⛏️', '黙々と壕を掘る', 'safe', 'hp-5 rep+4', nx('pc_04', 2)),
    C('🌀', '要領よく日陰で休む', 'gamble', 'hp+2', { check: { base: 55 }, win: { res: '見つからなかった。' , later: [2, 'pc_04'] }, lose: { e: 'rep-6 hp-4', res: '班長に見つかり、炎天下で直立させられた。', later: [2, 'pc_04'] } }),
  ], { art: 'barracks', img: 'pc_betio', note: 'マリアナの陣地構築は資材・時間不足で不十分なまま米軍上陸を迎えた（史実）。', sources: ['nids'] }),
  F('pc_04', `家からの手紙。半年前の日付だ。
partner|「町内の△△さんの息子さんが、ガダルカナルで戦死されたそうです。あなたは南洋で、きっと大丈夫ですよね」
narr|ガダルカナル。噂では、あの島では兵が飢えて死んだという。`, [
    C('✉️', '「こちらは平穏。果物も多い」と書く', 'safe', 'spirit+5 r.partner+6 r.mother+4', nx('pc_05', 3)),
    C('📷', '写真を一枚、手紙に入れる', 'safe', 'r.partner+8 r.mother+6 yen-2', nx('pc_05', 3)),
  ], { letter: true, art: 'letters', note: 'ガダルカナル島の戦い（1942〜43）では約2万人の日本兵の多くが餓死・病死した（史実）。', sources: ['nids'] }),
  F('pc_05', `夜、浜辺。同年兵の{friend}と、波の音を聞く。
friend|なあ。帰ったら何したい。
narr|南十字星が見える。故郷の空には、ない星だ。`, [
    C('🍶', '「腹いっぱい白い飯を食う」と笑う', 'safe', 'spirit+6 r.friend+8', nx('pc_06', 3)),
    C('💌', '{partner}の話をする', 'safe', 'spirit+5 r.friend+6', { need: ['rom_met'], ...nx('pc_06', 3) }),
  ], { art: 'barracks', img: 'pc_ng_snlf', note: '個人の物語は架空。' }),
  F('pc_06', `空襲警報。米軍の艦載機が、初めて島の上を飛んだ。
narr|飛行場が燃える。友軍の飛行機は、地上で次々に爆発していく。
officer|来るぞ。今度こそ、本当に来るぞ。`, [
    C('🕳️', '壕に飛び込む', 'gamble', 'hp-4', { risk: 4, ...nx('pc_wait') }),
    C('🔥', '炎上する機体から整備兵を引きずり出す', 'gamble', 'hp-10 consc+8 rep+4', { risk: 10, ...nx('pc_wait') }),
  ], { art: 'airfield', img: 'pc_zero', note: '1944年2月以降、米機動部隊がマリアナを空襲した（史実）。', sources: ['nids', 'usna'] }),
  F('pc_wait', `空襲は日に日に増える。島の住民は、子どもを連れて山の洞窟へ食糧を運び始めた。
okinawan|内地へ帰る船は、沈められたって。もう、逃げる船はないよ。
narr|夜、眠りに落ちる寸前に、いつも艦砲の音を想像してしまう。`, [
    C('🫡', '配置で待つ', 'safe', '+pc_wait spirit-6'),
  ], { img: 'pc_cave', perspective: 'サイパンの住民', note: '1944年3月、引揚船「亜米利加丸」が撃沈され、多数の民間人が犠牲になった（史実）。', sources: ['oki'] }),
  E('pc_07', 'front', { modes: ['mil'], flags: ['pc_wait', 'chain'], from: '1944-06-11', w: 0, auto: 1 }, `艦砲射撃。水平線いっぱいの艦影から、砲弾が雨のように降る。
narr|壕の天井から砂が落ちる。三日三晩、止まない。耳から血が出る兵もいる。
friend|……来る。今度こそ、上がって来る。`, [
    C('🕳️', '壕の奥で耐える', 'gamble', 'hp-10 spirit-10', { risk: 10, ...nx('pc_08') }),
    C('🧱', '崩れた壕から埋まった仲間を掘り出す', 'gamble', 'hp-12 consc+8 r.friend+8', { risk: 14, ...nx('pc_08') }),
  ], { art: 'refugees', img: 'pc_peleliu', clip: 'real_navyair', note: '1944年6月11日から米軍はサイパンへの空襲・艦砲射撃を開始、15日に上陸した（史実）。写真は同様の艦砲射撃下の上陸（ペリリュー）。', sources: ['nids', 'usna'] }),
  F('pc_08', `米軍上陸。海岸に水陸両用車が押し寄せる。
officer|夜襲で海に追い落とす！ 総員、着剣！
narr|照明弾が上がるたび、昼のように明るくなり、機関銃が掃射する。`, [
    C('🗡️', '夜襲に加わる', 'gamble', 'rep+8 hp-12', { risk: 28, ...nx('pc_09') }),
    C('📡', '伝令役を買って出て、後方へ走る', 'gamble', 'hp-8', { risk: 14, ...nx('pc_09') }),
  ], { img: 'pc_saipanbeach', note: '日本軍は上陸初夜に夜襲を行ったが撃退された（史実）。', sources: ['nids', 'usna'] }),
  F('pc_09', `山の洞窟。逃げてきた住民と、兵が入り混じっている。水がない。
okinawan|赤ん坊が泣くと、見つかるって兵隊さんが……
narr|洞窟の暗がりで、ある兵が母親に「黙らせろ」と言っている。`, [
    C('✋', '「泣かせておけ。見つかったら俺が出る」と言う', 'gamble', 'consc+14 rep-6', { check: { base: 50, add: { rep: 0.2 } }, win: { res: '兵は舌打ちして黙った。', later: [0, 'pc_10'] }, lose: { e: 'hp-8 rep-6', res: '殴られて、岩に頭を打った。', later: [0, 'pc_10'] } }),
    C('💧', '自分の水筒の水を、母親に渡す', 'cost', 'hp-10 consc+10', nx('pc_10')),
  ], { img: 'pc_cave', perspective: 'サイパンの住民', note: '洞窟に避難した住民が日本兵に追い出され、あるいは乳幼児の殺害を強いられた例が証言されている（史実）。', sources: ['oki'] }),
  F('pc_10', `食糧が尽きた。夜、海岸近くまで降りて、米軍の残した缶詰を探す。
narr|{friend}が、熱にうなされている。傷口が膿んで、蛆がわいている。
friend|……置いていけ。俺は、もう。`, [
    C('🤝', '{friend}を背負って洞窟に戻る', 'gamble', 'hp-12 r.friend+15 consc+6', { risk: 12, ...nx('pc_11') }),
    C('🥫', '缶詰を取りに一人で降りる', 'gamble', 'hp+6', { risk: 16, res: '帰ってきたとき、{friend}はもう冷たかった。', ...nx('pc_11') }),
  ], { img: 'pc_tarawatank', note: '飢餓と傷病は太平洋の島々の戦いで大量死の原因となった（史実）。', sources: ['mhlw'] }),
  F('pc_11', `守備隊長の命令が伝えられる。
officer|七月七日、全員で最後の突撃を行う。生きて虜囚の辱めを受けず。
narr|洞窟の外、米軍の拡声器が、日本語で「出てきなさい。水も食べ物もある」と繰り返している。`, [
    C('🗡️', '最後の突撃に加わる', 'gamble', 'rep+6', { risk: 65, res: '夜明け、気がつくと、死体の間に倒れていた。生きていた。', setOnSurvive: '+pc_pow', ...nx('pc_12') }),
    C('🏳️', '住民を連れて、拡声器の方へ歩き出す', 'gamble', 'consc+15 rep-10', { risk: 20, setOnSurvive: '+pc_pow', res: '米兵が銃を下ろし、水筒を差し出した。', ...nx('pc_12') }),
    C('🕳️', '洞窟に残る', 'gamble', 'hp-14', { risk: 35, setOnSurvive: '+pc_pow', res: '数週間後、掃討の米兵に見つかった。', ...nx('pc_12') }),
  ], { img: 'pc_tarawapow', note: '1944年7月7日、サイパンで日本軍の最後の総攻撃（「玉砕」）が行われた。その後、マッピ岬などで民間人の集団自決が起きた（史実）。', sources: ['nids', 'oki'] }),
  F('pc_12', `島の北端の崖。民間人が、次々と海に身を投げている。
narr|米兵が拡声器で叫ぶ。母親が、子どもの手を引いて崖へ向かう。`, [
    C('✋', '母親の腕をつかみ、止めようとする', 'gamble', 'consc+15 spirit-8', { check: { base: 45 }, win: { res: '母親は泣き崩れ、その場に座り込んだ。子どもは生きている。' }, lose: { e: 'spirit-15', res: '手が、届かなかった。' }, later: [0, 'pc_end'] }),
    C('😶', '動けずに見ている', 'cost', 'spirit-18 +saw_atrocity', nx('pc_end')),
  ], { img: 'pc_cave', perspective: 'サイパンの住民', note: 'サイパン陥落時、「バンザイ・クリフ」などで多数の民間人が自決した（史実）。', sources: ['oki', 'usna'] }),
  F('pc_end', `収容所の鉄条網。配られた食事を前に、手が震える。
narr|生き残った。それを、家族はまだ知らない。故郷には、自分の戦死公報が届いているかもしれない。`, [
    C('🧾', '本名で捕虜登録をする', 'gamble', 'spirit+5 consc+3 -chain -pc_wait -at_front', { res: '家族への通知が届いたのは、戦後だった。' }),
  ], { art: 'barracks', img: 'pc_tarawapow', note: '日本兵捕虜の多くは家族に生存が知らされず、戦死扱いとされた例も多い（史実）。', sources: ['usna', 'mhlw'] }, { flags: ['pc_pow'] }),
];

// ================= 南方・フィリピン（レイテ→ルソン） =================
export const PHIL = [
  E('ph_00', 'front', { modes: ['mil'], branch: A, from: '1944-04', to: '1945-03', not: ['at_front', 'chain'], w: 0, auto: 1 }, `赤紙から三週間。行き先は「比島（フィリピン）」。
narr|門司港。岸壁で、見送りの家族が旗を振っている。
senior|バシー海峡は、魔の海峡と呼ばれとる。生きて渡れたら、半分は助かったようなもんだ。`, [
    C('🚢', '輸送船に乗る', 'safe', '+at_front +deployed +chain +south_front', nx('ph_01')),
  ], { art: 'station', img: 'hm_nada', note: '1944年、フィリピン増援の輸送船多数がバシー海峡で撃沈された（史実）。', sources: ['nids', 'mhlw'] }),
  F('ph_01', `バシー海峡。深夜、ドンという衝撃。船が傾く。
narr|船倉への梯子に、兵が殺到する。甲板の向こうは真っ黒な海。
comrade|飛べ！ 船に吸い込まれるぞ！`, [
    C('🌊', '海に飛び込み、浮遊物につかまる', 'gamble', 'hp-16', { risk: 22, res: '夜明け、海防艦に拾い上げられた。周りの海には、浮いたまま動かない兵が何人も。', ...nx('ph_02') }),
    C('🧗', '船倉の兵に梯子を譲り、最後に上がる', 'gamble', 'hp-12 consc+12', { risk: 30, ...nx('ph_02') }),
  ], { art: 'navy', img: 'ph_ls11', note: 'バシー海峡では1944年に輸送船の撃沈が相次ぎ、10万人以上が海没したとされる（推計に幅がある）。', sources: ['mhlw'] }),
  F('ph_02', `マニラ。小銃も装備も海の底だ。着の身着のままの兵が、港に並ぶ。
woman_ph|（フィリピン人の女性が、冷たい目で兵を見ている）
narr|街のあちこちに、日本の軍票が紙くずのように落ちている。`, [
    C('🍞', '配られたわずかな食糧を受け取る', 'safe', 'hp+4', nx('ph_03', 1)),
    C('🗣️', '片言の英語で、市場の女性に話しかける', 'gamble', 'consc+4', { check: { base: 50 }, win: { e: 'hp+4 spirit+4', res: 'バナナを一房、売ってくれた。「早く戦争が終わるといいね」とだけ言った。', later: [1, 'ph_03'] }, lose: { res: '女性は黙って店を閉めた。', later: [1, 'ph_03'] } }),
  ], { img: 'ph_intramuros', perspective: 'フィリピンの人々', note: '日本の占領下、フィリピンでは軍票の乱発によるインフレと抗日ゲリラの活動が広がった（史実）。', sources: ['mofa_qa', 'usna'] }),
  F('ph_03', `レイテ島へ転進。オルモック湾。米軍はすでに上陸している。
narr|上陸した輸送船が、目の前で炎に包まれる。積み上げた米も弾も、燃えていく。
officer|レイテは天王山だ。ここで勝てば、戦局は変わる。`, [
    C('📦', '燃える物資を少しでも運び出す', 'gamble', 'hp-8 rep+4', { risk: 12, ...nx('ph_04') }),
    C('🏃', 'ジャングルへ走り込む', 'gamble', 'hp-4', { risk: 8, ...nx('ph_04') }),
  ], { img: 'ph_ls159', clip: 'real_cn_bombing', note: '1944年10月、米軍はレイテに上陸。日本軍は多号作戦でオルモックへ増援したが、輸送船の多くが撃沈された（史実）。', sources: ['nids', 'usna'] }),
  F('ph_04', `ジャングル。米軍の砲撃は、規則正しく、休みなく続く。
narr|一発撃てば、百発返ってくる。木の幹ごと吹き飛ぶ。
comrade|あいつら、弾がいくらでもあるんだな……。`, [
    C('🕳️', 'タコツボに伏せ、夜を待つ', 'gamble', 'hp-8 spirit-8', { risk: 12, ...nx('ph_05') }),
    C('🔫', '斬り込み隊に志願する', 'gamble', 'rep+10 hp-12', { risk: 30, ...nx('ph_05') }),
  ], { img: 'ph_navalfire', note: 'レイテ戦の日本軍は約8万が投入され、ほとんどが戦死・戦病死した（史実）。', sources: ['nids'] }),
  F('ph_05', `雨季。体が熱い。歯がガチガチと鳴る。マラリアだ。
medic|キニーネは、もうない。
narr|仲間の一人が、木にもたれて座り込んだまま、二度と立たなかった。`, [
    C('🌿', '草の根を煎じて飲む', 'gamble', 'hp-12 +sick', { risk: 14, ...nx('ph_06') }),
    C('🤝', '{friend}と体を寄せ合って寒気に耐える', 'gamble', 'hp-10 r.friend+10 +sick', { risk: 10, ...nx('ph_06') }),
  ], { art: 'hospital', img: 'ph_baleta', note: '南方戦線の日本兵の死因は、戦闘よりもマラリア等の戦病と餓死が多かったとされる（史実）。', sources: ['mhlw', 'nids'] }),
  F('ph_06', `レイテ放棄の命令。「自活自戦」――食べ物は自分で探せ、という意味だ。
narr|兵が村に入り、芋を掘り、豚を奪う。村人は山へ逃げ、ゲリラになる。
woman_ph|（遠くから、子どもを抱いた女性がこちらを見ている）`, [
    C('🙅', '村の芋には手を出さない', 'cost', 'hp-12 consc+10', { risk: 8, ...nx('ph_07') }),
    C('🥔', '畑の芋を、黙って掘る', 'cost', 'hp+6 consc-8', nx('ph_07')),
  ], { img: 'ph_lipa', perspective: 'フィリピンの人々', note: '補給を絶たれた日本軍の「現地自活」は住民の食糧を奪い、住民の被害と抗日感情を深めた（史実）。フィリピン人の犠牲者は約100万人以上とされる。', sources: ['mofa_qa', 'usna'] }),
  F('ph_07', `ルソン島へ。脱出できた者はわずかだった。北部の山岳地帯へ退く。
narr|バレテ峠。道は、倒れた兵で一杯だ。誰も埋める力がない。
narr|家に手紙を出す手段はもうない。家族は、自分が生きているのかも知らない。`, [
    C('📓', '倒れた兵の名前を、分かる限り手帳に書く', 'cost', 'spirit-8 consc+8 item:my_diary', nx('ph_08', 2)),
    C('🥾', '前だけを見て歩く', 'safe', 'hp-8 spirit-6', nx('ph_08', 2)),
  ], { img: 'ph_baleta', note: '1945年、山下奉文の第14方面軍はルソン北部山岳地帯で持久戦を行い、多数が餓死した（史実）。', sources: ['nids', 'mhlw'] }),
  F('ph_08', `マニラが燃えている、と伝わる。市街戦で、町が丸ごと消えたという。
narr|山の上から、遠い煙が見える。あの市場の女性は、どうしただろう。`, [
    C('🙏', '手を合わせる', 'safe', 'consc+4 spirit-6', nx('ph_09', 1)),
  ], { img: 'ph_manilaescape', clip: 'real_cn_refugees', perspective: 'マニラの市民', note: '1945年2〜3月のマニラ市街戦で約10万人の市民が犠牲になった。日本軍による住民殺害も多数記録されている（史実）。', sources: ['usna', 'mofa_qa'] }),
  F('ph_09', `飢え。トカゲ、カタツムリ、木の皮。仲間が、仲間の背嚢を盗む。
narr|夜、誰かが、人に言えない「肉」を食べたという噂が流れる。
friend|……俺は、人間のまま死にたい。`, [
    C('🤝', '{friend}と最後の塩を分け合う', 'cost', 'hp-10 r.friend+12 consc+6 +starving +ph_hold', { risk: 14 }),
    C('🥀', '一人で食べ物を探しに行く', 'gamble', 'hp-4 r.friend-8 +starving +ph_hold', { risk: 16 }),
  ], { img: 'ph_napalm', note: 'ルソン山中では極度の飢餓が生じ、人肉食の証言も残る（史実・証言）。表現は抑制している。', sources: ['mhlw'] }),
  E('ph_10', 'front', { modes: ['mil'], flags: ['ph_hold', 'chain'], from: '1945-08-15', w: 0, auto: 1 }, `米軍の飛行機が、ビラを撒いた。日本語で「戦争は終わった」と書いてある。
comrade|謀略だ。信じるな。
narr|でも、砲撃の音がしない。何日も、静かだ。`, [
    C('🏳️', 'ビラを持って山を下りる', 'gamble', 'consc+6 -starving', { risk: 8, res: '米兵が水と缶詰をくれた。手が震えて、缶が開けられなかった。', ...nx('ph_end') }),
    C('🕳️', '命令が来るまで山に残る', 'gamble', 'hp-12', { risk: 14, res: '九月、元上官が白旗を持って迎えに来た。', ...nx('ph_end') }),
  ], { art: 'refugees', img: 'ph_wounded', note: 'ルソンの日本軍が投降したのは1945年9月で、生存者はわずかだった（史実）。', sources: ['usna', 'nids'] }),
  F('ph_end', `収容所。痩せこけた兵の列。自分の腕は、骨に皮が張りついているだけだ。
narr|フィリピン人の群衆が、トラックの日本兵に石を投げた。誰も、文句を言えなかった。`, [
    C('🧾', '収容所で帰国の日を待つ', 'safe', '-chain -ph_hold -at_front -south_front -sick -starving hp+10 spirit+4'),
  ], { img: 'ph_surrender', perspective: 'フィリピンの人々', note: '投降した日本兵は収容所を経て1946年までにほぼ復員した（史実）。', sources: ['usna', 'mhlw'] }, { from: '1945-08-15' }),
  // Leyte chain is time-gated: a soldier who arrives before the war ends but whose ph_10 is due before 8/15 waits here.
  E('ph_09w', 'front', { modes: ['mil'], flags: ['ph_hold'], to: '1945-08-14', w: 4 }, `山中の日々は果てしなく続く。数えるのをやめた日付。
narr|雨、飢え、熱。生き延びた者だけが、次の朝を迎える。`, [
    C('🥀', '耐える', 'gamble', 'hp-10', { risk: 10 }),
    C('🌿', '谷へ下りて食べられる草を探す', 'gamble', 'hp-4', { risk: 14, res: '米軍の哨戒をかわして戻った。' }),
  ], { art: 'refugees', img: 'ph_corregidor', note: '背景は史実（ルソン持久戦）。', sources: ['mhlw'] }),
  E('ph_09w2', 'front', { modes: ['mil'], flags: ['ph_hold'], to: '1945-08-14', w: 3 }, `ある朝、谷の向こうから砲声が消えた。
narr|戦争は、いつ終わるのだろう。`, [
    C('🕳️', '待つ', 'gamble', 'hp-6', { risk: 8 }),
    C('📻', '拾った米軍のビラを、こっそり読む', 'gamble', 'consc+4', { check: { base: 60 }, lose: { e: 'rep-8', res: '下士官に見つかり、ビラを焼かれた。' }, res: '「日本の都市は焼かれている」と書いてあった。' }),
  ], { art: 'refugees', img: 'hm_naha', note: '背景は史実。ビラ（伝単）は米軍が投降勧告や戦況を伝えるため大量に撒いた。', sources: ['usna'] }),
];

// safety: release any soldier still flagged in a chain after the war (prevents a stuck chain flag)
export const FRONT_TAIL = [
  E('fr_release', 'front', { modes: ['mil'], flags: ['war_over', 'chain'], from: '1945-10-01', w: 0, auto: 1 }, `部隊は解散した。名簿の半分は、赤い線で消されている。
narr|復員の順番を待つ日々が始まった。`, [C('🧳', '待つ', 'safe', '-chain -manchu_front -ph_hold -pc_wait spirit+2')], { art: 'postwar', img: 'mn_return', note: '復員は1946年中にほぼ完了したが、ソ連抑留者の帰還は1956年まで続いた（史実）。', sources: ['mhlw'] }),
];
