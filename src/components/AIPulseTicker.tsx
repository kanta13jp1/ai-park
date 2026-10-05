"use client";

import { useEffect, useState } from "react";
import { Activity, Sparkles, Terminal, CheckCircle2, Flame, Bot, Cpu, Pause, Trophy, Wrench, AlertTriangle, LucideIcon } from "lucide-react";
import Link from "next/link";
import { playCyberClick, playCyberHover } from "@/lib/sound";

interface PulseItem {
  id: string;
  badge: string;
  badgeColor: string;
  icon: LucideIcon;
  text: string;
  linkText?: string;
  href?: string;
  time: string;
}

const pulseEvents: PulseItem[] = [
  {
    id: "3",
    badge: "SUPPORT",
    badgeColor: "bg-rose-500/25 text-rose-300 border-rose-400/50",
    icon: AlertTriangle,
    text: "Windowsトラブルシューター：PowerShell・Git・Node環境の自己解決コマンド集公開",
    linkText: "解決する",
    href: "/troubleshooting",
    time: "FAQ",
  },
  {
    id: "4",
    badge: "ACADEMY",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    icon: Sparkles,
    text: "Antigravity Academy：全12レッスンの受講 & ブラウザ内修了証発行システム稼働中",
    linkText: "受講する",
    href: "/academy",
    time: "NOW",
  },
  {
    id: "5",
    badge: "FEEDBACK",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    icon: CheckCircle2,
    text: "社員フィードバック：GitHub Issue / 改善ToDoボードへの自動同期が進行中",
    linkText: "ToDoを見る",
    href: "/feedback-todo",
    time: "SYNCED",
  },
  {
    id: "6",
    badge: "AGENTIC",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    icon: Bot,
    text: "Google Antigravity：Gemini 3.1 Pro / agy CLI 連携ガイドを完全公開",
    linkText: "ガイドを見る",
    href: "/guide",
    time: "v1.2",
  },
  {
    id: "7",
    badge: "COMMUNITY",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    icon: Flame,
    text: "アイデア宣言ボード：AIで任せたい作業の宣言を受付中（GitHub で宣言・Google Chat に通知）",
    linkText: "宣言する",
    href: "/idea-board",
    time: "ACTIVE",
  },
];

export default function AIPulseTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % pulseEvents.length);
        setIsFading(false);
      }, 300);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const current = pulseEvents[currentIndex];
  const IconComponent = current.icon;

  return (
    <div
      onMouseEnter={() => {
        setIsPaused(true);
        playCyberHover();
      }}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-[#0d1424] to-slate-950 border border-slate-800/80 px-4 py-2.5 sm:px-5 sm:py-3 shadow-lg select-none backdrop-blur-md transition-all hover:border-cyan-500/40"
    >
      {/* 背景の走査線と光彩 */}
      <div className="absolute top-0 right-1/4 w-96 h-full bg-cyan-500/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-full bg-indigo-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        {/* 左側：リアルタイム・パルスインジケーター */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tracking-wider">AI PULSE</span>
          </div>

          <div className="hidden sm:flex items-center text-slate-400 font-mono text-[11px] space-x-1">
            {isPaused ? (
              <>
                <Pause size={12} className="text-amber-400" />
                <span className="text-amber-300">PAUSED</span>
              </>
            ) : (
              <>
                <Activity size={12} className="text-cyan-400 animate-pulse" />
                <span>LIVE FEED</span>
              </>
            )}
          </div>
        </div>

        {/* 中央：イベントティッカー内容 */}
        <div
          className={`flex-1 flex items-center space-x-2.5 min-w-0 transition-opacity duration-300 ${
            isFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          <span
            className={`text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-md border shrink-0 ${current.badgeColor}`}
          >
            {current.badge}
          </span>

          <span className="text-xs sm:text-[13px] text-slate-200 truncate font-medium flex items-center gap-1.5">
            <IconComponent size={14} className="text-cyan-300 shrink-0 inline hidden md:inline" />
            <span>{current.text}</span>
          </span>
        </div>

        {/* 右側：クイックアクション & タイム */}
        <div className="flex items-center space-x-3 shrink-0 ml-auto">
          {current.href && current.linkText && (
            <Link
              href={current.href}
              onClick={() => playCyberClick()}
              onMouseEnter={() => playCyberHover()}
              className="text-xs font-bold text-cyan-300 hover:text-cyan-100 underline decoration-cyan-400/50 hover:decoration-cyan-300 transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span>{current.linkText}</span>
              <span className="text-[10px]">→</span>
            </Link>
          )}

          <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-[10px] font-mono text-slate-400">
            {current.time}
          </div>
        </div>
      </div>
    </div>
  );
}
