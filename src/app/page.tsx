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
  ChevronRight,
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

      {/* メインコンテンツエリア */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
        {/* 社員フィードバック反映アナウンスバナー */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 border border-indigo-700/60 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center shrink-0 text-indigo-300 shadow-inner">
              <Sparkles size={20} />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/30">
                  新機能
                </span>
                <span className="text-xs font-semibold text-indigo-200">社員のご意見から改善中</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                社内Chatでいただいたご意見を「改善ToDoボード」として蓄積・反映しています
              </h3>
              <p className="text-xs text-slate-300">
                杉村さんからの「シンプル導線」「導入・初級・実践編」や小林さんからのアカウント疑問などをタスク化しました。
              </p>
            </div>
          </div>
          <Link
            href="/feedback-todo"
            className="shrink-0 inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-xs transition-colors shadow-xs self-start sm:self-center"
          >
            <span>ご意見・改善ToDoを見る</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 杉村さんのご意見を反映：はじめての方向け 迷わない3ステップ導線 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🌱</span>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  はじめての方へ：迷わない社内AI活用 3ステップ
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                「情報が多くて迷子になりそう」というお声に応え、最短で実務に活かせるステップを整理しました。
              </p>
            </div>
            <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full self-start sm:self-center">
              まずはここから！
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: 導入編 */}
            <Link
              href="/guide"
              className="group p-5 rounded-xl border border-sky-200 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-sky-600 bg-white px-2 py-0.5 rounded border border-sky-200">
                    Step 01
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">所要 10分</span>
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-sky-700 text-base flex items-center space-x-1.5">
                  <span>🔰 AI導入編</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Antigravityのインストールと、VS Code / IDEの日本語化設定手順。迷わず使える環境をセットアップします。
                </p>
              </div>
              <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs font-bold text-sky-600">
                <span>導入手順書を見る</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Step 2: 初級編 */}
            <Link
              href="/learning"
              className="group p-5 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                    Step 02
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">初心者向け</span>
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-amber-800 text-base flex items-center space-x-1.5">
                  <span>📖 AI初級編</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Antigravityの基本的なプロンプト指示、ファイル編集の依頼法、エラー解決の基本手順書（チートシート）。
                </p>
              </div>
              <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>基本手順書を見る</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Step 3: 実践編 */}
            <Link
              href="/ai-projects"
              className="group p-5 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                    Step 03
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">社内事例</span>
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-purple-800 text-base flex items-center space-x-1.5">
                  <span>🏢 AI実践編</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  社内のAI関連プロジェクトの最新状況（どの部署が何のツールで何をしているか）を一覧で確認できます。
                </p>
              </div>
              <div className="pt-3 border-t border-purple-100 flex items-center justify-between text-xs font-bold text-purple-700">
                <span>社内プロジェクト・事例を見る</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* 注目のサブ導線（ビジネスモデル懸賞 ＆ 注意事項） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/idea-board"
              className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">💡</span>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">
                    社内AIビジネスモデル提案（懸賞・企画）
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    AIを使った新しい業務改革・事業アイデアの宣言ボード
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Link>

            <Link
              href="/tools-hub"
              className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 rounded-xl transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">
                    社内AI利用時の注意事項・セキュリティ基準
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    機密情報マスキングルールとLevel 1〜3早見表
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Link>
          </div>
        </section>

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
