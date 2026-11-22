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

- **一次仕様の事前確認**: Next.js 16 の API・ファイル規約（`metadata`、`generateMetadata`、`error.tsx` の `{ error, retry }`、`output: "export"` 等）は変更前に必ず `node_modules/next/dist/docs/` を確認する。UI・モーダル・ナビゲーションの実装は W3C WAI-ARIA APG / WCAG 2.1 AA（スキップリンク、`role="dialog"` / `aria-modal="true"` / `aria-labelledby`、`Escape` クローズ、`htmlFor`/`id`、`role="tablist"` / `role="tab"` / `aria-selected` / `role="tabpanel"`、`aria-pressed`、`aria-expanded` / `aria-controls` / `aria-current="page"`、`aria-live="polite"`、`type="button"`）に準拠し、横スクロール表には `min-w-[640px]` と見出し `whitespace-nowrap` を付与する。
- **新規ルート追加時の必須セット**: 静的ルートは `src/data/route-metadata.ts`（SSOT）に登録し、同階層の Server Component `layout.tsx` から `getRouteMetadata("/<route>")` を export する（動的ルートは `generateMetadata`）。品質ゲート（`scripts/verify-deployment-gate.mjs`）との整合のため `page.tsx` のパス構造を維持する。
- **CI と同一のプッシュ前検証チェーン**: commit / push 前に `npm run lint` → `npx tsc --noEmit` → `npm test` → `npm run check:gate` → `npm run build` をすべてエラー 0 で通過させる（`.github/workflows/deploy.yml` と同一ゲート）。
- **レスポンシブ＆本番実機検証の基準**: 固定サイドバー（288px）による狭幅崩れを防ぐため、UI 変更時は `1280x800` とあわせて **`768x1024`（タブレット）** の重なり・クリップ・折り返しを必ず検証する。CI（`.github/workflows/deploy.yml`）の `actions/configure-pages@v5` には `static_site_generator: next` を付けず `next.config.ts`（`trailingSlash: true`）を正本として維持する。これにより正規パスは末尾 `/` 付き `/<route>/` となり、末尾 `/` なし `/<route>` も GitHub Pages の自動リダイレクトにより HTTP 200 で解決されるため、本番検証は正規パス（末尾 `/` 付き＋`?cachebust=<timestamp>`）を主としつつ末尾 `/` なしアクセスと存在しない URL の 404（Hydration エラー 0）も確認する。
- **着手前の棚卸しと独立監査**: 新画面追加や大幅更新の前には、既存スキル（`.agents/skills/preflight-uat-workflow/SKILL.md` 等）、正本台帳（`src/data/feature-status.ts`, `src/data/preflight-checklist.ts`, `src/data/route-metadata.ts`）、自動テスト（`tests/*.test.mjs`）を確認してギャップを特定してから着手する。大規模な追加・公開前には Read-only 監査エージェント（`ai-park-release-audit`）で独立監査を実施し、実機確認済みのエビデンスのみ `preflight-checklist.ts` に記録する（未確認項目は推測で `passed` にしない）。
- **並行セッション安全制約**: `.next/lock` が存在する場合は実行中の `next build` プロセス有無を確認し、他プロセスが稼働中なら強制削除せず完了を待つ。`git add -A` や `git add .` は使わず自身が変更したファイルパスのみを明示指定してコミットし、`git pull --rebase --autostash origin main` で他セッションの未コミット作業を保護する。
