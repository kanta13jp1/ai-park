"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import {
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  BarChart3,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Award
} from "lucide-react";
import Link from "next/link";

interface DepartmentStat {
  rank: number;
  department: string;
  adoptionRate: number;
  activeUsers: number;
  monthlyHoursSaved: number;
  primaryUseCases: string[];
}

const DEPARTMENT_STATS: DepartmentStat[] = [
  {
    rank: 1,
    department: "プロダクト開発本部",
    adoptionRate: 88,
    activeUsers: 42,
    monthlyHoursSaved: 320,
    primaryUseCases: ["リファクタリング", "型定義生成", "単体テスト作成"]
  },
  {
    rank: 2,
    department: "データアナリティクス部",
    adoptionRate: 74,
    activeUsers: 18,
    monthlyHoursSaved: 145,
    primaryUseCases: ["SQLクエリ最適化", "BigQueryパイプライン設計", "EDA分析"]
  },
  {
    rank: 3,
    department: "QA・品質保証グループ",
    adoptionRate: 65,
    activeUsers: 14,
    monthlyHoursSaved: 110,
    primaryUseCases: ["E2Eテストシナリオ生成", "テストケース自動作成"]
  },
  {
    rank: 4,
    department: "情シス・社内基盤チーム",
    adoptionRate: 52,
    activeUsers: 11,
    monthlyHoursSaved: 78,
    primaryUseCases: ["GASスクリプト生成", "障害ログ解析", "インフラ自動化"]
  }
];

export default function AdoptionPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="社内AI活用状況ダッシュボード"
        subtitle="全社・部署別のAI導入率・利用頻度・業務効率化効果の集計レポート（PoC試作データ）"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          statusType="poc"
          title="🧪 PoC検証中・サンプル試作データ表示"
          message="利用ログやアンケートなどの実データと連携準備中です。社員向けに誤解のない正確な情報を提供するため、本番データ集計完了までは試作モデルケースを表示しています。"
          prepDetails="全社AI利用アンケートの集計および監査ログ（BigQuery）の集計パイプラインを構築中です。"
          releaseDate="2026年11月中旬予定"
        />

        {/* 4大KPIカード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(6, 182, 212, 0.15)"
              className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
            >
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs">
                  <span>全社AI導入率 (PoC)</span>
                  <TrendingUp size={16} className="text-cyan-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  <AnimatedCounter value={68.4} decimals={1} suffix="%" />
                </div>
                <p className="text-[11px] text-slate-500 font-mono">対象社員 120名中 82名活用中</p>
              </div>
            </SpotlightCard>
          </TiltCard>

          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(99, 102, 241, 0.15)"
              className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
            >
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs">
                  <span>月間削減時間 (試算)</span>
                  <Clock size={16} className="text-indigo-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  <AnimatedCounter value={653} decimals={0} suffix="h" />
                </div>
                <p className="text-[11px] text-slate-500 font-mono">1人あたり月平均 約8.0時間</p>
              </div>
            </SpotlightCard>
          </TiltCard>

          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.15)"
              className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
            >
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs">
                  <span>アクティブ部署数</span>
                  <Building2 size={16} className="text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  <AnimatedCounter value={8} decimals={0} suffix=" / 10 部署" />
                </div>
                <p className="text-[11px] text-slate-500 font-mono">主要開発・分析部門は100%導入</p>
              </div>
            </SpotlightCard>
          </TiltCard>

          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(168, 85, 247, 0.15)"
              className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
            >
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs">
                  <span>月次試算価値創出</span>
                  <Sparkles size={16} className="text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  <AnimatedCounter value={3.26} decimals={2} prefix="¥" suffix="M" />
                </div>
                <p className="text-[11px] text-slate-500 font-mono">社内人時単価換算による効果</p>
              </div>
            </SpotlightCard>
          </TiltCard>
        </div>

        {/* 部署別ランキング */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>部署別 AI 活用推進ランキング（サンプル表示）</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                各部署における導入率・月間削減工数・代表的な活用ユースケース
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              試作モデルデータ
            </span>
          </div>

          <div className="space-y-4">
            {DEPARTMENT_STATS.map((dept) => (
              <div
                key={dept.rank}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-md">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black font-mono ${
                      dept.rank === 1
                        ? "bg-amber-400 text-slate-950"
                        : dept.rank === 2
                        ? "bg-slate-300 text-slate-800"
                        : "bg-amber-700/30 text-amber-900"
                    }`}>
                      #{dept.rank}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {dept.department}
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dept.primaryUseCases.map((uc, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600"
                      >
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8 shrink-0 font-mono">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">導入率</div>
                    <div className="text-lg font-black text-cyan-700">{dept.adoptionRate}%</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">アクティブ</div>
                    <div className="text-lg font-black text-slate-800">{dept.activeUsers} 名</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">削減工数</div>
                    <div className="text-lg font-black text-emerald-600">{dept.monthlyHoursSaved} h</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
