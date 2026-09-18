"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Lightbulb,
  Cpu,
  BarChart3,
  Sparkles,
  Layers,
  ArrowRight,
  Calendar,
  TrendingUp,
} from "lucide-react";

export default function AgentToolsHubPage() {
  const hubCards = [
    {
      id: "idea-board",
      title: "アイデア宣言ボード",
      desc: "AIエージェントの宣言をしたい方はこちら！",
      detail:
        "「こんな作業を自動化したい」「この業務のAgentを開発中」など、アイデアや現場の課題を気軽に宣言し、共同開発メンバーやメンターを募る社内掲示板です。",
      icon: Lightbulb,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50 border-amber-200",
      href: "/idea-board",
      badge: "β版運用中",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      statusType: "active",
      tags: ["#アイデア起票", "#メンバー募集", "#CoEフィードバック"],
    },
    {
      id: "agent-cases",
      title: "AI Agent Case (Subagents活用事例)",
      desc: "完成済みのエージェントを見るにはこちらから！",
      detail:
        "Antigravity Subagentsを活用した並列フロントエンド自動テスト、障害ログ自動解析、CIコードレビューなど、社内で実際に稼働している自律エージェントの構成と定量効果を紹介。",
      icon: Cpu,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-200",
      href: "/agent-cases",
      badge: "🧪 PoC中 (2026年10月30日正式公開)",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      statusType: "poc",
      tags: ["#Antigravity", "#並列サブエージェント", "#業務自動化"],
    },
    {
      id: "adoption",
      title: "社内活用状況",
      desc: "各部のAI活用状況を知りたいときはこちら！",
      detail:
        "事業部ごとのAIツール利用浸透率、月間業務工数の削減時間（ROI）、現場での主なユースケース内訳をリアルタイムに可視化・分析します。",
      icon: BarChart3,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50 border-sky-200",
      href: "/adoption",
      badge: "🧪 PoC中 (2026年11月13日正式公開)",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      statusType: "poc",
      tags: ["#部門別利用率", "#工数削減ROI", "#活用アンケート"],
    },
    {
      id: "gemini-stats",
      title: "Gemini利用率 (利用状況ダッシュボード)",
      desc: "全社Gemini・生成AIの利用推移とアクティブ数はこちら！",
      detail:
        "BigQueryログパイプラインと連携し、日次・月次の全社アクティブユーザー数（MAU/DAU）、トークン消費トレンド、利用頻度推移を集計表示します。",
      icon: TrendingUp,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-200",
      href: "/gemini-stats",
      badge: "🚧 工事中 (2026年11月20日正式公開)",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      statusType: "construction",
      tags: ["#BigQueryログ", "#MAU集計", "#トークン推移"],
    },
    {
      id: "tools-hub",
      title: "AI Tool Hub",
      desc: "便利なGemやNotebookが知りたいときはこちら！",
      detail:
        "社内公認のGem、業務特化型Notebook、自作プロンプト・Skillsを検索し、ワンクリックで利用申請・即時共有できる社内AIツールマーケットプレイスです。",
      icon: Sparkles,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-50 border-cyan-200",
      href: "/tools-hub",
      badge: "🚧 工事中 (2026年11月27日正式公開)",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      statusType: "construction",
      tags: ["#社内Gem", "#Notebook", "#即時利用申請"],
    },
  ];

  const steps = [
    {
      num: "01",
      title: "アイデアを宣言する",
      desc: "「アイデア宣言ボード」に現場の課題や自動化したい業務を投稿。CoEや他部署からのアドバイス・協力者を募ります。",
      linkText: "アイデア宣言ボードへ",
      href: "/idea-board",
    },
    {
      num: "02",
      title: "先行事例を参考に開発・PoC",
      desc: "「AI Agent Case」や「AI Tool Hub」から社内の既存エージェント設計やプロンプトを活用し、迅速にプロトタイプを構築します。",
      linkText: "Agent Caseを見る",
      href: "/agent-cases",
    },
    {
      num: "03",
      title: "効果を測定し全社へ共有",
      desc: "「社内活用状況」で月間削減工数やROIを可視化。社内インタビューなどを通じて成功ノウハウを全社に還元します。",
      linkText: "活用状況を見る",
      href: "/adoption",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* 1. 参考サイト風 オーシャンブルー・ヘッダー */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          {/* ホームに戻るリンク */}
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs text-sky-100 hover:text-white transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>AI Park ホームに戻る</span>
          </Link>

          {/* タイトルエリア */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-3xl sm:text-4xl shadow-md shrink-0">
              🤖
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wide mb-1 border border-white/20">
                Agent & Tools Portal
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                エージェント・ツール
              </h1>
              <p className="text-xs sm:text-sm text-sky-100 mt-1 font-medium max-w-xl">
                自律型AIエージェントの開発宣言から、社内実稼働事例、活用状況ダッシュボードまでをワンストップで俯瞰する総合ハブ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. メインコンテンツエリア */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ======================================================== */}
        {/* ハブカード一覧（参考サイトの1カラム縦型カード完全再現） */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                エージェント・ツール一覧
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              目的のカードをクリックして各機能へアクセス
            </span>
          </div>

          <div className="space-y-4">
            {hubCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="block bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all group relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      {/* アイコンバッジ */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs group-hover:scale-105 transition-transform ${card.iconBg}`}
                      >
                        <Icon className={`w-6 h-6 ${card.iconColor}`} />
                      </div>

                      {/* テキスト情報 */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                            {card.title}
                          </h3>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}
                          >
                            {card.badge}
                          </span>
                        </div>

                        {/* 参考サイト完全再現のキャッチコピー */}
                        <p className="text-xs sm:text-sm font-semibold text-slate-700">
                          {card.desc}
                        </p>

                        {/* 詳細説明 */}
                        <p className="text-xs text-slate-500 leading-relaxed pt-0.5">
                          {card.detail}
                        </p>

                        {/* タグ一覧 */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          {card.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 矢印アイコン */}
                    <div className="shrink-0 self-end sm:self-center">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-sky-500 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* エージェント活用の3ステップガイド */}
        {/* ======================================================== */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold tracking-widest uppercase text-sky-400 font-mono">
                How to leverage agents
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                自律型エージェント活用の3ステップ
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                個人のちょっとした業務自動化から、チーム・全社展開までをスムーズに進めるための推進サイクル
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {steps.map((st) => (
                <div
                  key={st.num}
                  className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 transition-colors"
                >
                  <div className="space-y-2">
                    <span className="text-2xl font-black text-sky-400 font-mono">
                      {st.num}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {st.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                  <Link
                    href={st.href}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-sky-300 hover:text-white transition-colors pt-2 border-t border-white/10"
                  >
                    <span>{st.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 開発ロードマップ連携バナー */}
        {/* ======================================================== */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <h4 className="text-sm font-bold text-slate-900">
                PoC中・工事中機能の正式稼働スケジュール
              </h4>
            </div>
            <p className="text-xs text-slate-500">
              各機能の解除条件・本番データ連携予定日は「開発ロードマップ」にて具体的に公開されています。
            </p>
          </div>
          <Link
            href="/roadmap"
            className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold transition-colors inline-flex items-center space-x-1.5"
          >
            <span>開発ロードマップを確認する</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
