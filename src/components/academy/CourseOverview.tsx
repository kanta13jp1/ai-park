"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Award, BookOpen, CheckCircle2, ChevronRight, Circle, Clock, ListChecks, PlayCircle } from "lucide-react";
import { courseMinutes, PASS_RATE, type Course } from "@/data/academy";
import { stepCounts, useCourseProgress } from "./useCourseProgress";

export default function CourseOverview({ course }: { course: Course }) {
  const { progress, nextStep } = useCourseProgress(course);
  const { done, total } = stepCounts(course, progress);
  const nextTitle =
    course.lessons.find((l) => l.id === nextStep)?.title ?? (nextStep === "quiz" ? "評価テスト" : "修了証");
  const sections = [...new Set(course.lessons.map((l) => l.section))];

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">
      {/* ヒーロー */}
      <div className={`${course.color}`}>
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6 items-center">
          <div className="space-y-4">
            <nav className="flex items-center gap-1.5 text-xs text-slate-700">
              <ArrowLeft size={13} />
              <Link href="/academy" className="hover:underline">Academy</Link>
              <span>/</span>
              <span>コース</span>
            </nav>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-slate-900">{course.title}</h1>
            <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">{course.summary}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { icon: BookOpen, text: `${course.lessons.length} レッスン` },
                { icon: Clock, text: `約 ${courseMinutes(course)} 分` },
                { icon: ListChecks, text: `評価テスト ${course.quiz.length} 問` },
                { icon: Award, text: "修了証" },
              ].map((c) => (
                <span key={c.text} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-400/40 bg-white/60 text-slate-800">
                  <c.icon size={13} /> {c.text}
                </span>
              ))}
            </div>
            <div className="space-y-1.5 max-w-md">
              <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${(done / total) * 100}%` }} />
              </div>
              <p className="text-xs text-slate-700">
                {progress.completedAt ? (
                  "✅ 修了済み"
                ) : (
                  <>
                    <span className="font-bold">{done}</span> / {total} 完了・次：{nextTitle}
                  </>
                )}
              </p>
            </div>
            <Link
              href={`/academy/${course.id}/${nextStep}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-sm font-bold"
            >
              {progress.completedAt ? "修了証を見る" : done === 0 ? "コースを始める" : "コースを続ける"}
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="hidden md:flex w-44 h-44 rounded-full bg-white/70 items-center justify-center text-7xl justify-self-center">
            {course.icon}
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        <div className="space-y-8 min-w-0">
          <section className="border border-slate-200 rounded-2xl p-6 space-y-3">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900">このコースで学べること</h2>
              <p className="text-xs text-slate-500">コースを終えると、次のことができるようになります</p>
            </div>
            <ul className="space-y-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2 text-sm text-slate-700">
                  <ChevronRight size={15} className="text-slate-400 shrink-0 mt-0.5" /> {o}
                </li>
              ))}
            </ul>
          </section>

          {course.referenceVideo && (
            <section className="space-y-3">
              <h2 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <PlayCircle size={18} /> 参考動画（公式・英語）
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${course.referenceVideo.id}`}
                  title={course.referenceVideo.title}
                  allowFullScreen
                />
              </div>
              <p className="text-xs text-slate-500">
                {course.referenceVideo.title}（{course.referenceVideo.channel}）・字幕の自動翻訳で日本語表示できます
              </p>
            </section>
          )}

          <p className="text-xs text-slate-500">
            すべてのレッスンを読み、評価テストで {Math.round(PASS_RATE * 100)}% 以上を取ると修了証を発行できます。進み具合はこのブラウザにのみ保存されます。
          </p>
        </div>

        {/* 目次 */}
        <aside className="space-y-5">
          {sections.map((sec) => (
            <div key={sec} className="space-y-1.5">
              <p className="text-xs text-slate-500">{sec}</p>
              {course.lessons
                .filter((l) => l.section === sec)
                .map((l) => (
                  <Link key={l.id} href={`/academy/${course.id}/${l.id}`} className="flex items-start gap-2 text-sm text-slate-800 hover:text-orange-700">
                    {progress.lessonsDone.includes(l.id) ? (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle size={16} className="text-slate-300 shrink-0 mt-0.5" />
                    )}
                    {l.title}
                  </Link>
                ))}
            </div>
          ))}
          <div className="space-y-1.5">
            <p className="text-xs text-slate-500">まとめ</p>
            <Link href={`/academy/${course.id}/quiz`} className="flex items-center gap-2 text-sm text-slate-800 hover:text-orange-700">
              <ListChecks size={16} className={(progress.bestScore ?? 0) >= PASS_RATE ? "text-emerald-600" : "text-slate-300"} />
              評価テスト
            </Link>
            <Link href={`/academy/${course.id}/certificate`} className="flex items-center gap-2 text-sm text-slate-800 hover:text-orange-700">
              <Award size={16} className={progress.completedAt ? "text-emerald-600" : "text-slate-300"} />
              修了証
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
