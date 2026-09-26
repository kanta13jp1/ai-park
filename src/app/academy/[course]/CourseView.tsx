"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Award, CheckCircle2, Circle, ListChecks, PlayCircle, Printer } from "lucide-react";
import { basePath } from "@/lib/basePath";
import { PASS_RATE, type Course, type LessonBlock } from "@/data/academy";
import { loadProgress, newCertificateId, saveCourseProgress, type CourseProgress } from "@/lib/academyProgress";

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-sm text-slate-700 leading-relaxed">{block.text}</p>;
    case "steps":
      return (
        <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-700 leading-relaxed">
          {block.items.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      );
    case "tip":
      return <p className="text-sm bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 text-sky-900 leading-relaxed">💡 {block.text}</p>;
    case "warn":
      return <p className="text-sm bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-amber-900 leading-relaxed">⚠️ {block.text}</p>;
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${basePath}/images/guide/${block.file}`} alt={block.alt} className="w-full rounded-lg border border-slate-200" />
      );
  }
}

export default function CourseView({ course }: { course: Course }) {
  const quizStep = course.lessons.length;
  const certStep = quizStep + 1;
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState<CourseProgress>({ lessonsDone: [] });
  const [answers, setAnswers] = useState<(number | null)[]>(course.quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // localStorage はブラウザでのみ読めるため、表示後に反映する
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress()[course.id] ?? { lessonsDone: [] });
  }, [course.id]);

  const update = (next: CourseProgress) => {
    setProgress(next);
    saveCourseProgress(course.id, next);
  };

  const allLessonsDone = course.lessons.every((l) => progress.lessonsDone.includes(l.id));

  const completeLesson = (index: number) => {
    const id = course.lessons[index].id;
    if (!progress.lessonsDone.includes(id)) {
      const lessonsDone = [...progress.lessonsDone, id];
      // 先に評価テストに合格していれば、最後のレッスン完了時に修了とする
      const nowComplete =
        !progress.completedAt &&
        (progress.bestScore ?? 0) >= PASS_RATE &&
        course.lessons.every((l) => lessonsDone.includes(l.id));
      update({
        ...progress,
        lessonsDone,
        ...(nowComplete ? { completedAt: new Date().toISOString(), certificateId: newCertificateId(course.id) } : {}),
      });
    }
    setStep(index + 1);
    window.scrollTo({ top: 0 });
  };

  const score = answers.filter((a, i) => a === course.quiz[i].answer).length / course.quiz.length;
  const passed = score >= PASS_RATE;

  const submitQuiz = () => {
    setSubmitted(true);
    const best = Math.max(progress.bestScore ?? 0, score);
    const completes = score >= PASS_RATE && allLessonsDone && !progress.completedAt;
    update({
      ...progress,
      bestScore: best,
      ...(completes ? { completedAt: new Date().toISOString(), certificateId: newCertificateId(course.id) } : {}),
    });
  };

  const retryQuiz = () => {
    setAnswers(course.quiz.map(() => null));
    setSubmitted(false);
  };

  const lesson = step < quizStep ? course.lessons[step] : null;

  return (
    <div className="flex-1 flex flex-col bg-[#faf9f5] min-h-screen">
      <div className="max-w-6xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* 目次 */}
        <aside className="space-y-3 print:hidden">
          <Link href="/academy" className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900">
            <ArrowLeft size={13} /> Academy
          </Link>
          <h1 className="font-serif font-bold text-lg text-slate-900 leading-snug">{course.title}</h1>
          <nav className="bg-white border border-slate-200 rounded-xl p-2 space-y-0.5">
            {course.lessons.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setStep(i)}
                className={`w-full text-left flex items-start gap-2 px-2.5 py-2 rounded-lg text-xs cursor-pointer ${
                  step === i ? "bg-orange-50 text-orange-900 font-bold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {progress.lessonsDone.includes(l.id) ? (
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Circle size={14} className="text-slate-300 shrink-0 mt-0.5" />
                )}
                <span>{i + 1}. {l.title}</span>
              </button>
            ))}
            <button
              onClick={() => setStep(quizStep)}
              className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs cursor-pointer ${
                step === quizStep ? "bg-orange-50 text-orange-900 font-bold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ListChecks size={14} className={progress.bestScore !== undefined ? "text-emerald-600" : "text-slate-300"} />
              評価テスト
            </button>
            <button
              onClick={() => setStep(certStep)}
              className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs cursor-pointer ${
                step === certStep ? "bg-orange-50 text-orange-900 font-bold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Award size={14} className={progress.completedAt ? "text-emerald-600" : "text-slate-300"} />
              修了証
            </button>
          </nav>
        </aside>

        <main className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 min-w-0">
          {lesson && (
            <>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">レッスン {step + 1} / {course.lessons.length}・約 {lesson.minutes} 分</p>
                <h2 className="font-serif font-bold text-2xl text-slate-900">{lesson.title}</h2>
              </div>
              {lesson.video ? (
                <div className="aspect-video rounded-xl overflow-hidden border border-slate-200">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${lesson.video}`}
                    title={lesson.title}
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                  <PlayCircle size={16} /> 動画レッスンは準備中です。下のテキストと画面キャプチャで学べます。
                </div>
              )}
              <div className="space-y-4">
                {lesson.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => completeLesson(step)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-sm font-bold cursor-pointer"
                >
                  {step + 1 < course.lessons.length ? "完了して次のレッスンへ" : "完了して評価テストへ"}
                </button>
              </div>
            </>
          )}

          {step === quizStep && (
            <>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">評価テスト・{course.quiz.length} 問（{Math.round(PASS_RATE * 100)}% 以上で合格）</p>
                <h2 className="font-serif font-bold text-2xl text-slate-900">評価テスト</h2>
              </div>
              <ol className="space-y-5">
                {course.quiz.map((q, qi) => (
                  <li key={q.q} className="space-y-2">
                    <p className="text-sm font-bold text-slate-900">
                      Q{qi + 1}. {q.q}
                    </p>
                    <div className="space-y-1.5">
                      {q.choices.map((c, ci) => {
                        const chosen = answers[qi] === ci;
                        const state = submitted ? (ci === q.answer ? "correct" : chosen ? "wrong" : "") : "";
                        return (
                          <label
                            key={c}
                            className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border cursor-pointer ${
                              state === "correct"
                                ? "border-emerald-400 bg-emerald-50"
                                : state === "wrong"
                                ? "border-rose-400 bg-rose-50"
                                : chosen
                                ? "border-orange-400 bg-orange-50"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q${qi}`}
                              checked={chosen}
                              disabled={submitted}
                              onChange={() => setAnswers(answers.map((a, i) => (i === qi ? ci : a)))}
                            />
                            {c}
                          </label>
                        );
                      })}
                    </div>
                    {submitted && <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">{q.explanation}</p>}
                  </li>
                ))}
              </ol>
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                {submitted ? (
                  <>
                    <p className={`text-sm font-bold ${passed ? "text-emerald-700" : "text-rose-700"}`}>
                      {Math.round(score * 100)}% 正解・{passed ? "合格です！" : "もう一度挑戦しましょう"}
                      {passed && !allLessonsDone && "（未完了のレッスンを終えると修了証を発行できます）"}
                    </p>
                    {passed && allLessonsDone ? (
                      <button onClick={() => setStep(certStep)} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold cursor-pointer">
                        修了証を見る
                      </button>
                    ) : (
                      <button onClick={retryQuiz} className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold cursor-pointer">
                        もう一度解く
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={submitQuiz}
                    disabled={answers.some((a) => a === null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold disabled:opacity-40 cursor-pointer"
                  >
                    採点する
                  </button>
                )}
              </div>
            </>
          )}

          {step === certStep && (
            <>
              {progress.completedAt && progress.certificateId ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-end gap-3 print:hidden">
                    <label className="text-xs text-slate-700 space-y-1">
                      <span className="font-bold block">修了証に載せる氏名</span>
                      <input
                        value={progress.learnerName ?? ""}
                        onChange={(e) => update({ ...progress, learnerName: e.target.value })}
                        placeholder="例: 山田 太郎"
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </label>
                    <button
                      onClick={() => window.print()}
                      disabled={!progress.learnerName}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold disabled:opacity-40 cursor-pointer"
                    >
                      <Printer size={15} /> 印刷・PDF で保存
                    </button>
                  </div>
                  <div className="print-area border-8 border-double border-orange-300 rounded-2xl p-10 text-center space-y-4 bg-[#fffdf8]">
                    <p className="text-xs tracking-[0.3em] text-orange-700 font-bold">CERTIFICATE OF COMPLETION</p>
                    <h2 className="font-serif text-3xl font-bold text-slate-900">修了証</h2>
                    <p className="text-2xl font-serif text-slate-900 border-b border-slate-300 inline-block px-8 pb-1">
                      {progress.learnerName || "（氏名を入力してください）"}
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      あなたは Antigravity Academy のコース
                      <br />
                      <span className="font-bold text-base">「{course.title}」</span>
                      <br />
                      のすべてのレッスンと評価テストを修了したことを証します。
                    </p>
                    <div className="text-xs text-slate-500 space-y-0.5 pt-2">
                      <p>修了日：{new Date(progress.completedAt).toLocaleDateString("ja-JP")}</p>
                      <p>修了証番号：{progress.certificateId}</p>
                      <p className="pt-2 font-bold text-slate-700">MightyLINK AI CoE / AI Park</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <Award className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-700">まだ修了していません</p>
                  <p className="text-xs text-slate-500">
                    すべてのレッスン（{progress.lessonsDone.length} / {course.lessons.length} 完了）を読み、評価テストで {Math.round(PASS_RATE * 100)}% 以上を取ると修了証を発行できます。
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
