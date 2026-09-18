"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { Plug, Server, Database, Globe, Cloud, ExternalLink, Code } from "lucide-react";

export default function McpHubPage() {
  const mcpServers = [
    {
      name: "chrome_devtools / puppeteer",
      title: "ブラウザ自動操作 & UI検証 MCP",
      desc: "Antigravityが直接ブラウザを立ち上げ、UIのクリック、フォーム入力、スクリーンショット撮影、コンソールログ検証を行うMCPサーバー。",
      type: "E2Eテスト / 検証",
      command: "npx -y @modelcontextprotocol/server-puppeteer",
    },
    {
      name: "google-drive",
      title: "Google Drive / Workspace MCP",
      desc: "社内Drive上のファイル検索、ドキュメント要約、スプレッドシートデータ連携をセキュアに行うMCPサーバー。",
      type: "ドキュメント / 社内ナレッジ",
      command: "npx -y @modelcontextprotocol/server-gdrive",
    },
    {
      name: "bigquery",
      title: "BigQuery データ探索 MCP",
      desc: "データセット、テーブルスキーマの自動取得やSQLクエリの実行を行い、自然言語でのデータ分析を実現。",
      type: "データ分析 / BI",
      command: "uvx mcp-server-bigquery --project mightylink-data-prod",
    },
    {
      name: "canva",
      title: "Canva デザイン連携 MCP",
      desc: "プレゼンテーションスライドや図解デザインの自動生成・テンプレート編集を可能にするクリエイティブMCP。",
      type: "デザイン / スライド",
      command: "npx -y @canva/mcp-server",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="MCP (Model Context Protocol) 連携"
        subtitle="外部ツールや社内データベースをAntigravityに安全に接続"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <Plug className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-base">MCPとは？</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            MCP（Model Context Protocol）は、AIエージェントに社内の安全なツールやデータソースへのアクセス権を標準プロトコルで提供する仕組みです。
            APIキーをAntigravityの設定ファイルに置くだけで、エージェントが自律的に外部システムと連携してタスクを遂行します。
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-base">社内推奨MCPサーバー一覧</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mcpServers.map((server) => (
              <div
                key={server.name}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {server.type}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{server.name}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">{server.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{server.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                    mcp_config.json 設定例:
                  </span>
                  <div className="p-2 bg-slate-900 text-slate-200 rounded font-mono text-[11px] overflow-x-auto">
                    {server.command}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
