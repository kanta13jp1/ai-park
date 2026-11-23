---
name: ai-park-ops
description: >-
  AI Park MCP サーバー（search_portal, list_board_items, create_board_item,
  update_board_item_status, run_quality_gate, open_ai_park_console）を安全かつ手順通りに
  操作するための運用スキル。AI Park の調査、ボード起票・ステータス更新、品質確認時に使用する。
---

# AI Park MCP 運用ガイド

## 1. 読み取り・調査を先に行う
- ページ案内や仕様調査: `search_portal` または `get_portal_status` を呼び、公開中／工事中／PoC中を区別して案内する。
- ボード確認: 起票前に `list_board_items`（`feedback` / `idea` / `ai-project`）で既存 Issue の重複がないか確認する。

## 2. 書き込み操作の 2 段階安全手順（dryRun 必須）
1. `create_board_item` や `update_board_item_status` は **まず `dryRun: true`（既定）** で呼び出し、生成された本文・ラベル・プリフィル URL をユーザーへ提示して確認を取る。
2. ユーザーの明示的な承認を得た後にのみ `dryRun: false` で実行する。
3. 公開リポジトリ保護のため、顧客名・個人情報・社内メールアドレス（`@ml-mightylink.com`）・ローカルパス・API キーを含めない。

## 3. Antigravity App UI の起動
- 一覧や起票フォームを視覚的に操作したい場合は `open_ai_park_console` を呼び出し、サイドパネルまたはチャット内で UI を開く。
