<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 架空の内容を載せない（このサイトの最重要ルール）

AI Park は社員が実際に見て判断に使う社内ポータルです。確認できていない内容を、事実のように載せないでください。

- 載せてはいけないもの：実在しない人物・部署名、取材していないインタビュー、測っていない数値（削減時間・導入率・人数・金額）、決まっていない予定や締切、存在しない社内制度・申請窓口・Slack チャンネル・リポジトリ、「社内認定」「全社標準」「全社員利用可能」などの言い切り。
- 「サンプル」「モデルケース」「PoC」と注記しても、架空の人名や数値は載せない。内容がまだ無いページは `ComingSoonPage`（工事中の表示）にする。
- 実データを載せるときは、出どころ（どのシート・どの Issue・どの API か）をコードのコメントに書く。
- 公開サイト・公開リポジトリなので、社員のメールアドレス、請求先アカウント ID、組織 ID などの社内の識別情報を載せない。
- main への push は本番にそのまま反映される。依頼された変更については、架空の内容や個人情報を含まないこと、および下記 5 段階の検証ゲート通過を確認したうえで、`main` への commit / push（本番デプロイ）まで進めてよい。

# 実装・検証の標準作法（自己流の禁止）

- **一次仕様の事前確認**: Next.js 16 の API・ファイル規約（`metadata`、`generateMetadata`、`error.tsx` の `{ error, retry }`、`output: "export"` 等）は変更前に必ず `node_modules/next/dist/docs/` を確認する（静的エクスポート配下のクライアントページで URL クエリ同期する場合は `useSearchParams()` を直接使わず、`useEffect`＋`queueMicrotask` 内の `window.location.search` 読取と `window.history.replaceState` で扱う）。React 19 の ESLint（`react-hooks/set-state-in-effect`）対策として、`useEffect` から呼ぶ非同期フェッチャー内に条件分岐付きでも同期 `setState` を置かず、再読込ボタン等の同期状態更新はイベントハンドラ側へ分離する。UI・モーダル・ナビゲーションの実装は W3C WAI-ARIA APG / WCAG 2.1 AA（スキップリンク、`role="dialog"` / `aria-modal="true"` / `aria-labelledby`、`Escape` クローズ、`htmlFor`/`id`、`role="tablist"` / `role="tab"` / `aria-selected` / `role="tabpanel"`＋roving `tabIndex`・`ArrowLeft`/`ArrowRight`（縦型は `ArrowUp`/`ArrowDown`）/`Home`/`End` フォーカス移動、`role="group"`＋`aria-label`（複数フィルタ/状態ボタン群）、`aria-pressed`、`aria-expanded` / `aria-controls` / `aria-current="page"`、`role="status"`＋`aria-live="polite"`、`type="button"`、および `<button>` 内に `<div>`/`<h*>`/`<p>` 等のブロック要素を入れず `<span className="block">` 等のフレージング要素のみを使う HTML5 準拠）を守り、空結果リセットボタンには上位検索クエリのクリアも連動させる。コピー通知等の `sr-only` ライブ領域はボタンの短時間リセットタイマーから分離した専用状態（次操作の `await` 前で空文字クリア→完了時再設定）で文言を保持する。`<InlineCodeText />` を通さない見出し・`jaTitle`・`img alt`・共有テキストには生のバッククォート（`` `...` ``）を含めず、テストで非混入を検証する。グローバル `window` `keydown` ショートカットでは修飾キー（`ctrlKey`/`metaKey`/`altKey`）と操作要素（`INPUT`/`TEXTAREA`/`SELECT`/`BUTTON`/`A`/`[role="tab"]`/`isContentEditable`）を必ず除外する。横スクロール表には `min-w-[640px]` と見出し `whitespace-nowrap` を付与する。
- **外部公式 URL のライブ HTTP 200・最終遷移先実測**: 公式ドキュメント・シラバス・参考リンク等の外部 URL を新規追加・変更する際は、Web 検索スニペットや記憶からそのまま転記せず、コミット前に `GET` で最終遷移先 URL と `<title>` まで実測確認する。HTTP `200` を返す Soft-404 リダイレクト（一覧ページ `/training/browse/` 等への転送）や、同一資格・同一ページ内で別 URL 文字列が同じ最終 URL へ収束する重複リダイレクトを排除し、不適格と判明した旧 URL パターンは `tests/` に回帰防止アサーションを残す。
- **新規ルート追加時の必須セット**: 静的ルートは `src/data/route-metadata.ts`（SSOT）に登録し、同階層の Server Component `layout.tsx` から `getRouteMetadata("/<route>")` を export する（動的ルートは `generateMetadata`）。品質ゲート（`scripts/verify-deployment-gate.mjs`）との整合のため `page.tsx` のパス構造を維持する。
- **CI と同一のプッシュ前検証チェーン**: commit / push 前に `npm run lint` → `npx tsc --noEmit` → `npm test` → `npm run check:gate` → `npm run build` をすべてエラー 0 で通過させる（`.github/workflows/deploy.yml` と同一ゲート）。
- **レスポンシブ＆本番実機検証の基準**: 固定サイドバー（288px）による狭幅崩れを防ぐため、UI 変更時は `1280x800` とあわせて **`768x1024`（タブレット）** の重なり・クリップ・折り返し、および `truncate` による意図しない末尾省略途切れ（DOM `scrollWidth` 検査をすり抜けるため実スクリーンショットの `read_file` 目視で確認）を必ず検証する。ローカル静的サーバーで `./out` を検証する際、Next.js 16.3.5 のサイドバー `<Link>` 事前取得（`__next.<route>.__PAGE__.txt`）が 404 となっても、サーバー側へ架空の書き換えを入れて隠蔽せず、JS ランタイム・React Hydration・対象チャンクエラー（`0` 件）と切り分けて誠実に記録し、本番 GitHub Pages でもコンソールエラーを確認する。CI（`.github/workflows/deploy.yml`）の `actions/configure-pages@v5` には `static_site_generator: next` を付けず `next.config.ts`（`trailingSlash: true`）を正本として維持する。これにより正規パスは末尾 `/` 付き `/<route>/` となり、末尾 `/` なし `/<route>` も GitHub Pages の自動リダイレクトにより HTTP 200 で解決されるため、本番検証は **`gh run watch` で対象 `headSha` の `deploy.yml` が `conclusion: success` で完了した後に** 正規パス（末尾 `/` 付き＋`?cachebust=<timestamp>`）で実施し（デプロイ完了前の先行ブラウザ起動を禁止）、末尾 `/` なしアクセスと存在しない URL の 404（Hydration エラー 0）も確認する。
- **着手前の棚卸しと独立監査**: 新画面追加や大幅更新の前には、コンテキスト予算で省略されたスキルを含めディスク上の `.agents/skills/`（`preflight-uat-workflow`, `certification-hub-standard` 等）、正本台帳（`src/data/feature-status.ts`, `src/data/preflight-checklist.ts`, `src/data/route-metadata.ts`）、自動テスト（`tests/*.test.mjs`）を直接確認してギャップを特定してから着手する。`feature-status.ts` の `isVerified: true` 全機能は `preflight-checklist.ts` に `overallStatus: "passed"` で登録し、テストの正規表現検査では隣接オブジェクトを跨ぐ `[\s\S]*?` を避けて `[^}]*?` で単一レコード内へスコープを限定する。大規模な追加・公開前には Read-only 監査エージェント（`ai-park-release-audit`）で独立監査を実施し、実機確認済みのエビデンスのみ `preflight-checklist.ts` に記録する（未確認項目は推測で `passed` にしない）。
- **並行セッション安全制約**: `.next/lock` が存在する場合は実行中の `next build` プロセス有無を確認し、他プロセスが稼働中なら強制削除せず完了を待つ。`git add -A` や `git add .` は使わず自身が変更したファイルパスのみを明示指定してコミットし、`git pull --rebase --autostash origin main` で他セッションの未コミット作業を保護する。
- **多資格・製品学習ハブ（`*-info`）の事実検証・分割・回帰テスト**: 資格試験要綱（有効期限・問題数・受験プラットフォーム・合格基準の公表有無）や製品仕様はモデル記憶で書かず必ず公式一次ページと照合し、掲載する全外部 URL はファイル全文の正規表現抽出（設定例文字列の誤検出）ではなくエクスポート済みリソース配列を直接走査して実測 HTTP `200`（`403`/`404`・不要転送ゼロ）を確認する。複数資格を束ねるページでは初期表示資格のみを静的 `import` し、残りはオンデマンド動的 `import()`（リクエスト世代番号による競合ガード＆再試行 UI 付き）でチャンク分割して初期バンドル肥大を防ぐ。`tests/cert-data.test.mjs` のファイル数検査と Node 22 ネイティブ TS テスト（`@/` 実行時エイリアス非解決）との両立のため、共通型は `src/data/<domain>-types.ts` に分離し、メタデータ／レジストリは `src/components/<domain>/` へ配置して `src/data/<domain>-*.ts` 内は `import type` のみに保つ。検索正規化・採点等の純粋ロジックは `"use client"` ページへ直書きせず `src/lib/*.ts` へ切り出して `node --test` から直接検証し、全資格の件数・バッジ/検索チップの 0 件ヒット防止・試験時間・URL 衛生・旧名称非混入を検証する専用回帰テスト（例: `tests/<domain>-cert.test.mjs`）を並行セッションが編集中の共有テストファイルと分離して追加する。
