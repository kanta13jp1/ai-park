"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import {
  Activity,
  Users,
  PieChart,
  Award,
  Calculator,
  TrendingUp,
  Clock,
  Coins,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  BarChart2,
} from "lucide-react";
import { useState } from "react";

export default function AdoptionPage() {
  // ROIシミュレータ用ステート
  const [teamSize, setTeamSize] = useState<number>(30);
  const [hourlyWage, setHourlyWage] = useState<number>(4000);
  const [dailySavingsMinutes, setDailySavingsMinutes] = useState<number>(30);

  // 試算ロジック (月20営業日換算)
  const monthlyHoursPerPerson = (dailySavingsMinutes * 20) / 60;
  const totalMonthlyHours = Math.round(monthlyHoursPerPerson * teamSize);
  const totalYearlyHours = Math.round(totalMonthlyHours * 12);
  const totalYearlyCostSavings = Math.round((totalYearlyHours * hourlyWage) / 10000); // 万円単位

  const phases = [
    {
      phase: "Phase 1",
      status: "完了",
      statusColor: "text-emerald-700 bg-emerald-100",
      title: "日常対話・要約・メール支援",
      achievement: "全社導入率 92%",
      description: "Gemini Enterprise 全社展開。社内基本研修受講率95%達成。ドキュメント要約・翻訳・ドラフト作成が日常業務に定着。",
    },
    {
      phase: "Phase 2",
      status: "推進中",
      statusColor: "text-blue-700 bg-blue-100",
      title: "Antigravity 開発環境 & Skills活用",
      achievement: "エンジニア導入率 78%",
      description: "Antigravity IDE / CLI のセットアップと、コーディング規約や業務特化 Skills による開発自動化を各チームへ展開中。",
    },
    {
      phase: "Phase 3",
      status: "先行PoC中",
      statusColor: "text-purple-700 bg-purple-100",
      title: "自律並列エージェント & MCP連携",
      achievement: "導入率 42%",
      description: "Subagentsによる障害調査自動化、社内DB直結MCPサーバー、PR自動コードレビューなど高度な自律プロセスの実用化。",
    },
    {
      phase: "Phase 4",
      status: "ロードマップ",
      statusColor: "text-slate-600 bg-slate-200",
      title: "DevOps・基幹業務の完全自律化",
      achievement: "2026 Q4〜",
      description: "CI/CDパイプラインとの完全統合、障害自動復旧、仕様書からのシステム自動プロビジョニングの実現を目指す。",
    },
  ];

  const surveyHighlights = [
    { metric: "91.8%", label: "「業務スピードが向上した」と回答", desc: "回答者 1,020名中 936名が実感を報告" },
    { metric: "平均 34分", label: "1人あたりの1日平均短縮時間", desc: "特にコード実装と調査業務で顕著な効果" },
    { metric: "88.4%", label: "「AIツールの利用継続を強く希望」", desc: "社内エンジニアのほぼ全員が必須ツールと認識" },
  ];

  const topUseCases = [
    { rank: "1位", name: "コード実装・リファクタリング・バグ修正", share: "38%", team: "開発推進部 / 基幹システム" },
    { rank: "2位", name: "エラーログ解析・インシデント調査・SQL最適化", share: "27%", team: "SRE / クラウド基盤" },
    { rank: "3位", name: "社内規程・仕様書・ナレッジ検索 (RAG)", share: "19%", team: "全社 / DXソリューション" },
    { rank: "4位", name: "会議議事録・ネクストアクション自動抽出", share: "16%", team: "PMO / 企画管理" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="社内AI活用状況 & ROIシミュレータ"
        subtitle="MightyLINK 全社のAI活用浸透度・推進フェーズ・定量的削減効果の可視化"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* バナー: Phase 3 稼働 */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-200/60 text-emerald-800 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-emerald-950 flex items-center space-x-1">
                  <span>👀</span>
                  <span>全社AI活用推進ダッシュボード & ROIシミュレータ公開中</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold text-[10px]">
                  Phase 3 機能稼働
                </span>
              </div>
              <p className="text-emerald-800/90 leading-relaxed">
                全社フェーズ進捗、社内アンケート集計、および自チームの人数や想定時給に応じた工数削減シミュレーションが即座に実行可能です。
              </p>
            </div>
          </div>
        </div>

        {/* インタラクティブ ROI シミュレータ */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-cyan-600" />
                <span>自チーム向け AI工数削減 & コストROIシミュレータ</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                チームの規模や利用実態に合わせて、年間で創出される削減時間とコスト効果を試算できます。
              </p>
            </div>
            <span className="px-3 py-1 bg-cyan-50 text-cyan-800 text-xs font-bold rounded-full border border-cyan-200 self-start sm:self-auto">
              リアルタイム試算
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* スライダー入力部 */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>対象チーム人数:</span>
                  <span className="text-blue-600 text-sm font-black">{teamSize} 名</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5名 (小規模PJ)</span>
                  <span>100名</span>
                  <span>200名 (部門全体)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>想定平均時給 (人件費換算):</span>
                  <span className="text-blue-600 text-sm font-black">
                    {hourlyWage.toLocaleString()} 円 / 時間
                  </span>
                </div>
                <input
                  type="range"
                  min="2500"
                  max="8000"
                  step="500"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>2,500円</span>
                  <span>4,000円 (社内標準)</span>
                  <span>8,000円 (エキスパート)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>1人あたりの1日あたり短縮時間:</span>
                  <span className="text-blue-600 text-sm font-black">
                    {dailySavingsMinutes} 分 / 日
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDailySavingsMinutes(mins)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        dailySavingsMinutes === mins
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {mins}分
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 試算結果カード */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-[#3b4856] text-white p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
              <div>
                <span className="text-xs font-semibold text-cyan-300 flex items-center space-x-1.5">
                  <TrendingUp size={14} />
                  <span>試算された年間創出バリュー</span>
                </span>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-4xl font-black text-white">
                    約 {totalYearlyCostSavings.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-cyan-200">万円 / 年</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  （人件費換算での生産性向上バリュー）
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/80">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
                  <div className="text-[11px] text-slate-400 font-medium">月間創出時間</div>
                  <div className="text-xl font-bold text-white mt-0.5">
                    {totalMonthlyHours.toLocaleString()} 時間
                  </div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
                  <div className="text-[11px] text-slate-400 font-medium">年間創出時間</div>
                  <div className="text-xl font-bold text-cyan-300 mt-0.5">
                    {totalYearlyHours.toLocaleString()} 時間
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-snug">
                ※月20稼働日、全社員アンケート（平均34分短縮実績）を元にした概算シミュレーションです。
              </div>
            </div>
          </div>
        </div>

        {/* 全社AI活用フェーズマップ */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>全社AI活用推進フェーズマップ</span>
            </h3>
            <span className="text-xs text-slate-400">MightyLINK AI推進ロードマップ 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((p) => (
              <div
                key={p.phase}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{p.phase}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                  <div className="text-xs font-semibold text-blue-600">{p.achievement}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 社内アンケート結果サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
              <ThumbsUp className="w-5 h-5 text-emerald-600" />
              <span>社員満足度 & 実感アンケート</span>
            </h3>
            <div className="space-y-3">
              {surveyHighlights.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center space-x-4"
                >
                  <div className="text-2xl font-black text-slate-900 shrink-0 min-w-[75px]">
                    {s.metric}
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800 text-xs">{s.label}</div>
                    <div className="text-[11px] text-slate-500">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-purple-600" />
              <span>効果の高かった業務領域 TOP 4</span>
            </h3>
            <div className="space-y-3">
              {topUseCases.map((u) => (
                <div
                  key={u.rank}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded text-[11px]">
                      {u.rank}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800 text-xs">{u.name}</div>
                      <div className="text-[10px] text-slate-400">主な活用: {u.team}</div>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 shrink-0">{u.share}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
