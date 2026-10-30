# テスト結果（ローカル実行・2026-10-30 JST）
## vitest（tests/engine.test.ts）
33/33 passed（success=true）。内容：コンテンツ整合（ID一意・史実に出典・改変に原因・実在人物に肖像なし）、全21開始×5seed×3方針でソフトロックなく1945年8月以降まで到達、日付単調、各モードで恋愛/家族アーク、軍人モードで死亡→後日談→継承、同seed同結果、セーブ途中保存→復元→同一進行、他アプリ/未来版セーブ拒否、史実固定で改変なし、国家モードの改変に原因。
## Playwright（scripts/e2e.mjs、390x844 と 1366x900）
30/30 passed（docs/e2e-results.json）。UI操作のみで一般/軍人/指揮官/国家の各モードをエンディングまでプレイ、年の後退なし、年表パネル、リロード後の自動セーブ復帰、横スクロールなし、コンソールエラーなし。スクリーンショット：docs/screenshots/。

## 公開URLでの検証（2026-10-31 00:33 JST）
https://gamebar777.github.io/showa-crossroads/ に対し curl（index / manifest / 画像 / 動画すべて200）と同じPlaywrightスイートを実行：30/30 passed（docs/e2e-results-live.json）。スクリーンショットはこの公開版での撮影。
