"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Rocket,
  BookOpen,
  Bot,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";

interface JumpSection {
  id: "learning" | "agents" | "community";
  title: string;
  subtitle: string;
  icon: any;
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
      { name: "使い方・学び 総合ハブ", href: "/how-to", desc: "ツール・教育・インタビュー・クラウドの全体ポータル", badge: "総合" },
      { name: "AIツール一覧", href: "/tools", desc: "社内公認AIツールのスペック・利用可否判定", badge: "公認" },
      { name: "教育用コンテンツ", href: "/learning", desc: "全社カリキュラム・過去勉強会アーカイブ動画", badge: "人気" },
      { name: "AI活用インタビュー", href: "/interviews", desc: "社内エンジニアのリアルな導入体験談・生の声", badge: "新着" },
      { name: "AWS・クラウド情報局", href: "/aws-info", desc: "クラウドネイティブAI・アーキテクチャ情報" },
      { name: "Antigravity導入ガイド", href: "/guide", desc: "IDE / CLI セットアップとスラッシュコマンド" },
      { name: "社内Skillsカタログ", href: "/skills-hub", desc: "自社業務特化スキル・申請・ワンクリック導入" },
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
      { name: "アイデア宣言ボード", href: "/idea-board", desc: "AI活用のアイデア起票・共創・いいね応援", badge: "共創" },
      { name: "Subagents活用事例", href: "/agent-cases", desc: "自律並列エージェント（SRE・調達・QA）構成図", badge: "注目" },
      { name: "利用状況ダッシュボード", href: "/gemini-stats", desc: "部署別MAU・プロンプト推移・CSV入出力", badge: "稼働中" },
      { name: "社内AI活用状況 & ROI", href: "/adoption", desc: "全社フェーズ進捗・削減工数リアルタイム試算" },
      { name: "AI Tools Hub", href: "/tools-hub", desc: "社内公認ツール一覧・セキュリティ基準・申請" },
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
      { name: "社内AIアンバサダー", href: "/ambassadors", desc: "各部署のAI推進リーダー一覧・Slack相談窓口", badge: "稼働中" },
      { name: "Office Hour (CoE相談)", href: "/antigravity-info", desc: "マンツーマンでの導入・エージェント開発相談", badge: "おすすめ" },
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
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
        <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
          <Rocket size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <span>何がしたい？</span>
            <span className="text-xs text-slate-500 font-normal">目的に合わせてページへジャンプ</span>
          </h3>
        </div>
      </div>

      {/* 3大カテゴリセレクターカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jumpSections.map((sec) => {
          const Icon = sec.icon;
          const isSelected = activeCategory === sec.id;

          return (
            <button
              key={sec.id}
              onClick={() => setActiveCategory(isSelected ? null : sec.id)}
              className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between space-y-3 relative group ${
                isSelected
                  ? `${sec.bgActive} shadow-sm ring-2 ring-blue-500/20`
                  : `bg-slate-50/70 ${sec.borderColor} hover:bg-white hover:shadow-sm`
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs ${
                  isSelected ? "bg-white" : "bg-white/90"
                }`}
              >
                <Icon size={28} className={sec.color} />
              </div>

              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-base">{sec.title}</h4>
                <p className="text-[11px] text-slate-500">{sec.subtitle}</p>
              </div>

              <div
                className={`text-xs font-semibold flex items-center space-x-1 ${
                  isSelected ? sec.color : "text-slate-400 group-hover:text-slate-700"
                }`}
              >
                <span>{isSelected ? "▲ 閉じる" : "▼ 選んでジャンプ"}</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentSection.items.map((item) => {
                const isExternal = item.href.startsWith("http");

                if (isExternal) {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h5>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug mt-1">
                          {item.desc}
                        </p>
                      </div>
                      <div className="flex items-center justify-end text-slate-400 group-hover:text-blue-600 text-[11px] font-semibold space-x-1">
                        <span>開く</span>
                        <ExternalLink size={12} />
                      </div>
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h5>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1">
                        {item.desc}
                      </p>
                    </div>
                    <div className="flex items-center justify-end text-slate-400 group-hover:text-blue-600 text-[11px] font-semibold space-x-1">
                      <span>ページへ進む</span>
                      <ArrowRight size={12} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
