"use client";

import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import {
  Activity,
  Users,
  TrendingUp,
  BarChart3,
  Calendar,
  Sparkles,
  ChevronDown,
  Award,
  Zap,
  Clock,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Building,
} from "lucide-react";
import { useState } from "react";

interface MonthlyData {
  usersCount: number;
  totalSeats: number;
  totalMessages: number;
  creditUsageRate: number;
  llmCalls: number;
  deptRankings: { name: string; count: number; maxCount: number }[];
  topUsers: { rank: number; name: string; dept: string; type: string; count: number }[];
  creditAvgRate: number;
}

const mockMonthlyData: Record<string, MonthlyData> = {
  "2026-09": {
    usersCount: 49,
    totalSeats: 66,
    totalMessages: 30742,
    creditUsageRate: 28,
    llmCalls: 3579,
    deptRankings: [
      { name: "DXソリューション部", count: 13850, maxCount: 15000 },
      { name: "クラウド基盤推進部", count: 10420, maxCount: 15000 },
      { name: "基幹システム開発部", count: 3680, maxCount: 15000 },
      { name: "CX・カスタマーサクセス", count: 2840, maxCount: 15000 },
      { name: "品質管理・QA部", count: 1950, maxCount: 15000 },
      { name: "データアナリティクス部", count: 820, maxCount: 15000 },
      { name: "コーポレートIT・情シス", count: 480, maxCount: 15000 },
    ],
    topUsers: [
      { rank: 1, name: "クラウド基盤 Aさん", dept: "クラウド基盤", type: "レギュラー", count: 3669 },
      { rank: 2, name: "DX推進 Aさん", dept: "DX推進", type: "ヘビー", count: 2289 },
      { rank: 3, name: "DX推進 Bさん", dept: "DX推進", type: "ヘビー", count: 2130 },
    ],
    creditAvgRate: 28,
  },
  "2026-08": {
    usersCount: 42,
    totalSeats: 60,
    totalMessages: 26180,
    creditUsageRate: 24,
    llmCalls: 2940,
    deptRankings: [
      { name: "DXソリューション部", count: 11200, maxCount: 15000 },
      { name: "クラウド基盤推進部", count: 8900, maxCount: 15000 },
      { name: "基幹システム開発部", count: 3100, maxCount: 15000 },
      { name: "CX・カスタマーサクセス", count: 2200, maxCount: 15000 },
      { name: "品質管理・QA部", count: 1600, maxCount: 15000 },
      { name: "データアナリティクス部", count: 650, maxCount: 15000 },
      { name: "コーポレートIT・情シス", count: 390, maxCount: 15000 },
    ],
    topUsers: [
      { rank: 1, name: "クラウド基盤 Aさん", dept: "クラウド基盤", type: "レギュラー", count: 3120 },
      { rank: 2, name: "DX推進 Aさん", dept: "DX推進", type: "ヘビー", count: 2040 },
      { rank: 3, name: "基幹システム Kさん", dept: "基幹開発", type: "レギュラー", count: 1890 },
    ],
    creditAvgRate: 24,
  },
};

