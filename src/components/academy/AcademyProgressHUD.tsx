"use client";

import { useEffect, useState } from "react";
import { Trophy, Award, Flame, Sparkles, CheckCircle2 } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

interface AcademyProgressHUDProps {
  totalLessons: number;
  doneLessons: number;
  completedCourses: number;
  totalCourses: number;
}

export default function AcademyProgressHUD({
  totalLessons,
  doneLessons,
  completedCourses,
  totalCourses,
}: AcademyProgressHUDProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const percent = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  // 円周の計算 (r = 40, C = 2 * PI * 40 = 251.32)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (circumference * animatedPercent) / 100;

  useEffect(() => {
    // わずかな遅延を入れてスムーズに円弧を描画
    const timer = setTimeout(() => {
      setAnimatedPercent(percent);
    }, 150);
    return () => clearTimeout(timer);
  }, [percent]);

  // レベル判定
  const getRankBadge = () => {
    if (percent === 100) {
      return {
        label: "AI MASTER",
        color: "text-amber-300 border-amber-400/40 bg-amber-500/20",
        icon: <Trophy size={13} className="text-amber-300" />,
      };
    }
    if (percent >= 60) {
      return {
        label: "AGENT BUILDER",
        color: "text-cyan-300 border-cyan-400/40 bg-cyan-500/20",
        icon: <Sparkles size={13} className="text-cyan-300" />,
      };
    }
    if (percent > 0) {
      return {
        label: "AI APPRENTICE",
        color: "text-indigo-300 border-indigo-400/40 bg-indigo-500/20",
        icon: <Flame size={13} className="text-indigo-300" />,
      };
    }
    return {
      label: "AI ROOKIE",
      color: "text-slate-300 border-slate-400/30 bg-slate-500/20",
      icon: <Award size={13} className="text-slate-300" />,
    };
  };

  const rank = getRankBadge();

  return (
    <div className="shrink-0 flex items-center gap-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl">
      {/* 円形SVGサイバープログレスリング */}
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
          {/* 背景トラック */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate-800"
            fill="transparent"
          />
          {/* 進捗ライン */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="url(#cyberProgressGrad)"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="cyberProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>

        {/* 中央テキスト */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-black font-mono text-white tracking-tight flex items-baseline">
            <AnimatedCounter value={percent} duration={1000} />
            <span className="text-[10px] text-cyan-300 ml-0.5">%</span>
          </span>
          <span className="text-[9px] text-slate-400 font-mono tracking-wider -mt-0.5">PROGRESS</span>
        </div>
      </div>

      {/* 詳細進捗ステータス */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${rank.color}`}
          >
            {rank.icon}
            <span>{rank.label}</span>
          </span>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span className="text-[11px] text-slate-400">レッスン履修:</span>
            <span className="font-mono font-bold text-cyan-300">
              <AnimatedCounter value={doneLessons} /> / {totalLessons}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span className="text-[11px] text-slate-400">修了コース:</span>
            <span className="font-mono font-bold text-emerald-300">
              {completedCourses} / {totalCourses}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
