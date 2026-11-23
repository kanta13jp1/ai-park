# AI Park Antigravity Plugin (`ai-park-mcp`)

MightyLINK AI Park（社内 AI ポータル）を Google Antigravity（App / IDE / CLI）から直接検索・参照・運用するための公式準拠 MCP & MCP Apps プラグインです。

## 主な機能

- **ポータル横断検索 (`search_portal`)**: 全ルート、ニュース、Windows トラブルシューティング、Skills、MCP 安全チェックを横断検索し、公開 URL を返します。
- **ステータス & UAT 照会 (`get_portal_status`)**: `feature-status.ts` と `preflight-checklist.ts` の実態をそのまま返します。
- **ニュース・Gemini 利用監視・AI ツール一覧 (`get_ai_news`, `get_gemini_usage`, `list_ai_tools`)**: 公式フィード・GCP 利用状況・Google Sheets PoC データを取得します。
- **GitHub Issue ボード連携 (`list_board_items`, `create_board_item`, `update_board_item_status`)**: ご意見ToDo / 社内AIプロジェクト / アイデア宣言の一覧取得と起票・更新を行います。書き込み系は既定 `dryRun: true` で下書き・プリフィル URL を生成し、機密情報・ローカルパスを自動ブロックします。
- **品質ゲート (`run_quality_gate`)**: リポジトリ内で実行時に `scripts/verify-deployment-gate.mjs` を呼び出します。
- **MCP App コンソール (`open_ai_park_console`)**: Antigravity App のサイドパネル / 左サイドバー / チャット内で対話 UI（`ui://ai-park/dashboard.html`）を表示します。

## 検証・インストールコマンド

```powershell
# プラグイン厳格検証
agy plugin validate --strict .agents/plugins/ai-park-mcp

# 個人環境へインストールする場合
agy plugin install ./.agents/plugins/ai-park-mcp
```

## 安全運用上の注意

- 公開リポジトリと連携するため、顧客名・個人情報・社内メールアドレス・シークレットトークンを入力しないでください。
- `create_board_item` / `update_board_item_status` で実 GitHub Issue を書き込むには `AI_PARK_GITHUB_TOKEN`（または `GITHUB_TOKEN`）もしくはログイン済み `gh` CLI が必要です。未認証時はブラウザ起票用のプリフィル URL を返します。
