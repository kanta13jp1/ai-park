"use client";

import Link from "next/link";
import { useState } from "react";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import {
  Rocket,
  BookOpen,
  Bot,
  MessageCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  LucideIcon,
} from "lucide-react";

interface JumpSection {
  id: "learning" | "agents" | "community";
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  borderColor: string;
  bgActive: string;
  items: {
    name: string;
    href: string;
    desc: string;
    badge?: string;
  }[];
}

const jumpSections: JumpSection[] = [
  {
    id: "learning",
    title: "使い方・学び",
    subtitle: "ツールの使い方や活用スキルを学びたい",
    icon: BookOpen,
    color: "text-blue-600",
    borderColor: "border-blue-200 hover:border-blue-400",
    bgActive: "bg-blue-50/60 border-blue-500",
    items: [
      { name: "Antigravity Academy", href: "/academy", desc: "動画と実践で学ぶ全12レッスン・修了テスト", badge: "おすすめ" },
      { name: "使い方・学び 総合ハブ", href: "/how-to", desc: "ツール・教育・インタビュー・クラウドの全体ポータル", badge: "総合" },
      { name: "社内Skillsカタログ", href: "/skills-hub", desc: "実務効率化の切り札！Antigravity認定Skills一覧（全8種）", badge: "✅ 認定公開" },
      { name: "Windowsトラブル解決", href: "/troubleshooting", desc: "PowerShell・Git・Node環境の自己解決コマンド集", badge: "FAQ" },
      { name: "AIツール一覧", href: "/tools", desc: "AIツールの一覧（社内マスターシートの内容・確認中）", badge: "🧪 PoC中" },
      { name: "教育用コンテンツ", href: "/learning", desc: "初級編チートシート・Academy への案内" },
      { name: "AI活用インタビュー", href: "/interviews", desc: "社内のAI活用事例の取材記事（取材の立候補を受付中）", badge: "📋 準備中" },
      { name: "AWS・クラウド情報局", href: "/aws-info", desc: "社内での AWS・クラウド活用の情報", badge: "🚧 工事中" },
      { name: "Antigravity導入ガイド", href: "/guide", desc: "IDE / CLI セットアップとスラッシュコマンド" },
    ],
  },
  {
    id: "agents",
    title: "エージェント・ツール",
    subtitle: "業務を自動化するAIツールを探したい・使いたい",
    icon: Bot,
    color: "text-purple-600",
    borderColor: "border-purple-200 hover:border-purple-400",
    bgActive: "bg-purple-50/60 border-purple-500",
    items: [
      { name: "社内AIプロジェクト一覧", href: "/ai-projects", desc: "各部署の実践事例・進捗可視化・自動掲載", badge: "新着" },
      { name: "Gemini利用統計 & SKU", href: "/gemini-stats", desc: "社内利用トレンド分析とGemini 3.1 Pro/Flashスペック表", badge: "可視化" },
      { name: "アイデア宣言ボード", href: "/idea-board", desc: "AI活用のアイデアを宣言して協力者を募る場所", badge: "β版" },
      { name: "Subagents活用事例", href: "/agent-cases", desc: "社内でのエージェント活用事例", badge: "🚧 工事中" },
      { name: "社内AI活用状況", href: "/adoption", desc: "全社・部署ごとの AI 活用状況（実データ連携の準備中）", badge: "🚧 工事中" },
      { name: "AI Tools Hub", href: "/tools-hub", desc: "社内AI利用のセキュリティ基準と注意事項", badge: "🚧 工事中" },
    ],
  },
  {
    id: "community",
    title: "コミュニティ",
    subtitle: "仲間と情報交換したい・専門家に相談したい",
    icon: MessageCircle,
    color: "text-rose-600",
    borderColor: "border-rose-200 hover:border-rose-400",
    bgActive: "bg-rose-50/60 border-rose-500",
    items: [
      { name: "最新AIニュース", href: "/news", desc: "社内リリース・各社最新動向のリアルタイムレーダー", badge: "LIVE" },
      { name: "AI Park カレンダー", href: "/calendar", desc: "社内AI勉強会・イベントの予定（社内アカウントで表示）", badge: "β版" },
      { name: "ご意見・改善ToDo", href: "/feedback-todo", desc: "社員からのご意見・改善要望の管理ボード", badge: "β版" },
      { name: "社内AIアンバサダー", href: "/ambassadors", desc: "第1期アンバサダーの応募受付", badge: "📋 準備中" },
      { name: "AI推進担当に相談する", href: "/contact", desc: "導入や使い方の相談・お問い合わせ" },
      { name: "開発ロードマップ", href: "/roadmap", desc: "AI Parkの機能拡充計画と進捗スケジュール" },
      { name: "AIガバナンス (🌐公式)", href: "https://antigravity.google/docs/permissions", desc: "モデルの権限・セキュリティガイドライン", badge: "外部リンク" },
    ],
  },
];

