import { E, C } from './lib.mjs';
const M = ['mil'], A = { branch: ['army'] }, N = { branch: ['navy'] }, AA = { branch: ['army_air'] }, NA = { branch: ['navy_air'] };
const c = (o, x) => ({ modes: M, ...o, ...x });
export const MIL = [
  // ---- training (all branches) ----
  E('mil_army_slap', 'training', c(A, { to: '1938-12', w: 6 }), `内務班。古参兵が並ばせる。
senior|貴様ら、たるんどる！ 歯を食いしばれ！
narr|理由のない往復びんたが続く。`, [
    C('😤', '耐える', 'safe', 'hp-3 spirit-4 rep+2'),
    C('🛡️', '殴られている同年兵をかばう', 'gamble', 'hp-6 consc+5 r.friend+15', { res: '{friend}が後でそっと礼を言った。' }),
  ], { art: 'barracks', note: '内務班での私的制裁は多くの回想記に記録されている（史実）。' }),
  E('mil_army_drill', 'training', c(A, { w: 4, cd: 12, to: '1941-12' }), `練兵場で匍匐前進。泥が口に入る。
officer|遅い！ もう一度！`, [C('💪', '必死に食らいつく', 'safe', 'hp-2 rep+4'), C('🌀', '要領よく手を抜く', 'gamble', 'rep-1 hp+1')], { art: 'barracks' }),
  E('mil_navy_hammock', 'training', c(N, { to: '1939-12', w: 6 }), `海兵団。ハンモックを素早く畳めない者は、「精神注入棒」で尻を叩かれる。
senior|海軍は五分前精神だ！`, [C('⏱️', '夜中に畳む練習をする', 'safe', 'hp-1 rep+3'), C('🤝', '同期と手順を教え合う', 'safe', 'r.friend+10 rep+1')], { art: 'navy', note: '海軍の「軍人精神注入棒」による制裁は回想に多い（史実）。' }),
  E('mil_navy_gunnery', 'training', c(N, { from: '1937-01', w: 4, cd: 12 }), `艦上の訓練。「月月火水木金金」と言われる休みなしの日々。
officer|弾着！ 遠い、修正！`, [C('🎯', '計算を磨く', 'safe', 'rep+3 +skilled'), C('😮‍💨', '体力の限界、休ませてくれと言う', 'gamble', 'hp+3 rep-3')], { art: 'navy' }),
  E('mil_air_firstsolo', 'training', c({ branch: ['army_air', 'navy_air'] }, { w: 6, to: '1940-12' }), `初めての単独飛行。教官が後席を降りる。
officer|行ってこい。落ちるなよ。
narr|地面が離れていく。怖いのに、笑いが込み上げる。`, [C('🛩️', '教わったとおり丁寧に', 'safe', 'spirit+8 rep+3 +skilled'), C('🌀', '宙返りしてみせる', 'gamble', 'spirit+10', { check: { base: 60 }, lose: { e: 'hp-15 rep-6', res: '着陸で脚を折った。機体は大破。' } })], { art: 'airfield' }),
  E('mil_air_friend_crash', 'training', c({ branch: ['army_air', 'navy_air'] }, { w: 4, from: '1937-06' }), `訓練中の事故で、同期の一人が死んだ。
narr|昨夜、一緒に羊羹を食べたばかりだった。`, [C('🕯️', '遺品を家族に送る手配をする', 'safe', 'spirit-8 consc+4'), C('🛩️', '翌朝も飛ぶ', 'safe', 'spirit-5 rep+3')], { art: 'airfield' }),
  E('mil_yokaren_song', 'training', c(NA, { w: 5, to: '1942-12' }), `予科練。七つボタンの制服。故郷の母に写真を送る。
friend|母ちゃん、喜ぶかな。`, [C('📷', '写真を撮って送る', 'safe', 'yen-2 r.mother+10 spirit+4 item:uniform_photo')], { art: 'airfield' }),
  E('mil_leave_home', 'daily', c({}, { w: 4, cd: 18, not: ['at_front'] }), `数日の休暇。故郷に帰る。
mother|まあ、痩せたね。
narr|母はとっておきの白米を炊いた。`, [C('🍚', '腹いっぱい食べる', 'safe', 'hp+8 spirit+6 r.mother+8'), C('💌', '{partner}に会いに行く', 'safe', 'r.partner+12 spirit+6', { need: ['rom_met'] })], { art: 'village' }),
  // ---- army China front ----
  E('mil_army_ship_china', 'front', c(A, { from: '1937-08', to: '1938-06', not: ['at_front', 'alt_china_truce'], w: 0, auto: 1 }), `動員令。部隊は大陸へ。輸送船の船倉は汗と吐瀉物の匂い。
friend|すぐ終わるって話だ。正月には帰れるさ。`, [C('🚢', '海を渡る', 'safe', '+at_front +deployed +china_front +chain', { later: [0, 'cn_01'] })], { art: 'navy', img: 'cn_flagship' }),
  E('mil_army_march', 'front', c(A, { flags: ['china_front'], not: ['chain'], w: 5, cd: 14 }), `一日40キロの行軍。靴擦れが化膿している。
friend|水、少しくれないか。`, [C('💧', '水筒を分ける', 'cost', 'hp-4 r.friend+12'), C('🚶', '自分も限界だ', 'safe', 'hp-1 r.friend-3')], { art: 'refugees' }),
  E('mil_army_creek', 'front', c(A, { flags: ['china_front'], not: ['chain'], w: 4, cd: 16 }), `クリーク（水路）沿いの戦闘。対岸から撃たれる。
officer|突撃準備！`, [C('🎌', '先頭で飛び出す', 'gamble', 'rep+8 hp-10', { risk: 10 }), C('🛡️', '仲間と援護し合いながら前進', 'safe', 'hp-6 r.friend+5', { risk: 4 })], { art: 'refugees' }),
  E('mil_army_nanjing_order', 'warcrime', c(A, { on: 'h_nanjing', not: ['chain'], w: 0 }), `城内掃討。捕虜と、軍服を脱いだ男たちと、市民の区別がつかない。
officer|「処置」しろ。
narr|捕虜の不法殺害や民間人への暴行が、各所で起きていた。`, [
    C('🙅', '命令をはぐらかし、連行だけにとどめる', 'gamble', 'consc+12 rep-6', { check: { base: 45, add: { rep: 0.2 } }, lose: { e: 'hp-6 rep-6', res: '上官に殴り倒された。' }, later: [100, 'post_nanjing_memory'] }),
    C('😶', '何もできず、目を背ける', 'cost', 'consc-6 spirit-12 +saw_atrocity', { later: [100, 'post_nanjing_memory'] }),
  ], { art: 'refugees', perspective: '南京の市民・捕虜', note: '南京事件の存在は日本政府も認めている。犠牲者数には諸説ある（外務省見解）。ゲーム内では加害行為を選択肢として遊戯化しない。' }),
  E('post_nanjing_memory', 'postwar', c({}, { flags: ['war_over'], w: 0, modes: ['mil', 'civ'] }), `戦後、何十年も経ってから。
narr|夢に出るのは、あの冬の城壁だった。
child|……お父さん、戦争のこと、話してくれる？`, [C('🗣️', '見たことを話す', 'gamble', 'spirit+6 consc+8 r.child+10'), C('🤐', '「忘れた」と言う', 'safe', 'spirit-6')], { art: 'postwar', echo: true }),
  E('mil_army_xuzhou', 'front', c(A, { flags: ['china_front'], not: ['chain'], from: '1938-04', to: '1938-08', w: 4 }), `徐州へ。麦畑が地平線まで続く。
narr|「麦と兵隊」という本が内地で売れているらしい。`, [C('🌾', '麦畑を黙々と進む', 'safe', 'hp-5', { risk: 5 })], { art: 'refugees' }),
  E('mil_army_malaria', 'front', c(A, { flags: ['at_front'], w: 3, cd: 24 }), `高熱と悪寒。マラリアだ。
medic|キニーネが足りない。`, [C('💊', '最後の薬をもらう', 'gamble', 'hp-8 r.friend-3', { check: { base: 70, add: { hp: 0.2 } }, lose: { e: 'hp-20', res: '三週間、生死の境をさまよった。' } }), C('🙏', '薬は若い兵に回してもらう', 'cost', 'hp-15 consc+6', { risk: 6 })], { art: 'hospital' }),
  E('mil_army_friend_dies', 'front', c({}, { flags: ['at_front'], w: 3, not: ['friend_dead', 'chain'], from: '1938-01' }), `{friend}が撃たれた。
friend|……家に、手紙……頼む。
narr|血の付いた封筒を握らされた。`, [C('✉️', '手紙を必ず届けると約束する', 'safe', 'spirit-12 item:friend_letter +friend_dead npc:friend:dead', { later: [30, 'mil_friend_letter_deliver'] })], { art: 'refugees' }),
  E('mil_friend_letter_deliver', 'family', { modes: ['mil', 'civ', 'cmd'], items: ['friend_letter'], flags: ['war_over'], w: 0 }, `{friend}の故郷の家。年老いた母親が出てきた。
narr|血の跡の付いた封筒を渡す。
mother_f|……あの子の字だ。`, [C('🙇', '最期の様子を正直に伝える', 'safe', 'spirit+5 consc+6'), C('🌸', '「苦しまなかった」と伝える', 'safe', 'spirit+3')], { art: 'village', echo: true }),
  // ---- army South / Pacific ----
  E('mil_army_south', 'front', c(A, { from: '1941-11', to: '1942-03', not: ['south_front', 'alt_us_deal', 'chain'], w: 0, auto: 1 }), `部隊が南方へ転用される。行き先は知らされない。
friend|暑いところらしいぞ。`, [C('🚢', '輸送船に乗る', 'safe', '+south_front +at_front +deployed +chain -china_front', { later: [0, 'pc_01'] })], { art: 'navy', img: 'ph_ls11' }),
  E('mil_army_bicycle', 'front', c(A, { flags: ['south_front'], not: ['chain'], from: '1941-12', to: '1942-02', w: 4 }), `マレー半島。自転車で密林の道を南へ。
narr|タイヤが溶けるほどの暑さ。`, [C('🚲', '進む', 'safe', 'hp-5 rep+3', { risk: 4 })], { art: 'refugees' }),
  E('mil_army_guadal_hunger', 'front', c(A, { flags: ['south_front'], from: '1942-09', to: '1943-02', w: 4, not: ['alt_us_deal', 'chain'] }), `補給が来ない。木の根と草をかじる。
narr|兵たちはこの島を「餓島」と呼んだ。`, [C('🌿', '食べられる草を探す', 'gamble', 'hp-12', { risk: 10 }), C('🍙', '最後の米を病兵に分ける', 'cost', 'hp-15 consc+8', { risk: 8 })], { art: 'refugees', note: 'ガダルカナル島では戦死者の多くが餓死・病死だった（史実）。' }),
  E('mil_army_imphal', 'front', c(A, { flags: ['south_front'], not: ['chain'], on: 'h_imphal', w: 0 }), `インパールへ。牛を連れて、山を越えろという。
narr|補給はない。「白骨街道」と呼ばれる道になる。`, [C('🥾', '行軍する', 'gamble', 'hp-25', { risk: 20 }), C('🤝', '動けない戦友を背負う', 'cost', 'hp-30 consc+10', { risk: 22 })], { art: 'refugees' }),
  E('mil_army_gyokusai_order', 'front', c(A, { flags: ['south_front'], not: ['chain'], from: '1944-06', to: '1945-08', w: 3 }), `守備隊長が言う。
officer|最後の一兵まで。生きて虜囚の辱めを受けず。
narr|洞窟の奥には、逃げ込んだ住民もいる。`, [
    C('🗡️', '突撃に加わる', 'gamble', 'rep+5', { risk: 60 }),
    C('🏳️', '住民を連れて投降の道を探す', 'gamble', 'consc+12', { risk: 20, res: '米兵の拡声器が「出て来い」と言っていた。', setOnSurvive: '+pow' }),
    C('🕳️', '洞窟で命令を待つ', 'gamble', 'hp-10', { risk: 30 }),
  ], { art: 'refugees', note: '「戦陣訓」（1941）の一節。住民を巻き込んだ「玉砕」は沖縄・サイパン等で記録されている（史実）。' }),
  // ---- navy ----
  E('mil_navy_assign', 'front', c(N, { from: '1937-08', not: ['at_front'], w: 0, auto: 1 }), `艦隊配属。巡洋艦の機関科。
senior|ここは地獄の釜の底だぞ、新兵。`, [C('⚙️', '配置につく', 'safe', '+at_front +deployed')], { art: 'navy' }),
  E('mil_navy_pearl', 'front', c(N, { on: 'h_pearl', w: 0 }), `艦内放送。
radio|トラ・トラ・トラ。我奇襲ニ成功セリ。
narr|甲板で歓声が上がる。誰かが言った。「これでアメリカも本気になる」`, [C('🎌', '歓声に加わる', 'safe', 'spirit+5'), C('🤔', '黙って海を見る', 'safe', 'consc+2')], { art: 'navy' }),
  E('mil_navy_midway', 'front', c(N, { on: 'h_midway', w: 0 }), `空母が燃えている。爆発。煙で太陽が見えない。
officer|総員、退艦！`, [C('🌊', '海に飛び込む', 'gamble', 'hp-20', { risk: 14 }), C('🧑‍🚒', '負傷者を引きずって甲板へ', 'gamble', 'hp-15 consc+8', { risk: 18 })], { art: 'navy' }),
  E('mil_navy_secret', 'front', c(N, { flags: ['at_front'], from: '1942-06', to: '1943-06', w: 3 }), `生還した者は、口外禁止のまま別の艦へ回された。
officer|負けたことは、内地では知らされていない。`, [C('🤐', '黙る', 'safe', 'spirit-4'), C('✉️', '家族への手紙にほのめかす', 'gamble', 'consc+3', { check: { base: 50 }, lose: { e: 'rep-8', res: '検閲で呼び出された。' } })], { art: 'navy', note: 'ミッドウェー敗北は国民に秘匿された（史実）。' }),
  E('mil_navy_convoy', 'front', c(N, { flags: ['at_front'], from: '1943-01', w: 4, cd: 6, not: ['alt_us_deal'] }), `輸送船団の護衛。夜の海に、魚雷の白い航跡。
narr|前の船が火柱を上げて沈んでいく。`, [C('🛟', '海に浮かぶ人を救助する', 'gamble', 'consc+8 hp-5', { risk: 8 }), C('🎯', '回避運動に専念する', 'safe', 'hp-2', { risk: 5 })], { art: 'navy', note: '日本の商船・輸送船の損害は甚大で、多数の船員・兵員が犠牲になった（史実）。' }),
  E('mil_navy_leyte', 'front', c(N, { on: 'h_leyte', w: 0 }), `レイテ沖。艦隊のほとんどが沈んでいく。
narr|海に油が浮き、燃えている。`, [C('🌊', '最後まで配置を守る', 'gamble', 'hp-20 rep+6', { risk: 25 }), C('🛟', '浮遊物につかまり漂う', 'gamble', 'hp-25', { risk: 18 })], { art: 'navy' }),
  // ---- air ----
  E('mil_air_china_raid', 'front', c({ branch: ['army_air', 'navy_air'] }, { from: '1938-06', to: '1941-10', not: ['alt_china_truce'], w: 3 }), `出撃命令。目標は重慶の市街。
narr|上空からは、人の姿は見えない。`, [C('🛩️', '命令どおり出撃する', 'gamble', 'rep+3 consc-6', { risk: 5 }), C('🌀', '目標を外れた荒地に落とす', 'gamble', 'consc+8 rep-4', { risk: 5 })], { art: 'airfield', perspective: '重慶の市民', note: '重慶爆撃では多数の市民が犠牲になった（史実）。' }),
  E('mil_air_nomonhan', 'front', c(AA, { on: 'h_nomonhan', w: 0 }), `ノモンハンの空。最初は優勢だった。だが、ソ連機は次々に増えていく。`, [C('🛩️', '飛ぶ', 'gamble', 'hp-10 rep+5', { risk: 12 })], { art: 'airfield' }),
  E('mil_air_south_strip', 'front', c({ branch: ['army_air', 'navy_air'] }, { from: '1942-01', not: ['alt_us_deal'], w: 4, cd: 5 }), `南方の前線基地。整備員が足りず、部品もない。
mech|今日は、飛べるのが三機だけです。`, [C('🔧', '自分も整備を手伝う', 'safe', 'hp-2 r.friend+8'), C('🛩️', '三機で出撃', 'gamble', 'rep+6', { risk: 14 })], { art: 'airfield' }),
  E('mil_air_ace_lost', 'front', c({ branch: ['army_air', 'navy_air'] }, { from: '1943-01', w: 3, not: ['alt_us_deal'] }), `熟練搭乗員が次々に帰らない。補充の若者は、飛行時間がまるで足りない。
friend|俺たちは、もう落とされるために飛んでるみたいだな。`, [C('📖', '後輩に生き残る技を教える', 'safe', 'consc+5 r.friend+8'), C('🍶', '黙って酒を飲む', 'safe', 'hp-3')], { art: 'airfield' }),
  E('mil_tokko_ask', 'front', c({ branch: ['army_air', 'navy_air'] }, { from: '1944-10', to: '1945-08', not: ['war_over', 'tokko_asked'], w: 0, auto: 2 }), `集合。司令が「志願」を募る。
officer|特別攻撃隊を編成する。熱望、望、否の三つから選べ。
narr|紙を配られる。周りの視線。拒否が許される空気は、なかった。`, [
    C('✍️', '「熱望」と書く', 'gamble', '+tokko_asked +tokko', { res: '出撃の日が決まった。', later: [2, 'mil_tokko_eve'] }),
    C('✍️', '「望」と書く', 'gamble', '+tokko_asked', { check: { base: 50 }, lose: { e: '+tokko', res: '名簿に名前があった。', later: [3, 'mil_tokko_eve'] }, res: 'まだ、名前は呼ばれなかった。' }),
    C('✍️', '「否」と書く', 'cost', '+tokko_asked rep-15 consc+10', { res: '翌日から、上官の目が変わった。' }),
  ], { art: 'airfield', note: '特攻の「志願」が実質的に強制であったとする証言は多い。形式的な志願制の運用は部隊により異なり、評価は議論がある。' }),
  E('mil_tokko_eve', 'front', c({ branch: ['army_air', 'navy_air'] }, { flags: ['tokko'], w: 0, not: ['war_over'] }), `出撃前夜。遺書を書く時間が与えられた。
narr|鉛筆の先が、何度も止まる。`, [
    C('✉️', '母に「先立つ不孝を」と書く', 'safe', 'item:last_letter r.mother+10', { fate: 'tokko' }),
    C('💌', '{partner}に「幸せになれ」と書く', 'safe', 'item:last_letter r.partner+10', { need: ['rom_met'], fate: 'tokko' }),
  ], { art: 'letters' }),
  // ---- endgame & postwar for soldiers ----
  E('mil_0815', 'front', c({}, { on: 'h_0815', w: 0 }), `部隊に終戦の詔書が伝えられた。
officer|……武装解除に応じる。
narr|へたり込む者。泣く者。まだ戦うと叫ぶ者。`, [C('🫡', '従う', 'safe', 'spirit+3'), C('😶', '空を見る。帰れるのだろうか', 'safe', 'spirit+5')], { art: 'postwar' }),
  E('mil_siberia', 'postwar', c({}, { flags: ['war_over', 'manchuria_post'], w: 0, auto: 1 }), `貨車は東ではなく、北へ向かった。
narr|シベリアの収容所。零下30度。黒パンと薄いスープ。`, [C('🪵', '伐採の労働に耐える', 'gamble', 'hp-30', { risk: 12, res: '三度目の冬を越えて、帰国船の名前を聞いた。' })], { art: 'refugees' }),
  E('mil_army_mankki', 'career', c(A, { flags: ['china_front', 'cn_done'], not: ['mankki_done', 'war_over', 'chain'], from: '1939-03', to: '1941-06', w: 7 }), `中隊事務室。准尉が名簿をめくる。
officer|満期除隊だ。内地へ帰れ。
narr|戦地の兵は、満期を過ぎても留め置かれることが多かった。帰れるのは、運のいい者だけだ。`, [
    C('🚢', '帰国船に乗る', 'safe', '+mankki_done -at_front -china_front -deployed spirit+12', { res: '港で母が泣いていた。だが、在郷軍人名簿に名は残る。', later: [20, 'mil_recall'] }),
    C('🪖', '残留を志願する', 'gamble', '+mankki_done rep+8 spirit-6', { res: '{friend}が「馬鹿だな」と笑った。' }),
  ], { art: 'station', note: '日中戦争期、現役満期兵の除隊延期・再召集は広く行われた（史実）。' }),
  E('mil_recall', 'conscription', c(A, { not: ['war_over'], w: 0 }), `二度目の赤紙。
mother|また、行くのかい。
narr|再召集。今度の行き先は、南方だと噂されていた。`, [
    C('🫡', '出頭する', 'safe', '+deployed +at_front +chain spirit-8', { res: '家族写真を、軍隊手帳に挟んだ。', later: [1, 'pc_01'] }),
  ], { art: 'station', note: '再召集（史実）。' }),
  E('mil_demob', 'postwar', c({}, { flags: ['war_over'], not: ['demobbed', 'manchuria_post', 'chain'], w: 0, auto: 2 }), `復員船。故郷の山が見えた。
narr|港では、「〇〇部隊の消息を知りませんか」という札を持った人々が並んでいた。`, [C('🧳', '上陸する', 'safe', '+demobbed spirit+5', { become: 'civ_post' })], { art: 'postwar' }),
  E('mil_pow_camp', 'postwar', c({}, { flags: ['pow'], w: 0, auto: 1 }), `捕虜収容所。米兵が煙草をくれた。
narr|「捕虜になれば家族が恥をかく」と教えられてきた。
narr|でも、生きている。`, [C('✍️', '偽名を使わず本名を登録する', 'gamble', 'spirit+5 consc+3', { res: '家族への通知が届いたのは、戦後だった。' })], { art: 'barracks' }),
];
