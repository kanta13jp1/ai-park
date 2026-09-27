import ComingSoonPage from "@/components/ComingSoonPage";

export default function McpHubPage() {
  return (
    <ComingSoonPage
      title="MCP 外部ツール連携"
      subtitle="Antigravity と外部ツールをつなぐ設定（準備中）"
      message="社内で使ってよい MCP サーバーと、その設定方法はまだ決まっていません。確認が済んだものから掲載します。"
      planned={["社内で使ってよい MCP サーバーの一覧", "設定方法（mcp_config.json の書き方）", "扱ってよいデータの範囲"]}
      links={[
        { href: "/guide", label: "Antigravity 導入ガイド" },
        { href: "/tools-hub", label: "社内AI利用の注意事項" },
      ]}
    />
  );
}
