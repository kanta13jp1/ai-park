"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  Command,
  X,
  Layers,
  Terminal,
  ShieldCheck,
  Building,
  Lightbulb,
  ExternalLink,
  Bot,
  Wrench,
  HelpCircle,
  Compass,
  FileCheck2,
  LucideIcon,
} from "lucide-react";
import { playCyberOpen, playCyberClick, playCyberHover } from "@/lib/sound";

interface PaletteItem {
  id: string;
  title: string;
  category: "Academy & 学習" | "ツール & ガイド" | "共創 & コミュニティ" | "ガバナンス & サポート";
  href: string;
  description: string;
  icon: LucideIcon;
  isExternal?: boolean;
}

const paletteItems: PaletteItem[] = [
  {
    id: "academy",
    title: "Antigravity Academy",
    category: "Academy & 学習",
    href: "/academy",
    description: "全12レッスン・評価テスト・修了証発行の公式マスターカリキュラム",
    icon: BookOpen,
  },
  {
    id: "tools",
    title: "AIツール検証マトリクス & 利用申請ドラフト",
    category: "ツール & ガイド",
    href: "/tools",
    description: "推奨ランク（S/A/B/PoC）、職種別フィルター、ワンクリック申請文生成",
    icon: Bot,
  },
  {
    id: "guide",
    title: "Antigravity 導入ガイド",
    category: "ツール & ガイド",
    href: "/guide",
    description: "公式ドキュメント準拠のインストール・IDE日本語化・Git連携手順",
    icon: Terminal,
  },
  {
    id: "troubleshooting",
    title: "Windows環境トラブルシューティング & FAQ",
    category: "ツール & ガイド",
    href: "/troubleshooting",
    description: "PowerShell実行ポリシー、Node.js 22、文字コード、権限エラーの即時解決",
    icon: Wrench,
  },
  {
    id: "how-to",
    title: "使い方・学び 総合ハブ",
    category: "Academy & 学習",
    href: "/how-to",
    description: "AIツール一覧、教育用コンテンツ、AI活用インタビュー、クラウド情報局",
    icon: Compass,
  },
  {
    id: "learning",
    title: "初心者向けチートシート & 教育コンテンツ",
    category: "Academy & 学習",
    href: "/learning",
    description: "初級編プロンプトの頼み方・編集手順・エラー対処法",
    icon: Sparkles,
  },
  {
    id: "ai-projects",
    title: "社内AIプロジェクト一覧",
    category: "共創 & コミュニティ",
    href: "/ai-projects",
    description: "社内各部署のAI活用事例・課題・効果を可視化した共創台帳",
    icon: Building,
  },
  {
    id: "idea-board",
    title: "アイデア宣言ボード",
    category: "共創 & コミュニティ",
    href: "/idea-board",
    description: "新しいAI活用のアイデアを宣言して共創や協力者を募る広場",
    icon: Lightbulb,
  },
  {
    id: "feedback-todo",
    title: "ご意見・改善ToDoボード",
    category: "共創 & コミュニティ",
    href: "/feedback-todo",
    description: "社員のご意見をGitHub Issueとリアルタイム同期してタスク化",
    icon: Layers,
  },
  {
    id: "calendar",
    title: "AI Park カレンダー",
    category: "共創 & コミュニティ",
    href: "/calendar",
    description: "社内AI勉強会・Office Hour・募集スケジュールの共有",
    icon: Calendar,
  },
  {
    id: "roadmap",
    title: "開発ロードマップ",
    category: "共創 & コミュニティ",
    href: "/roadmap",
    description: "AI Park の準備中機能公開スケジュールと実装条件",
    icon: Layers,
  },
  {
    id: "contact",
    title: "AI推進担当窓口 & アカウント・ライセンスFAQ",
    category: "ガバナンス & サポート",
    href: "/contact",
    description: "担当：梅澤への相談窓口、アカウント発行・ライセンスよくある質問検索",
    icon: HelpCircle,
  },
  {
    id: "tools-hub",
    title: "AI利用セキュリティ基準 (Level 1〜3)",
    category: "ガバナンス & サポート",
    href: "/tools-hub",
    description: "入力可能なデータの分類と安全な利用ガイドライン",
    icon: ShieldCheck,
  },
  {
    id: "skills-hub",
    title: "社内Skillsカタログ",
    category: "ツール & ガイド",
    href: "/skills-hub",
    description: "社内で共有する Antigravity の Skills カタログ（工事中：準備中）",
    icon: Bot,
  },
  {
    id: "mcp-hub",
    title: "MCP外部ツール連携ガイド",
    category: "ツール & ガイド",
    href: "/mcp-hub",
    description: "Antigravity と外部ツールをつなぐ MCP の設定（工事中：準備中）",
    icon: Terminal,
  },
  {
    id: "safety-checker",
    title: "社内AI入力 セルフチェック診断ツール",
    category: "ガバナンス & サポート",
    href: "/guide#safety-checker",
    description: "顧客データ・個人情報・社外秘の入力可否を判定する3問の安全診断",
    icon: ShieldCheck,
  },
  {
    id: "fill-in-prompts",
    title: "穴埋めプロンプト集（実務テンプレ）",
    category: "Academy & 学習",
    href: "/learning#fill-in-prompts",
    description: "コピペですぐ使える要約・コード生成・エラー調査・メール作成の穴埋め型プロンプト集",
    icon: Sparkles,
  },
  {
    id: "safe-rules",
    title: "安全なプロンプト基本ルール＆禁止入力早見表",
    category: "ガバナンス & サポート",
    href: "/learning#safe-prompting-rules",
    description: "個人情報・機密情報の禁止ルール（OK/NG対比）と安全な依頼3大テクニック",
    icon: ShieldCheck,
  },
  {
    id: "gemini-stats",
    title: "Gemini利用統計ダッシュボード & FAQ",
    category: "ツール & ガイド",
    href: "/gemini-stats",
    description: "全社・部署別の利用回数集計、日次推移（7d/14d/30d）、SKU立体カード",
    icon: Layers,
  },
  {
    id: "dept-templates",
    title: "部署別実践テンプレ＆実務フロー",
    category: "共創 & コミュニティ",
    href: "/ai-projects#dept-templates",
    description: "営業・開発・マーケ・人事・法務など各部署の具体的活用ステップと削減効果",
    icon: Building,
  },
  {
    id: "preflight",
    title: "開発者手動UAT管理（プリフライト）",
    category: "ガバナンス & サポート",
    href: "/preflight",
    description: "4大評価軸（仕様・デザイン・操作性・視認性）の社内受入テスト管理コンソール",
    icon: FileCheck2,
  },
  {
    id: "news",
    title: "最新AIニュース & リリースレーダー",
    category: "ツール & ガイド",
    href: "/news",
    description: "Gemini, Claude, DeepSeek, OpenAI等の自動巡回最新AIニュース速報",
    icon: Sparkles,
  },
  {
    id: "official-doc",
    title: "Google Antigravity 公式ドキュメント",
    category: "ツール & ガイド",
    href: "https://antigravity.google/docs",
    description: "Google公式の開発者リファレンス・APIガイド",
    icon: ExternalLink,
    isExternal: true,
  },
];

