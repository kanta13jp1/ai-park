"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import {
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Cpu,
  Layers,
  Filter,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface ToolItem {
  id: string;
  name: string;
  category: "dev" | "llm" | "platform" | "research";
  categoryLabel: string;
  status: "全社利用可" | "申請制 (ライセンス配布)" | "特定PJ限定";
  description: string;
  badge: string;
  security: string;
  link: string;
}

const toolsData: ToolItem[] = [
  {
    id: "antigravity",
    name: "Google Antigravity (IDE / CLI)",
    category: "dev",
    categoryLabel: "開発・エージェント",
    status: "全社利用可",
    description: "自律並列サブエージェント、Skills/Rulesによる規約遵守、MCP外部ツール連携を標準装備した次世代AI統合開発環境。",
    badge: "全社推奨",
    security: "Level 1: 社内機密・コード投入可",
    link: "/guide",
  },
  {
    id: "gemini",
    name: "Google Gemini Enterprise",
    category: "llm",
    categoryLabel: "全社対話・要約",
    status: "全社利用可",
    description: "Google Workspace統合の全社標準LLM。ドキュメント要約、メールドラフト作成、マルチモーダル画像解析に即時利用可能。",
    badge: "標準導入",
    security: "Level 1: 社内機密・文書投入可",
    link: "/antigravity-info",
  },
  {
    id: "code-assist",
    name: "Gemini Code Assist",
    category: "dev",
    categoryLabel: "コード補完",
    status: "全社利用可",
    description: "VS Code / IntelliJ 等のIDE統合コーディング支援。リアルタイムなコード補完、バグ検出、テスト自動生成。",
    badge: "エンジニア向け",
    security: "Level 1: 社内コード投入可",
    link: "/guide",
  },
  {
    id: "notebooklm",
    name: "NotebookLM (Enterprise)",
    category: "research",
    categoryLabel: "リサーチ・要約",
    status: "全社利用可",
    description: "社内マニュアルや長文PDF、スライドをアップロードしてQ&A・ポッドキャスト形式の要約を行うナレッジ探索ツール。",
    badge: "業務効率化",
    security: "Level 1: 社内文書OK",
    link: "https://notebooklm.google.com",
  },
  {
    id: "claude",
    name: "Claude 3.5 Sonnet (Vertex AI経由)",
    category: "platform",
    categoryLabel: "高度推論・分析",
    status: "申請制 (ライセンス配布)",
    securityLevel: "Level 2: マスキング必須",
    description: "長文の仕様書解析、複雑な要件定義、高度な論理検証に優れたモデル。GCP Vertex AI経由でセキュアに利用。",
    badge: "高度分析",
    security: "Level 2: 個人情報マスキング必須",
    link: "/tools-hub",
  } as any,
  {
    id: "chatgpt",
    name: "ChatGPT Enterprise",
    category: "llm",
    categoryLabel: "対話・検証",
    status: "特定PJ限定",
    description: "特定顧客向けのPoC検証や、GPTsによる独自アプリ構築を検証するための限定環境。",
    badge: "特定PJ",
    security: "Level 2: マスキング必須",
    link: "/tools-hub",
  },
];

export default function ToolsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTools = toolsData.filter((t) => {
    const matchesFilter = filter === "all" || t.category === filter;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.categoryLabel.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AIツール一覧"
        subtitle="MightyLINK 社内で利用可能な公認AIツール・プラットフォームの機能比較 & ガイド"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        {/* バナー */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-200/60 text-emerald-800 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-emerald-950 flex items-center space-x-1">
                  <span>🤖</span>
                  <span>社内公認AIツールカタログ（2026年最新版）</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold text-[10px]">
                  公認ツール一覧
                </span>
              </div>
              <p className="text-emerald-800/90 leading-relaxed">
                全社利用可能な標準ツールから、申請制の高度分析モデルまで一覧で比較・アクセスできます。
              </p>
            </div>
          </div>
          <Link
            href="/tools-hub"
            className="shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-end sm:self-center"
          >
            <span>利用規約 & 申請フローを見る</span>
          </Link>
        </div>

        {/* 検索 & フィルター */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ツール名、用途で検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-200/70 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
            {[
              { id: "all", label: "すべて" },
              { id: "dev", label: "開発・コード" },
              { id: "llm", label: "対話・要約" },
              { id: "platform", label: "高度推論" },
              { id: "research", label: "リサーチ" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  filter === f.id
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ツールカードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100">
                    {tool.categoryLabel}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {tool.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base">{tool.name}</h4>
                  <span className="inline-block mt-0.5 text-[11px] font-semibold text-emerald-700">
                    {tool.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{tool.description}</p>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-700 block">セキュリティ基準:</span>
                  <span className="text-slate-500">{tool.security}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                {tool.link.startsWith("http") ? (
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>ツールを開く</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <Link
                    href={tool.link}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>ガイド・申請を見る →</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
