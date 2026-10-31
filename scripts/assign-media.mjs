// Generates content/media-assign.json: per-card real photo/clip chosen by a curated keyword→theme table,
// balancing reuse (cap per asset). Run: NO_ASSIGN=1 node content/build.mjs && node scripts/media.mjs && node scripts/assign-media.mjs
// Only cards without a hand-set img/clip are assigned. Cards with no fitting real asset keep their (labelled) AI art.
import fs from 'node:fs';
const D = JSON.parse(fs.readFileSync('src/data/content.json'));
const R = JSON.parse(fs.readFileSync('content/media-real.json'));
const PH = new Set(R.photos.map(p => p.key));
const CAP = 4, CLIPCAP = 6;
// theme: [regex over card text, photo keys]
const T = [
  ['pearl', /真珠湾|ハワイ|開戦の朝|十二月八日/, ['nv_pearlview', 'nv_shokakudeck', 'air_zero']],
  ['midway', /ミッドウェー/, ['nv_hiryu']],
  ['carrier', /空母|母艦|飛行甲板|機動部隊|単冠湾/, ['nv_akagi', 'nv_akagideck', 'pc_kaga', 'nv_shokakudeck']],
  ['yamato', /大和|戦艦|沖縄特攻|天一号/, ['nv_yamato']],
  ['convoy', /輸送船|船団|潜水艦|魚雷|海没/, ['nv_convoy', 'ph_ls159', 'ph_ls11']],
  ['navy', /艦|海軍|水兵|甲板|艦隊|軍艦|レイテ沖/, ['ph_wakatsuki', 'nv_akagi', 'pc_minesweeper', 'cn_flagship']],
  ['tokko', /特攻|知覧|鹿屋|振武|神風/, ['air_chiran', 'air_72shinbu', 'ph_shikishima', 'ph_kamikaze']],
  ['air', /搭乗員|飛行|操縦|零戦|戦闘機|撃墜|飛行場|滑走路|航空/, ['air_shokakupilots', 'mn_pilots', 'pc_zero', 'air_zero', 'air_choshi']],
  ['manchuria', /満洲|満州|開拓|ノモンハン|ソ連|関東軍|ハルビン|シベリア/, ['hm2_mansettler', 'hm2_mansettlers3', 'hm2_mansettlers6', 'hm2_manwomen', 'mn_settlers', 'mn_cross', 'mn_tanks']],
  ['okinawa', /沖縄|那覇|ひめゆり/, ['hm2_himeyuri', 'hm2_nahamarket', 'hm2_okfuneral', 'hm_naha']],
  ['china', /上海|南京|徐州|漢口|武漢|重慶|支那|中国|華北|北支|蘆溝橋|盧溝橋|クリーク|広東/, ['cn_smokeflag', 'cn_baoshan', 'cn_sihang_north', 'cn_suzhou', 'cn_landing', 'cn_gasmask', 'cn_hungjao', 'cn_railway', 'cn_taierzhuang', 'cn_sihang_attack', 'cn_zhabei_fire', 'cn_north_station', 'cn_snlf']],
  ['south', /ガダルカナル|ニューギニア|ジャングル|南方|玉砕|サイパン|タラワ|ペリリュー/, ['pc_ridge', 'pc_ng_snlf', 'pc_betio', 'pc_garapan', 'pc_matanikau', 'pc_tarawatank', 'pc_saipanbeach', 'pc_mortar', 'pc_peleliu']],
  ['philippines', /フィリピン|比島|ルソン|レイテ|マニラ/, ['ph_baleta', 'ph_lipa', 'ph_corregidor', 'ph_navalfire']],
  ['barracks', /内務班|古参兵|上等兵|ビンタ|兵舎|初年兵|徴兵検査|班長/, ['hm_exam', 'hm2_armyday44', 'hm2_seinento']],
  ['hospital', /病院|看護|療養|結核|軍医|衛生兵|担架|入院|赤十字|マラリア/, ['hm2_nurse38', 'hm2_redcross1', 'hm2_redcross2', 'hm2_redcross3', 'hm2_sanatorium']],
  ['sendoff', /出征|見送|壮行|万歳|赤紙|召集|入営|入隊|学徒出陣|出陣/, ['hm_nada', 'hm2_narita', 'hm2_aoyama', 'hm2_kokushikan', 'hm2_sokokai', 'hm_gakuto', 'hm2_school40a', 'hm2_kokubo']],
  ['senninbari', /千人針|お守り|武運/, ['hm_senninbari', 'hm_senninbari36', 'hm2_senninbari37', 'hm2_senninbari']],
  ['letters', /手紙|葉書|はがき|便り|郵便|検閲|返事|文面|封筒|軍事郵便/, ['hm2_kumada', 'hm2_senninbari', 'hm2_hands1', 'hm2_girl36', 'hm2_oldman', 'hm2_village41']],
  ['funeral', /葬|戦死|遺骨|英霊|公報|遺族|白木の箱|墓/, ['hm2_okfuneral', 'hm_yamamoto', 'hm_boy', 'hm2_kokubo']],
  ['raid', /空襲|焼夷|B29|Ｂ２９|B-29|警報|焼け跡|焼け野|罹災/, ['hm2_sendai', 'hm2_maebashi', 'hm2_hiratsuka', 'hm2_fukui', 'hm_tokyoafter', 'hm_ryogoku', 'hm_waseda', 'hm_nakamise']],
  ['shelter', /防空壕|壕|避難/, ['hm2_inshelter', 'hm2_bigshelter', 'hm2_shelter', 'hm2_shelterbuild']],
  ['drill', /訓練|防空演習|演習|バケツ|竹槍|教練|なぎなた|薙刀|防火/, ['hm2_disaster39', 'hm2_bucketstud', 'hm_drill1', 'hm_drill2', 'hm2_kendo', 'hm2_naginata', 'hm2_schooldrill', 'hm_gasmask', 'hm_bucket']],
  ['evac', /疎開/, ['hm_evac', 'hm2_demolition', 'hm2_ogouchi', 'hm2_children39']],
  ['factory', /工場|挺身|動員|徴用|旋盤|軍需|勤労/, ['hm2_labor', 'hm2_teishin', 'hm2_teishin1', 'hm_nakajima', 'hm2_hands1']],
  ['tonari', /隣組|常会|回覧|組長|婦人会|国防婦人|愛国婦人|町内/, ['hm2_kensei', 'hm2_seishin38', 'hm2_aikoku', 'hm2_kokubo', 'hm_kyodo', 'hm2_shelterbuild', 'hm_bucket']],
  ['ration', /配給|切符|闇|衣料|供出|芋|雑炊|米びつ|砂糖|代用|食糧|食料/, ['hm_ration', 'hm_kometsuki', 'hm2_clothes38', 'hm2_nahamarket', 'hm2_stall45', 'hm_ricefeed', 'hm2_lunch44']],
  ['save', /貯金|貯蓄|国債|献納|金属回収/, ['hm2_save', 'hm2_castor']],
  ['news', /新聞|ラジオ|大本営|発表|号外|ポスター|標語|宣伝/, ['hm2_shashin', 'hm2_newspaper44', 'hm_dangan', 'hm2_armyday44', 'hm2_seinento']],
  ['school', /学校|先生|教室|生徒|学童|校庭|勉強/, ['hm2_sinzyo', 'hm2_lunch44', 'hm2_schooldrill', 'hm2_schoolgirls', 'hm2_agrischool', 'hm2_naginata']],
  ['farm', /田植|稲|田んぼ|畑|収穫|農|牛|麦|草取り|ヒマ|野良/, ['hm2_taue', 'hm2_ricefield36', 'hm2_summer37', 'hm2_castor', 'hm2_agrischool', 'hm2_oldman']],
  ['station', /駅|汽車|列車|ホーム/, ['hm_nagoya', 'hm2_narita', 'hm_nada', 'hm2_ueno46']],
  ['postwar', /復員|引揚|闇市|孤児|進駐|敗戦|戦後|焼け出/, ['hm2_demob', 'hm2_ueno46', 'hm2_orphan', 'hm2_stall45', 'hm_line46', 'hm_ebisu']],
  ['child', /息子|娘|赤ん坊|子ども|子供|\{child\}|弟|妹/, ['hm2_children39', 'hm2_girls39', 'hm2_girls45', 'hm2_ogouchi', 'hm2_girl36', 'hm_zoo']],
  ['village', /村|集落|庄屋|駐在|寄合|祭|神社|田舎|郷/, ['hm2_village41', 'hm2_suburb37', 'hm2_ogouchi', 'hm2_bamboo', 'hm2_kasaya', 'hm2_oldman', 'hm2_girl36']],
  ['family', /母|父|妻|夫|家族|祖|嫁|姑/, ['hm2_oldman', 'hm2_kumada', 'hm2_village41', 'hm2_school40a', 'hm2_manwomen', 'hm2_girl36']],
];
// fallback pools by art (home art without keyword hit)
const ART = { village: ['hm2_village41', 'hm2_suburb37', 'hm2_bamboo', 'hm2_kasaya', 'hm2_ogouchi', 'hm2_summer37', 'hm2_taue', 'hm2_ricefield36'], letters: ['hm2_kumada', 'hm2_senninbari', 'hm2_hands1', 'hm2_girl36', 'hm_senninbari36'], ration: ['hm_ration', 'hm_kometsuki', 'hm2_clothes38'], hospital: ['hm2_redcross1', 'hm2_redcross2', 'hm2_redcross3', 'hm2_nurse38'], family: ['hm2_oldman', 'hm2_village41', 'hm2_kumada'], factory: ['hm2_labor', 'hm2_teishin', 'hm_nakajima'], station: ['hm_nagoya', 'hm2_narita', 'hm_nada'], airraid: ['hm2_sendai', 'hm2_maebashi', 'hm2_inshelter'], postwar: ['hm2_demob', 'hm2_ueno46', 'hm2_stall45', 'hm_line46'], navy: ['nv_akagi', 'ph_wakatsuki'], airfield: ['air_shokakupilots', 'pc_zero'] };
// news clips by place
const CL = [
  [/真珠湾|ミッドウェー|海戦|機動部隊|ハワイ/, 'real_navyair'],
  [/香港|マレー|シンガポール|蘭印|ジャワ|南方作戦/, 'real_hongkong'],
  [/特攻|神風/, 'real_tokko_takeoff'],
  [/重慶|爆撃|渡洋/, 'real_cn_bombing'],
  [/上海|南京|難民|武漢|漢口|徐州/, 'real_cn_refugees'],
  [/観兵式|紀元二千六百年|閲兵/, 'real_parade'],
  [/復興|焼け跡の|戦災復興/, 'real_postwar_rebuild'],
  [/闇市|食糧メーデー|配給遅配/, 'real_postwar_crowd'],
];
const text = (x) => [x.title, x.region, ...(x.lines || []), ...(x.news || [])].map(l => typeof l === 'string' ? l : l?.t).join(' ') + ' ' + (x.cond?.flags || []).map(f => ({ china_front: '中国', south_front: '南方', manchuria_front: '満洲', navy: '海軍' })[f] || '').join(' ') + ' ' + (x.choices || []).map(c => c.label).join(' ');
const use = {}, out = {};
const bump = (k) => (use[k] = (use[k] || 0) + 1);
// count hand-set usage first
for (const x of [...D.events, ...D.hist]) { if (x.img) bump(x.img); if (x.clip) bump(x.clip); }
const choose = (keys, cap = CAP) => { const ok = keys.filter(k => PH.has(k) && (use[k] || 0) < cap); if (!ok.length) return null; ok.sort((a, b) => (use[a] || 0) - (use[b] || 0) || keys.indexOf(a) - keys.indexOf(b)); return ok[0]; };
const civArts = new Set(['village', 'letters', 'ration', 'family', 'hospital', 'factory', 'station', 'airraid', 'postwar', 'wedding', 'couple']);
// Hand-curated overrides after reviewing the keyword output: id -> photo key, 'clip:key', or null (= keep labelled AI art; no fitting real asset).
const HAND = {
  mil_army_march: 'cn_smokeflag', mil_army_nanjing_order: 'cn_north_station', mil_army_guadal_hunger: 'pc_ridge', mil_army_gyokusai_order: 'pc_garapan',
  mil_army_creek: 'cn_suzhou', cn_14: 'hm2_redcross1', mil_army_mankki: 'cn_snlf', pc_04: 'hm2_hands1', ph_09w2: 'ph_baleta',
  mil_navy_pearl: 'nv_pearlview', mil_navy_midway: 'nv_hiryu', mil_navy_leyte: 'ph_wakatsuki', mil_navy_secret: 'nv_akagideck', mil_navy_hammock: 'nv_akagi', mil_navy_gunnery: 'cn_flagship',
  mil_air_china_raid: 'clip:real_cn_bombing', mil_air_nomonhan: 'mn_pilots', mil_air_south_strip: 'pc_zero', mil_air_ace_lost: 'air_shokakupilots', mil_air_firstsolo: 'air_choshi', mil_air_friend_crash: 'mn_pilots', mil_yokaren_song: 'air_zero',
  mil_tokko_ask: 'ph_shikishima', mil_tokko_eve: 'air_72shinbu', mil_siberia: 'mn_nakhodka', mil_pow_camp: 'pc_tarawapow', mil_demob: 'hm2_demob',
  mil_army_bicycle: null, mil_army_imphal: null, post_kr_soldier: null, col_sea_romusha: null, col_china_village: null,
  fam_newlife: 'hm2_kasaya', fam_kid_sick: 'hm2_nurse38', fam_birth2: 'hm2_children39', fam_parent_ill: 'hm2_narita', fam_mother_care: 'hm2_oldman', fam_war_wound: 'hm2_kumada',
  fam_keepsake_return: 'hm2_village41', col_kr_return: 'hm2_demob', post_nanjing_memory: 'hm2_oldman', mil_friend_letter_deliver: 'hm2_village41', post_alt_world: 'hm2_suburb37',
  // news cards: only explicit, place-matched picks (others keep their AI art or show none)
  h_shanghai: 'clip:real_cn_refugees', h_nanjing: 'cn_landing', h_wuhan: 'cn_snlf', h_chongqing: 'clip:real_cn_bombing', h_mobil: 'hm2_labor', h_nomonhan: 'mn_cross',
  h_soviet: 'mn_harbin', h_siberia: 'mn_nakhodka', h_taisei: 'hm2_seishin38', h_ration: 'hm_ration', h_2600: 'clip:real_parade', h_pearl: 'nv_pearlview', h_midway: 'nv_hiryu',
  h_guadal: 'pc_ridge', h_guadal_out: 'pc_matanikau', h_yamamoto: 'hm_yamamoto', h_gakuto: 'hm_gakuto', h_saipan: 'pc_saipanbeach', h_sokai: 'hm_evac', h_teishin: 'hm2_teishin1',
  h_leyte: 'ph_wakatsuki', h_b29: 'hm_b29', h_tokyo_raid: 'hm_tokyoafter', h_okinawa: 'hm2_himeyuri', h_tokko: 'clip:real_tokko_takeoff',
  // state/cmd/civ cards reviewed by hand
  st_nomonhan: 'mn_cross', st_marco: null, st_axis: null, st_south: null, st_econ: null, st_konoe_memo: null, st_ningen: null, st_ch_family: null, st_ch_letter: null, st_attu: null, st_ch_loss: null, st_ch_after: null, st_opinion: 'hm2_shashin',
  civ_payday: null, civ_radio: null, civ_berlin_olympics: null, civ_pearl_news: 'nv_pearlview', civ_singapore_lantern: null, civ_gakuto: 'hm_gakuto', civ_hiroshima: null, civ_0815: null,
  civ_student_reading: null, civ_clerk_typing: null, col_korea_school: null, col_taiwan_letter: null, hp_kempei: null, hp_blackout: 'hm_drill1', civ_ration_line: 'hm_ration', civ_metal: null,
  hw_02: 'hm_nada', hw_03: 'hm2_kumada', hw_06: 'hm_kyodo', hw_08b: 'hm2_newspaper44', hw_11: null, rom_meet_festival: null, rom_omiai: null, fam_second: null, fam_kid_walk: 'hm2_girl36',
  fam_birth: null, fam_keepsake_diary: 'hm2_oldman', fam_widow_choice: null, fam_reunion: 'hm2_ueno46', civ_226_morning: null, civ_job_munitions: 'hm2_labor', cmd_inspect: null, cmd_nco_violence: null,
  cmd_surrender: null, cmd_letter_men: 'hm2_hands1', post_blackmarket: 'hm2_stall45', post_vote: null, post_kid_question: null, civ_death_notice: 'hm2_okfuneral', civ_sokai_kids: 'hm_evac',
  post_return_kid: 'hm2_children39', post_reporter_draft: null, col_settler_land: 'hm2_mansettlers6', col_settler_1945: 'hm2_manwomen', st_mobil: 'hm2_teishin',
};
const skip = new Set();
for (const [id, k] of Object.entries(HAND)) { if (k === null) { skip.add(id); continue; } if (k.startsWith('clip:')) { out[id] = { clip: k.slice(5) }; bump(k.slice(5)); } else { out[id] = { img: k }; bump(k); } }
const cards = [...D.hist.map(h => ({ x: h, news: true })), ...D.events.map(e => ({ x: e }))];
for (const { x, news } of cards) {
  if (x.img || x.clip || out[x.id] || skip.has(x.id)) continue;
  if (news || /^st_/.test(x.id)) continue; // news/state cards: explicit HAND picks only
  const s = text(x);
  if (news) {
    const c = CL.find(([re, k]) => re.test(s) && (use[k] || 0) < CLIPCAP);
    if (c) { out[x.id] = { clip: c[1] }; bump(c[1]); continue; }
  }
  const art = x.art || (news ? '' : 'village');
  // AI-only arts that should stay AI when nothing fits: council/hq/title/wedding/couple/barracks
  let k = null;
  for (const [, re, keys] of T) if (re.test(s)) { k = choose(keys); if (k) break; }
  if (!k && ART[art]) k = choose(ART[art], CAP + 1);
  if (k) { out[x.id] = { img: k }; bump(k); }
}
fs.writeFileSync('content/media-assign.json', JSON.stringify(out, null, 0).replace(/},"/g, '},\n"'));
const left = cards.filter(({ x }) => !x.img && !x.clip && !out[x.id]).map(({ x, news }) => (news ? 'N:' : '') + x.id + ':' + (x.art || '-'));
console.log('assigned', Object.keys(out).length, 'unassigned', left.length); console.log(left.join(' '));
