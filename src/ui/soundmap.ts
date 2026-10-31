// Scene → sound mapping. Explicit IDs (event/hist field `sfx` / `bgm`, or EXPLICIT below) win;
// otherwise ordered keyword rules over the card's title, lines, tags and art pick up to 3 SFX, plus a BGM mood.
export type Mood = 'title' | 'home' | 'night' | 'tension' | 'battle' | 'grief' | 'gunkan' | 'kimigayo';
// loop = ambience that repeats while the card is open; others are one-shots.
export const LOOP = new Set(['waves', 'ship', 'rain', 'wind', 'fire', 'crickets', 'suzumushi', 'cicada', 'static', 'crowd', 'clock', 'train', 'teleprinter', 'bombers']);
export const SFX_IDS = ['rifle', 'firefight', 'mg', 'explosion', 'bombing', 'artillery', 'bombers', 'flak', 'fighter', 'dogfight', 'siren', 'waves', 'ship', 'horn', 'shipbell',
  'train', 'whistle', 'rain', 'thunder', 'wind', 'fire', 'crowd', 'cheer', 'static', 'chime', 'telegraph', 'teleprinter', 'typewriter', 'paper', 'bell', 'cicada', 'crickets',
  'suzumushi', 'furin', 'steps', 'steps_in', 'march', 'heartbeat', 'clock', 'bugle', 'door', 'sting', 'taiko'] as const;
