"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { UnderConstructionBanner } from "@/components/UnderConstruction";
import { BarChart3, TrendingUp, Users, MessageSquare, Award, ArrowUpRight } from "lucide-react";

export default function GeminiStatsPage() {
  const departmentStats = [
    { name: "DX・イノベーション推進部", rate: 94, users: 48, prompts: "18,420" },
    { name: "ITシステム基盤部", rate: 89, users: 72, prompts: "24,800" },
    { name: "エンタープライズソリューション部", rate: 82, users: 110, prompts: "31,200" },
    { name: "基幹システム開発部", rate: 76, users: 65, prompts: "14,500" },
    { name: "人事・総務・経営企画部", rate: 71, users: 54, prompts: "12,100" },
    { name: "デジタルサービス推進部", rate: 64, users: 42, prompts: "8,900" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="Gemini利用率ダッシュボード"
        subtitle="社内Gemini Enterpriseの浸透状況・部署別アクティブ率レポート"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* 工事中・モック警告バナー */}
        <UnderConstructionBanner
          message="【開発中】本画面の利用統計データはサンプル（モック）です"
          submessage="現在、Google Workspace利用ログおよびAntigravityテレメトリとのAPI連携バッチを開発中です。本番リリース時に社内の実データに自動切り替わります。"
        />

        {/* KPIカード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>全社月間アクティブ率</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">79.4%</span>
              <span className="text-xs text-emerald-600 font-semibold">+4.2% (前月比)</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>総月間プロンプト数</span>
              <MessageSquare className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">109.9K</span>
              <span className="text-xs text-emerald-600 font-semibold">+18%</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>ライセンス配布済人数</span>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">1,240</span>
              <span className="text-xs text-slate-400">/ 1,500名</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>活用トップ部署</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2">
              <span className="text-lg font-bold text-slate-900 truncate block">DX推進部</span>
              <span className="text-xs text-amber-600 font-semibold">利用率 94%</span>
            </div>
          </div>
        </div>

        {/* 部署別利用率プログレスバー */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>部署別 月間アクティブ利用率 (MAU)</span>
            </h3>
            <span className="text-xs text-slate-400">2026年8月実績</span>
          </div>

          <div className="space-y-4 pt-2">
            {departmentStats.map((dept, index) => (
              <div key={dept.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-800 font-semibold flex items-center space-x-2">
                    <span className="w-5 text-slate-400 text-[11px]">{index + 1}.</span>
                    <span>{dept.name}</span>
                  </span>
                  <div className="space-x-3 text-slate-500">
                    <span>{dept.users}名利用</span>
                    <span className="font-bold text-slate-900">{dept.rate}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      dept.rate >= 85
                        ? "bg-emerald-500"
                        : dept.rate >= 70
                        ? "bg-blue-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${dept.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 人気活用用途トップ */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-2">1位：会議メモ・議事録要約</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Google Meetの文字起こしやメモテキストから、ToDo付き議事録のドラフト作成（所要時間 70% 削減）。
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-2">2位：社内規定・仕様書Q&A</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              NotebookLMを活用した規程集の検索・確認業務。問い合わせ対応のスピードが向上。
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-2">3位：コードレビュー・テスト生成</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              開発エンジニアによるエラーメッセージの調査、単体テストケースの網羅性チェック。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
