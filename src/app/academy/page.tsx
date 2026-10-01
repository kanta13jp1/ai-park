"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, BookOpen, Clock, ListChecks, Sparkles, ArrowRight, CheckCircle2, Trophy, Flame } from "lucide-react";
import { courses, courseMinutes } from "@/data/academy";
import { loadProgress, type CourseProgress } from "@/lib/academyProgress";
import { stepCounts } from "@/components/academy/useCourseProgress";
import HeroBanner from "@/components/HeroBanner";
import SpotlightCard from "@/components/SpotlightCard";

export default function AcademyPage() {
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});

  useEffect(() => {
    // localStorage はブラウザでのみ読めるため、表示後に反映する
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress());
  }, []);

  const inProgress = courses.filter((c) => {
    const p = progress[c.id];
    return p && !p.completedAt && (p.lessonsDone.length > 0 || p.bestScore !== undefined);
  });

  const completedCount = courses.filter((c) => progress[c.id]?.completedAt).length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50/70 min-h-screen">
      {/* ヒーローヘッダー */}
      <HeroBanner
        title="Antigravity Academy"
        subtitle="全12レッスンと実践評価テストで習得する、Google Antigravity 社内公式マスターパス"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* アカデミーステータス HUD バナー */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-700/50 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 tracking-wider">
                  OFFICIAL CURRICULUM
                </span>
                <span className="text-xs text-indigo-200">全3コース・12レッスン・修了証発行機能</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                体系的なステップで「プロンプトからエージェント共創」へ
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Antigravity の基本セットアップから、Subagents 並列オーケストレーション、外部 MCP ツール連携、社内セキュリティ基準（Level 1〜3）までを完全網羅。各コースの確認テストで80%以上を獲得すると、デジタル修了証が即時発行されます。
              </p>
            </div>

            {/* スタッツウィジェット */}
            <div className="shrink-0 flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="text-center px-3 border-r border-white/10">
                <div className="text-2xl font-black text-cyan-300 font-mono">12</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Lessons</div>
              </div>
              <div className="text-center px-3 border-r border-white/10">
                <div className="text-2xl font-black text-emerald-300 font-mono">{completedCount}/3</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Completed</div>
              </div>
              <div className="text-center px-3">
                <div className="text-2xl font-black text-amber-300 font-mono">100%</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Free & Fast</div>
              </div>
            </div>
          </div>
        </div>

        {/* 学習再開セクション（進行中がある場合） */}
        {inProgress.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center space-x-2">
              <Flame size={20} className="text-amber-500 animate-pulse" />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">学習の続きから再開</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {inProgress.map((c) => {
                const { done, total } = stepCounts(c, progress[c.id]);
                const pct = Math.round((done / total) * 100);
                return (
                  <SpotlightCard
                    key={c.id}
                    spotlightColor="rgba(99, 102, 241, 0.15)"
                    className="border-indigo-200/80 bg-white"
                  >
                    <Link href={`/academy/${c.id}`} className="group p-5 flex flex-col justify-between h-full space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                          {c.icon}
                        </div>
                        <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full">
                          {pct}% 完了
                        </span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors text-base leading-snug">
                          {c.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {done} / {total} ステップ達成中
                        </p>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                          <span>レッスンを続ける</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </SpotlightCard>
                );
              })}
            </div>
          </section>
        )}

        {/* コース一覧グリッド */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2 tracking-tight">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>全カリキュラム一覧</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">※ブラウザ内に進捗と修了証が自動保存されます</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => {
              const p = progress[c.id];
              const done = p?.lessonsDone.length ?? 0;
              const isFinished = !!p?.completedAt;

              return (
                <SpotlightCard
                  key={c.id}
                  spotlightColor="rgba(14, 165, 233, 0.18)"
                  className="bg-white border-slate-200/90 hover:border-indigo-400/80"
                >
                  <Link
                    href={`/academy/${c.id}`}
                    className="group flex flex-col justify-between h-full p-6 space-y-5"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/80 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xs">
                          {c.icon}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70">
                            {c.level}
                          </span>
                          {isFinished && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 size={10} /> 修了済み
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors text-base leading-snug">
                          {c.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {c.summary}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                        <span className="inline-flex items-center gap-1">
                          <BookOpen size={12} className="text-indigo-500" />
                          {c.lessons.length} レッスン
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ListChecks size={12} className="text-cyan-500" />
                          評価テスト {c.quiz.length} 問
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} className="text-amber-500" />
                          約 {courseMinutes(c)} 分
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Award size={12} className="text-emerald-500" />
                          修了証発行
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      {isFinished ? (
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                          <span className="flex items-center gap-1">
                            <Trophy size={14} /> 修了証を確認
                          </span>
                          <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span>進捗状況</span>
                            <span className="font-mono font-bold text-slate-700">
                              {done === 0 ? "未受講" : `${done} / ${c.lessons.length} 完了`}
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full"
                              style={{ width: `${(done / c.lessons.length) * 100}%` }}
                            />
                          </div>
                          <div className="pt-2 flex items-center justify-end text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                            <span>コースを学ぶ</span>
                            <ArrowRight size={14} className="ml-1 group-hover:translate-x-1.5 transition-transform" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </SpotlightCard>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
