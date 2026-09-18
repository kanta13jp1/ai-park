"use client";

import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { Sparkles, ArrowRight, Zap, BookOpen, BarChart3, Users, ExternalLink, Bot, Layers, Terminal, Boxes, Plug } from "lucide-react";

export default function Home() {
  const quickLinks = [
    {
      title: "Antigravity情報局",
      description: "CoE相談室・Google Antigravity の社内導入相談・Skills開発支援・最新モデル情報",
      icon: "🌌",
      href: "/antigravity-info",
      badge: "稼働中",
      badgeColor: "bg-blue-100 text-blue-800",
    },
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
      description: "自律並列サブエージェント（Research, Coding, QA）による工数削減事例",
      icon: "🟣",
      href: "/agent-cases",
      badge: "🚧 PoC中",
      badgeColor: "bg-rose-100 text-rose-800 border border-rose-200",
    },
    {
      title: "利用状況ダッシュボード",
      description: "各部署のAntigravity / Gemini Enterprise 活用率・プロンプト推移レポート",
      icon: "💎",
      href: "/gemini-stats",
      badge: "🚧 モック",
      badgeColor: "bg-amber-100 text-amber-800 border border-amber-200",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AI Park"
        subtitle="MightyLINK × Google Antigravity 社内エージェント推進ポータル"
      />

      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-10">
        {/* ウェルカムセクション */}
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

        {/* ロードマップ案内バナー */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#3b4856] rounded-2xl p-5 md:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700/60">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded text-[11px] font-semibold">
                プロジェクト進捗
              </span>
              <span className="text-xs text-slate-300 font-mono">Phase 1〜4 計画公開中</span>
            </div>
            <h3 className="font-bold text-base md:text-lg text-white">
              準備中機能の実装スケジュール & 開発ロードマップ
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              社内Skillsカタログ拡充、アイデア宣言ボード、利用統計ダッシュボードの動的連携など、準備中となっている各機能の対応スケジュールと進捗を随時公開しています。
            </p>
          </div>
          <Link
            href="/roadmap"
            className="shrink-0 inline-flex items-center space-x-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm self-start md:self-center"
          >
            <span>対応スケジュールを見る</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* メインナビゲーションカードグリッド */}
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
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-blue-600 group-hover:text-blue-700">
                  <span>詳細を見る</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* お知らせ & イベント */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>最新のお知らせ & Antigravityアップデート</span>
            </h3>
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
              🚧 サンプル展示中
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start justify-between py-2 border-b border-slate-50">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-400 shrink-0">2026.09.18</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-rose-50 text-rose-700 rounded shrink-0">
                  NEW
                </span>
                <Link
                  href="/antigravity-info"
                  className="font-medium text-slate-800 hover:text-blue-600 transition-colors"
                >
                  【Antigravity情報局】CoE相談室がオープン！個別相談・Skills開発レビュー枠を増設
                </Link>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">AI推進部</span>
            </div>

            <div className="flex items-start justify-between py-2 border-b border-slate-50">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-400 shrink-0">2026.09.10</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded shrink-0">
                  機能解放
                </span>
                <Link
                  href="/guide"
                  className="font-medium text-slate-800 hover:text-blue-600 transition-colors"
                >
                  Gemini 3.1 Pro / 3.8 Flash モデルが社内Antigravity環境でプレビュー利用可能に
                </Link>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">基盤推進部</span>
            </div>

            <div className="flex items-start justify-between py-2">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-400 shrink-0">2026.08.30</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded shrink-0">
                  スキル追加
                </span>
                <Link
                  href="/skills-hub"
                  className="font-medium text-slate-800 hover:text-blue-600 transition-colors"
                >
                  社内標準Skills「誤削除防止ガード」「Playwright UI検証」をカタログに追加しました
                </Link>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">Antigravity CoE</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
