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
} from "lucide-react";

export default function HowToPage() {
  const mainHubCards = [
    {
      id: "tools",
      title: "AIツール一覧",
      desc: "社内で使えるAIツールの情報を知りたい方はこちら！",
      icon: <Bot className="text-sky-600" size={32} />,
      iconBg: "bg-sky-50 border-sky-100",
      href: "/tools",
      badge: "公認ツールカタログ",
      badgeColor: "bg-sky-100 text-sky-700",
      tags: ["利用可否判定", "セキュリティLevel 1-3", "ライセンス申請"],
      highlights: "Gemini Enterprise、Antigravity、Claude 3.5 Sonnet などの利用基準とスペック一覧",
    },
    {
      id: "learning",
      title: "教育用コンテンツ",
      desc: "AIについて学びたい方はこちら！",
      icon: <FileText className="text-amber-600" size={32} />,
      iconBg: "bg-amber-50 border-amber-100",
      href: "/learning",
      badge: "体系的カリキュラム",
      badgeColor: "bg-amber-100 text-amber-800",
      tags: ["動画・スライド", "初級〜上級", "勉強会アーカイブ"],
      highlights: "全5回オンデマンド講義、過去の全社勉強会動画アーカイブ、出張勉強会の相談窓口",
    },
    {
      id: "interviews",
      title: "AI活用インタビュー",
      desc: "他部署の活用事例が知りたい方はこちら！",
      icon: <Mic className="text-indigo-600" size={32} />,
      iconBg: "bg-indigo-50 border-indigo-100",
      href: "/interviews",
      badge: "現場の生の声",
      badgeColor: "bg-indigo-100 text-indigo-700",
      tags: ["定量削減効果", "インフラ/QA/情シス", "取材立候補"],
      highlights: "現場エンジニアやバックオフィスによるリアルな導入成果とプロンプト工夫の連載",
    },
    {
      id: "aws-info",
      title: "AWS・クラウド情報局",
      desc: "クラウド・生成AI基盤の最新技術情報や活用Tipsはこちらから！",
      icon: <Cloud className="text-cyan-600" size={32} />,
      iconBg: "bg-cyan-50 border-cyan-100",
      href: "/aws-info",
      badge: "技術ナレッジ",
      badgeColor: "bg-cyan-100 text-cyan-700",
      tags: ["AWS & Google Cloud", "アーキテクチャ", "ベストプラクティス"],
      highlights: "クラウドネイティブAIアーキテクチャ、セキュリティ設計、最新アップデート解説",
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
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* 参考サイト風 ブルーヘッダー領域 */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          {/* ホームに戻るリンク */}
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-sky-100 hover:text-white mb-6 group transition-colors"
          >
            <ArrowLeft
              size={14}
              className="mr-1.5 transition-transform group-hover:-translate-x-1"
            />
            AI Park ホームに戻る
          </Link>

          {/* 📖 タイトルバッジ */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <BookOpen className="text-white" size={30} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                使い方・学び
              </h1>
              <p className="text-sm sm:text-base text-sky-100 mt-1 font-medium">
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
            <span className="text-xs text-slate-500">目的のカードをクリックして移動</span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {mainHubCards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="group block bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-4">
                    {/* アイコン */}
                    <div
                      className={`w-14 h-14 rounded-xl border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform ${card.iconBg}`}
                    >
                      {card.icon}
                    </div>

                    {/* タイトルと説明 */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                          {card.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${card.badgeColor}`}
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
                          className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
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
            ))}
          </div>
        </section>

        {/* 初めての方におすすめのステップ */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
            <CheckCircle2 className="text-emerald-500" size={22} />
            はじめての社内AI活用 3ステップ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6">
            社内で生成AIを実務に導入する際の標準的な学習・ステップアップ手順です。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-2xl font-extrabold text-sky-500/80 block">
                    {item.step}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-700"
                  >
                    {item.linkText}
                    <ChevronRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* クイックツール・ガイドへの直接アクセス */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 text-xs font-semibold">
                <Lightbulb size={14} />
                開発者 & 実務者向け便利リンク
              </div>
              <h3 className="text-xl font-bold">
                日々の開発・業務を加速するリソース集
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Antigravityの社内環境接続情報やプロンプト逆引き、Subagents用Skillsカタログへのショートカットです。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
              <Link
                href="/guide"
                className="flex items-center justify-between gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText size={15} className="text-sky-300" />
                  プロンプト逆引きガイド
                </span>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>

              <Link
                href="/skills-hub"
                className="flex items-center justify-between gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Terminal size={15} className="text-emerald-300" />
                  社内Skillsカタログ
                </span>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>

              <Link
                href="/antigravity-info"
                className="flex items-center justify-between gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Cloud size={15} className="text-cyan-300" />
                  Antigravity社内情報局
                </span>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>

              <Link
                href="/contact"
                className="flex items-center justify-between gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle size={15} className="text-amber-300" />
                  AI推進担当へのお問い合わせ
                </span>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
