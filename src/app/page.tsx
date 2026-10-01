"use client";

import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import AIPulseTicker from "@/components/AIPulseTicker";
import ExperienceSelector from "@/components/ExperienceSelector";
import PurposeJump from "@/components/PurposeJump";
import SiteOmnisearch from "@/components/SiteOmnisearch";
import SpotlightCard from "@/components/SpotlightCard";
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
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Compass,
  Lightbulb,
  Radio,
  Flame,
} from "lucide-react";

export default function Home() {
  const quickLinks = [
    {
      title: "Antigravity Academy",
      description: "動画と実践で学ぶ全12レッスン・評価テスト・ブラウザ内修了証発行",
      icon: "🎓",
      href: "/academy",
      badge: "おすすめ",
      badgeColor: "bg-indigo-500/15 text-indigo-700 border border-indigo-300/60",
      accentGradient: "from-blue-600 to-indigo-600",
      spotlightColor: "rgba(99, 102, 241, 0.18)",
    },
    {
      title: "Antigravity導入ガイド",
      description: "IDE / CLI (agy) の社内セットアップ手順、スラッシュコマンド活用法",
      icon: "🚀",
      href: "/guide",
      badge: "公開中",
      badgeColor: "bg-emerald-500/15 text-emerald-700 border border-emerald-300/60",
      accentGradient: "from-emerald-500 to-teal-600",
      spotlightColor: "rgba(16, 185, 129, 0.18)",
    },
    {
      title: "社内AIプロジェクト一覧",
      description: "社内各部署の実践事例・課題・効果・進捗を一覧化し自動掲載",
      icon: "🏢",
      href: "/ai-projects",
      badge: "β版",
      badgeColor: "bg-sky-500/15 text-sky-700 border border-sky-300/60",
      accentGradient: "from-sky-500 to-blue-600",
      spotlightColor: "rgba(14, 165, 233, 0.18)",
    },
    {
      title: "AI Park カレンダー",
      description: "社内AI勉強会・Office Hour・募集締切などのスケジュール共有",
      icon: "🗓️",
      href: "/calendar",
      badge: "β版",
      badgeColor: "bg-cyan-500/15 text-cyan-700 border border-cyan-300/60",
      accentGradient: "from-cyan-500 to-blue-500",
      spotlightColor: "rgba(6, 182, 212, 0.18)",
    },
    {
      title: "ご意見・改善ToDoボード",
      description: "社員からのご意見・改善要望の蓄積とタスク化、進捗の可視化",
      icon: "📋",
      href: "/feedback-todo",
      badge: "β版",
      badgeColor: "bg-purple-500/15 text-purple-700 border border-purple-300/60",
      accentGradient: "from-purple-500 to-indigo-600",
      spotlightColor: "rgba(168, 85, 247, 0.18)",
    },
    {
      title: "教育用コンテンツ",
      description: "初心者向けチートシートや Antigravity Academy への案内",
      icon: "✍️",
      href: "/learning",
      badge: "公開中",
      badgeColor: "bg-emerald-500/15 text-emerald-700 border border-emerald-300/60",
      accentGradient: "from-teal-500 to-emerald-600",
      spotlightColor: "rgba(20, 184, 166, 0.18)",
    },
    {
      title: "アイデア宣言ボード",
      description: "AI活用のアイデアを宣言して共創や協力者を募る社内広場",
      icon: "💡",
      href: "/idea-board",
      badge: "β版",
      badgeColor: "bg-amber-500/15 text-amber-700 border border-amber-300/60",
      accentGradient: "from-amber-500 to-orange-600",
      spotlightColor: "rgba(245, 158, 11, 0.18)",
    },
    {
      title: "社内AIアンバサダー",
      description: "各事業部のAI推進リーダー一覧・第1期アンバサダー公募受付",
      icon: "🤝",
      href: "/ambassadors",
      badge: "📋 準備中",
      badgeColor: "bg-slate-200/80 text-slate-700 border border-slate-300/60",
      accentGradient: "from-slate-600 to-slate-800",
      spotlightColor: "rgba(100, 116, 139, 0.18)",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen relative selection:bg-cyan-500 selection:text-white">
      {/* ヒーローバナー（サイバーオーロラ＆デジタルAIツリー） */}
      <HeroBanner
        title="AI Park"
        subtitle="みんなでつくるAI広場 — MightyLINK × Google Antigravity"
        isHome={true}
      />

      {/* メインコンテンツコンテナ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10 flex-1 relative z-10">
        {/* リアルタイムAI活動ティッカー（AIPulseTicker） */}
        <AIPulseTicker />

        {/* 社員フィードバック反映アナウンスバナー（リッチグラスモーフィズム） */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-700/50 p-6 sm:p-7 text-white shadow-xl">
          {/* 背景の光彩 */}
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center space-x-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-blue-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 text-cyan-300 shadow-inner">
                <Sparkles size={24} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/30 tracking-wider uppercase font-mono">
                    NEW FEATURE
                  </span>
                  <span className="text-xs font-semibold text-indigo-200">社員のご意見から進化中</span>
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  社内Chatでいただいたご意見を「改善ToDoボード」として蓄積・自動同期しています
                </h3>
                <p className="text-xs text-slate-300/90 leading-relaxed max-w-2xl">
                  杉村さんからの「シンプル導線」「導入・初級・実践編」や小林さんからのアカウント疑問などをタスク化し、GitHub Issueとリアルタイム連携しています。
                </p>
              </div>
            </div>

            <Link
              href="/feedback-todo"
              className="shrink-0 inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md hover:shadow-cyan-400/25 active:scale-95 self-start sm:self-center"
            >
              <span>改善ToDoボードを見る</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 役割・目的別スマートジャーニー（ExperienceSelector） */}
        <ExperienceSelector />

        {/* はじめての方向け 迷わない3ステップ導線（インフォグラフィック・ジャーニー） */}
        <section className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                  <Compass size={20} />
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
                  はじめての方へ：迷わない社内AI活用 3ステップ
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                「情報が多くてどこから手をつければいいか分からない」というお声に応え、最短で実務に活かせる王道ステップを整理しました。
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-3 py-1 rounded-full self-start sm:self-center shadow-xs">
              最短10分でスタート！
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1: 導入編 */}
            <SpotlightCard
              spotlightColor="rgba(14, 165, 233, 0.15)"
              className="border-sky-200/80 bg-gradient-to-b from-sky-50/50 via-white to-sky-50/20 hover:border-sky-400"
            >
              <Link
                href="/guide"
                className="group flex flex-col justify-between h-full p-6 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-sky-700 bg-sky-100/80 px-2.5 py-0.5 rounded-full border border-sky-300/50">
                      STEP 01
                    </span>
                    <span className="text-xs text-slate-400 font-medium">所要 10分</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 group-hover:text-sky-600 text-base flex items-center space-x-2 transition-colors">
                      <span className="text-xl">🔰</span>
                      <span>AI環境セットアップ</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Google Antigravity のインストールと VS Code / IDE の日本語化。迷わず安全に使える開発環境を最速で構築します。
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
                  <span>導入手順書を見る</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            </SpotlightCard>

            {/* Step 2: 初級編 */}
            <SpotlightCard
              spotlightColor="rgba(245, 158, 11, 0.15)"
              className="border-amber-200/80 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/20 hover:border-amber-400"
            >
              <Link
                href="/learning"
                className="group flex flex-col justify-between h-full p-6 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/50">
                      STEP 02
                    </span>
                    <span className="text-xs text-slate-400 font-medium">初心者・非エンジニア向け</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 group-hover:text-amber-700 text-base flex items-center space-x-2 transition-colors">
                      <span className="text-xl">📖</span>
                      <span>基本プロンプト & 指示法</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Antigravityへの的確な指示出し、ファイル編集の依頼法、エラー解決の基本手順書（チートシート）を習得します。
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
                  <span>基本手順書を見る</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            </SpotlightCard>

            {/* Step 3: 実践編 */}
            <SpotlightCard
              spotlightColor="rgba(99, 102, 241, 0.15)"
              className="border-indigo-200/80 bg-gradient-to-b from-indigo-50/50 via-white to-indigo-50/20 hover:border-indigo-400"
            >
              <Link
                href="/ai-projects"
                className="group flex flex-col justify-between h-full p-6 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-indigo-800 bg-indigo-100/80 px-2.5 py-0.5 rounded-full border border-indigo-300/50">
                      STEP 03
                    </span>
                    <span className="text-xs text-slate-400 font-medium">社内実践事例</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 group-hover:text-indigo-600 text-base flex items-center space-x-2 transition-colors">
                      <span className="text-xl">🏢</span>
                      <span>社内プロジェクト実践</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      各事業部が何のツールでどんな業務改善を行っているかをリアルタイム一覧で確認し、自チームの業務へ横展開します。
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-700 group-hover:text-indigo-800">
                  <span>プロジェクト一覧を見る</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            </SpotlightCard>
          </div>

          {/* Antigravity Academy 特設キーノートバナー（圧倒的クオリティ） */}
          <Link
            href="/academy"
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white border border-indigo-600/50 shadow-lg hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 group"
          >
            {/* 背景のネオングロー */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/30 transition-colors" />

            <div className="relative z-10 flex items-start sm:items-center space-x-4 sm:space-x-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 p-0.5 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center text-2xl backdrop-blur-md">
                  🎓
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 tracking-wide font-mono">
                    RECOMMENDED COURSE
                  </span>
                  <span className="text-xs text-indigo-200">動画全12レッスン ＆ ブラウザ内修了証発行</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Antigravity Academy — 体系的に学ぶ実践チュートリアル
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  基本操作からSubagents並列実行、外部MCP連携、安全な社内AI利用規約までを全3コースで完全網羅。
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0 inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md group-hover:shadow-cyan-400/30 self-start md:self-center">
              <span>Academyを受講する（無料）</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* 注目のサブ導線（ビジネスモデル懸賞 ＆ セキュリティ基準） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <Link
              href="/idea-board"
              className="flex items-center justify-between p-4 bg-slate-50/80 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 rounded-2xl transition-all shadow-2xs group"
            >
              <div className="flex items-center space-x-3.5">
                <span className="text-2xl p-2 bg-amber-100 rounded-xl">💡</span>
                <div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-amber-800 transition-colors">
                    社内AIビジネスモデル提案（懸賞・企画）
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    AIを使った新しい業務改革・事業アイデアの宣言ボード
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
            </Link>

            <Link
              href="/tools-hub"
              className="flex items-center justify-between p-4 bg-slate-50/80 hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 rounded-2xl transition-all shadow-2xs group"
            >
              <div className="flex items-center space-x-3.5">
                <span className="text-2xl p-2 bg-rose-100 rounded-xl">⚠️</span>
                <div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-rose-800 transition-colors">
                    社内AI利用時の注意事項・セキュリティ基準
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    機密情報マスキングルールとLevel 1〜3早見表
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 group-hover:text-rose-600 transition-all" />
            </Link>
          </div>
        </section>

        {/* 1. 「何がしたい？」目的に合わせてページへジャンプ */}
        <PurposeJump />

        {/* 2. サイト内横断検索 */}
        <SiteOmnisearch />

        {/* 3. プロジェクト進捗・ロードマップ案内バナー */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 md:p-7 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 border border-slate-700/60">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-bold">
                ROADMAP
              </span>
              <span className="text-xs text-slate-300 font-semibold">透明性の高い開発推進</span>
            </div>
            <h3 className="font-black text-base md:text-lg text-white tracking-tight">
              準備中機能の実装スケジュール & 開発ロードマップ
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              事実確認・実データ連携が完了していない機能の公式公開日と、クリアすべき条件をすべて公開しています。
            </p>
          </div>
          <Link
            href="/roadmap"
            className="shrink-0 inline-flex items-center space-x-2 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black rounded-xl text-xs transition-colors shadow-sm self-start md:self-center"
          >
            <span>開発ロードマップを見る</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4. メインナビゲーションカードグリッド（8大機能カード / SpotlightCard適用） */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2 tracking-tight">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>おすすめ・主要コンテンツ</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickLinks.map((item) => (
              <SpotlightCard
                key={item.href}
                spotlightColor={item.spotlightColor}
                className="hover:border-indigo-400/80"
              >
                <Link
                  href={item.href}
                  className="group relative flex flex-col justify-between h-full p-6 space-y-4"
                >
                  {/* ホバー時の上部アクセントライン */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-2xs">
                        {item.icon}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors text-base leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                    <span>詳しく見る</span>
                    <ArrowRight
                      size={14}
                      className="ml-1 group-hover:translate-x-1.5 transition-transform"
                    />
                  </div>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* 5. ウェルカム・ミッションステートメント */}
        <section className="bg-gradient-to-br from-white via-indigo-50/20 to-sky-50/30 border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl space-y-3.5 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI推進担当（担当：梅澤）より</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              コードを書くだけの時代から、<br className="hidden sm:inline" />AIエージェントと共創する開発へ。
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              AI Parkは、MightyLINK社員のための社内AI活用・エージェント共創ポータルです。
              Google Antigravity の社内導入支援、実践Academy、現場インタビュー、そして社内アンバサダーネットワークを通じて、全社員のAI実践を全力でサポートします。
            </p>
          </div>
          <div className="absolute right-6 -bottom-8 opacity-10 pointer-events-none hidden md:block">
            <Bot size={240} className="text-blue-900" />
          </div>
        </section>

        {/* 6. なぜ Antigravity なのか？ 3つの強み */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2 tracking-tight">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>なぜ Google Antigravity なのか？ 3つの革新性</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SpotlightCard
              spotlightColor="rgba(59, 130, 246, 0.16)"
              className="bg-white border-slate-200/90"
            >
              <div className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-2xs border border-blue-100">
                  <Boxes size={22} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">自律型Subagentsの並列協調</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  単一プロンプトにとどまらず、リサーチ・設計・テスト生成など専門役割を持つサブエージェントを自律的に並列実行できます。
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.16)"
              className="bg-white border-slate-200/90"
            >
              <div className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-2xs border border-emerald-100">
                  <Terminal size={22} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">Skills & Rules による社内統制</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  破壊的コマンド実行防止や独自のコーディング規約を `SKILL.md` や `RULE` として定義し、社内標準をAIに確実に遵守させます。
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(168, 85, 247, 0.16)"
              className="bg-white border-slate-200/90"
            >
              <div className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-2xs border border-purple-100">
                  <Plug size={22} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">オープン標準 MCP ツール連携</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  社内データベース、GitHub、ブラウザテストツールを直結し、エージェントが必要な外部ツールを自律的に呼び出せます。
                </p>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* 7. サポート & Office Hour 相談窓口 */}
        <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden border border-blue-900/60">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 inline-block">
              AI推進担当 サポートデスク
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI導入の疑問や自チームへの適用相談をお待ちしています
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              「自チームの業務にエージェントを組み込みたい」「カスタムSkillsの作り方を教えてほしい」など、AI推進担当（担当：梅澤）が毎週水曜のOffice Hourで個別に対応します。
            </p>
            <div className="pt-2">
              <Link
                href="/antigravity-info"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95"
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
