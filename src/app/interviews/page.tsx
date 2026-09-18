"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { UnderConstructionBanner } from "@/components/UnderConstruction";
import { UserCheck, MessageSquare, ArrowRight } from "lucide-react";

export default function InterviewsPage() {
  const interviews = [
    {
      title: "「月間40時間の問い合わせ対応をゼロに」ソリューション開発チームの挑戦",
      interviewee: "ソリューション開発第一部 課長代理 佐藤氏",
      date: "2026.09.05",
      tag: "業務削減",
      summary: "社内問い合わせ対応にSlack×Gemini Botを導入。FAQメンテナンスを自動化し、本質的な開発業務に集中できる環境を実現した舞台裏。",
    },
    {
      title: "「AIはパートナー」プラットフォーム監視現場でのリアルタイムデータ分析と意思決定支援",
      interviewee: "プラットフォーム基盤統括 主任アーキテクト 伊藤氏",
      date: "2026.08.20",
      tag: "現場DX",
      summary: "突発的なアクセス急増時や障害検知時のシミュレーションにおいて、生成AIを活用した迅速な意思決定支援プロトタイプを構築した知見を語る。",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AI活用インタビュー"
        subtitle="現場で成果を出している社内プロジェクトのリアルな声"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionBanner
          message="【取材・執筆中】現場メンバーへのインタビュー記事を準備中"
          submessage="現在、社内でAntigravityや生成AIを活用して業務削減に成功した各プロジェクトへの取材を進めています。近日中に第1弾記事を公開予定です。"
        />

        <div className="space-y-4">
          {interviews.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-95"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                    {item.tag}
                  </span>
                  <span className="text-xs text-slate-400">{item.date}</span>
                  <span className="text-xs text-slate-500 font-medium">| {item.interviewee}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>
              </div>

              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg shrink-0">
                <span>🚧 記事執筆中 (近日公開)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
