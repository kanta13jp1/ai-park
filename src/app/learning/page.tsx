"use client";

import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import BeginnerCheatsheet from "@/components/BeginnerCheatsheet";
import SafePromptingRules from "@/components/SafePromptingRules";
import SafetySelfChecker from "@/components/SafetySelfChecker";
import InteractivePromptLibrary from "@/components/InteractivePromptLibrary";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberHover, playCyberClick } from "@/lib/sound";
import { GraduationCap, ArrowRight, Sparkles, BookOpen } from "lucide-react";

export default function LearningPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="生成AI 学習コンテンツ"
        subtitle="初級チートシート・プロンプト実例集・体系的カリキュラム（Antigravity Academy 連携）"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Academy への誘導ハイライト SpotlightCard */}
        <TiltCard maxTilt={4} glareOpacity={0.08} className="rounded-2xl">
          <SpotlightCard
            spotlightColor="rgba(99, 102, 241, 0.25)"
            className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border-indigo-700/50 shadow-xl overflow-hidden rounded-2xl"
          >
            <Link
              href="/academy"
              onMouseEnter={() => playCyberHover()}
              onClick={() => playCyberClick()}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 gap-5 group"
            >
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 text-cyan-300 shadow-inner group-hover:scale-105 transition-transform">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-white">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    おすすめ公式カリキュラム
                  </span>
                  <span className="text-xs text-slate-400 font-mono">全12レッスン + 修了証</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight group-hover:text-cyan-300 transition-colors">
                  Antigravity Academy
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-light">
                  動画と実践で学ぶ全12レッスン。受講後の評価テストに合格すると、<span className="inline-block">ブラウザ内で即時修了証（SVG証明書）を発行・印刷できます。</span>
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs group-hover:bg-cyan-300 transition-colors shadow-md">
              <span>受講を開始する</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </SpotlightCard>
      </TiltCard>

        {/* 初心者チートシート */}
        <BeginnerCheatsheet />

        {/* 社内AI安全利用ルール & 入力早見表 */}
        <SafePromptingRules />

        {/* 社内AI入力セルフチェック診断ツール */}
        <SafetySelfChecker />

        {/* 実務プロンプト集（穴埋め入力＆ワンクリックコピー） */}
        <InteractivePromptLibrary />

        {/* 工事中アラート */}
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中：おすすめ講座・資格の一覧を準備しています"
          message="社内でおすすめする外部講座・資格と、受講・受験の補助制度はまだ決まっていません。決まり次第、ここに掲載します。"
        />
      </div>
    </div>
  );
}
