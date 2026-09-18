"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { UnderConstructionBanner } from "@/components/UnderConstruction";
import { Activity, Users, PieChart, Award } from "lucide-react";

export default function AdoptionPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="社内AI活用状況"
        subtitle="MightyLINK全体のAI浸透度・活用フェーズ・推進指標"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionBanner
          message="【策定中】全社AI活用推進指標・フェーズマップは策定作業中です"
          submessage="各部門のAI活用KPI、セキュリティ評価指標、業務効率化効果の測定フレームワークを順次更新・開示していきます。"
        />
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>社内AI活用フェーズマップ</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            現在、MightyLINK全体で「Phase 2: 個別業務への組み込み」から「Phase 3: 自律エージェント連携」への移行を進めています。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-emerald-600 mb-1">Phase 1 (完了)</div>
              <h4 className="font-bold text-sm text-slate-900">日常対話・要約利用</h4>
              <p className="text-[11px] text-slate-500 mt-1">全社Gemini展開・基本研修受講率90%達成</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 ring-2 ring-blue-500/20">
              <div className="text-xs font-bold text-blue-700 mb-1">Phase 2 (推進中)</div>
              <h4 className="font-bold text-sm text-slate-900">RAG・社内データ連携</h4>
              <p className="text-[11px] text-slate-600 mt-1">Antigravity Skills / Bedrock による規程・マニュアル連携</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="text-xs font-bold text-purple-700 mb-1">Phase 3 (検証中)</div>
              <h4 className="font-bold text-sm text-slate-900">自律エージェント連携</h4>
              <p className="text-[11px] text-slate-500 mt-1">複数ツールを跨いだ自動調査・チケット起票PoC</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 opacity-70">
              <div className="text-xs font-bold text-slate-500 mb-1">Phase 4 (展望)</div>
              <h4 className="font-bold text-sm text-slate-900">基幹プロセスAI化</h4>
              <p className="text-[11px] text-slate-500 mt-1">基幹システム・顧客向けソリューションの高度リアルタイム最適化</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