const CATEGORIES = [
  "すべて",
  "Academy & 学習",
  "ツール & ガイド",
  "共創 & コミュニティ",
  "ガバナンス & サポート",
] as const;

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const openPalette = useCallback(() => {
    setQuery("");
    setSelectedCategory("すべて");
    setSelectedIndex(0);
    setIsOpen(true);
    playCyberOpen();
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
  }, []);

  // ⌘K / Ctrl+K による開閉
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            playCyberOpen();
            setQuery("");
            setSelectedCategory("すべて");
            setSelectedIndex(0);
            return true;
          }
          return false;
        });
      } else if (e.key === "Escape") {
        closePalette();
      }
    };

    const handleOpenCustom = () => openPalette();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("ai-park-open-command-palette", handleOpenCustom);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("ai-park-open-command-palette", handleOpenCustom);
    };
  }, [closePalette, openPalette]);

  // 開いた際に入力欄にフォーカス
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    let list = paletteItems;
    if (selectedCategory !== "すべて") {
      list = list.filter((item) => item.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, selectedCategory]);

  const handleSelect = (item: PaletteItem) => {
    playCyberClick();
    setIsOpen(false);
    if (item.isExternal) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      playCyberHover();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      playCyberHover();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#090d16] border border-cyan-500/35 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[82vh] relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 背景アンビエント光彩 */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* 検索入力ヘッダー */}
        <div className="relative flex items-center px-6 py-4 border-b border-slate-800/80 z-10">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="AI Park のページやガイドを瞬時に検索... (↑↓で選択、Enterで移動)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            onMouseEnter={() => playCyberHover()}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* カテゴリピルタブ */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/60 overflow-x-auto scrollbar-none z-10">
          {CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  playCyberClick();
                  setSelectedCategory(cat);
                  setSelectedIndex(0);
                }}
                onMouseEnter={() => playCyberHover()}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                  isCatActive
                    ? "bg-cyan-400 text-slate-950 font-black shadow-xs shadow-cyan-400/20"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 検索結果リスト */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 z-10">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              「{query}」に一致するコンテンツが見つかりませんでした。
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => {
                    setSelectedIndex(index);
                    playCyberHover();
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border border-cyan-400/40 text-white"
                      : "text-slate-300 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-cyan-400 text-slate-950 font-bold"
                          : "bg-slate-800/80 text-cyan-400 border border-slate-700/60"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm tracking-tight truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800/90 text-slate-400 border border-slate-700/50 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pl-3">
                    {isSelected ? (
                      <span className="flex items-center space-x-1 text-xs font-mono font-bold text-cyan-300">
                        <span>開く</span>
                        <ArrowRight size={13} />
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[11px] font-mono">↵</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* フッターナビゲーションヒント (3Dキーキャップ風) */}
        <div className="px-6 py-3 border-t border-slate-800/60 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400 font-mono z-10">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 shadow-[0_2px_0_#334155]">↑↓</kbd>
              <span>移動</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 shadow-[0_2px_0_#334155]">↵</kbd>
              <span>決定</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 shadow-[0_2px_0_#334155]">ESC</kbd>
              <span>閉じる</span>
            </span>
          </div>
          <span className="text-cyan-400 font-semibold">AI Park Command Palette</span>
        </div>
      </div>
    </div>
  );
}
