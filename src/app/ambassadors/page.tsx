"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { UnderConstructionBanner } from "@/components/UnderConstruction";
import { Users, Sparkles, MessageCircle } from "lucide-react";

export default function AmbassadorsPage() {
  const ambassadors = [
    { name: "高橋 氏", role: "Antigravity CoE リード / アーキテクト", dept: "基盤推進部", specialty: "Antigravity, Subagents, MCP連携" },
    { name: "佐藤 氏", role: "生成AI推進リード", dept: "DX推進部", specialty: "プロンプト設計, 業務自動化, RAG" },
    { name: "田中 氏", role: "セキュリティ＆ガバナンス", dept: "品質保証部", specialty: "社内規定, データマスキング, 著作権" },
    { name: "鈴木 氏", role: "AIエンジニア / エージェント開発", dept: "システム開発第一部", specialty: "LangChain, TypeScript, Slack Bot" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AIアンバサダー"
        subtitle="各部署でAI活用を先導するアンバサダーメンバーの紹介"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionBanner
          message="【公募準備中】第1期AIアンバサダーの社内公募を準備中です"
          submessage="以下は推進体制のサンプル構成イメージです。2026年Q4より各部署から推進リーダー（アンバサダー）を募る予定です。"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ambassadors.map((amb, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-sm">
                {amb.name.slice(0, 2)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-slate-900 text-sm">{amb.name}</h4>
                  <span className="text-[11px] text-slate-500">({amb.dept})</span>
                </div>
                <div className="text-xs text-blue-600 font-medium">{amb.role}</div>
                <div className="text-[11px] text-slate-500">得意領域: {amb.specialty}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
