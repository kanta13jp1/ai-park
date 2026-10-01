"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import {
  Users,
  TrendingUp,
  BarChart3,
  Clock,
  Sparkles,
  Building,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface DeptAdoption {
  name: string;
  totalMembers: number;
  activeUsers: number;
  adoptionRate: number;
  monthlySavedHours: number;
  topUseCases: string[];
  statusBadge: string;
}

const DEPT_DATA: DeptAdoption[] = [
  {
    name: "AI推進部 / DX推進室",
    totalMembers: 4,
    activeUsers: 4,
    adoptionRate: 100,
    monthlySavedHours: 120,
    topUseCases: ["Antigravity並列開発", "社内ポータル保守", "プロンプトテンプレート作成"],
    statusBadge: "本格運用中"
  },
  {
    name: "開発部（フロントエンド/バックエンド）",
    totalMembers: 12,
    activeUsers: 9,
    adoptionRate: 75,
    monthlySavedHours: 180,
    topUseCases: ["コード生成 & レビュー", "単体テスト自動生成", "リファクタリング"],
    statusBadge: "導入拡大中"
  },
  {
    name: "インフラ・情シスチーム",
    totalMembers: 5,
    activeUsers: 4,
    adoptionRate: 80,
    monthlySavedHours: 65,
    topUseCases: ["Terraform自動生成", "GCPログ監査", "セキュリティ設定確認"],
    statusBadge: "本格運用中"
  },
  {
    name: "企画・マーケティング部",
    totalMembers: 8,
    activeUsers: 5,
    adoptionRate: 62.5,
    monthlySavedHours: 75,
    topUseCases: ["競合リサーチ要約", "プレスリリース骨子作成", "SNS投稿案作成"],
    statusBadge: "PoC検証中"
  },
  {
    name: "営業推進・カスタマーサクセス",
    totalMembers: 10,
    activeUsers: 4,
    adoptionRate: 40,
    monthlySavedHours: 40,
    topUseCases: ["顧客ヒアリング議事録要約", "提案書構成案", "FAQ作成"],
    statusBadge: "PoC検証中"
  }
];

export default function AdoptionPage() {
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const totalCompanyMembers = DEPT_DATA.reduce((sum, d) => sum + d.totalMembers, 0);
  const totalCompanyActive = DEPT_DATA.reduce((sum, d) => sum + d.activeUsers, 0);
  const companyAdoptionRate = Math.round((totalCompanyActive / totalCompanyMembers) * 100);
  const totalSavedHours = DEPT_DATA.reduce((sum, d) => sum + d.monthlySavedHours, 0);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="社内AI活用状況ダッシュボード"
        subtitle="全社および部署別のAI導入率・作業時間削減効果・主要活用シーンの可視化"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* サマリーKPIカード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>全社AI導入率</span>
              <Users size={16} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
              {companyAdoptionRate}%
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingUp size={12} className="mr-0.5" />
                +12% (前月比)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              対象社員 {totalCompanyMembers}名中 {totalCompanyActive}名が継続利用
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>月間削減作業時間（推計）</span>
              <Clock size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
              約 {totalSavedHours} 時間
            </div>
            <p className="text-[11px] text-slate-400">
              コード作成・資料要約・調査業務の効率化
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>年間創出価値（推計）</span>
              <Zap size={16} className="text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
              ¥1,920 万
              <span className="text-xs font-normal text-slate-400">相当</span>
            </div>
            <p className="text-[11px] text-slate-400">
              時給単価 4,000円換算の業務余力創出
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>GCP無料クレジット残高</span>
              <ShieldCheck size={16} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-600 flex items-baseline gap-2">
              ¥47,749
              <span className="text-xs font-normal text-slate-400">/ 90日残</span>
            </div>
            <Link
              href="/gemini-stats"
              className="text-[11px] text-indigo-600 hover:underline flex items-center gap-0.5 font-bold"
            >
              利用監視ダッシュボードを見る
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* 部署別AI導入・活用ランキング */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>部署別 AI活用進捗 ＆ 削減時間</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                各チームの日常業務でのAI利用実態と主な活用シーン
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              2026年10月度 最新集計
            </span>
          </div>

          <div className="space-y-4">
            {DEPT_DATA.map((dept, index) => (
              <div
                key={dept.name}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {dept.name}
                      </h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>メンバー: {dept.activeUsers} / {dept.totalMembers} 名利用中</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-700">月間約 {dept.monthlySavedHours}時間 削減</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      dept.statusBadge === "本格運用中"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {dept.statusBadge}
                    </span>
                    <div className="text-right w-20">
                      <span className="text-sm font-black text-slate-900">{dept.adoptionRate}%</span>
                    </div>
                  </div>
                </div>

                {/* プログレスバー */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${dept.adoptionRate}%` }}
                  />
                </div>

                {/* 主な活用シーン */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-600">
                  <span className="text-slate-400 font-semibold mr-1">主な利用業務:</span>
                  {dept.topUseCases.map((u) => (
                    <span
                      key={u}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium text-slate-700"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
