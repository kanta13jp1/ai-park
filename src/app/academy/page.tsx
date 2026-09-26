"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, BookOpen, Clock, ListChecks } from "lucide-react";
import { courses, courseMinutes } from "@/data/academy";
import { loadProgress, type CourseProgress } from "@/lib/academyProgress";

export default function AcademyPage() {
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});

  useEffect(() => {
    // localStorage はブラウザでのみ読めるため、表示後に反映する
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress());
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#faf9f5] min-h-screen">
      <div className="max-w-5xl w-full mx-auto px-4 py-10 space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-bold text-orange-700 tracking-wide">MightyLINK AI推進担当</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">Antigravity Academy</h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            レッスンと評価テストを備えた体系的な学習パスで、Antigravity を仕事で安全に使うための知識を身につけます。
            すべてのレッスンを読み、評価テストで 80% 以上を取ると修了証を発行できます。
          </p>
          <p className="text-[11px] text-slate-500">
            ※ 学習の進み具合と修了証は、このブラウザにのみ保存されます。動画レッスンは順次追加予定です（現在はテキストと画面キャプチャで学べます）。
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-slate-900">コース</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c) => {
              const p = progress[c.id];
              const done = p?.lessonsDone.length ?? 0;
              return (
                <Link
                  key={c.id}
                  href={`/academy/${c.id}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col"
                >
                  <div className={`${c.color} h-32 flex items-center justify-center`}>
                    <span className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center text-4xl">{c.icon}</span>
                  </div>
                  <div className="p-5 space-y-2 flex-1 flex flex-col">
                    <span className="self-start text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{c.level}</span>
                    <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug group-hover:text-orange-700">{c.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed flex-1">{c.summary}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-1">
                      <span className="inline-flex items-center gap-1"><BookOpen size={12} />{c.lessons.length} レッスン</span>
                      <span className="inline-flex items-center gap-1"><ListChecks size={12} />評価テスト {c.quiz.length} 問</span>
                      <span className="inline-flex items-center gap-1"><Clock size={12} />約 {courseMinutes(c)} 分</span>
                      <span className="inline-flex items-center gap-1"><Award size={12} />修了証</span>
                    </div>
                    <div className="pt-2">
                      {p?.completedAt ? (
                        <span className="text-xs font-bold text-emerald-700">✅ 修了済み</span>
                      ) : (
                        <div className="space-y-1">
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${(done / c.lessons.length) * 100}%` }} />
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {done === 0 ? "未受講" : `${done} / ${c.lessons.length} レッスン完了`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
