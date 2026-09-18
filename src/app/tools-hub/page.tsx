"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { UnderConstructionBanner } from "@/components/UnderConstruction";
import { Wrench, Terminal, Cpu, Database } from "lucide-react";

export default function ToolsHubPage() {
  const hubs = [
    {
      title: "社内プロンプト共有ライブラリ",
      category: "プロンプト集",
      desc: "部署ごとに洗練された定型プロンプトテンプレート集（メール、仕様書、要件定義など）。",
    },
    {
      title: "AWS Bedrock クイックスタートキット",
      category: "開発SDK",
      desc: "社内AWS環境からPython/TypeScriptでBedrock APIを簡単に呼び出せる共通ライブラリ・サンプルリポジトリ。",
    },
    {
      title: "セキュア画像マスキングユーティリティ",
      category: "セキュリティ",
      desc: "ログやスクリーンショット内の個人情報・機密情報を自動で黒塗りしてからAIに入力するWebツール。",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AI Tools Hub"
        subtitle="社内開発のAIツール・ユーティリティ・プロンプトライブラリ集積地"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionBanner
          message="【集約中】社内開発ツール・ユーティリティを順次登録準備中です"
          submessage="各プロジェクトで自作された便利ツールやプロンプトテンプレートのリポジトリをこちらに一元集約していきます。"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {hubs.map((hub, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {hub.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2 mb-1">{hub.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{hub.desc}</p>
              </div>
              <button
                onClick={() => alert(`「${hub.title}」は現在社内リポジトリ整備中です。`)}
                className="mt-4 text-xs font-semibold text-slate-500 hover:text-blue-700 text-left flex items-center space-x-1"
              >
                <span>リポジトリへ →</span>
                <span className="text-[10px] text-amber-700 font-normal">（🚧 準備中）</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