type Rule = [RegExp, string[]];
const RULES: Rule[] = [
  [/空襲警報|警戒警報|サイレン/, ['siren']],
  [/B-?29|爆撃機|大編隊|銀色の機体|爆音/, ['bombers']],
  [/焼夷弾|爆弾が|空襲(?!警報)|爆撃|投下|爆弾を/, ['bombing']],
  [/高射砲|対空砲火|対空射撃/, ['flak']],
  [/空戦|格闘戦|グラマン|ヘルキャット|P-?51|迎撃/, ['dogfight']],
  [/戦闘機|零戦|隼|特攻機|飛行機|離陸|発進|操縦|プロペラ|エンジン音/, ['fighter']],
  [/機関銃|機銃|掃射/, ['mg']],
  [/銃撃|銃声|撃ち合|射撃|発砲|撃て|交戦|白兵|突撃|夜襲|斬り込/, ['firefight']],
  [/小銃|狙撃|一発|銃口|引き金/, ['rifle']],
  [/艦砲|砲撃|砲弾|砲声|大砲|榴弾|迫撃/, ['artillery']],
  [/爆発|炸裂|轟音|轟沈|魚雷/, ['explosion']],
  [/火の手|燃え|炎|火事|焼け野|火の海|焼け跡/, ['fire']],
  [/汽笛|出港|入港|岸壁|桟橋/, ['horn']],
  [/艦橋|甲板|艦内|船倉|輸送船|艦隊|航海|出航|洋上|船/, ['ship']],
  [/海|波|浜|浦/, ['waves']],
  [/汽車|列車|機関車|鉄道|ホーム|駅/, ['train']],
  [/雷鳴|雷が|稲妻/, ['thunder']],
  [/雨(?!のよう)|梅雨|豪雨|水害|濁流/, ['rain']],
  [/風が|木枯らし|吹雪|台風|嵐|北風|寒風/, ['wind']],
  [/万歳|出征|見送|壮行|旗を振|日の丸の小旗/, ['cheer']],
  [/群衆|人波|行列|提灯|集会|大勢の|人だかり|闇市/, ['crowd']],
  [/玉音|詔書|重大放送|正午の放送/, ['chime', 'static']],
  [/ラジオ|放送|臨時ニュース|大本営発表/, ['static']],
  [/電報|電信|暗号|無電|打電|モールス/, ['telegraph']],
  [/通信|司令部|参謀|作戦室/, ['teleprinter']],
  [/タイプ|起草|文書|書類|記者|新聞社|原稿/, ['typewriter']],
  [/手紙|便り|葉書|封筒|検閲|遺書|千人針|日記/, ['paper']],
  [/寺|鐘|除夜|墓|葬|供養|お盆|位牌|遺骨|戦死公報|弔/, ['bell']],
  [/蝉|蟬|真夏|炎天|夏祭/, ['cicada']],
  [/鈴虫|虫の声|秋の夜|月見/, ['suzumushi']],
  [/秋|夜更け|夜道|夜半|蛍/, ['crickets']],
  [/風鈴|縁側|夕涼み/, ['furin']],
  [/行軍|行進|分列|隊列|歩調/, ['march']],
  [/廊下|宮中|御所|板の間|座敷/, ['steps_in']],
  [/足音|歩い|駆け|走っ|逃げ|避難/, ['steps']],
  [/心臓|鼓動|息を殺|息をひそめ|震え|恐怖|冷や汗|身を伏せ/, ['heartbeat']],
  [/ラッパ|起床|点呼|消灯|整列/, ['bugle']],
  [/御前会議|閣議|会議|時計|待つ|返事を|夜明け前/, ['clock']],
  [/戸を|玄関|扉|襖/, ['door']],
  [/太鼓|祭り|盆踊り/, ['taiko']],
];
// Art/category fallbacks so every card carries at least an ambience.
const ART: Record<string, string[]> = {
  airraid: ['wind', 'steps'], airfield: ['fighter'], navy: ['ship'], station: ['train'], barracks: ['bugle'], letters: ['paper'],
  council: ['clock'], hq: ['teleprinter'], refugees: ['wind', 'steps'], ration: ['crowd'], factory: ['teleprinter'], hospital: ['clock'],
  postwar: ['crowd'], family: ['clock'], couple: ['furin'], wedding: ['taiko'], title: ['wind'],
};
// Explicit per-event/per-history picks for key scenes (ids from content.json). Value: [sfx..., 'bgm:<mood>'?]
export const EXPLICIT: Record<string, string[]> = {
  h_pearl: ['dogfight', 'explosion', 'bgm:battle'], h_b29: ['siren', 'bombers', 'bgm:tension'], h_surrender: ['static', 'bgm:grief'],
  h_okinawa_end: ['artillery', 'bgm:grief'], h_marianas: ['dogfight', 'explosion', 'bgm:battle'], h_guadal: ['artillery', 'firefight', 'bgm:battle'],
  h_nanjing: ['artillery', 'bgm:tension'], h_1931_manchuria: ['explosion', 'train', 'bgm:tension'], h_const_enforce: ['crowd', 'chime', 'bgm:home'],
};
function season(date?: string) { const m = date ? +date.slice(5, 7) : 0; return m >= 7 && m <= 8 ? 'cicada' : m === 6 ? 'rain' : m >= 9 && m <= 10 ? 'suzumushi' : m === 11 ? 'crickets' : m === 12 || m <= 2 ? 'wind' : 'furin'; }
export interface Pick { sfx: string[]; mood: Mood }
export function pickSound(c: any, mode: string, date?: string): Pick {
  const x = c.ev || c.hist || {};
  const text = [x.title, ...(c.lines || []).map((l: any) => l.t), ...(x.tags || []), c.kind === 'death' ? '死' : ''].join(' ');
  const out: string[] = []; let mood: Mood | '' = '';
  const ex = [...(x.sfx || []), ...(EXPLICIT[x.id] || []), ...(EXPLICIT[x.scene] || [])];
  for (const e of ex) e.startsWith('bgm:') ? (mood = e.slice(4) as Mood) : out.push(e);
  if (!out.length) for (const [re, ids] of RULES) { if (re.test(text)) for (const i of ids) if (!out.includes(i)) out.push(i); if (out.length >= 3) break; }
  if (!out.length) out.push(...(ART[x.art] || []));
  if (!out.length) out.push(x.category === 'front' ? 'firefight' : mode === 'state' ? 'clock' : season(date));
  if (c.letter || x.letter) out.includes('paper') || out.unshift('paper');
  if (!mood) mood = c.kind === 'death' || c.kind === 'end' || /戦死|遺骨|亡くな|息を引き取|弔|焼け跡|遺族|帰らぬ/.test(text) || x.art === 'postwar' ? 'grief'
    : /firefight|mg|dogfight|bombing|artillery|explosion|flak/.test(out.join()) ? 'battle'
    : /siren|bombers|heartbeat|telegraph|teleprinter/.test(out.join()) || x.category === 'front' || x.category === 'state' || x.art === 'council' || x.art === 'hq' ? 'tension'
    : /crickets|suzumushi|paper/.test(out.join()) || /夜|月/.test(text) ? 'night' : 'home';
  if (/紀元二千六百年|即位|式典|奉祝/.test(text) && mode === 'state') mood = 'kimigayo';
  if (/陥落|大勝|提灯行列|祝賀|大戦果/.test(text) && (date || '') < '1942-07') mood = 'gunkan';
  return { sfx: out.slice(0, 3), mood };
}
