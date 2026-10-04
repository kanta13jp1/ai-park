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
- main への push は本番にそのまま反映される。梅澤さんの確認なしに、新しいページや数値を本番に出さない。
