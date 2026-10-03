"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberSuccess, playCyberHover } from "@/lib/sound";
import {
  Cpu,
  Server,
  Layers,
  ShieldCheck,
  Code2,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Lock,
  Database,
  Globe,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface McpServerItem {
  id: string;
  name: string;
  category: "開発・リポジトリ" | "データ・分析" | "テスト・ブラウザ" | "コラボレーション";
  status: "社内検証中" | "準備中";
  statusBadgeColor: string;
  description: string;
  allowedOperations: string[];
  securityLevel: "READ-ONLY" | "RESTRICTED-WRITE" | "SANDBOX";
  sampleConfig: string;
  docsUrl?: string;
}

const MCP_SERVERS: McpServerItem[] = [
  {
    id: "mcp-github",
    name: "GitHub Official MCP",
    category: "開発・リポジトリ",
    status: "社内検証中",
    statusBadgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Issue/PRの閲覧、コミットログの自動分析、コード変更の差分検出をエージェントに直接実行させます。",
    allowedOperations: ["リポジトリ一覧・ファイル閲覧", "Issue / PR 本文の取得", "差分レビューの自動生成"],
    securityLevel: "READ-ONLY",
    sampleConfig: `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "\${SECURE_GITHUB_TOKEN}"
      }
    }
  }
}`
  },
  {
    id: "mcp-bigquery",
    name: "Google BigQuery MCP",
    category: "データ・分析",
    status: "社内検証中",
    statusBadgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "BigQueryのデータセット構造やINFORMATION_SCHEMAを高速スキャンし、最適化されたクエリと分析を自律実行します。",
    allowedOperations: ["スキーマ・メタデータ取得", "DRY-RUNによる課金バイト数見積もり", "集計クエリの実行（上限設定あり）"],
    securityLevel: "READ-ONLY",
    sampleConfig: `{
  "mcpServers": {
    "bigquery": {
      "command": "python",
      "args": ["-m", "mcp_server_bigquery", "--project", "mightylink-prod"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/readonly-key.json"
      }
    }
  }
}`
  },
  {
    id: "mcp-playwright",
    name: "Playwright Headless Browser MCP",
    category: "テスト・ブラウザ",
    status: "社内検証中",
    statusBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Antigravityエージェントが自律的にブラウザを起動し、UI崩れの検出やE2E検証、画面キャプチャを自動取得します。",
    allowedOperations: ["ページナビゲーション & DOM解析", "スクリーンショット・アクセシビリティツリー抽出", "レスポンシブ表示確認"],
    securityLevel: "SANDBOX",
    sampleConfig: `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}`
  },
  {
    id: "mcp-slack",
    name: "Slack Notify MCP",
    category: "コラボレーション",
    status: "準備中",
    statusBadgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "長時間の自律タスク完了時やデプロイ検証完了時に、社内Slackの専用通知チャンネルへサマリーを自動ポストします。",
    allowedOperations: ["指定チャンネルへの完了通知送信", "アラートの送信（読み取り権限なし）"],
    securityLevel: "RESTRICTED-WRITE",
    sampleConfig: `{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "\${SECURE_SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "T0123456789"
      }
    }
  }
}`
  }
];

export default function McpHubPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    playCyberSuccess();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="MCP 外部ツール連携ハブ"
        subtitle="Antigravity 2.0 と社内ツール・DB・クラウドを安全につなぐ標準プロトコル（Model Context Protocol）"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中・社内検証中（PoC段階）"
          message="社内で正式に許可される MCP サーバー一覧およびセキュアな設定手順ガイドラインを策定中です。安全性が検証されたものから順次本番公開します。"
          prepDetails="情シス・セキュリティチームと連携し、APIキーのVault管理連携とRead-Only権限分離テンプレートを策定しています。"
          releaseDate="2026年Q4予定"
        />

        {/* MCPとは？ アーキテクチャ解説HUD */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-mono font-bold tracking-wider uppercase">
                <Cpu size={14} />
                <span>MODEL CONTEXT PROTOCOL (MCP)</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                エージェントに「社内システムへの安全な目と手」を与える
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                MCP（Model Context Protocol）は、AIモデルが外部データベース・GitHub・ブラウザ等のツールと標準化されたAPIで会話するためのオープンプロトコルです。
                専用のクライアント設定（<code className="text-cyan-300 font-mono bg-white/10 px-1.5 py-0.5 rounded">mcp_config.json</code>）を追加するだけで、自律エージェントが必要なデータやコマンドを自律的に呼び出せるようになります。
              </p>
            </div>

            {/* アーキテクチャ概要ダイアグラム */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shrink-0 w-full lg:w-96 shadow-lg space-y-3">
              <div className="text-xs font-mono font-bold text-slate-400 flex items-center justify-between border-b border-slate-800 pb-2">
                <span>SYSTEM ARCHITECTURE</span>
                <span className="text-emerald-400">SECURE BOUNDARY</span>
              </div>
              <div className="flex flex-col gap-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-center font-bold text-indigo-300">
                  Antigravity (Parent Agent)
                </div>
                <div className="text-center text-slate-500 text-[10px]">↓ JSON-RPC 2.0 (stdio)</div>
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-center font-bold text-cyan-300">
                  MCP Server (Sandbox Layer)
                </div>
                <div className="text-center text-slate-500 text-[10px]">↓ Read-Only API Calls</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800 text-center text-slate-300">
                    GitHub / GitLab
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800 text-center text-slate-300">
                    BigQuery / SQL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 社内検証中 MCPサーバーカタログ */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                <span>社内検証中・推奨 MCPサーバーカタログ</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                社内セキュリティ基準を満たす検証中サーバーと設定スニペット
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80">
              全 {MCP_SERVERS.length} サーバー
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {MCP_SERVERS.map((server) => (
              <TiltCard
                key={server.id}
                maxTilt={6}
                glareOpacity={0.12}
                className="h-full rounded-2xl"
              >
                <SpotlightCard
                  spotlightColor="rgba(99, 102, 241, 0.12)"
                  className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
                >
                  <div className="p-6 flex flex-col justify-between space-y-4 h-full">
                  <div className="space-y-3.5">
                    {/* カードヘッダー */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${server.statusBadgeColor}`}>
                            {server.status}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {server.category}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base sm:text-lg mt-1.5">
                          {server.name}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border font-mono ${
                        server.securityLevel === "READ-ONLY"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : server.securityLevel === "SANDBOX"
                          ? "bg-blue-50 text-blue-800 border-blue-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}>
                        {server.securityLevel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {server.description}
                    </p>

                    {/* 許可される操作 */}
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-700 font-mono">許可操作スコープ:</div>
                      <div className="space-y-1">
                        {server.allowedOperations.map((op, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                            <span>{op}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 設定スニペットプレビュー */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>設定例 (mcp_config.json)</span>
                        <button
                          onClick={() => handleCopy(server.id, server.sampleConfig)}
                          onMouseEnter={() => playCyberHover()}
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
                        >
                          {copiedId === server.id ? (
                            <>
                              <Check size={12} className="text-emerald-600" />
                              <span className="text-emerald-600">コピー完了</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>コピー</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="bg-slate-950 text-slate-200 p-3 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800">
                        <code>{server.sampleConfig}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* 社内セキュリティ原則 */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                MCP 利用における社内3大セキュリティ原則
              </h3>
              <p className="text-xs text-slate-500">外部サーバー接続時は以下のガイドラインを必ず遵守してください</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 font-mono">
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Lock size={14} className="text-indigo-600" />
                <span>1. トークンの直書き禁止</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                APIキーや個人アクセストークン（PAT）は設定ファイルにハードコードせず、環境変数または社内Vault連携から動的注入してください。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Database size={14} className="text-emerald-600" />
                <span>2. 原則 READ-ONLY 権限</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                データベースやリポジトリへのMCP接続は原則として読み取り専用アカウントを使用し、破壊的変更のリスクを遮断します。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Globe size={14} className="text-blue-600" />
                <span>3. 審査済みサーバーのみ許可</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                インターネット上で公開されている未検証のサードパーティMCPサーバーの利用は禁止されています。社内推奨リストから選択してください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