export default function PurposeJump() {
  const [activeCategory, setActiveCategory] = useState<"learning" | "agents" | "community" | null>(
    "learning"
  );

  const currentSection = jumpSections.find((s) => s.id === activeCategory);

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 bg-gradient-to-br from-rose-500 to-amber-500 text-white rounded-2xl shadow-sm shadow-rose-500/20">
          <Rocket size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-lg sm:text-xl flex items-center space-x-2 tracking-tight">
            <span>何がしたい？</span>
            <span className="text-xs text-slate-500 font-normal">目的に合わせて最短アクセス</span>
          </h3>
        </div>
      </div>

      {/* 3大カテゴリセレクターカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {jumpSections.map((sec) => {
          const Icon = sec.icon;
          const isSelected = activeCategory === sec.id;

          return (
            <button
              key={sec.id}
              onClick={() => {
                playCyberClick();
                setActiveCategory(isSelected ? null : sec.id);
              }}
              onMouseEnter={() => playCyberHover()}
              className={`p-6 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-between space-y-4 relative group cursor-pointer active:scale-95 ${
                isSelected
                  ? `${sec.bgActive} shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/30 scale-[1.02]`
                  : `bg-slate-50/60 ${sec.borderColor} hover:bg-white hover:shadow-md hover:-translate-y-1`
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${
                  isSelected ? "bg-white shadow-md" : "bg-white"
                }`}
              >
                <Icon size={28} className={sec.color} />
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-base tracking-tight">{sec.title}</h4>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">{sec.subtitle}</p>
              </div>

              <div
                className={`text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                  isSelected ? sec.color : "text-slate-400 group-hover:text-slate-700"
                }`}
              >
                <span>{isSelected ? "▲ 選択中（閉じる）" : "▼ クリックして開く"}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 展開されたリンク一覧エリア */}
      {currentSection && (
        <div className="pt-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Sparkles size={14} className={currentSection.color} />
                <span>「{currentSection.title}」の関連ページ ({currentSection.items.length}件)</span>
              </span>
              <span className="text-[11px]">目的のページをクリックしてください</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {currentSection.items.map((item) => {
                const isExternal = item.href.startsWith("http");

                if (isExternal) {
                  return (
                    <TiltCard key={item.name} maxTilt={3} glareOpacity={0.06} className="rounded-2xl h-full">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playCyberClick()}
                        onMouseEnter={() => playCyberHover()}
                        className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group space-y-3 h-full cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="font-extrabold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </h5>
                            {item.badge && (
                              <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200/60 shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                            {item.desc}
                          </p>
                        </div>
                        <div className="flex items-center justify-end text-slate-400 group-hover:text-blue-600 text-[11px] font-bold space-x-1 pt-2 border-t border-slate-100">
                          <span>開く</span>
                          <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </a>
                    </TiltCard>
                  );
                }

                return (
                  <TiltCard key={item.name} maxTilt={3} glareOpacity={0.06} className="rounded-2xl h-full">
                    <Link
                      href={item.href}
                      onClick={() => playCyberClick()}
                      onMouseEnter={() => playCyberHover()}
                      className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group space-y-3 h-full cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="font-extrabold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h5>
                          {item.badge && (
                            <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200/60 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                          {item.desc}
                        </p>
                      </div>
                      <div className="flex items-center justify-end text-slate-400 group-hover:text-blue-600 text-[11px] font-bold space-x-1 pt-2 border-t border-slate-100">
                        <span>ページへ進む</span>
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
