# AI Park Remote MCP (Cloudflare Workers アダプタ)

`mcp/worker/index.ts` は、`WebStandardStreamableHTTPServerTransport` を用いて AI Park MCP サーバーを Cloudflare Workers 上でステートレス Streamable HTTP（`/mcp`）として提供するためのアダプタです。

> **注記**: このディレクトリはリモートホスト用の構成一式を同梱したものであり、本番 Cloudflare Workers へのデプロイは別途明示的な承認と認証設定のうえで行います。

## デプロイ手順（事前確認後）

1. 先にルートでスナップショットと MCP UI バンドルを最新化します：
   ```powershell
   npm run mcp:build
   ```
2. Cloudflare Wrangler でログイン・シークレット登録・デプロイを行います：
   ```powershell
   cd mcp/worker
   npx wrangler login
   npx wrangler secret put AI_PARK_MCP_AUTH_TOKEN
   # GitHub Issue の直接作成/更新も許可する場合のみ（任意）:
   # npx wrangler secret put AI_PARK_GITHUB_TOKEN
   npx wrangler deploy
   ```
3. Antigravity の `mcp_config.json` に接続先を追加します：
   ```json
   {
     "mcpServers": {
       "ai-park": {
         "url": "https://<your-worker-subdomain>.workers.dev/mcp",
         "headers": {
           "Authorization": "Bearer <YOUR_AI_PARK_MCP_AUTH_TOKEN>"
         }
       }
     }
   }
   ```
