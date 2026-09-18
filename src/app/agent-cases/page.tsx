"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { UnderConstructionBanner } from "@/components/UnderConstruction";
import { Bot, Cpu, GitBranch, CheckCircle2 } from "lucide-react";

export default function AgentCasesPage() {
  const cases = [
    {
      name: "API決済・トランザクションエラー自動診断エージェント",
      model: "Bedrock (Claude 3.5 Sonnet)",
      architecture: "LangChain + OpenSearch Serverless + Lambda",
      impact: "一次調査時間を平均 25分 → 2分 に短縮",
      description: "ログ解析・エラーコード調査・既知事象ナレッジベース検索を自律的に行い、原因と推奨対応をチケットに自動起票。",
      status: "PoC検証中",
    },
    {
      name: "社内調達・見積書チェックエージェント",
      model: "Gemini 1.5 Pro / Enterprise",
      architecture: "Document AI + Vertex AI Search",
      impact: "月間 120件 の見積比較作業を自動化",
      description: "PDF見積書から品名・型番・単価を抽出し、過去契約価格や市場参考価格との比較検証レポートを生成。",
      status: "PoC検証中",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AI Agent Case"
        subtitle="社内自律型AIエージェントの実装事例・アーキテクチャ設計パターン"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionBanner
          message="【PoC推進中】社内Subagent活用事例は現在実証実験（PoC）進行中です"
          submessage="各プロジェクトで開発中のエージェントアーキテクチャやベンチマーク結果を順次掲載していきます。"
        />
        <div className="space-y-4">
          {cases.map((c, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
                    <span className="text-xs text-purple-700 font-medium">{c.model}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                  {c.impact}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-700 flex items-center space-x-2">
                <Cpu size={14} className="text-slate-400 shrink-0" />
                <span className="font-semibold">構成:</span>
                <span>{c.architecture}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
