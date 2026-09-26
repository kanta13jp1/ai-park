"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Award, BookOpen, Clock, ExternalLink, ListChecks, PlayCircle, Printer } from "lucide-react";
import { basePath } from "@/lib/basePath";
import { PASS_RATE, type Course, type LessonBlock } from "@/data/academy";
import { useCourseProgress } from "./useCourseProgress";

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "h":
      return (
        <h3 id={block.id} className="scroll-mt-6 font-serif font-bold text-xl text-slate-900 pt-2">
          {block.text}
        </h3>
      );
    case "p":
      return <p className="text-[15px] text-slate-700 leading-relaxed">{block.text}</p>;
    case "steps":
      return (
        <ol className="list-decimal pl-5 space-y-1.5 text-[15px] text-slate-700 leading-relaxed">
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

export default function LessonView({ course, stepId }: { course: Course; stepId: string }) {
  const router = useRouter();
  const { progress, allLessonsDone, markLessonDone, recordQuizScore, setLearnerName } = useCourseProgress(course);
  const [answers, setAnswers] = useState<(number | null)[]>(course.quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const steps = [...course.lessons.map((l) => ({ id: l.id, label: l.title })), { id: "quiz", label: "評価テスト" }, { id: "certificate", label: "修了証" }];
  const index = steps.findIndex((s) => s.id === stepId);
  const lesson = course.lessons.find((l) => l.id === stepId);
  const headings = lesson?.blocks.filter((b): b is Extract<LessonBlock, { type: "h" }> => b.type === "h") ?? [];
  const go = (id: string) => {
    router.push(`/academy/${course.id}/${id}`);
    window.scrollTo({ top: 0 });
  };

  const score = answers.filter((a, i) => a === course.quiz[i].answer).length / course.quiz.length;
  const passed = score >= PASS_RATE;

  return (
    <div className="flex-1 flex flex-col bg-[#faf9f5] min-h-screen">
      <div className="max-w-6xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <main className="space-y-5 min-w-0">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 print:hidden">
            <ArrowLeft size={13} />
            <Link href="/academy" className="hover:underline">Academy</Link>
            <span>/</span>
            <Link href={`/academy/${course.id}`} className="hover:underline">{course.title}</Link>
          </nav>

          {lesson && (
            <>
              <h1 className="font-serif font-bold text-3xl text-slate-900">{lesson.title}</h1>
              <div className="flex gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-300 bg-white"><BookOpen size={13} />レッスン {index + 1}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-300 bg-white"><Clock size={13} />{lesson.minutes} 分</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {lesson.video ? (
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${lesson.video.id}`}
                      title={lesson.video.title}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/5] bg-slate-100 flex flex-col items-center justify-center text-slate-500 text-xs gap-1">
                    <PlayCircle size={28} />
                    動画レッスンは準備中です。下のテキストと画面キャプチャで学べます。
                  </div>
                )}
                <div className="px-4 py-3 space-y-1 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-900">
                    {lesson.video ? `${lesson.video.title}（${lesson.video.channel}・英語）` : lesson.title}
                  </p>
                  <p className="text-xs text-slate-600">{lesson.summary}</p>
                </div>
              </div>
              {lesson.video && (
                <a
                  href={`https://www.youtube.com/watch?v=${lesson.video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-600 underline"
                >
                  YouTube で見る（字幕の自動翻訳で日本語表示できます） <ExternalLink size={11} />
                </a>
              )}

              <article className="space-y-4 pt-2">
                {lesson.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </article>

              <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
                {index > 0 ? (
                  <button onClick={() => go(steps[index - 1].id)} className="text-sm text-slate-600 hover:underline cursor-pointer">
                    ← {steps[index - 1].label}
                  </button>
                ) : (
                  <span />
                )}
                <button
                  onClick={() => {
                    markLessonDone(lesson.id);
                    go(steps[index + 1].id);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-sm font-bold cursor-pointer"
                >
                  完了して次へ：{steps[index + 1].label} →
                </button>
              </div>
            </>
          )}

          {stepId === "quiz" && (
            <>
              <h1 className="font-serif font-bold text-3xl text-slate-900">評価テスト</h1>
              <p className="text-xs text-slate-500">{course.quiz.length} 問・{Math.round(PASS_RATE * 100)}% 以上で合格</p>
              <ol className="space-y-5 bg-white border border-slate-200 rounded-2xl p-6">
                {course.quiz.map((q, qi) => (
                  <li key={q.q} className="space-y-2">
                    <p className="text-sm font-bold text-slate-900">Q{qi + 1}. {q.q}</p>
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
              <div className="flex flex-wrap items-center justify-end gap-3">
                {submitted ? (
                  <>
                    <p className={`text-sm font-bold ${passed ? "text-emerald-700" : "text-rose-700"}`}>
                      {Math.round(score * 100)}% 正解・{passed ? "合格です！" : "もう一度挑戦しましょう"}
                      {passed && !allLessonsDone && "（未完了のレッスンを終えると修了証を発行できます）"}
                    </p>
                    {passed && allLessonsDone ? (
                      <button onClick={() => go("certificate")} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold cursor-pointer">
                        修了証を見る
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setAnswers(course.quiz.map(() => null));
                          setSubmitted(false);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold cursor-pointer"
                      >
                        もう一度解く
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setSubmitted(true);
                      recordQuizScore(score);
                    }}
                    disabled={answers.some((a) => a === null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold disabled:opacity-40 cursor-pointer"
                  >
                    採点する
                  </button>
                )}
              </div>
            </>
          )}

          {stepId === "certificate" &&
            (progress.completedAt && progress.certificateId ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-end gap-3 print:hidden">
                  <label className="text-xs text-slate-700 space-y-1">
                    <span className="font-bold block">修了証に載せる氏名</span>
                    <input
                      value={progress.learnerName ?? ""}
                      onChange={(e) => setLearnerName(e.target.value)}
                      placeholder="例: 山田 太郎"
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
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
                  <h1 className="font-serif text-3xl font-bold text-slate-900">修了証</h1>
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
                    <p className="pt-2 font-bold text-slate-700">MightyLINK AI推進担当 / AI Park</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl text-center py-12 space-y-2">
                <Award className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">まだ修了していません</p>
                <p className="text-xs text-slate-500">
                  すべてのレッスン（{progress.lessonsDone.length} / {course.lessons.length} 完了）を読み、評価テストで {Math.round(PASS_RATE * 100)}% 以上を取ると修了証を発行できます。
                </p>
              </div>
            ))}
        </main>

        {/* 右側：レッスン切り替え＆ページ内目次 */}
        <aside className="space-y-4 print:hidden lg:sticky lg:top-6 self-start">
          <label className="block bg-white border border-slate-200 rounded-xl px-4 py-3 space-y-1">
            <span className="text-[11px] text-slate-500 block">
              {lesson ? `レッスン ${index + 1} / ${course.lessons.length}` : stepId === "quiz" ? "評価テスト" : "修了証"}・{course.title}
            </span>
            <select
              value={stepId}
              onChange={(e) => go(e.target.value)}
              className="w-full text-sm font-bold text-slate-900 bg-transparent cursor-pointer"
            >
              {steps.map((s, i) => (
                <option key={s.id} value={s.id}>
                  {i < course.lessons.length ? `${i + 1}. ` : ""}
                  {s.label}
                  {progress.lessonsDone.includes(s.id) ? " ✓" : ""}
                </option>
              ))}
            </select>
          </label>
          {headings.length > 0 && (
            <nav className="border-l-2 border-slate-200 space-y-2 pl-3">
              {headings.map((h) => (
                <a key={h.id} href={`#${h.id}`} className="block text-sm text-slate-600 hover:text-slate-900">
                  {h.text}
                </a>
              ))}
            </nav>
          )}
          <Link href={`/academy/${course.id}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:underline">
            <ListChecks size={13} /> コースの目次に戻る
          </Link>
        </aside>
      </div>
    </div>
  );
}
