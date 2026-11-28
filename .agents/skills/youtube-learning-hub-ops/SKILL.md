---
name: youtube-learning-hub-ops
description: >-
  YouTube公式チャンネル（@googleantigravity等）の全動画・Shorts・ライブ配信・プレイリスト限定公開を
  yt-dlp で漏れなく収集・分類し、一次情報ベースの学習コンテンツとクリック読み込みプレイヤー・進捗トラッカーを
  ai-park へ実装または差分更新する手順スキル。
---

# YouTube Learning Hub Operations

YouTube 公式チャンネルの全動画を `ai-park` の学習ハブ（例: [OfficialVideoHub.tsx](file:///c:/Users/kanta/GitHub/ai-park/src/components/antigravity/OfficialVideoHub.tsx)）へ収録・差分更新する際の標準手順です。

## 1. 一次情報の一括収集（HTML 正規表現スクレイピング禁止）

- `ytInitialData` の素の HTML 抽出は継続トークンや同意画面で `0` 件になりやすいため使わない。
- 必ず `yt-dlp --flat-playlist --dump-single-json --no-warnings` で以下 4 サーフェス＋各プレイリストを横断収集し、`video.id` で重複排除する：
  1. `https://www.youtube.com/@<handle>/videos`
  2. `https://www.youtube.com/@<handle>/shorts`
  3. `https://www.youtube.com/@<handle>/streams`
  4. `https://www.youtube.com/@<handle>/playlists` → 検出された全プレイリスト URL（`unlisted` なプレイリスト限定公開動画の取りこぼし防止）
- 各動画 ID に対して `yt-dlp -J --skip-download --no-warnings https://www.youtube.com/watch?v=<id>` を並列実行し、`title`, `upload_date`, `duration`, `availability`, `description`, `chapters`, `subtitles`/`automatic_captions` を作業外の `scratch/`（`<appDataDir>/brain/<cid>/scratch/`）へ保存する。
- **注意**: `src/` 配下にはローカルパス（`C:\Users\...` 等）やトークンを絶対に書かない（[hygiene-and-gate.test.mjs](file:///c:/Users/kanta/GitHub/ai-park/tests/hygiene-and-gate.test.mjs) で禁止）。

## 2. 一次情報厳守の執筆と機械照合

1. **推測・捏造の禁止**: すべての要約・要点・クイズは、取得した `TITLE`・`DESC`・字幕のみを根拠に執筆する。
2. **ASR 誤表記と字幕なし動画の扱い**:
   - 自動字幕（ASR）の固有名詞・話者名（例: ASR `Roddy` vs 公式概要欄 `Speakers: Rody Davis`）は必ず `description` 側と照合して正式表記へ揃える。
   - BGM のみ等で字幕が取得できない動画は、`TITLE` と `description` に書かれた UI 手順・事実のみを記述し、発話内容を補作しない。
3. **プレーンテキスト領域の記法**: `<InlineCodeText />` を通さない `jaTitle`・見出し・`alt`・チャット共有文に生のバッククォート（`` `...` ``）を書かない。
4. **1 対 1 機械照合**: トラック別モジュール（`src/data/antigravity-videos/track-*.ts`）執筆後、`yt_91_assigned.json` 等の一次 JSON と `id`・`recommendedOrder`・`title`・`uploadDate`・`durationSeconds`・`format`・`availability`・`playlist`・総秒数（`ANTIGRAVITY_VIDEO_COUNTS`）が 100% 一致することをスクリプトと `npm test`（`tests/antigravity-videos.test.mjs`）で検証する。

## 3. 分割構成・埋め込みプレイヤー・差分更新の原則

- **バンドル分割**: `meta.ts` と `types.ts` のみ軽量保持し、全動画配列バレル（`src/data/antigravity-videos/index.ts`）は `OfficialVideoHub.tsx` の `import("@/data/antigravity-videos")` で動的読み込みする（ビルド後に `out/_next/static/chunks/` へ別チャンク分離されたことを確認する）。
- **Node 22 + `tsc` 両立**: リーフ `.ts` ファイルおよび `src/lib/antigravityVideoProgress.ts` では他 `.ts` ファイルへの拡張子なし値 import を避け、`import type` のみを使う。
- **パフォーマンスとプライバシー**: 動画一覧には直接 `<iframe>` を並べず、[YouTubeFacadePlayer.tsx](file:///c:/Users/kanta/GitHub/ai-park/src/components/antigravity/YouTubeFacadePlayer.tsx)（`https://i.ytimg.com/vi/<id>/hqdefault.jpg` クリック時に `https://www.youtube-nocookie.com/embed/<id>` をマウント＋自動翻訳日本語字幕案内）を使う。
- **新着動画の差分同期時**: 既存の `id` と `recommendedOrder` を壊さないよう末尾または該当トラックへ連番追加し、`meta.ts` の `ANTIGRAVITY_VIDEO_VERIFIED_DATE` と `ANTIGRAVITY_VIDEO_COUNTS` を同時更新して 5 段階ゲートを通す。
