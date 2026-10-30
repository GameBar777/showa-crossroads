import { E, C } from './lib.mjs';
const S = ['state'];
const c = (o) => ({ modes: S, ...o });
// 天皇/国家 mode: the player acts as the "imperial court & state" perspective under constitutional and political constraints.
// Real persons' lines are marked * (創作). No line attributes inner feelings to the real emperor; the player chooses institutional actions.
export const STATE = [
  E('st_intro', 'state', c({ w: 0, auto: 1, not: ['st_intro'], to: '1936-03' }), `あなたは、宮中と国家の意思決定の「場」に立つ。
chamberlain|大日本帝国憲法の下、天皇は統治権の総攬者とされます。
chamberlain|しかし実際には、内閣の輔弼、統帥部、元老・重臣、枢密院、議会、そして世論。
chamberlain|どれ一つ、思いどおりにはなりません。`, [C('📜', '始める', 'safe', '+st_intro')], { art: 'council', note: '明治憲法下の天皇の権能と、立憲君主としての実際の運用には研究上の議論がある。' }),
  E('st_226', 'state', c({ on: 'h_226', w: 0 }), `陸軍の青年将校が重臣を襲撃。
*army_min|（創作）彼らの心情も汲んでいただきたく……
narr|史実では、天皇は反乱軍を厳しく鎮圧する意思を示したと記録される。`, [
    C('⚖️', '断固鎮圧を求める', 'safe', 'n.army-5 n.elders+8 n.cab+5 +st_firm', { res: '戒厳令下、反乱は四日で収束した。' }),
    C('🕊️', '説得による帰順を優先させる', 'gamble', 'n.army+3 n.elders-3', { res: '時間はかかったが、流血は避けられた。' }),
  ], { art: 'council', sources: ['jitsu', 'ndl'] }),
  E('st_bukan', 'state', c({ on: 'h_gunbu', w: 0, not: ['alt_no_bukan'] }), `陸軍は軍部大臣現役武官制の復活を求めている。
*minister|（創作）粛軍のためです、と陸軍は言っております。
narr|復活すれば、陸軍が大臣を出さないだけで、内閣は倒れる。`, [
    C('🛑', '枢密院と重臣を通じて慎重論を働きかける', 'gamble', 'n.army-8', { check: { base: 25, add: { 'n.elders': 0.4, 'n.privy': 0.3, 'n.army': -0.3 } }, win: { e: '+alt_no_bukan n.cab+10', res: '復活は見送られた。歴史が、ひとつ分岐した。' }, lose: { e: 'n.army+5', res: '閣議は陸軍案を通した。' } }),
    C('📜', '内閣の決定を受け入れる', 'safe', 'n.army+6 n.cab-3'),
  ], { art: 'council', alt: 'alt_no_bukan' }),
  E('st_marco', 'state', c({ on: 'h_marco', w: 0 }), `盧溝橋で衝突。
*army_staff|（創作）参謀本部の中でも、不拡大派と拡大派が対立しております。
narr|「一撃で片付く」という声が強い。`, [
    C('🕊️', '不拡大方針を強く確認させる', 'gamble', 'n.army-10 n.intl+5', { check: { base: 30, add: { 'n.cab': 0.3, 'n.elders': 0.3, 'n.army': -0.4 } }, win: { e: '+alt_china_truce n.war-15', res: '現地停戦協定が守られた。だが、火種は残る。' }, lose: { e: 'n.war+10', res: '内閣は派兵を決定した。' } }),
    C('⚔️', '派兵の上奏を裁可する', 'safe', 'n.army+8 n.war+15 n.opinion+5'),
  ], { art: 'council', alt: 'alt_china_truce' }),
  E('st_nanjing_report', 'state', c({ on: 'h_nanjing', w: 0 }), `南京占領。祝賀の提灯行列が続く。
*diplomat|（創作）外務省には、現地での暴行・掠奪の報告が届いております。
narr|情報は、どこまで上がり、誰が動くのか。`, [
    C('🔎', '陸軍に軍紀の調査と処分を求める', 'gamble', 'n.army-6 n.intl+6 +st_discipline', { res: '陸軍中央は「善処する」と答えた。処分は軽かった。' }),
    C('🤐', '戦勝の報告だけを受ける', 'cost', 'n.opinion+4 n.intl-6'),
  ], { art: 'council', note: '外務省東亜局長石射猪太郎の日記等に、南京での暴行の報告が記されている（史実）。' }),
  E('st_mobil', 'state', c({ on: 'h_mobil', w: 0 }), `国家総動員法案。政府が議会を経ずに、勅令で人も物も統制できる。
*diet_member|（創作）これは白紙委任状ではないか！
narr|議会では反対の声も上がったが、法は通った。`, [C('📜', '成立を見守る', 'safe', 'n.diet-8 n.econ+5'), C('⚖️', '運用の歯止めを求めるよう働きかける', 'gamble', 'n.diet+5 n.army-4')], { art: 'council' }),
  E('st_nomonhan', 'state', c({ on: 'h_nomonhan', w: 0 }), `満蒙国境での衝突が拡大している。関東軍は中央の意向を無視しがちだ。`, [C('🛑', '統帥部に現地軍の統制を求める', 'safe', 'n.army-5 n.intl+3'), C('📰', '報道を最小限にとどめる', 'safe', 'n.opinion+2')], { art: 'hq' }),
  E('st_axis', 'state', c({ on: 'h_axis', w: 0, not: ['alt_no_axis'] }), `三国同盟の締結が議論されている。海軍の一部は強く反対してきた。
*navy_min|（創作）米英を敵に回せば、海軍には勝算がありません。`, [
    C('🛑', '海軍・重臣と組んで反対を貫く', 'gamble', 'n.army-12', { check: { base: 25, add: { 'n.navy': 0.3, 'n.elders': 0.3, 'n.intl': 0.2, 'n.army': -0.3 } }, win: { e: '+alt_no_axis n.intl+10', res: '同盟は見送られた。' }, lose: { e: 'n.navy-5 n.intl-8', res: '同盟は調印された。' } }),
    C('📜', '内閣の決定に従う', 'safe', 'n.army+6 n.intl-10'),
  ], { art: 'council', alt: 'alt_no_axis' }),
  E('st_south', 'state', c({ on: 'h_indochina_s', w: 0, not: ['alt_no_south'] }), `南部仏印への進駐。米国は石油禁輸で応じると警告している。`, [
    C('🛑', '進駐の中止を強く求める', 'gamble', 'n.army-10 n.navy-4', { check: { base: 25, add: { 'n.intl': 0.3, 'n.elders': 0.3, 'n.army': -0.3 } }, win: { e: '+alt_no_south n.intl+10 n.econ+5', res: '進駐は延期された。石油は、まだ止まらない。' }, lose: { e: 'n.econ-10', res: '進駐は実施され、石油が止まった。' } }),
    C('📜', '進駐を裁可する', 'safe', 'n.army+5 n.econ-12 n.war+10'),
  ], { art: 'council', alt: 'alt_no_south' }),
  E('st_0906', 'state', c({ on: 'h_0906', w: 0 }), `御前会議。外交が行き詰まれば開戦、という方針。
narr|史実では、天皇は明治天皇の御製「よもの海」を読み上げ、平和への意向を示したと記録される。
*chamberlain|（創作）御前会議での発言は、慣例上、極めて異例です。`, [
    C('📜', '御製を読み、外交を優先させる意を示す', 'safe', 'n.cab+5 n.army-3 +st_yomo'),
    C('🤐', '慣例どおり沈黙する', 'safe', 'n.army+4'),
  ], { art: 'council', sources: ['jitsu'] }),
  E('st_hull', 'state', c({ on: 'h_hull', w: 0, flags: ['alt_no_south'] }), `石油はまだ止まっていない。米国が暫定協定の可能性を示している。`, [
    C('🤝', '暫定協定を受け入れるよう内閣を支える', 'gamble', 'n.army-15', { check: { base: 35, add: { 'n.cab': 0.3, 'n.elders': 0.3, 'n.intl': 0.3, 'n.army': -0.3 } }, win: { e: '+alt_us_deal n.war-30', res: '開戦は回避された。だが、陸軍の不満は爆発寸前だ。' }, lose: { e: 'n.war+15', res: '交渉は決裂した。' } }),
    C('⚔️', '統帥部の主張を受け入れる', 'safe', 'n.army+8 n.war+20'),
  ], { art: 'council', alt: 'alt_us_deal' }),
  E('st_1201', 'state', c({ on: 'h_1201', w: 0 }), `開戦の御前会議。すでに機動部隊は動き出している。
narr|この段階で止めることは、どこまで可能だったのか。研究者の評価は分かれる。`, [C('📜', '裁可する', 'safe', 'n.war+30 n.army+5'), C('🤐', '最後まで外交を問い続ける', 'gamble', 'n.army-8', { res: '決定は変わらなかった。' })], { art: 'council', note: '開戦決定における天皇の役割については、研究上の議論がある（論争あり）。' }),
  E('st_midway', 'state', c({ on: 'h_midway', w: 0 }), `ミッドウェーで空母四隻を失った。大本営は国民に損害を偽って発表する。`, [C('📢', '事実を政府内で共有させる', 'gamble', 'n.navy-5 n.cab+5 +st_truth'), C('🤐', '秘匿を認める', 'safe', 'n.opinion+3')], { art: 'hq' }),
  E('st_attu', 'state', c({ on: 'h_attu', w: 0 }), `アッツ島守備隊の全滅。「玉砕」という言葉が初めて公式に使われた。`, [C('🕯️', '戦没者を悼む', 'safe', 'n.opinion+2'), C('🕊️', '重臣に早期和平の研究を内々に命じる', 'gamble', '+peace_study n.army-5')], { art: 'hq' }),
  E('st_peace', 'state', c({ on: 'h_tojo_out', w: 0, not: ['alt_early_peace', 'alt_us_deal'] }), `サイパン陥落。東條内閣が倒れた。重臣の間に、和平の声が出始めている。`, [
    C('🕊️', '和平交渉の開始を後押しする', 'gamble', 'n.army-15', { check: { base: 15, add: { 'n.elders': 0.4, 'n.cab': 0.2, 'n.army': -0.3 }, flagBonus: { peace_study: 20, st_truth: 10 } }, win: { e: '+alt_early_peace', res: '中立国を通じた交渉が始まった。' }, lose: { e: 'n.war+5', res: '陸軍は「一撃講和」を主張し、交渉は潰えた。' } }),
    C('⚔️', '「もう一度戦果を」の声を受け入れる', 'safe', 'n.army+5 n.war+10'),
  ], { art: 'council', alt: 'alt_early_peace' }),
  E('st_konoe_memo', 'state', c({ on: 'h_konoe_memo', w: 0 }), `近衛文麿が上奏する。「敗戦は必至」。
narr|史実では、天皇は「もう一度戦果を挙げてから」と答えたと記録される。`, [
    C('🕊️', '上奏を受け、和平を急がせる', 'gamble', 'n.army-10', { check: { base: 20, add: { 'n.elders': 0.4, 'n.army': -0.3 } }, win: { e: '+early_surrender n.war-20', res: '和平への動きが数か月早まった。' }, lose: { e: '', res: '陸軍は本土決戦を唱え続けた。' } }),
    C('⚔️', '「もう一度戦果を」（史実）', 'safe', 'n.army+3'),
  ], { art: 'council', sources: ['jitsu'] }),
  E('st_seidan', 'state', c({ on: 'h_seidan', w: 0 }), `御前会議。ポツダム宣言の受諾をめぐり、意見は三対三に割れた。
*suzuki|（創作）……ご聖断を仰ぎたく存じます。`, [C('🕊️', '受諾の意を示す', 'safe', 'n.war-50 +seidan')], { art: 'council', sources: ['jitsu'], note: '終戦の「聖断」の評価や経緯には研究上の議論がある（論争あり）。' }),
  E('st_ningen', 'state', c({ on: 'h_ningen', w: 0 }), `新年の詔書。新しい国の形が問われている。`, [C('📜', '詔書を発する', 'safe', 'n.opinion+5')], { art: 'postwar' }),
  // alt-world crises (cause-and-effect)
  E('st_alt_coup', 'state', c({ on: 'a_us_deal_coup', w: 0 }), `陸軍の一部が、協定破棄を叫んでクーデターを計画している。`, [
    C('⚖️', '陸軍中央と協力して首謀者を処分', 'gamble', 'n.army-10', { check: { base: 50, add: { 'n.cab': 0.3, 'n.elders': 0.2 } }, win: { e: 'n.cab+10', res: '計画は未然に防がれた。' }, lose: { e: 'n.cab-15 n.opinion-8', res: '要人が襲撃され、政局は混乱した。' } }),
    C('🤝', '陸軍の要求の一部をのむ', 'safe', 'n.army+8 n.intl-6'),
  ], { art: 'council' }),
  E('st_alt_china', 'state', c({ flags: ['alt_china_truce'], from: '1939-01', to: '1941-12', w: 3, cd: 12 }), `華北での小競り合いが、また報告された。
*diplomat|（創作）停戦は紙の上のものです。現地軍がまた動いています。`, [C('📜', '現地軍司令官の更迭を求める', 'gamble', 'n.army-6 n.intl+6'), C('🤐', '黙認する', 'cost', 'n.war+8', { res: '火種は、くすぶり続ける。' })], { art: 'hq' }),
  E('st_opinion', 'state', c({ w: 3, cd: 10, from: '1937-01', to: '1945-08' }), `新聞は強硬論を書き立て、世論は「弱腰」を許さない空気だ。`, [C('📰', '世論に配慮する', 'safe', 'n.opinion+6 n.intl-3'), C('🛑', '強硬論の抑制を内閣に促す', 'gamble', 'n.opinion-6 n.intl+4')], { art: 'title' }),
  E('st_econ', 'state', c({ w: 3, cd: 10, from: '1938-01' }), `物資動員計画。鉄、石油、船。どこにも足りない。
*minister|（創作）陸軍と海軍が、互いに鋼材を奪い合っております。`, [C('⚖️', '配分の調整を内閣に任せる', 'safe', 'n.econ+3 n.navy-2 n.army-2'), C('⚓', '海軍を優先', 'safe', 'n.navy+6 n.army-6'), C('🪖', '陸軍を優先', 'safe', 'n.army+6 n.navy-6')], { art: 'hq' }),
  E('st_privy', 'state', c({ w: 2, cd: 16 }), `枢密院が、条約案の審査で政府に注文をつけた。`, [C('📜', '審査を尊重する', 'safe', 'n.privy+6 n.cab-3'), C('⏩', '政府の迅速な処理を支持', 'safe', 'n.cab+4 n.privy-5')], { art: 'council' }),
  E('st_diet', 'state', c({ w: 2, cd: 14, to: '1942-12' }), `議会で政府批判の演説。陸軍は議員の除名を求めている。`, [C('⚖️', '議会の自律に任せる', 'safe', 'n.diet+6 n.army-4'), C('🤐', '関与しない', 'safe', 'n.diet-4')], { art: 'council', note: '1940年、斎藤隆夫の「反軍演説」で斎藤は衆議院を除名された（史実）。' }),
  // fictional chamberlain family arc (human core without inventing the imperial family's private life)
  E('st_ch_family', 'family', c({ w: 4, not: ['ch_son'], from: '1936-06' }), `侍従の{partner}（架空）が、珍しく私事を話した。
chamberlain|息子が、陸軍士官学校に受かりました。……誇らしいような、怖いような。`, [C('🎌', '祝いの言葉をかける', 'safe', '+ch_son r.partner+8'), C('🕊️', '「無事を祈る」とだけ言う', 'safe', '+ch_son r.partner+10')], { art: 'council' }),
  E('st_ch_letter', 'letter', c({ flags: ['ch_son'], from: '1938-01', w: 3, cd: 18, letter: true }), `chamberlain|息子からの手紙です。
child_ch|父上 こちらは寒いです。部下はみな良い者です。
chamberlain|……あの子は、部下のことばかり書く。`, [C('✉️', '手紙の話を聞く', 'safe', 'r.partner+6')], { art: 'letters' }),
  E('st_ch_loss', 'family', c({ flags: ['ch_son'], from: '1944-07', to: '1945-08', w: 3, not: ['ch_loss'] }), `侍従の目が赤い。
chamberlain|……息子が、フィリピンで。公報が昨日。
narr|宮中にも、戦死公報は届く。`, [C('🕯️', '休暇を与える', 'safe', '+ch_loss r.partner+10 n.war-2'), C('🤝', '黙ってそばに立つ', 'safe', '+ch_loss r.partner+12')], { art: 'letters' }),
  E('st_ch_after', 'postwar', c({ flags: ['ch_loss', 'war_over'], w: 3 }), `戦後。侍従が辞表を出した。
chamberlain|息子の墓を、故郷に建てに参ります。
chamberlain|あの子が守りたかったものが何だったのか、考えながら。`, [C('🙇', '送り出す', 'safe', 'spirit+5')], { art: 'postwar' }),
];
