# 岐路の十年 — TEN YEARS AT THE CROSSROADS 1936–1945

昭和11年（1936）から終戦・新憲法施行（1947-05-03）までを、一人の人生として生きる歴史ライフシム（ブラウザ / スマホ縦画面対応）。

- **主軸は恋愛と家族**：出会い・求婚・婚礼・出征・軍事郵便・音信不通・帰還または戦死公報・形見・配偶者/子の視点・遺された者の願い。
- **モード**：一般人（男女10の出自：農家・工員・商店・学生・記者／農家の娘・紡績女工・教師・看護婦・事務員）／軍人（陸軍・海軍・陸軍航空・海軍航空 計7）／指揮官（抽象化した部隊運用・3）／天皇・国家（制度的制約の中の判断）。
- **史実と改変**：すべての歴史カードに「史実 / 改変」タグ。改変は国家モードの選択のみで発生し、原因・比較年表・出典を表示。「史実固定」トグルあり。
- **死と継承**：死亡すると後日談を表示し、配偶者・子・兄弟・友人の一人として物語を継続。
- **表示原則**：実在人物の台詞はすべて「創作」バッジ付き。実在人物のAI顔画像は生成しない。AI画像はすべて「AI再現」表示。戦争犯罪は美化せず、被害を受けた人々（中国・朝鮮・東南アジア・沖縄など）の視点を併記。

## 開発
```
npm ci
npm run dev        # 開発サーバ
npm test           # コンテンツ検証 + vitest
npm run build      # content.json / media manifest 生成 → tsc → vite build
npm run preview    # http://localhost:4180/
npm run e2e        # Playwright（390x844 + デスクトップ）
npm run counts     # 正直な件数カウント → docs/counts.json
```
構成：`content/*.mjs`（データ駆動イベント）→ `src/data/content.json`、`src/engine/`（seed付き決定論エンジン・バージョン付きセーブ）、`src/ui/`、`public/art|media`。

## ドキュメント
[SPEC](docs/SPEC.md) · [出典とライセンス](docs/SOURCES.md) · [件数](docs/COUNTS.md) · [テスト結果](docs/TEST_RESULTS.md) · [収益シミュレーション](docs/REVENUE_SIM.md) · [マーケティング文案](docs/MARKETING.md) · [法務・配慮チェックリスト](docs/LEGAL_SENSITIVITY.md) · [オーナー対応事項](docs/USER_ACTIONS.md)

本作はフィクションを含む教育的シミュレーションです。歴史解釈に争いのある点は作中で「論争あり」と明示しています。
