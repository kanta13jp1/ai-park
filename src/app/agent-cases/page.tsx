"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import {
  Bot,
  Sparkles,
  GitFork,
  Cpu,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Users
} from "lucide-react";
import Link from "next/link";

interface AgentCase {
  id: string;
  title: string;
  department: string;
  summary: string;
  subagentRoles: string[];
  estimatedHoursSaved: string;
  status: "PoC検証中" | "試作モデルケース";
  keyBenefits: string[];
}

const AGENT_CASES: AgentCase[] = [
  {
    id: "case-legacy-refactor",
    title: "レガシーNext.js/TSコードの型安全リファクタリング",
    department: "開発第1グループ",
    summary: "親エージェントが全体依存関係を解析し、Subagentが各モジュールの型定義修正とユニットテスト実行を並列で自律処理。",
    subagentRoles: ["Codebase Inspector (Flash)", "Type Refactorer (Pro)", "Test Runner (CLI)"],
    estimatedHoursSaved: "月間約 38 時間削減（PoC試算）",
    status: "PoC検証中",
    keyBenefits: [
      "20ファイル以上の型エラーを一括解消",
      "Gitコミット履歴を汚さない安全なブランチ実行",
      "人的レビュー時間を約65%圧縮"
    ]
  },
  {
    id: "case-sql-optimization",
    title: "BigQuery複雑クエリのコスト最適化 & インデックス設計",
    department: "データ基盤チーム",
    summary: "実行ログからスキャンバイト数の多い重いクエリを特定し、パーティショニングとクラスタリングを最適化。",
    subagentRoles: ["Query Profiler (Flash)", "BigQuery Optimizer (Pro)"],
    estimatedHoursSaved: "月間約 24 時間削減（試作モデルケース）",
    status: "試作モデルケース",
    keyBenefits: [
      "DRY-RUN検証によるクエリスキャン量の半減",
      "日次バッチ処理時間を42分から18分に短縮",
      "クラウド利用コストの削減に寄与"
    ]
  },
  {
    id: "case-playwright-e2e",
    title: "Playwright E2E UIリグレッション自動テスト生成",
    department: "QA・品質管理部",
    summary: "画面仕様書とDOM構造からPlaywrightテストシナリオを自動合成し、ヘッドレスブラウザで視覚差分を検証。",
    subagentRoles: ["DOM Crawler (Flash)", "Scenario Synthesizer (Pro)", "Visual Diff Checker"],
    estimatedHoursSaved: "月間約 30 時間削減（PoC検証中）",
    status: "PoC検証中",
    keyBenefits: [
      "回帰テストのスクリプト作成工数をゼロ化",
      "PR作成時の自動CI連携による不具合即時検知",
      "主要画面40パターンのクロスブラウザ検証"
    ]
  }
];

export default function AgentCasesPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="Subagents 活用事例集"
        subtitle="Antigravity 2.0 の並列自律エージェントを活用した社内実測モデルケース"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          statusType="poc"
          title="🧪 PoC検証中・試作モデルケース表示"
          message="現在社内パイロットプロジェクトにてSubagents（自律サブエージェント協調）の実測効果をヒアリング・検証中です。正式運用データが揃い次第更新します。"
          prepDetails="社内パイロットチームでの工数削減実績・安全な権限設定ガイドラインの客観評価を取りまとめています。"
          releaseDate="2026年11月上旬予定"
        />

        {/* HUDハイライトカード */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-3xl">
          <div onMouseEnter={() => playCyberHover()} className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-mono font-bold tracking-wider uppercase">
                <Bot size={14} className="text-purple-400" />
                <span>MULTI-AGENT ARCHITECTURE</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                単一プロンプトから「自律協調チーム」への進化
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Antigravity 2.0 の Subagents 機能により、親エージェントがタスクを分割し、調査役（Flash）・実装役（Pro）・テスト実行役（CLI）をバックグラウンドで並列起動。
                開発者は複雑な指示を待つことなく、完成された差分とテストログを受け取ることが可能になります。
              </p>
            </div>

            <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 shrink-0 font-mono text-xs space-y-2">
              <div className="text-purple-400 font-bold flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>POC HIGHLIGHTS</span>
              </div>
              <div className="text-slate-200">・並列実行による待ち時間 70% 削減</div>
              <div className="text-slate-200">・独立ブランチでの安全なサンドボックス実行</div>
              <div className="text-slate-200">・Flashモデル併用によるトークンコスト半減</div>
            </div>
          </div>
        </div>
      </TiltCard>

        {/* 事例カード一覧 */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <GitFork className="w-5 h-5 text-purple-600" />
                <span>社内パイロット先行事例・モデルケース</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                各部署で進行中のPoC検証シナリオと想定工数削減効果
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/80">
              全 {AGENT_CASES.length} 事例
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {AGENT_CASES.map((item) => (
              <TiltCard
                key={item.id}
                maxTilt={6}
                glareOpacity={0.12}
                className="h-full rounded-2xl"
              >
                <SpotlightCard
                  spotlightColor="rgba(168, 85, 247, 0.15)"
                  className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
                >
                  <div className="p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between gap-2 font-mono">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          {item.status}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          {item.department}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.summary}
                      </p>

                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 space-y-1.5 font-mono">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Subagent Roles</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.subagentRoles.map((role, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 font-semibold"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-700 font-mono">主要な検証成果:</div>
                        {item.keyBenefits.map((b, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-mono">
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Clock size={12} />
                        <span>{item.estimatedHoursSaved}</span>
                      </span>
                      <Link
                        href="/how-to"
                        onClick={() => playCyberClick()}
                        onMouseEnter={() => playCyberHover()}
                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-800 transition-colors"
                      >
                        <span>操作手順を見る</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
