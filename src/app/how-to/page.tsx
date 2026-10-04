"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Bot,
  FileText,
  Mic,
  Cloud,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Terminal,
  GraduationCap,
  Wrench,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";

export default function HowToPage() {
  const mainHubCards = [
    {
      id: "tools",
      title: "AIツール一覧",
      desc: "社内で使えるAIツールの情報を知りたい方はこちら！",
      icon: <Bot className="text-sky-600" size={32} />,
      iconBg: "bg-sky-50 border-sky-100",
      href: "/tools",
      badge: "AIツール一覧",
      badgeColor: "bg-sky-100 text-sky-700",
      tags: ["ツール一覧", "セキュリティLevel 1-3"],
      highlights: "AIツールの一覧と、扱ってよいデータの基準（Level 1〜3）",
    },
    {
      id: "academy",
      title: "Antigravity Academy",
      desc: "動画と実践でAntigravityを体系的に学びたい方はこちら！",
      icon: <GraduationCap className="text-indigo-600" size={32} />,
      iconBg: "bg-indigo-50 border-indigo-100",
      href: "/academy",
      badge: "おすすめ・β版",
      badgeColor: "bg-indigo-100 text-indigo-800",
      tags: ["全12レッスン", "動画解説", "評価テスト", "修了証"],
      highlights: "Claude Academy スタイルの動画付き実践チュートリアルと修了証発行",
    },
    {
      id: "learning",
      title: "教育用コンテンツ",
      desc: "初級編チートシートや基礎知識を学びたい方はこちら！",
      icon: <FileText className="text-amber-600" size={32} />,
      iconBg: "bg-amber-50 border-amber-100",
      href: "/learning",
      badge: "基礎チートシート",
      tags: ["プロンプト集", "穴埋めコピー", "安全ルール", "チートシート"],
      highlights: "穴埋め入力ですぐ動く実務プロンプト集、安全利用ルール早見表、頼み方チートシート",
    },
    {
      id: "interviews",
      title: "AI活用インタビュー",
      desc: "他部署の活用事例が知りたい方はこちら！",
      icon: <Mic className="text-indigo-600" size={32} />,
      iconBg: "bg-indigo-50 border-indigo-100",
      href: "/interviews",
      badge: "📋 準備中",
      badgeColor: "bg-indigo-100 text-indigo-700",
      tags: ["取材立候補", "準備中"],
      highlights: "社内のAI活用事例の取材記事（準備中。取材の立候補を受付中）",
    },
    {
      id: "aws-info",
      title: "AWS・クラウド情報局",
      desc: "クラウド・生成AI基盤の最新技術情報や活用Tipsはこちらから！",
      icon: <Cloud className="text-cyan-600" size={32} />,
      iconBg: "bg-cyan-50 border-cyan-100",
      href: "/aws-info",
      badge: "🚧 工事中",
      badgeColor: "bg-cyan-100 text-cyan-700",
      tags: ["準備中"],
      highlights: "社内での AWS・クラウド活用の情報（準備中）",
    },
    {
      id: "skills-hub",
      title: "社内Skillsカタログ",
      desc: "実務効率化の切り札！Antigravity認定Skillsの検索と新規申請はこちら！",
      icon: <Wrench className="text-purple-600" size={32} />,
      iconBg: "bg-purple-50 border-purple-100",
      href: "/skills-hub",
      badge: "✅ 認定公開中",
      badgeColor: "bg-purple-100 text-purple-700 font-bold",
      tags: ["認定Skills", "申請モーダル", "業務自動化"],
      highlights: "社内で共有する認定 Skills カタログ（全8スキル・プロンプト即時コピー・申請フォーム完備）",
    },
    {
      id: "troubleshooting",
      title: "Windowsトラブル解決",
      desc: "PowerShell実行ポリシーやGit認証・Node環境のエラーを即時自己解決！",
      icon: <AlertTriangle className="text-rose-600" size={32} />,
      iconBg: "bg-rose-50 border-rose-100",
      href: "/troubleshooting",
      badge: "自己解決FAQ",
      badgeColor: "bg-rose-100 text-rose-700 font-bold",
      tags: ["PowerShell", "Git認証", "Node.js", "ワンクリックコピー"],
      highlights: "Windows開発環境で発生しやすいエラーの対処コマンド集と事前チェック",
    },
    {
      id: "gemini-stats",
      title: "Gemini利用統計 & SKU",
      desc: "社内でのGemini活用状況、SKU別料金・モデル仕様の可視化ダッシュボード！",
      icon: <BarChart3 className="text-emerald-600" size={32} />,
      iconBg: "bg-emerald-50 border-emerald-100",
      href: "/gemini-stats",
      badge: "利用統計・可視化",
      badgeColor: "bg-emerald-100 text-emerald-700 font-bold",
      tags: ["利用統計", "SKU・料金", "モデル比較"],
      highlights: "社内利用トレンドのグラフ分析とGemini 3.1 Pro/Flashのスペック早見表",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "社内で使えるツールを確認",
      desc: "まずは「AIツール一覧」で業務に使える公認ツールとデータ取り扱いルールを確認します。",
      linkText: "AIツール一覧を見る",
      href: "/tools",
    },
    {
      step: "02",
      title: "基礎知識とプロンプトを学ぶ",
      desc: "「教育用コンテンツ」や「プロンプト逆引きガイド」で効果的な指示の出し方を習得します。",
      linkText: "教育用コンテンツを見る",
      href: "/learning",
    },
    {
      step: "03",
      title: "他部署の事例を自分の業務に応用",
      desc: "「AI活用インタビュー」や「Subagents活用事例」を参考に、自分のタスクの自動化に挑戦しましょう。",
      linkText: "活用インタビューを見る",
      href: "/interviews",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      {/* 参考サイト風 ブルーヘッダー領域 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-sky-950 to-indigo-950 text-white shadow-md border-b border-sky-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 relative z-10">
          {/* ホームに戻るリンク */}
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-sky-200 hover:text-white mb-6 group transition-colors"
          >
            <ArrowLeft
              size={14}
              className="mr-1.5 transition-transform group-hover:-translate-x-1"
            />
            AI Park ホームに戻る
          </Link>

          {/* 📖 タイトルバッジ */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 backdrop-blur-md flex items-center justify-center border border-sky-400/30 shadow-inner text-cyan-300">
              <BookOpen size={30} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                使い方・学び
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-1 font-light">
                社内で使えるAIツールの基本操作から実務活用、他部署事例まで体系的に学べるナレッジハブ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ領域 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-12">
        {/* 4大ナレッジカード（参考サイト準拠） */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="text-sky-500" size={20} />
              ナレッジ・コンテンツ一覧
            </h2>
            <span className="text-xs text-slate-500 font-mono">Select any module to begin</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {mainHubCards.map((card) => (
              <TiltCard
                key={card.id}
                maxTilt={4}
                glareOpacity={0.08}
                className="rounded-2xl"
              >
                <SpotlightCard
                  spotlightColor="rgba(14, 165, 233, 0.14)"
                  className="bg-white border-slate-200/90 rounded-2xl"
                >
                  <Link
                    href={card.href}
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="group block p-6 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center space-x-4">
                        {/* アイコン */}
                        <div
                          className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform ${card.iconBg}`}
                        >
                          {card.icon}
                        </div>

                        {/* タイトルと説明 */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors tracking-tight">
                              {card.title}
                            </h3>
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${card.badgeColor}`}
                            >
                              {card.badge}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium">
                            {card.desc}
                          </p>
                          <p className="text-xs text-slate-400 hidden sm:block">
                            {card.highlights}
                          </p>
                        </div>
                      </div>

                      {/* 右側アクション */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="flex flex-wrap gap-1.5">
                          {card.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[11px] bg-slate-100 font-mono text-slate-600 px-2.5 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </SpotlightCard>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* 初めての方におすすめのステップ */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-1 tracking-tight">
              <CheckCircle2 className="text-emerald-500" size={22} />
              はじめての社内AI活用 3ステップ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              社内で生成AIを実務に導入する際の標準的な学習・ステップアップ手順です。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((item, idx) => (
              <TiltCard
                key={idx}
                maxTilt={6}
                glareOpacity={0.12}
                className="h-full rounded-2xl"
              >
                <SpotlightCard
                  spotlightColor="rgba(14, 165, 233, 0.15)"
                  className="bg-slate-50/70 border-slate-200/80 h-full rounded-2xl"
                >
                  <div className="p-5 flex flex-col justify-between h-full">
                    <div className="space-y-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 inline-block">
                        {item.step}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/80">
                      <Link
                        href={item.href}
                        onClick={() => playCyberClick()}
                        onMouseEnter={() => playCyberHover()}
                        className="inline-flex items-center text-xs font-bold text-sky-600 hover:text-sky-700 group/lnk cursor-pointer"
                      >
                        <span>{item.linkText}</span>
                        <ChevronRight size={14} className="ml-1 group-hover/lnk:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* クイックツール・ガイドへの直接アクセス */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-3xl">
          <section
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/40"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-400/30">
                  <Lightbulb size={14} />
                  <span>開発者 & 実務者向け便利リンク</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  日々の開発・業務を加速するリソース集
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  導入ガイド・社内Skillsカタログ（準備中）・Antigravity情報局（準備中）へのショートカットです。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 shrink-0">
                <Link
                  href="/guide#troubleshooting-board"
                  onClick={() => playCyberClick()}
                  onMouseEnter={() => playCyberHover()}
                  className="flex items-center justify-between gap-3 px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 rounded-2xl text-xs font-bold text-amber-200 transition-all group/q active:scale-95 shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <Terminal size={16} className="text-amber-300" />
                    Windows エラー解決早見表
                  </span>
                  <ChevronRight size={14} className="text-amber-400 group-hover/q:text-white group-hover/q:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/guide"
                  onClick={() => playCyberClick()}
                  onMouseEnter={() => playCyberHover()}
                  className="flex items-center justify-between gap-3 px-4 py-3 bg-white/5 hover:bg-white/15 border border-white/10 rounded-2xl text-xs font-bold text-white transition-all group/q active:scale-95 shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={16} className="text-sky-300" />
                    Antigravity 導入ガイド
                  </span>
                  <ChevronRight size={14} className="text-slate-400 group-hover/q:text-white group-hover/q:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/skills-hub"
                  onClick={() => playCyberClick()}
                  onMouseEnter={() => playCyberHover()}
                  className="flex items-center justify-between gap-3 px-4 py-3 bg-white/5 hover:bg-white/15 border border-white/10 rounded-2xl text-xs font-bold text-white transition-all group/q active:scale-95 shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <Terminal size={16} className="text-emerald-300" />
                    社内Skillsカタログ
                  </span>
                  <ChevronRight size={14} className="text-slate-400 group-hover/q:text-white group-hover/q:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/antigravity-info"
                  onClick={() => playCyberClick()}
                  onMouseEnter={() => playCyberHover()}
                  className="flex items-center justify-between gap-3 px-4 py-3 bg-white/5 hover:bg-white/15 border border-white/10 rounded-2xl text-xs font-bold text-white transition-all group/q active:scale-95 shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <Cloud size={16} className="text-cyan-300" />
                    Antigravity社内情報局
                  </span>
                  <ChevronRight size={14} className="text-slate-400 group-hover/q:text-white group-hover/q:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/contact"
                  onClick={() => playCyberClick()}
                  onMouseEnter={() => playCyberHover()}
                  className="flex items-center justify-between gap-3 px-4 py-3 bg-white/5 hover:bg-white/15 border border-white/10 rounded-2xl text-xs font-bold text-white transition-all group/q active:scale-95 shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle size={16} className="text-amber-300" />
                    AI推進担当へのお問い合わせ
                  </span>
                  <ChevronRight size={14} className="text-slate-400 group-hover/q:text-white group-hover/q:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        </TiltCard>
      </div>
    </div>
  );
}
