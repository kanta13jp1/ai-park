"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Award, BookOpen, CheckCircle2, ChevronRight, Circle, Clock, ListChecks, PlayCircle, Sparkles } from "lucide-react";
import { courseMinutes, PASS_RATE, type Course } from "@/data/academy";
import { stepCounts, useCourseProgress } from "./useCourseProgress";

export default function CourseOverview({ course }: { course: Course }) {
  const { progress, nextStep } = useCourseProgress(course);
  const { done, total } = stepCounts(course, progress);
  const nextTitle =
    course.lessons.find((l) => l.id === nextStep)?.title ?? (nextStep === "quiz" ? "評価テスト" : "修了証");
  const sections = [...new Set(course.lessons.map((l) => l.section))];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/70 min-h-screen">
      {/* ヒーローヘッダー */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6 items-center relative z-10">
          <div className="space-y-4">
            <nav className="flex items-center gap-2 text-xs text-slate-300">
              <Link href="/academy" className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors">
                <ArrowLeft size={13} />
                <span>Academy トップ</span>
              </Link>
              <span className="text-slate-500">/</span>
              <span className="text-cyan-400 font-mono font-medium">{course.level}</span>
            </nav>

            <h1 className="font-black text-2xl sm:text-4xl text-white tracking-tight leading-snug">
              {course.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-light">
              {course.summary}
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { icon: BookOpen, text: `${course.lessons.length} レッスン` },
                { icon: Clock, text: `約 ${courseMinutes(course)} 分` },
                { icon: ListChecks, text: `評価テスト ${course.quiz.length} 問` },
                { icon: Award, text: "デジタル修了証" },
              ].map((c) => (
                <span
                  key={c.text}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-200 backdrop-blur-md text-[11px]"
                >
                  <c.icon size={13} className="text-cyan-400" /> {c.text}
                </span>
              ))}
            </div>

            <div className="space-y-2 max-w-md pt-2">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-300 flex items-center justify-between">
                {progress.completedAt ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> コース修了済み
                  </span>
                ) : (
                  <>
                    <span>
                      <strong className="text-cyan-300 font-mono">{done}</strong> / {total} ステップ完了
                    </span>
                    <span className="text-slate-400 text-[11px]">次：{nextTitle}</span>
                  </>
                )}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/academy/${course.id}/${nextStep}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95"
              >
                <span>{progress.completedAt ? "修了証を見る" : done === 0 ? "レッスンを始める" : "レッスンを続ける"}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="hidden md:flex w-44 h-44 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md items-center justify-center text-7xl justify-self-center shadow-2xl">
            {course.icon}
          </div>
        </div>
      </div>

      {/* メインコンテンツ & 目次 */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-8 min-w-0">
          {/* このコースで学べること */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Sparkles size={18} className="text-indigo-600" />
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                このコースで習得できること
              </h2>
            </div>
            <ul className="space-y-3">
              {course.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 公式参考動画 */}
          {course.referenceVideo && (
            <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2 tracking-tight">
                <PlayCircle size={18} className="text-rose-500" />
                <span>参考動画（Google 公式・英語）</span>
              </h2>
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${course.referenceVideo.id}`}
                  title={course.referenceVideo.title}
                  allowFullScreen
                />
              </div>
              <p className="text-xs text-slate-500">
                {course.referenceVideo.title}（{course.referenceVideo.channel}）※ YouTubeの自動翻訳機能で日本語字幕を表示できます。
              </p>
            </section>
          )}

          <div className="bg-indigo-50/60 border border-indigo-200/60 rounded-2xl p-4 text-xs text-indigo-900/80 leading-relaxed">
            💡 全てのレッスンを完了し、評価テストで {Math.round(PASS_RATE * 100)}% 以上正解すると、ブラウザ上で公式修了証を発行・ダウンロードできます。
          </div>
        </div>

        {/* 右サイドバー：レッスン目次 */}
        <aside className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider font-mono">
              CURRICULUM SYLLABUS
            </h3>

            {sections.map((sec) => (
              <div key={sec} className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 font-mono tracking-wide">{sec}</p>
                <div className="space-y-1">
                  {course.lessons
                    .filter((l) => l.section === sec)
                    .map((l) => {
                      const isDone = progress.lessonsDone.includes(l.id);
                      return (
                        <Link
                          key={l.id}
                          href={`/academy/${course.id}/${l.id}`}
                          className="flex items-start gap-2.5 p-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          {isDone ? (
                            <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <Circle size={15} className="text-slate-300 shrink-0 mt-0.5" />
                          )}
                          <span className={isDone ? "text-slate-500 line-through" : "font-medium"}>
                            {l.title}
                          </span>
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 font-mono tracking-wide">COMPLETION</p>
              <div className="space-y-1">
                <Link
                  href={`/academy/${course.id}/quiz`}
                  className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <ListChecks
                    size={16}
                    className={(progress.bestScore ?? 0) >= PASS_RATE ? "text-emerald-500" : "text-cyan-600"}
                  />
                  <span>評価テスト ({course.quiz.length}問)</span>
                </Link>
                <Link
                  href={`/academy/${course.id}/certificate`}
                  className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <Award
                    size={16}
                    className={progress.completedAt ? "text-emerald-500" : "text-amber-500"}
                  />
                  <span>修了証の発行</span>
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
