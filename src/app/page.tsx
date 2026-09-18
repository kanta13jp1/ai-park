"use client";

import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import PurposeJump from "@/components/PurposeJump";
import SiteOmnisearch from "@/components/SiteOmnisearch";
import {
  Sparkles,
  ArrowRight,
  Zap,
  BookOpen,
  BarChart3,
  Users,
  ExternalLink,
  Bot,
  Layers,
  Terminal,
  Boxes,
  Plug,
  Award,
} from "lucide-react";

export default function Home() {
  const quickLinks = [
    {
      title: "Antigravity導入ガイド",
      description: "IDE / CLI (agy) の社内セットアップ手順、スラッシュコマンド活用法",
      icon: "🚀",
      href: "/guide",
      badge: "公開中",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "社内Skillsカタログ",
      description: "テスト自動化、規約ガード、BigQuery分析など社内公認スキル集の配布・申請",
      icon: "🛠️",
      href: "/skills-hub",
      badge: "β公開中",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "MCP外部ツール連携",
      description: "社内DB、Google Drive、ブラウザ検証をAntigravityに直結する設定ガイド",
      icon: "🔌",
      href: "/mcp-hub",
      badge: "公開中",
      badgeColor: "bg-purple-100 text-purple-800",
    },
    {
      title: "Subagents活用事例",
      description: "自律並列サブエージェント（SRE・調達・QA自動化）による工数削減事例",
      icon: "🟣",
      href: "/agent-cases",
      badge: "公開中",
      badgeColor: "bg-purple-100 text-purple-800",
    },
    {
      title: "利用状況ダッシュボード",
      description: "各部署のAntigravity / Gemini 活用率・プロンプト推移・CSV入出力分析",
      icon: "💎",
      href: "/gemini-stats",
      badge: "稼働中",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      title: "社内AI活用状況 & ROI",
      description: "全社フェーズ進捗、チーム人数に応じた削減工数・コストROIの試算",
      icon: "👀",
      href: "/adoption",
      badge: "公開中",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* ヒーローバナー（デジタルAIツリー背景・みんなでつくるAI広場） */}
      <HeroBanner
        title="AI Park"
        subtitle="みんなでつくるAI広場 — MightyLINK × Google Antigravity"
        isHome={true}
      />

      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-10">
        {/* 1. 「何がしたい？」目的に合わせてページへジャンプ (参考サイト完全準拠) */}
        <PurposeJump />

        {/* 2. サイト内横断検索 (参考サイト完全準拠) */}
        <SiteOmnisearch />

        {/* 3. プロジェクト進捗・ロードマップ案内バナー */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#3b4856] rounded-2xl p-5 md:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700/60">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-[11px] font-semibold">
                進捗率 90%
              </span>
              <span className="text-xs text-slate-300 font-mono">Phase 1〜3 公開完了 / Phase 4 進行中</span>
            </div>
            <h3 className="font-bold text-base md:text-lg text-white">
              準備中機能の実装スケジュール & 開発ロードマップ
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              社内Skillsカタログ、アイデア宣言ボード、アンバサダー紹介、利用状況ダッシュボードの動的連携がすべて完了しました。
            </p>
          </div>
          <Link
            href="/roadmap"
            className="shrink-0 inline-flex items-center space-x-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm self-start md:self-center"
          >
            <span>開発ロードマップを見る</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4. メインナビゲーションカードグリッド */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>おすすめ・主要コンテンツ</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    {item.badge && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>詳しく見る</span>
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. ウェルカムセクション */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MightyLINK AI Center of Excellence</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              コードを書くだけの時代から、AIエージェントと共創する開発へ。
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              AI Parkは、MightyLINK社員のための次世代AIプラットフォームです。
              Google Antigravity（IDE / CLI）の社内導入、業務特化Skillsの共有、MCP連携、そしてエキスパートによる個別相談（Office Hour）までをトータルでサポートします。
            </p>
          </div>
          <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none hidden md:block">
            <Bot size={220} className="text-blue-900" />
          </div>
        </section>

        {/* 6. なぜ Antigravity なのか？ 3つの強み */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>なぜ Google Antigravity なのか？</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-3">
                <Boxes size={22} />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">自律型Subagentsの並列協調</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                単一プロンプトにとどまらず、リサーチ・設計・テスト生成など専門役割を持つサブエージェントを自律的に並列実行できます。
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-3">
                <Terminal size={22} />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Skills & Rules による社内統制</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                破壊的コマンド実行防止や独自のコーディング規約を `SKILL.md` や `RULE` として定義し、社内標準をAIに確実に遵守させます。
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg mb-3">
                <Plug size={22} />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">オープン標準 MCP ツール連携</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                社内データベース、GitHub、ブラウザテストツールを直結し、エージェントが必要な外部ツールを自律的に呼び出せます。
              </p>
            </div>
          </div>
        </section>

        {/* 7. サポート & Office Hour 相談窓口 */}
        <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-700/60 border border-blue-400/30 text-blue-200 inline-block">
              AI CoE サポートデスク
            </span>
            <h3 className="text-2xl font-bold">
              AI導入の疑問や自チームへの適用相談をお待ちしています
            </h3>
            <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
              「自チームの業務にエージェントを組み込みたい」「カスタムSkillsの作り方を教えてほしい」など、AI推進CoEメンターがOffice Hourで個別に対応します。
            </p>
            <div className="pt-2">
              <Link
                href="/antigravity-info"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-blue-900 font-bold text-xs rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
              >
                <span>Antigravity情報局・相談予約へ</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
