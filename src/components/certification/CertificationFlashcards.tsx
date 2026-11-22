"use client";

import { useState, useMemo, useEffect } from "react";
import {
  RotateCw,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import type { CertFlashcardItem } from "./types";

interface CertificationFlashcardsProps {
  items: CertFlashcardItem[];
  masteredKeywords: string[];
  onToggleMastered: (keyword: string) => void;
  onResetMastered: () => void;
  badgeText?: string;
  title?: string;
  promptLabel?: string;
  answerLabel?: string;
}

export default function CertificationFlashcards({
  items,
  masteredKeywords,
  onToggleMastered,
  onResetMastered,
  badgeText = "直前暗記フラッシュカード",
  title = "要件キーワード → 推奨サービス・コマンド 即答トレーニング",
  promptLabel = "次の要件に最適なサービス・コマンドは？",
  answerLabel = "推奨サービス・コマンド",
}: CertificationFlashcardsProps) {
  const [onlyUnmastered, setOnlyUnmastered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [shuffledOrder, setShuffledOrder] = useState<string[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const categories = useMemo(() => {
    const uniq = Array.from(new Set(items.map((c) => c.category)));
    return ["すべて", ...uniq];
  }, [items]);

  const orderedCards = useMemo<CertFlashcardItem[]>(() => {
    if (!shuffledOrder) return items;
    const map = new Map(items.map((c) => [c.keyword, c]));
    return shuffledOrder.map((k) => map.get(k)).filter((c): c is CertFlashcardItem => Boolean(c));
  }, [items, shuffledOrder]);

  const cards = useMemo(() => {
    return orderedCards.filter((c) => {
      if (selectedCategory !== "すべて" && c.category !== selectedCategory) return false;
      if (onlyUnmastered && masteredKeywords.includes(c.keyword)) return false;
      return true;
    });
  }, [orderedCards, selectedCategory, onlyUnmastered, masteredKeywords]);

  const safeIndex = Math.min(currentIndex, Math.max(0, cards.length - 1));
  const currentCard = cards[safeIndex];
  const masteredCount = masteredKeywords.length;
  const pct = items.length > 0 ? Math.round((masteredCount / items.length) * 100) : 0;

  const handleToggleShuffle = () => {
    playCyberClick();
    if (shuffledOrder) {
      setShuffledOrder(null);
    } else {
      const keys = items.map((c) => c.keyword);
      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
      }
      setShuffledOrder(keys);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const goTo = (nextIdx: number) => {
    playCyberClick();
    setIsFlipped(false);
    setCurrentIndex(nextIdx);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        playCyberClick();
        setIsFlipped((f) => !f);
      } else if (e.key === "ArrowLeft" && safeIndex > 0) {
        e.preventDefault();
        playCyberClick();
        setIsFlipped(false);
        setCurrentIndex(safeIndex - 1);
      } else if (e.key === "ArrowRight" && safeIndex < cards.length - 1) {
        e.preventDefault();
        playCyberClick();
        setIsFlipped(false);
        setCurrentIndex(safeIndex + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [safeIndex, cards.length]);

  return (
    <div className="space-y-6">
      {/* ヘッダー＆進捗 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {badgeText}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              習得済み {masteredCount} / {items.length} 枚（{pct}%）
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900">{title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={onlyUnmastered}
            onClick={() => {
              playCyberClick();
              setOnlyUnmastered((v) => !v);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              onlyUnmastered
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}
          >
            {onlyUnmastered ? "未習得のみ表示中" : "未習得のみ"}
          </button>

          <button
            type="button"
            aria-pressed={Boolean(shuffledOrder)}
            onClick={handleToggleShuffle}
            className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              shuffledOrder
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}
          >
            <Shuffle size={14} />
            <span>{shuffledOrder ? "シャッフル中" : "シャッフル"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playCyberClick();
              onResetMastered();
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>リセット</span>
          </button>
        </div>
      </div>

      {/* カテゴリフィルター */}
      {categories.length > 2 && (
        <div role="group" aria-label="フラッシュカード カテゴリ" className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  playCyberClick();
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* カード本体 */}
      {!currentCard ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-10 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-emerald-500 mx-auto" />
          <div className="text-lg font-black text-slate-900">
            全 {items.length} 枚のカードを習得しました！
          </div>
          <p className="text-xs text-slate-500">
            すべてのカードに「覚えた」マークが付いています。「未習得のみ」を解除すると全カードを復習できます。
          </p>
          <button
            type="button"
            onClick={() => {
              setOnlyUnmastered(false);
              setSelectedCategory("すべて");
              setCurrentIndex(0);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
          >
            すべてのカードを表示
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-5">
          {/* フリップカード */}
          <button
            type="button"
            aria-pressed={isFlipped}
            aria-label={
              isFlipped
                ? "カード裏面（答え）を表示中。クリックして表面へ戻す"
                : "カード表面（問題）を表示中。クリックして答えを見る"
            }
            onClick={() => {
              playCyberClick();
              setIsFlipped((f) => !f);
            }}
            onMouseEnter={() => playCyberHover()}
            className={`w-full min-h-[260px] rounded-3xl border p-7 sm:p-10 text-left transition-all shadow-md flex flex-col justify-between cursor-pointer ${
              isFlipped
                ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-indigo-700 text-white"
                : "bg-white border-slate-200 hover:border-indigo-300 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isFlipped
                    ? "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
                    : "bg-indigo-50 text-indigo-700 border-indigo-100"
                }`}
              >
                {currentCard.category}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {safeIndex + 1} / {cards.length}
              </span>
            </div>

            <div aria-live="polite" className="w-full">
              {!isFlipped ? (
                <div className="py-6 space-y-2 text-center">
                  <div className="text-xs font-bold text-slate-400">{promptLabel}</div>
                  <div className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                    「{currentCard.keyword}」
                  </div>
                </div>
              ) : (
                <div className="py-5 space-y-3 text-center">
                  <div className="text-xs font-bold text-indigo-300">{answerLabel}</div>
                  <div className="text-xl sm:text-2xl font-mono font-black text-cyan-300">
                    {currentCard.recommended}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg mx-auto">
                    {currentCard.reason}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] opacity-70 w-full">
              <RotateCw size={12} />
              <span>クリックして{isFlipped ? "問題（表）" : "答え（裏）"}を見る</span>
            </div>
          </button>

          {/* 操作コントロール */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={safeIndex === 0}
              onClick={() => goTo(Math.max(0, safeIndex - 1))}
              className="inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>前へ</span>
            </button>

            <button
              type="button"
              aria-pressed={masteredKeywords.includes(currentCard.keyword)}
              onClick={() => {
                playCyberClick();
                const already = masteredKeywords.includes(currentCard.keyword);
                onToggleMastered(currentCard.keyword);
                if (!already && safeIndex < cards.length - 1) {
                  setIsFlipped(false);
                  setCurrentIndex((i) => i + 1);
                }
              }}
              className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                masteredKeywords.includes(currentCard.keyword)
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {masteredKeywords.includes(currentCard.keyword) ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>覚えた済み（解除）</span>
                </>
              ) : (
                <>
                  <Bookmark size={15} />
                  <span>覚えた！マークを付ける</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={safeIndex >= cards.length - 1}
              onClick={() => goTo(Math.min(cards.length - 1, safeIndex + 1))}
              className="inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
            >
              <span>次へ</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-400">
            ショートカット:{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-slate-600">
              Space
            </kbd>{" "}
            で裏返す /{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-slate-600">
              ←
            </kbd>{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-slate-600">
              →
            </kbd>{" "}
            で移動
          </p>
        </div>
      )}
    </div>
  );
}
