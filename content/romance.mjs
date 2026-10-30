import { E, C } from './lib.mjs';
const civ = ['civ'], ALL = ['civ', 'mil', 'cmd'];
// ===== Romance & family: the emotional core. Multi-year arc driven by flags rom_* / married / kid*.
export const ROMANCE = [
  // --- meeting (different per background) ---
  E('rom_meet_festival', 'romance', { modes: ALL, not: ['rom_met', 'married'], from: '1936-06', to: '1939-12', w: 6 }, `夏祭りの夜。人混みで下駄の鼻緒が切れた人がいた。
partner|……すみません、ありがとうございます。
narr|提灯の明かりの下、{partner}と名乗った。`, [
    C('🎐', '鼻緒をすげてやり、名を聞く', 'safe', 'spirit+4 r.partner+10 +rom_met', { res: '翌週、同じ道でまた会った。' }),
    C('🙇', '会釈だけして立ち去る', 'safe', 'spirit-1 +rom_missed', { res: '名前だけが、妙に耳に残った。', later: [8, 'rom_meet_again'] }),
  ], { art: 'couple', tags: ['festival', 'summer'] }),
  E('rom_meet_again', 'romance', { modes: ALL, flags: ['rom_missed'], not: ['rom_met', 'married'], w: 0 }, `市電の中で、あの祭りの夜の人と目が合った。
partner|あの時の……下駄の。
narr|偶然は、二度目には意味を持つ。`, [
    C('😊', '今度は話しかける', 'safe', 'spirit+5 r.partner+12 +rom_met'),
    C('🚃', '次の駅で降りる', 'cost', 'spirit-3 +rom_closed', { res: 'それきり、二度と会わなかった。' }),
  ], { art: 'station', echo: true }),
  E('rom_meet_work', 'romance', { modes: civ, not: ['rom_met', 'married'], from: '1936-04', to: '1941-06', w: 4 }, `職場に新しく来た人がいる。仕事は丁寧で、笑うと目が細くなる。
partner|分からないことがあったら、教えてくださいね。`, [
    C('📚', '仕事を口実に話す', 'safe', 'r.partner+8 +rom_met'),
    C('🤐', '噂になるのが怖い', 'safe', 'spirit-1', { res: '距離はそのまま。', later: [5, 'rom_meet_work2'] }),
  ], { art: 'factory' }),
  E('rom_meet_work2', 'romance', { modes: civ, not: ['rom_met', 'married'], w: 0 }, `残業の帰り道、雨。{partner}が傘を半分差し出した。
partner|駅まで、一緒にどうぞ。`, [C('☂️', '傘に入る', 'safe', 'r.partner+12 spirit+4 +rom_met'), C('🏃', '走って帰る', 'cost', 'hp-2 +rom_closed')], { art: 'station', echo: true }),
  // --- arranged marriage tension ---
  E('rom_omiai', 'romance', { modes: ALL, not: ['married', 'omiai_done'], age: [21, 40], from: '1937-01', w: 5 }, `mother|ご近所の世話で、お見合いの話が来たよ。
mother|先方は堅いお家だ。あんたも、もう年頃なんだから。
narr|写真の中の人は、真面目そうな顔で写っていた。`, [
    C('👘', '見合いを受ける', 'safe', 'r.mother+10 +omiai_done +omiai_yes', { res: '両家の顔合わせが決まった。', later: [3, 'rom_omiai_meet'] }),
    C('💌', '「好きな人がいる」と打ち明ける', 'gamble', 'r.mother-8 r.partner+10 +omiai_done +love_declared', { need: ['rom_met'], res: '母は黙って写真を戻した。' }),
    C('🙅', '「まだ早い」と断る', 'cost', 'r.mother-6 +omiai_done', { res: '母はため息をついた。' }),
  ], { art: 'letters' }),
  E('rom_omiai_meet', 'romance', { modes: ALL, flags: ['omiai_yes'], not: ['married', 'rom_engaged'], w: 0 }, `料亭の座敷。仲人ばかりが喋っている。
partner|……あの、映画はお好きですか。
narr|相手の小さな声が、場をほどいた。`, [
    C('🎬', '「今度、一緒に」と誘う', 'safe', 'r.partner+12 +rom_met +rom_court'),
    C('🍵', '礼儀正しく、それ以上は踏み込まない', 'safe', 'r.partner+3 +rom_met'),
    C('🚪', '「この話は」と断る', 'cost', 'r.mother-10 -omiai_yes +rom_closed'),
  ], { art: 'council' }),
  E('rom_parents_object', 'romance', { modes: ALL, flags: ['love_declared'], not: ['married'], w: 0, auto: 4 }, `father|身元もよく分からん相手と一緒になるのか。
father|家のことも、考えてくれ。
narr|{partner}の家は、貧しい長屋暮らしだった。`, [
    C('🙇', '父に頭を下げ続ける', 'safe', 'r.father+4 spirit-2 +parents_soften', { res: '半年後、父は「一度連れて来い」と言った。' }),
    C('🧳', '家を出てでも一緒になる', 'gamble', 'r.father-20 r.partner+15 yen-30 +eloped +rom_engaged', { res: '風呂敷包みひとつで、二人の暮らしが始まった。' }),
    C('💔', '諦める', 'cost', 'r.partner-30 spirit-10 +rom_closed +regret_love', { res: '駅で見送った背中を、何年も覚えていた。' }),
  ], { art: 'letters' }),
  // --- courtship ---
  E('rom_court_cinema', 'romance', { modes: ALL, flags: ['rom_met'], not: ['rom_court', 'rom_closed', 'married'], w: 6 }, `日曜日。{partner}と映画館へ行く約束をした。
partner|ニュース映画の前に、あんみつを食べたいな。`, [
    C('🍡', 'あんみつ屋に寄る', 'safe', 'yen-2 r.partner+8 spirit+5 +rom_court'),
    C('📖', '本屋に誘う（自分の好み）', 'gamble', 'r.partner+3 +rom_court', { res: '{partner}は意外な本を手に取った。' }),
  ], { art: 'couple' }),
  E('rom_court_wish', 'romance', { modes: ALL, flags: ['rom_court'], not: ['rom_engaged', 'married', 'rom_closed'], w: 5 }, `partner|わたし、本当は{pwish}。
partner|……笑う？
narr|{partner}が自分のことを話すのは、初めてだった。`, [
    C('🤝', '「応援する」と言う', 'safe', 'r.partner+14 +p_wish_ok', { res: 'この約束は、何年も後に試されることになる。' }),
    C('🏠', '「家庭に入ってくれたら」と言う', 'cost', 'r.partner-8 +p_wish_denied', { res: '{partner}は笑ったが、目は笑っていなかった。', later: [36, 'fam_wish_resurface'] }),
    C('🤔', '「考えさせて」', 'safe', 'r.partner+2'),
  ], { art: 'couple' }),
  E('rom_propose', 'romance', { modes: ALL, flags: ['rom_court'], not: ['rom_engaged', 'married', 'rom_closed'], age: [20, 50], w: 5 }, `夕暮れの川べり。言うなら、今だ。`, [
    C('💍', '「一緒になってください」', 'gamble', '+rom_engaged r.partner+15 spirit+8', { need_rel: { partner: 30 }, res: '{partner}は、黙ってうなずいた。' }),
    C('⏳', '「生活が落ち着いたら」', 'safe', 'r.partner-4', { res: '{partner}は「待ってる」と言った。' }),
  ], { art: 'couple' }),
  E('rom_propose_fail', 'romance', { modes: ALL, flags: ['rom_court'], not: ['rom_engaged', 'married', 'rom_closed'], age: [26, 60], from: '1940-01', w: 2 }, `partner|うちの父が、遠縁との縁談を決めてきたの。
partner|断れば、家に居られない。……どうしたらいい？`, [
    C('💍', '「うちに来い」と言う', 'gamble', '+rom_engaged r.partner+10 r.mother-5'),
    C('🙏', '先方の家に頭を下げに行く', 'safe', 'rep+3 r.partner+8 +rom_engaged', { check: { base: 55, add: { rep: 0.3 } }, lose: { e: '-rom_court +rom_closed spirit-12 +regret_love', res: '門前払いだった。{partner}は嫁いでいった。' } }),
    C('😶', '何も言えない', 'cost', '-rom_court +rom_closed spirit-10 +regret_love'),
  ], { art: 'letters' }),
  // --- wedding ---
  E('rom_wedding', 'family', { modes: ALL, flags: ['rom_engaged'], not: ['married'], w: 9 }, `婚礼の日。三三九度の盃が小さく震えた。
mother|……いい顔してるよ、二人とも。
narr|写真屋が「動かないで」と言った。`, [
    C('📷', '記念写真を一枚、大事にとっておく', 'safe', 'yen-15 +married bond+15 spirit+10 item:wedding_photo', { res: 'その写真は、のちに何度も取り出されることになる。' }),
    C('🍶', '質素に、身内だけで', 'safe', 'yen-5 +married bond+10'),
  ], { art: 'wedding', tags: ['wedding'] }),
  E('fam_newlife', 'family', { modes: ALL, flags: ['married'], not: ['fam_newlife'], w: 8 }, `新しい所帯。ちゃぶ台ひとつ、茶碗が二つ。
partner|お味噌汁、しょっぱくない？`, [
    C('😋', '「ちょうどいい」と嘘をつく', 'safe', 'r.partner+6 bond+3'),
    C('😄', '「しょっぱい」と笑う', 'gamble', 'r.partner+4 spirit+3', { res: '二人で笑った。それからずっと、少し薄味になった。' }),
  ], { art: 'letters' }),
  E('fam_wish_resurface', 'family', { modes: ALL, flags: ['p_wish_denied'], w: 0 }, `partner|ねえ。昔、わたしが言ったこと覚えてる？
partner|{pwish}って。……今からでも、遅いかな。`, [
    C('🌱', '「今度こそ応援する」', 'safe', 'r.partner+18 yen-10 +p_wish_ok -p_wish_denied', { res: '{partner}の顔が、娘のように明るくなった。' }),
    C('🏠', '「今は無理だ」', 'cost', 'r.partner-15 bond-8 +p_resent', { res: 'その夜、{partner}は黙って繕い物をしていた。' }),
  ], { art: 'letters', echo: true }),
  E('fam_partner_job', 'family', { modes: ALL, flags: ['married', 'p_wish_ok'], from: '1938-01', w: 3 }, `partner|わたし、{pjob}の口が見つかったの。働きたい。`, [
    C('👏', '背中を押す', 'safe', 'r.partner+10 yen+8 +p_working', { res: '家計が少し楽になり、{partner}はよく喋るようになった。' }),
    C('🧺', '家のことはどうする、と渋る', 'cost', 'r.partner-10 +p_resent'),
  ], { art: 'factory' }),
  E('fam_quarrel', 'family', { modes: ALL, flags: ['married'], w: 3, cd: 18 }, `partner|あなたは何でも一人で決める。
partner|わたしにも、考えがあるのよ。`, [
    C('🙇', '素直に謝る', 'safe', 'r.partner+8 spirit-1'),
    C('😤', '「家長は俺だ」と言い返す', 'cost', 'r.partner-12 bond-5 +p_resent'),
    C('🚶', '黙って外に出る', 'cost', 'r.partner-5', { res: '帰ると、夕飯にふきんが掛けてあった。' }),
  ], { art: 'family' }),
  E('fam_resent_break', 'family', { modes: ALL, flags: ['married', 'p_resent'], w: 3, from: '1939-01' }, `partner|実家に帰らせてもらいます。
narr|風呂敷包みを抱えた{partner}が、玄関に立っていた。`, [
    C('🏃', '追いかけて、本音で話す', 'gamble', '-p_resent r.partner+15', { check: { base: 50, add: { 'r.partner': 0.5 } }, lose: { e: '-married +divorced bond-20 spirit-15', res: '{partner}は戻らなかった。半年後、離縁の届けが出された。' }, res: '夜通し話した。{partner}は泣いて、それから笑った。' }),
    C('🚪', '止めない', 'cost', '-married +divorced bond-20 spirit-10'),
  ], { art: 'station' }),
  // --- children ---
  E('fam_pregnant', 'family', { modes: ALL, flags: ['married'], not: ['kid1', 'pregnant'], w: 7 }, `partner|……できたみたい。
narr|{partner}は、照れたように腹に手を当てた。`, [
    C('🎉', '近所中に言って回る', 'safe', 'spirit+10 bond+8 +pregnant', { later: [8, 'fam_birth'] }),
    C('🙏', '黙って神社にお参りする', 'safe', 'spirit+8 bond+6 +pregnant item:omamori', { later: [8, 'fam_birth'] }),
  ], { art: 'village' }),
  E('fam_birth', 'family', { modes: ALL, flags: ['pregnant'], w: 0 }, `産婆さんの声。それから、細い産声。
partner|……見て。あなたに似てる。`, [
    C('✍️', '名前を考え抜く', 'safe', 'bond+15 spirit+10 -pregnant +kid1 kid:1'),
    C('📜', '父に名付けを頼む', 'safe', 'bond+10 r.father+12 -pregnant +kid1 kid:1', { res: '父は三日かけて半紙に名前を書いた。' }),
  ], { art: 'family', tags: ['birth'] }),
  E('fam_kid_walk', 'family', { modes: ALL, flags: ['kid1'], kidAge: [1, 3], w: 6 }, `{child}が、初めて三歩あるいた。
partner|見た？ いま見た？`, [C('👐', '手を叩いて呼ぶ', 'safe', 'spirit+8 bond+5 r.child+8')], { art: 'letters' }),
  E('fam_kid_trait', 'family', { modes: ALL, flags: ['kid1'], kidAge: [3, 7], w: 6 }, `{child}は{ctrait}子に育っている。
child|ねえ、なんで空は青いの？`, [
    C('📖', '一緒に図鑑を見る', 'safe', 'r.child+10 kidtrait:curious', { res: '{child}は本を抱いて眠った。' }),
    C('🏃', '外で走り回らせる', 'safe', 'r.child+8 kidtrait:bold'),
    C('🎨', '好きに絵を描かせる', 'safe', 'r.child+8 kidtrait:gentle'),
  ], { art: 'family' }),
  E('fam_kid_sick', 'family', { modes: ALL, flags: ['kid1'], kidAge: [0, 8], w: 3, cd: 24 }, `{child}が高い熱を出した。夜中、息が荒い。`, [
    C('🏥', '金をはたいて医者を呼ぶ', 'cost', 'yen-25 r.child+5 bond+5', { res: '注射が効いた。朝には笑っていた。' }),
    C('🧊', '一晩中、額を冷やす', 'gamble', 'hp-3 bond+8', { check: { base: 70, add: { yen: 0.05 } }, lose: { e: 'yen-30 spirit-8', res: '翌朝、結局医者に走った。危ないところだった。' }, res: '明け方、熱が引いた。' }),
  ], { art: 'letters' }),
  E('fam_second', 'family', { modes: ALL, flags: ['kid1', 'married'], not: ['kid2', 'pregnant'], kidAge: [2, 9], w: 3 }, `partner|二人目、どうする？ 時節柄、楽じゃないけど。`, [
    C('👶', '「授かりものだ」', 'safe', '+pregnant2 bond+5', { later: [9, 'fam_birth2'] }),
    C('💴', '「今は一人を大事に」', 'safe', 'yen+3'),
  ], { art: 'letters' }),
  E('fam_birth2', 'family', { modes: ALL, flags: ['pregnant2'], w: 0 }, `二人目が生まれた。{child}が小さな手をそっと握る。
child|ぼく（わたし）、お兄ちゃん（お姉ちゃん）になるの。`, [C('🤲', '二人を抱き寄せる', 'safe', 'bond+12 spirit+8 -pregnant2 +kid2 kid:2')], { art: 'letters' }),
  E('fam_kid_school', 'family', { modes: ALL, flags: ['kid1'], kidAge: [6, 8], w: 6 }, `{child}が国民学校に上がる。ランドセルが大きすぎる。
child|先生がね、兵隊さんの絵を描けって。`, [
    C('✏️', '「好きなものを描け」と言う', 'gamble', 'r.child+8 consc+3 rep-2'),
    C('🎖️', '「上手に描けよ」と言う', 'safe', 'r.child+3'),
  ], { art: 'village', hist: '架空', note: '1941年4月から小学校は「国民学校」に改称（史実）' }),
  E('fam_parent_ill', 'family', { modes: ALL, from: '1938-01', w: 3, not: ['parent_ill'] }, `電報。「チチ キトク スグカエレ」
narr|故郷の駅まで、汽車で半日かかる。`, [
    C('🚂', 'すぐに帰る', 'cost', 'yen-12 r.father+20 +parent_ill', { res: '間に合った。父は手を握って「頼む」と言った。', later: [2, 'fam_parent_death'] }),
    C('💼', '仕事を片付けてから帰る', 'gamble', 'yen+5 +parent_ill +missed_father', { res: '着いたのは、通夜の晩だった。', later: [1, 'fam_parent_death'] }),
  ], { art: 'station' }),
  E('fam_parent_death', 'family', { modes: ALL, flags: ['parent_ill'], w: 0 }, `父の葬式。遺品の中に、古い帳面があった。
narr|そこには、自分の幼い頃のことばかりが書いてあった。`, [
    C('📓', '帳面を持ち帰る', 'safe', 'item:father_diary spirit+3 npc:father:dead', { res: 'のちに、この帳面を我が子が読むことになる。' }),
    C('🏚️', '家と田を兄弟に任せる', 'safe', 'yen+10 npc:father:dead'),
  ], { art: 'family' }),
  E('fam_mother_care', 'family', { modes: ALL, flags: ['parent_ill'], from: '1940-01', w: 3 }, `一人になった母が、物忘れをするようになった。
mother|あれ、あんた……いつ来たの。`, [
    C('🏠', '母を引き取る', 'cost', 'yen-10 bond+10 r.mother+15 r.partner-5', { res: '{partner}は黙って布団を一組増やした。' }),
    C('✉️', '仕送りを増やす', 'safe', 'yen-15 r.mother+6'),
  ], { art: 'village' }),
  // --- deployment: letters, waiting, silence, reunion or death notice ---
  E('fam_farewell', 'family', { modes: ALL, flags: ['call_up'], not: ['farewell_done'], w: 0, any: ['married', 'rom_engaged', 'rom_court'] }, `出征の朝。駅は日の丸の小旗で埋まっていた。
partner|手紙、書いてね。下手でもいいから。
narr|{partner}は千人針を差し出した。一針ずつ、街角で頼んで集めたという。`, [
    C('🧵', '千人針を腹に巻く', 'safe', 'item:senninbari r.partner+10 +farewell_done'),
    C('📷', '{partner}の写真を胸ポケットにしまう', 'safe', 'item:partner_photo r.partner+10 +farewell_done'),
    C('🤐', '「必ず帰る」とは言わずにおく', 'gamble', 'r.partner+4 consc+3 +farewell_done', { res: '守れない約束はしない。それが、精一杯の誠実だった。' }),
  ], { art: 'station', tags: ['farewell'] }),
  E('letter_home_first', 'letter', { modes: ['mil', 'cmd', 'civ'], flags: ['deployed'], any: ['married', 'rom_engaged', 'rom_court'], w: 8, letter: true }, `partner|前略
partner|お元気ですか。こちらは皆変わりありません。
partner|朝、あなたの茶碗にもご飯をよそってしまいました。
partner|かしこ`, [
    C('✍️', '検閲を気にしつつ、元気だと書く', 'safe', 'r.partner+6 spirit+4'),
    C('🌸', '故郷の桜のことだけを書く', 'safe', 'r.partner+8 spirit+3', { res: '検閲官も、桜は消さなかった。' }),
    C('😶', '返事が書けない', 'cost', 'r.partner-4', { res: '便箋は白いまま、背嚢の底にしまわれた。' }),
  ], { art: 'letters' }),
  E('letter_child_drawing', 'letter', { modes: ['mil', 'cmd', 'civ'], flags: ['deployed', 'kid1'], kidAge: [3, 12], w: 6, letter: true }, `partner|{child}が絵を描きました。同封します。
narr|クレヨンで描いた、大きな顔と小さな家。
narr|「おとうさん（おかあさん） はやくかえってきて」`, [
    C('🖼️', '絵を手帳に挟む', 'safe', 'item:child_drawing spirit+10 r.child+10'),
    C('✍️', '{child}あての返事を書く', 'safe', 'r.child+12 spirit+6'),
  ], { art: 'letters' }),
  E('letter_hardship', 'letter', { modes: ['mil', 'cmd', 'civ'], flags: ['deployed', 'married'], from: '1942-01', w: 5, letter: true }, `partner|配給がまた減りました。でも心配しないで。
partner|裏の空き地にかぼちゃを植えました。
narr|行間に、書かれていない苦労が見えた。`, [
    C('💴', '給料の送金を増やす', 'cost', 'yen-15 r.partner+8 bond+5'),
    C('✍️', '「無理をするな」と書く', 'safe', 'r.partner+5'),
  ], { art: 'letters' }),
  E('letter_partner_independent', 'letter', { modes: ['mil', 'cmd', 'civ'], flags: ['deployed', 'married', 'p_wish_ok'], w: 4, letter: true }, `partner|町内で{pjob}の手が足りず、わたしが務めることになりました。
partner|あなたに相談せず決めてごめんなさい。でも、やってみたいの。`, [
    C('👍', '「誇りに思う」と返す', 'safe', 'r.partner+12 bond+5'),
    C('😟', '「体を大事に」とだけ書く', 'safe', 'r.partner+4'),
  ], { art: 'factory' }),
  E('letter_rumor', 'letter', { modes: ['mil', 'cmd'], flags: ['deployed', 'rom_engaged'], not: ['married'], w: 3, letter: true }, `故郷の友の手紙。
friend|{partner}さんに、別の縁談があるらしい。親御さんが急かしてる。`, [
    C('✉️', 'すぐ{partner}に手紙を書く', 'gamble', 'r.partner+8', { check: { base: 60, add: { 'r.partner': 0.4 } }, lose: { e: '-rom_engaged +rom_closed spirit-15 +regret_love', res: '返事は来なかった。翌年、{partner}が嫁いだと聞いた。' }, res: '「待っています」とだけ書いた返事が届いた。' }),
    C('🕊️', '「自分を待つな」と書く', 'cost', '-rom_engaged +rom_closed consc+5 spirit-10', { res: '一番つらい手紙を、一番きれいな字で書いた。' }),
  ], { art: 'letters' }),
  E('letter_silence', 'letter', { modes: ['civ'], flags: ['partner_away'], w: 5, letter: true }, `もう三か月、{partner}からの便りがない。
narr|郵便配達の自転車の音がするたび、玄関に出てしまう。`, [
    C('🏯', '連隊区司令部に問い合わせる', 'cost', 'yen-3 spirit-2', { res: '「部隊は移動中」とだけ言われた。' }),
    C('✍️', '届くと信じて書き続ける', 'safe', 'spirit+2 r.partner+5'),
  ], { art: 'letters' }),
  E('letter_silence_mil', 'letter', { modes: ['mil', 'cmd'], flags: ['deployed', 'married'], from: '1943-01', w: 4, letter: true }, `もう半年、家からの便りが届かない。輸送船が沈むたび、郵便も沈む。
narr|最後の手紙を、すり切れるほど読み返している。`, [
    C('📖', '最後の手紙を読み返す', 'safe', 'spirit+4 item:last_letter'),
    C('✍️', '届かなくても書く', 'safe', 'spirit+2 r.partner+4'),
  ], { art: 'navy' }),
  E('fam_reunion', 'family', { modes: ['mil', 'cmd'], flags: ['war_over', 'deployed'], any: ['married', 'rom_engaged'], w: 0, auto: 1 }, `復員列車を降りると、ホームの端に{partner}が立っていた。
partner|……おかえりなさい。
narr|言いたいことは山ほどあったのに、どちらも何も言えなかった。`, [
    C('🫂', '抱きしめる', 'safe', 'spirit+20 bond+20 r.partner+20 -deployed +reunited'),
    C('🙇', '「ただいま」と頭を下げる', 'safe', 'spirit+15 bond+15 -deployed +reunited'),
  ], { art: 'family', tags: ['reunion'] }),
  E('fam_reunion_child', 'family', { modes: ['mil', 'cmd'], flags: ['reunited', 'kid1'], w: 0, auto: 1 }, `{child}は、母の後ろに隠れてこちらを見ている。
child|……おじさん、だれ？`, [
    C('🧸', 'しゃがんで、目の高さで名乗る', 'safe', 'r.child+15 bond+10', { res: '三日目に、{child}は膝に乗ってきた。' }),
    C('😢', '思わず泣いてしまう', 'safe', 'r.child+8 spirit+5'),
  ], { art: 'postwar' }),
  E('fam_war_wound', 'family', { modes: ['mil', 'cmd'], flags: ['reunited'], w: 4 }, `夜中に飛び起きる。夢の中で、まだ撃たれている。
partner|……大丈夫。ここは家よ。`, [
    C('🗣️', '戦地のことを少しだけ話す', 'gamble', 'spirit+8 r.partner+10', { res: '{partner}は最後まで黙って聞いた。' }),
    C('🍶', '酒で紛らわす', 'cost', 'hp-6 r.partner-8 spirit-4'),
  ], { art: 'letters' }),
  E('fam_keepsake_return', 'family', { modes: ALL, items: ['wedding_photo'], from: '1945-09', w: 3 }, `焼け残った柳行李の底から、婚礼の写真が出てきた。
partner|……この頃は、こんな顔してたのね。
narr|二人とも、ずいぶん痩せた。`, [C('🖼️', '写真を飾る', 'safe', 'spirit+10 bond+8')], { art: 'letters', echo: true }),
  E('fam_keepsake_diary', 'family', { modes: ALL, items: ['father_diary'], flags: ['kid1'], kidAge: [6, 20], from: '1944-01', w: 3 }, `{child}が、祖父の帳面を読んでいる。
child|おじいちゃん、字がきれいだね。……ここに、お父さん（お母さん）のことが書いてある。`, [C('📓', '一緒に読む', 'safe', 'r.child+12 bond+6')], { art: 'letters', echo: true }),
  E('fam_widow_choice', 'family', { modes: ['civ'], flags: ['partner_dead'], w: 4 }, `mother|まだ若いんだから、再縁の話も考えなさい。
narr|仏壇の写真は、何も言わない。`, [
    C('🕯️', '「この人だけ」と断る', 'safe', 'spirit-3 bond+5 rep+3'),
    C('🌱', '子のために、考えてみる', 'gamble', 'spirit+3 +remarry_open', { res: '答えは、急がなくていい。' }),
  ], { art: 'family' }),
];
