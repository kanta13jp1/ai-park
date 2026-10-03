"use client";

import { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import { playCyberOpen, playCyberClick, playCyberHover } from "@/lib/sound";

interface PaletteItem {
  id: string;
  title: string;
  category: "Academy & 学習" | "ツール & ガイド" | "共創 & コミュニティ" | "ガバナンス & サポート";
  href: string;
  description: string;
  icon: any;
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
    id: "guide",
    title: "Antigravity 導入ガイド",
    category: "ツール & ガイド",
    href: "/guide",
    description: "公式ドキュメント準拠のインストール・IDE日本語化・Git連携手順",
    icon: Terminal,
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
    id: "tools-hub",
    title: "AI利用セキュリティ基準 (Level 1〜3)",
    category: "ガバナンス & サポート",
    href: "/tools-hub",
    description: "社内AI活用時の機密情報保護基準と注意事項",
    icon: ShieldCheck,
  },
  {
    id: "contact",
    title: "AI推進担当（担当：梅澤）相談窓口",
    category: "ガバナンス & サポート",
    href: "/contact",
    description: "毎週水曜Office Hourの個別相談予約・お問い合わせ",
    icon: Bot,
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

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K による開閉
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 開いた際に入力欄にフォーカス
  useEffect(() => {
    if (isOpen) {
      playCyberOpen();
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = query.trim()
    ? paletteItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      })
    : paletteItems;

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
      playCyberClick();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      playCyberClick();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#090d16] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[80vh] relative animate-in zoom-in-95 duration-150"
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
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
          >
            <X size={18} />
          </button>
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

        {/* フッターナビゲーションヒント */}
        <div className="px-6 py-3 border-t border-slate-800/60 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400 font-mono z-10">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↑↓</kbd>
              <span>移動</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↵</kbd>
              <span>決定</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">ESC</kbd>
              <span>閉じる</span>
            </span>
          </div>
          <span className="text-cyan-400 font-semibold">AI Park Command Palette</span>
        </div>
      </div>
    </div>
  );
}
