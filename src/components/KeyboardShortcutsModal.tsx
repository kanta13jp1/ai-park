"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Keyboard,
  X,
  Volume2,
  VolumeX,
  Command,
  Compass,
  ArrowRight,
  GraduationCap,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  Bot,
  Newspaper,
  CheckCircle2,
} from "lucide-react";
import {
  isSoundEnabled,
  setSoundEnabled,
  playCyberClick,
  playCyberOpen,
  playCyberHover,
} from "@/lib/sound";

export default function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let pendingGKey = false;
    let pendingTimeout: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // input, textarea などの入力中は無視
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      // ? キー（Shift + /）でショートカット一覧を開く
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) playCyberOpen();
          return !prev;
        });
        return;
      }

      // Escキーで閉じる
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        playCyberClick();
        return;
      }

      // M キーでオーディオトグル
      if ((e.key === "m" || e.key === "M") && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const current = isSoundEnabled();
        setSoundEnabled(!current);
        playCyberClick();
        return;
      }

      // 2段階ショートカット: 'g' 押下後のジャンプ (g then h/g/a/s/r/t/f/c/n)
      if (e.key === "g" && !e.metaKey && !e.ctrlKey && !pendingGKey) {
        pendingGKey = true;
        if (pendingTimeout) clearTimeout(pendingTimeout);
        pendingTimeout = setTimeout(() => {
          pendingGKey = false;
        }, 1200);
        return;
      }

      if (pendingGKey) {
        pendingGKey = false;
        if (pendingTimeout) clearTimeout(pendingTimeout);

        switch (e.key.toLowerCase()) {
          case "h":
            playCyberClick();
            router.push("/");
            setIsOpen(false);
            break;
          case "g":
            playCyberClick();
            router.push("/guide");
            setIsOpen(false);
            break;
          case "a":
            playCyberClick();
            router.push("/academy");
            setIsOpen(false);
            break;
          case "s":
            playCyberClick();
            router.push("/gemini-stats");
            setIsOpen(false);
            break;
          case "r":
            playCyberClick();
            router.push("/roadmap");
            setIsOpen(false);
            break;
          case "t":
            playCyberClick();
            router.push("/tools");
            setIsOpen(false);
            break;
          case "f":
            playCyberClick();
            router.push("/feedback-todo");
            setIsOpen(false);
            break;
          case "c":
            playCyberClick();
            router.push("/calendar");
            setIsOpen(false);
            break;
          case "n":
            playCyberClick();
            router.push("/news");
            setIsOpen(false);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (pendingTimeout) clearTimeout(pendingTimeout);
    };
  }, [isOpen, router]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 text-white shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Keyboard size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-mono tracking-tight">
                KEYBOARD SHORTCUTS HUD
              </h3>
              <p className="text-xs text-slate-400">キーボードによる高速ナビゲーション</p>
            </div>
          </div>
          <button
            onClick={() => {
              playCyberClick();
              setIsOpen(false);
            }}
            onMouseEnter={() => playCyberHover()}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="閉じる"
          >
            <X size={16} />
          </button>
        </div>

        {/* ショートカット一覧グリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          {/* グローバル操作 */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>GLOBAL COMMANDS</span>
            </div>
            <div className="space-y-1.5">
              <div
                onMouseEnter={() => playCyberHover()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span className="text-slate-300">コマンドパレット起動</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-cyan-300 font-bold border border-slate-600 shadow-[0_2px_0_#334155]">
                  ⌘K / /
                </span>
              </div>
              <div
                onMouseEnter={() => playCyberHover()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span className="text-slate-300">触感オーディオ ON/OFF</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-cyan-300 font-bold border border-slate-600 shadow-[0_2px_0_#334155]">
                  M
                </span>
              </div>
              <div
                onMouseEnter={() => playCyberHover()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span className="text-slate-300">ショートカット一覧</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-cyan-300 font-bold border border-slate-600 shadow-[0_2px_0_#334155]">
                  ?
                </span>
              </div>
            </div>
          </div>

          {/* クイックナビゲーション (G then ...) */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>FAST JUMP (G then key)</span>
            </div>
            <div className="space-y-1.5">
              <div
                onMouseEnter={() => playCyberHover()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span className="text-slate-300">トップ (Home)</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-indigo-300 font-bold border border-slate-600 shadow-[0_2px_0_#334155]">
                  G H
                </span>
              </div>
              <div
                onMouseEnter={() => playCyberHover()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span className="text-slate-300">AIツール検証マトリクス</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-indigo-300 font-bold border border-slate-600 shadow-[0_2px_0_#334155]">
                  G T
                </span>
              </div>
              <div
                onMouseEnter={() => playCyberHover()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span className="text-slate-300">改善ToDoボード</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-indigo-300 font-bold border border-slate-600 shadow-[0_2px_0_#334155]">
                  G F
                </span>
              </div>
              <div
                onMouseEnter={() => playCyberHover()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span className="text-slate-300">AI Park カレンダー</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-indigo-300 font-bold border border-slate-600 shadow-[0_2px_0_#334155]">
                  G C
                </span>
              </div>
              <div
                onMouseEnter={() => playCyberHover()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span className="text-slate-300">最新AIニュース</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-indigo-300 font-bold border border-slate-600 shadow-[0_2px_0_#334155]">
                  G N
                </span>
              </div>
              <div
                onMouseEnter={() => playCyberHover()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span className="text-slate-300">Antigravity Academy</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-indigo-300 font-bold border border-slate-600 shadow-[0_2px_0_#334155]">
                  G A
                </span>
              </div>
              <div
                onMouseEnter={() => playCyberHover()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span className="text-slate-300">導入ガイド</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-indigo-300 font-bold border border-slate-600 shadow-[0_2px_0_#334155]">
                  G G
                </span>
              </div>
              <div
                onMouseEnter={() => playCyberHover()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span className="text-slate-300">利用統計・モニタ</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700 text-indigo-300 font-bold border border-slate-600 shadow-[0_2px_0_#334155]">
                  G S
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Esc キーで閉じます</span>
          <span className="text-cyan-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>Tactile Audio Feedback Active</span>
          </span>
        </div>
      </div>
    </div>
  );
}