export default function AdoptionPage() {
  const [targetMonth, setTargetMonth] = useState<string>("2026-09");
  const data = mockMonthlyData[targetMonth] || mockMonthlyData["2026-09"];

  // ROIシミュレータ用ステート
  const [teamSize, setTeamSize] = useState<number>(30);
  const [hourlyWage, setHourlyWage] = useState<number>(4000);
  const [dailySavingsMinutes, setDailySavingsMinutes] = useState<number>(30);

  const monthlyHoursPerPerson = (dailySavingsMinutes * 20) / 60;
  const totalMonthlyHours = Math.round(monthlyHoursPerPerson * teamSize);
  const totalYearlyHours = Math.round(totalMonthlyHours * 12);
  const totalYearlyCostSavings = Math.round((totalYearlyHours * hourlyWage) / 10000);

  const usageRatePct = Math.round((data.usersCount / data.totalSeats) * 100);

  return (
    <div className="flex-1 flex flex-col bg-[#0b1120] text-slate-100 min-h-screen">
      {/* 1. 専用ダークテーマ・ヘッダー（参考サイト完全再現） */}
      <div className="border-b border-slate-800 bg-[#070d18] py-6 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-sky-400">
              AI UTILIZATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>AI活用ダッシュボード</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              全社のAIツール活用状況・ライセンス稼働率・アクティビティ推移
            </p>
          </div>

          {/* 右上：対象月セレクタ（参考サイト完全再現） */}
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 self-start sm:self-center shadow-xs">
            <span className="text-amber-400 text-xs">☀️</span>
            <span className="text-xs text-slate-400 font-semibold">対象月</span>
            <select
              value={targetMonth}
              onChange={(e) => setTargetMonth(e.target.value)}
              className="bg-transparent text-xs text-white font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="2026-09" className="bg-slate-900 text-white">2026-09 (速報)</option>
              <option value="2026-08" className="bg-slate-900 text-white">2026-08 (確定)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. メインダッシュボードコンテンツ */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 品質ゲート注意書き */}
        <UnderConstructionAlert
          statusType="poc"
          releaseDate="2026年11月13日(金)"
          message="現在表示されている全社AI活用率やアクティビティ集計値はモデル試算データ（PoCデータ）です。2026年Q3全社アンケートおよび実測ログ集計基盤の接続を経て11月13日に正式公開を予定しています。"
          prepDetails="社内BigQuery利用ログ自動集計バッチと部署別実測ROIデータの反映フェーズ"
        />

        {/* ======================================================== */}
        {/* 4大サマリーメトリクスカード（参考サイト完全再現） */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* カード1: MightyAI 利用者 */}
          <div className="bg-[#111c30] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase font-mono">
              MightyAI 利用者
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-4xl font-black text-white tracking-tight">
                {data.usersCount}
              </span>
              <span className="text-sm text-slate-400 font-bold">名</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              付与 {data.totalSeats}席中 / <strong className="text-sky-400 font-bold">利用率 {usageRatePct}%</strong>
            </p>
          </div>

          {/* カード2: メッセージ数 */}
          <div className="bg-[#111c30] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase font-mono">
              MightyAI メッセージ数
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-4xl font-black text-white tracking-tight">
                {data.totalMessages.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              前月比 <strong className="text-emerald-400 font-bold">+18.2%</strong> 増
            </p>
          </div>

          {/* カード3: クレジット消費率 */}
          <div className="bg-[#111c30] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase font-mono">
              クレジット消費率
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-4xl font-black text-white tracking-tight">
                {data.creditUsageRate}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              枠に対する平均。<span className="text-amber-400">健全域 50〜80%</span>
            </p>
          </div>

          {/* カード4: LLM呼び出し */}
          <div className="bg-[#111c30] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase font-mono">
              Dify / LLM 呼び出し
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-4xl font-black text-white tracking-tight">
                {data.llmCalls.toLocaleString()}
              </span>
              <span className="text-sm text-slate-400 font-bold">回</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              対話型AI & RAG検索の利用
            </p>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 中段セクション: 部門別活用ランキング (左) × トップ活用者 (右) */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左カラム (8/12): 部門別活用ランキング横棒グラフ */}
          <div className="lg:col-span-8 bg-[#111c30] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                部門別 MightyAI 活用ランキング
              </h2>
              <p className="text-xs text-slate-400">
                MightyAIのメッセージ数で集計 / {data.deptRankings.length}部門が利用中
              </p>
            </div>

            {/* 横棒グラフ（参考サイト完全再現） */}
            <div className="space-y-4 pt-2">
              {data.deptRankings.map((dept, idx) => {
                const pct = Math.round((dept.count / dept.maxCount) * 100);
                return (
                  <div key={idx} className="space-y-1.5 group">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">
                        {dept.name}
                      </span>
                      <span className="font-mono text-slate-400 font-bold">
                        {dept.count.toLocaleString()} MSG
                      </span>
                    </div>

                    {/* バー */}
                    <div className="w-full bg-slate-900/90 h-6 rounded-lg overflow-hidden p-0.5 border border-slate-800 flex items-center">
                      <div
                        className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 h-full rounded-md transition-all duration-700 relative flex items-center justify-end pr-2 shadow-xs group-hover:brightness-110"
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      >
                        {pct > 15 && (
                          <span className="text-[10px] font-mono font-bold text-slate-950">
                            {dept.count.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X軸目盛り */}
            <div className="pt-2 border-t border-slate-800/80 flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0</span>
              <span>2,000</span>
              <span>4,000</span>
              <span>6,000</span>
              <span>8,000</span>
              <span>10,000</span>
              <span>12,000</span>
              <span>14,000+</span>
            </div>
          </div>

          {/* 右カラム (4/12): 今月のトップ活用者 */}
          <div className="lg:col-span-4 bg-[#111c30] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  今月のトップ活用者
                </h2>
                <p className="text-xs text-slate-400">
                  ※同意部門のみ公開しています
                </p>
              </div>

              {/* ランキングリスト（参考サイト完全再現） */}
              <div className="space-y-3">
                {data.topUsers.map((user) => {
                  let badge = "🥇";
                  let borderColor = "border-amber-500/40 bg-amber-500/10";
                  if (user.rank === 2) {
                    badge = "🥈";
                    borderColor = "border-slate-400/40 bg-slate-400/10";
                  } else if (user.rank === 3) {
                    badge = "🥉";
                    borderColor = "border-amber-700/40 bg-amber-700/10";
                  }

                  return (
                    <div
                      key={user.rank}
                      className={`p-4 rounded-2xl border ${borderColor} flex items-center justify-between transition-all hover:scale-[1.01]`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl shrink-0">{badge}</span>
                        <div>
                          <p className="text-xs font-bold text-white">
                            {user.name}
                          </p>
                          <span className="text-[10px] text-slate-400 inline-block mt-0.5">
                            {user.type}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-white font-mono">
                          {user.count.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          MSG
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ナレッジ共有リンク */}
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              <p className="leading-relaxed">
                💡 トップ活用者の工夫やプロンプトは「<a href="/ai-park/interviews" className="text-sky-400 hover:underline font-bold">AI活用インタビュー</a>」にて連載・公開中です。
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 下段セクション: クレジット枠の活用状況 (投資健全性メーター) */}
        {/* ======================================================== */}
        <section className="bg-[#111c30] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              クレジット枠の活用状況
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              MightyAIは1人あたり1,000クレジットの枠があります（一部2,000）。枠の50〜80%を使えていれば健全。20%未満は投資を活かせていない状態です。
            </p>
          </div>

          {/* プログレスバー（参考サイト完全再現） */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">全体の平均消費率</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {data.creditAvgRate}%
                </span>
              </div>
              <span className="text-amber-400/90 text-xs font-normal">
                活用余地があります（健全域は 50〜80%）
              </span>
            </div>

            {/* バー */}
            <div className="relative w-full bg-slate-950 h-5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              {/* 健全域ゾーンガイド（50%〜80%） */}
              <div className="absolute top-0 bottom-0 left-[50%] right-[20%] bg-emerald-500/10 border-x border-emerald-500/30 pointer-events-none" />

              {/* 実績バー */}
              <div
                className="bg-gradient-to-r from-amber-600 to-orange-500 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${data.creditAvgRate}%` }}
              />
            </div>

            {/* ゾーン説明 */}
            <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
              <span>0% (未活用)</span>
              <span className="text-amber-400">20% (投資未活用域)</span>
              <span className="text-emerald-400 font-bold">50%〜80% (健全推奨域)</span>
              <span>100% (枠上限)</span>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 追加セクション: 部署別ROI試算シミュレータ (ハイブリッド統合) */}
        {/* ======================================================== */}
        <section className="bg-[#111c30] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-sky-400" />
              <span>部署別 AI導入効果・ROI試算シミュレータ</span>
            </h2>
            <p className="text-xs text-slate-400">
              自部署の人数・想定短縮時間を入力して、年間想定削減工数とコスト効果を即時試算
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* スライダー1 */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">チーム人数</span>
                <span className="text-white font-mono font-bold">{teamSize} 名</span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* スライダー2 */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">1人1日あたりの削減時間</span>
                <span className="text-white font-mono font-bold">{dailySavingsMinutes} 分</span>
              </div>
              <input
                type="range"
                min={10}
                max={120}
                step={5}
                value={dailySavingsMinutes}
                onChange={(e) => setDailySavingsMinutes(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* スライダー3 */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">平均時間単価 (社内基準)</span>
                <span className="text-white font-mono font-bold">{hourlyWage.toLocaleString()} 円</span>
              </div>
              <input
                type="range"
                min={2000}
                max={10000}
                step={500}
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>
          </div>

          {/* 試算結果ボックス */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-sky-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest">
                Estimated Annual Impact
              </span>
              <p className="text-xs text-slate-300">
                年間で約 <strong className="text-white font-bold">{totalYearlyHours.toLocaleString()} 時間</strong> の業務工数を創出
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold mr-2">年間想定削減効果:</span>
              <span className="text-3xl sm:text-4xl font-black text-sky-400 font-mono">
                約 {totalYearlyCostSavings.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-white ml-1">万円</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
