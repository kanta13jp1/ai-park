"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Terminal,
  Trophy,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  MessageSquare,
  Cpu,
  Layers,
  Lightbulb,
} from "lucide-react";

interface PersonaMode {
  id: "beginner" | "business" | "engineer" | "leader";
  label: string;
  sublabel: string;
  icon: any;
  accent: string;
  badgeColor: string;
  recommendations: {
    title: string;
    description: string;
    href: string;
    icon: any;
    tag: string;
  }[];
}

const personaModes: PersonaMode[] = [
  {
    id: "beginner",
    label: "はじめてのAI",
    sublabel: "まずは触って基礎を学びたい方",
    icon: GraduationCap,
    accent: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-300",
    recommendations: [
      {
        title: "Antigravity Academy",
        description: "全12レッスンで基礎から学べる！動画解説・確認テスト・修了証発行に対応",
        href: "/academy",
        icon: BookOpen,
        tag: "必見コース",
      },
      {
        title: "初心者向けチートシート",
        description: "これだけ覚えれば安心。プロンプトの基本骨子や安全なAI利用の心得",
        href: "/learning",
        icon: Sparkles,
        tag: "クイック入門",
      },
      {
        title: "AI相談窓口・Office Hour",
        description: "「何から始めればいいかわからない」という疑問も専門メンバーが直接サポート",
        href: "/contact",
        icon: MessageSquare,
        tag: "サポート",
      },
    ],
  },
  {
    id: "business",
    label: "業務効率化・ビジネス",
    sublabel: "日々の定常作業や文書作成を加速",
    icon: Briefcase,
    accent: "from-blue-600 to-cyan-600",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-300",
    recommendations: [
      {
        title: "社内AIプロジェクト一覧",
        description: "他部署がどのような課題をAIで解決しているか、実践事例と効果を確認",
        href: "/ai-projects",
        icon: Trophy,
        tag: "社内事例",
      },
      {
        title: "AI Park カレンダー",
        description: "社内勉強会、ハンズオンセミナー、Office Hourの開催日程をチェック",
        href: "/calendar",
        icon: Calendar,
        tag: "イベント",
      },
      {
        title: "ご意見・改善ToDoボード",
        description: "現場の「ここが不便」「こうしてほしい」を投稿して自動でタスク化",
        href: "/feedback-todo",
        icon: Lightbulb,
        tag: "フィードバック",
      },
    ],
  },
  {
    id: "engineer",
    label: "開発者・エージェント",
    sublabel: "Antigravity IDE / agy CLI / 自動化",
    icon: Terminal,
    accent: "from-purple-600 to-indigo-600",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-300",
    recommendations: [
      {
        title: "Antigravity 導入ガイド",
        description: "VS Code / JetBrains 拡張機能、CLI (agy)、Gemini 3.1 Pro プレビューの導入手順",
        href: "/guide",
        icon: Terminal,
        tag: "開発環境",
      },
      {
        title: "社内Skillsカタログ",
        description: "社内標準の Skill.md テンプレートや自動テスト・品質検証スキルの共有",
        href: "/skills-hub",
        icon: Layers,
        tag: "🚧 工事中",
      },
      {
        title: "MCP外部ツール連携ガイド",
        description: "Model Context Protocol を使ったDB・API・外部サービスとの安全な接続",
        href: "/mcp-hub",
        icon: Cpu,
        tag: "🚧 工事中",
      },
    ],
  },
  {
    id: "leader",
    label: "推進・マネジメント",
    sublabel: "組織のAI定着とガバナンス推進",
    icon: Trophy,
    accent: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-300",
    recommendations: [
      {
        title: "アイデア宣言ボード",
        description: "社内のAI事業創出・業務変革アイデアを収集し、共創チームを結成",
        href: "/idea-board",
        icon: Lightbulb,
        tag: "共創プラットフォーム",
      },
      {
        title: "社内AIアンバサダー",
        description: "各部署でAI活用をリードするアンバサダーの選出・コミュニティ運営",
        href: "/ambassadors",
        icon: Trophy,
        tag: "📋 準備中",
      },
      {
        title: "全社AI活用状況・KPI",
        description: "部署ごとの活用率・時間削減効果のシミュレーションとモニタリング",
        href: "/adoption",
        icon: Layers,
        tag: "🚧 工事中",
      },
    ],
  },
];

export default function ExperienceSelector() {
  const [activeTab, setActiveTab] = useState<PersonaMode["id"]>("beginner");

  const currentMode = personaModes.find((m) => m.id === activeTab)!;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
      {/* 繊細なアンビエント背景 */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/5 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ヘッダー部 */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-wide uppercase font-mono mb-2">
            <Sparkles size={12} className="text-indigo-600" />
            <span>Personalized Journey</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            あなたに最適なAI活用ジャーニー
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            役割や目的に応じたおすすめルートを選択してください。
          </p>
        </div>

        {/* タブナビゲーション */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
          {personaModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeTab === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => setActiveTab(mode.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 select-none ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm shadow-slate-200 border border-slate-200/60 scale-[1.02]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Icon size={14} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* コンテンツカードグリッド */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentMode.recommendations.map((item, idx) => {
          const Icon = item.icon;

          return (
            <Link
              key={idx}
              href={item.href}
              className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentMode.accent} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentMode.badgeColor}`}
                  >
                    {item.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                <span>詳しく見る</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
