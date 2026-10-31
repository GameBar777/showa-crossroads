# 出典とアセットライセンス

## 歴史出典（作中の各カード「出典・注記」から参照）
※季節場面（`content/almanac-*.mjs`）では、各場面の見出しに 史実／架空／改変 の区分と出典キーを付け、注記に史実の要点を書く。架空の場面に出てくる制度・出来事も、注記で史実として出典を示す（例：阪神大水害 1938、東南海地震 1944、南海地震 1946、新円切替 1946、農地改革 1946、学童疎開 1944、引揚げ約660万人＝厚生労働省）。改変の場面は【改変】と明記する。
※URLは2026-10-30（JST）に到達確認済み（外務省2件はbotアクセスに403を返すが、検索でページの存在を確認）。

- **史料にみる日本の近代** — https://www.ndl.go.jp/modern/
- **アジア歴史資料センター（公文書デジタルアーカイブ）** — https://www.jacar.go.jp/
- **国立公文書館 所蔵資料** — https://www.archives.go.jp/
- **戦史叢書・戦史史料（防衛研究所）** — https://www.nids.mod.go.jp/military_history_search/
- **『昭和天皇実録』（宮内庁編、東京書籍 2015–2019）** — https://www.kunaicho.go.jp/
- **日中歴史共同研究 報告書（2010年公表）** — https://www.mofa.go.jp/mofaj/area/china/rekishi_kk.html
- **歴史問題Q&A** — https://www.mofa.go.jp/mofaj/area/taisen/qa/index.html
- **広島平和記念資料館** — https://hpmmuseum.jp/
- **長崎原爆資料館** — https://nagasakipeace.jp/
- **沖縄県平和祈念資料館** — https://www.peace-museum.okinawa.jp/
- **東京大空襲・戦災資料センター** — https://tokyo-sensai.net/
- **日本国憲法の誕生** — https://www.ndl.go.jp/constitution/
- **戦没者慰霊・援護** — https://www.mhlw.go.jp/seisakunitsuite/bunya/hokabunya/senbotsusha/
- **World War II records** — https://www.archives.gov/research/military/ww2

個別カードの出典キーと注記は `content/hist.mjs`（`src`/`note`フィールド）に記載。解釈に争いのある事項（盧溝橋の最初の発砲、南京事件の犠牲者数、創氏改名の強制の程度、シンガポール華僑粛清の規模、聖断の経緯など、hist.mjs の `contested` 欄15件）は作中で「論争あり」と表示し、複数の見解を併記。

## 画像・動画（public/media/manifest.json）
| id | 種別 | ファイル | ラベル | ライセンス | 出所 |
|---|---|---|---|---|---|
| img_title | image | art/title.webp | 雪の朝の駅（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_village | image | art/village.webp | 農村（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_factory | image | art/factory.webp | 軍需工場（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_station | image | art/station.webp | 出征の駅（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_barracks | image | art/barracks.webp | 兵営（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_navy | image | art/navy.webp | 艦上（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_airfield | image | art/airfield.webp | 飛行場（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_refugees | image | art/refugees.webp | 避難する人々（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_airraid | image | art/airraid.webp | 空襲（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_letters | image | art/letters.webp | 手紙（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_council | image | art/council.webp | 会議室（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_hq | image | art/hq.webp | 司令部（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_postwar | image | art/postwar.webp | 焼け跡（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_wedding | image | art/wedding.webp | 婚礼（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_family | image | art/family.webp | 食卓（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_hospital | image | art/hospital.webp | 病棟（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_ration | image | art/ration.webp | 配給の列（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| img_couple | image | art/couple.webp | 川べりの二人（AI再現） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| clip_airraid | clip | media/clips/airraid.mp4 | 空襲（AI再現・静止画から生成した6秒の動き） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| clip_navy | clip | media/clips/navy.mp4 | 艦上（AI再現・静止画から生成した6秒の動き） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |
| clip_letters | clip | media/clips/letters.mp4 | 手紙（AI再現・静止画から生成した6秒の動き） | AI生成画像（本プロジェクト用・権利は制作者に帰属） | Grok Bot GenerateImage（2026-10生成） |

- 上表のAI生成画像・クリップ（計21点）は、該当する実写がない場面にだけ残し、画面に「AI再現 イメージ・実在の人物ではありません」と表示。実在人物の肖像は生成していない。AIクリップは静止画からffmpegで作ったパン/ズーム。
- 実写画像174点・ニュース映画クリップ10点は Wikimedia Commons 等のパブリックドメイン（日本の旧著作権法による保護期間満了の写真、米国政府著作物など）または明示ライセンスのもの。個々の出典・作者・ライセンスは自動生成の `docs/MEDIA_SOURCES.md` と `content/media-real.json` に記録。遺体が写る写真・透かし入り画像・有料素材は使っていない。
- 場面への割り当ては `scripts/assign-media.mjs`（キーワード＋手作業の修正表 HAND、1枚4回・1クリップ6回まで）が `content/media-assign.json` に出力する。
- フォント：システムフォントのみ（同梱なし）。効果音：WebAudioでその場で合成（音源ファイルなし）。
- npm依存はMITなどのOSSライセンス（`node_modules/*/LICENSE`）。

