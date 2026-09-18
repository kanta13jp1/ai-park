"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { UnderConstructionBanner } from "@/components/UnderConstruction";
import { Search, ExternalLink, ShieldCheck, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function ToolsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const tools = [
    {
      id: "gemini",
      name: "Google Gemini (Enterprise)",
      category: "llm",
      status: "全社利用可",
      description: "Google Workspace統合の全社標準LLM。ドキュメント要約、メールドラフト作成、リサーチ等に即時利用可能。",
      badge: "推奨標準",
      link: "#",
    },
    {
      id: "copilot",
      name: "GitHub Copilot Enterprise",
      category: "dev",
      status: "申請制 (エンジニア)",
      description: "VS Code / JetBrains等のIDE統合AIコーディング支援ツール。コード補完、テストコード自動生成。",
      badge: "エンジニア向け",
      link: "#",
    },
    {
      id: "bedrock",
      name: "Amazon Bedrock (AWS)",
      category: "platform",
      status: "プロジェクト申請制",
      description: "Claude 3.5 Sonnet / Haiku や Titan が利用可能なフルマネージドAPI。自社データRAGやAgent基盤に最適。",
      badge: "AWS基盤",
      link: "/aws-info",
    },
    {
      id: "notebooklm",
      name: "NotebookLM (Enterprise)",
      category: "llm",
      status: "全社利用可",
      description: "社内マニュアルや長文PDF、スライドをアップロードしてQ&A・ポッドキャスト形式の要約を行うツール。",
      badge: "リサーチ",
      link: "#",
    },
    {
      id: "claude",
      name: "Anthropic Claude (AWS経由)",
      category: "llm",
      status: "プロジェクト申請制",
      description: "高度な推論・コード生成・文章作成能力を持つモデル。Bedrock環境下でセキュアに利用可能。",
      badge: "高性能",
      link: "/aws-info",
    },
    {
      id: "dalle",
      name: "社内画像生成ツール (Imagen / SD)",
      category: "creative",
      status: "検証中 (ベータ)",
      description: "社内プレゼン資料、広報、アイコン作成用のセキュアな商用利用可能画像生成環境。",
      badge: "Beta",
      link: "#",
    },
  ];

  const filteredTools = tools.filter((t) => {
    const matchesCategory = filter === "all" || t.category === filter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner title="AIツール一覧" subtitle="社内承認済みのAIツールカタログと申請・利用手順" />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionBanner
          message="【順次連携中】各ツールの社内申請ワークフローは整備進行中です"
          submessage="全社承認済みのGemini Enterpriseは即時ご利用可能です。その他プロジェクト申請制ツールのServiceNow自動連携は順次オープンします。"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === "all" ? "bg-[#3b4856] text-white" : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setFilter("llm")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === "llm" ? "bg-[#3b4856] text-white" : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              対話・要約 (LLM)
            </button>
            <button
              onClick={() => setFilter("dev")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === "dev" ? "bg-[#3b4856] text-white" : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              開発・コード
            </button>
            <button
              onClick={() => setFilter("platform")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === "platform" ? "bg-[#3b4856] text-white" : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              基盤・API
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ツール名・用途で検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {tool.badge}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-600 flex items-center space-x-1">
                    <ShieldCheck size={13} />
                    <span>{tool.status}</span>
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">{tool.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{tool.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">セキュリティ審査済</span>
                <a
                  href={tool.link}
                  className="font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>利用ガイド / 申請</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
