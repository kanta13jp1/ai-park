"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Award, BookOpen, Camera, Check, Clock, Copy, ExternalLink, ListChecks, PlayCircle, Printer, ThumbsDown, ThumbsUp } from "lucide-react";
import { basePath } from "@/lib/basePath";
import { PASS_RATE, type Course, type LessonBlock } from "@/data/academy";
import { useCourseProgress } from "./useCourseProgress";

function CodeBlock({ label, text }: { label?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-1">
      {label && <p className="text-xs font-bold text-slate-600">{label}</p>}
      <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
        <code className="flex-1 font-mono text-[13px] text-slate-800 break-all whitespace-pre-wrap">{text}</code>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(text).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="shrink-0 text-slate-500 hover:text-slate-900 cursor-pointer"
          title="コピー"
        >
          {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

// 修了の社内記録：公開の GitHub には載せず、報告文をコピーして Google Chat で AI推進担当 に送ってもらう
function CompletionReport({
  courseTitle,
  learnerName,
  score,
  completedAt,
  certificateId,
}: {
  courseTitle: string;
  learnerName: string;
  score: number;
  completedAt: string;
  certificateId: string;
}) {
  const [dept, setDept] = useState("");
  const [copied, setCopied] = useState(false);
  const text = [
    "【Antigravity Academy 修了報告】",
    `コース: ${courseTitle}`,
    `氏名: ${learnerName}`,
    `部署: ${dept}`,
    `評価テスト: ${Math.round(score * 100)}%`,
    `修了日: ${new Date(completedAt).toLocaleDateString("ja-JP")}`,
    `修了証番号: ${certificateId}`,
  ].join("\n");
  const ready = learnerName.trim() !== "" && dept.trim() !== "";
  return (
    <div className="print:hidden bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
      <div className="space-y-1">
        <h3 className="font-bold text-sm text-slate-900">修了を AI推進担当 に報告する</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          報告すると、AI推進担当 が修了者として記録します（記録は社内のみで、このサイトには載りません）。報告文をコピーして、Google Chat で AI推進担当（担当：梅澤）に送ってください。
          このボタンだけでは送信されません。
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs text-slate-700 space-y-1">
          <span className="font-bold block">部署</span>
          <input
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            placeholder="例: クラウド開発部"
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          />
        </label>
        <button
          onClick={() =>
            navigator.clipboard?.writeText(text).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
          }
          disabled={!ready}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold disabled:opacity-40 cursor-pointer"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "コピーしました" : "報告文をコピー"}
        </button>
        <a
          href="https://chat.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:underline"
        >
          Google Chat を開く <ExternalLink size={12} />
        </a>
      </div>
      {!ready && <p className="text-[11px] text-slate-500">上の「修了証に載せる氏名」と部署を入力すると、報告文をコピーできます。</p>}
      <pre className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 whitespace-pre-wrap font-sans">{text}</pre>
    </div>
  );
}

function PromptCard({ label, text }: { label?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 pt-3">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        {label && <span className="ml-2 text-xs font-bold text-slate-500">{label}</span>}
      </div>
      <p className="mx-3 mt-2 border border-slate-200 rounded-xl px-4 py-3 text-[15px] text-slate-800 leading-relaxed whitespace-pre-wrap">{text}</p>
      <div className="flex justify-end px-4 py-3">
        <button
          onClick={() =>
            navigator.clipboard?.writeText(text).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            })
          }
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          {copied ? "コピーしました" : "プロンプトをコピー"}
        </button>
      </div>
    </div>
  );
}

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "prompt":
      return <PromptCard label={block.label} text={block.text} />;
    case "shot":
      return (
        <figure className="rounded-xl border-2 border-dashed border-slate-300 bg-[#f3f1ea] px-6 py-10 text-center text-slate-500 space-y-1">
          <Camera size={26} className="mx-auto" />
          <p className="text-sm font-bold">画面キャプチャ準備中：{block.alt}</p>
          <p className="text-xs">{block.todo}</p>
        </figure>
      );
    case "code":
      return <CodeBlock label={block.label} text={block.text} />;
    case "link":
      return (
        <a href={block.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
          {block.text} <ExternalLink size={13} />
        </a>
      );
    case "h":
      return (
        <h3 id={block.id} className="scroll-mt-6 font-bold text-xl sm:text-2xl text-slate-900 pt-6 tracking-tight">
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
        <figure className="bg-[#f3f1ea] rounded-xl p-4 sm:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${basePath}/images/guide/${block.file}`} alt={block.alt} className="w-full rounded-lg border border-slate-200 shadow-md" />
        </figure>
      );
  }
}

// 「このレッスンは役に立ちましたか？」（評価はこのブラウザにのみ保存）
function Helpful({ lessonKey }: { lessonKey: string }) {
  const storageKey = `ai_park_academy_helpful_${lessonKey}`;
  const [vote, setVote] = useState<string | null>(null);
  const choose = (v: "up" | "down") => {
    setVote(v);
    try {
      localStorage.setItem(storageKey, v);
    } catch {
      // 保存できない環境では表示のみ切り替える
    }
  };
  return (
    <div className="bg-[#f3f1ea] border border-slate-200 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
      <p className="font-serif font-bold text-slate-900">
        {vote ? "ご回答ありがとうございます。" : "このレッスンは役に立ちましたか？"}
      </p>
      {vote ? (
        <Link href="/feedback-todo" className="text-sm text-blue-700 underline">
          分かりにくかった点はご意見ボードへ
        </Link>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => choose("up")} title="役に立った" className="w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
            <ThumbsUp size={16} />
          </button>
          <button onClick={() => choose("down")} title="分かりにくかった" className="w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
            <ThumbsDown size={16} />
          </button>
        </div>
      )}
    </div>
  );
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
    <div className="flex-1 flex flex-col bg-slate-50/70 min-h-screen">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <main className="space-y-6 min-w-0">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 print:hidden">
            <ArrowLeft size={13} />
            <Link href="/academy" className="hover:text-indigo-600 transition-colors">Academy</Link>
            <span>/</span>
            <Link href={`/academy/${course.id}`} className="hover:text-indigo-600 transition-colors">{course.title}</Link>
          </nav>

          {lesson && (
            <>
              <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-snug">{lesson.title}</h1>
              <div className="flex gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white font-mono text-[11px] font-bold text-slate-700 shadow-2xs"><BookOpen size={13} className="text-indigo-600" />レッスン {index + 1}</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white font-mono text-[11px] font-bold text-slate-700 shadow-2xs"><Clock size={13} className="text-amber-500" />{lesson.minutes} 分</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {lesson.ownVideo ? (
                  <video
                    controls
                    preload="metadata"
                    poster={`${basePath}/videos/academy/${lesson.ownVideo}.jpg`}
                    className="w-full aspect-video bg-black"
                  >
                    <source src={`${basePath}/videos/academy/${lesson.ownVideo}.mp4`} type="video/mp4" />
                    <track kind="captions" srcLang="ja" label="日本語" src={`${basePath}/videos/academy/${lesson.ownVideo}.vtt`} default />
                  </video>
                ) : lesson.video ? (
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
                    {lesson.ownVideo
                      ? `${lesson.title}（AI推進担当 作成・字幕付き／音声：Gemini 3.8 Flash TTS）`
                      : lesson.video
                      ? `${lesson.video.title}（${lesson.video.channel}・英語）`
                      : lesson.title}
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
                  {lesson.ownVideo
                    ? `参考：公式動画「${lesson.video.title}」（${lesson.video.channel}・英語）を YouTube で見る`
                    : "YouTube で見る（字幕の自動翻訳で日本語表示できます）"}{" "}
                  <ExternalLink size={11} />
                </a>
              )}

              <article className="space-y-4 pt-2">
                {lesson.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </article>

              <Helpful lessonKey={`${course.id}/${lesson.id}`} />

              <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {index > 0 ? (
                  <button
                    onClick={() => go(steps[index - 1].id)}
                    className="flex items-center gap-3 text-left bg-white border border-slate-200 rounded-xl px-4 py-4 hover:border-slate-400 cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><ArrowLeft size={15} /></span>
                    <span>
                      <span className="block text-xs text-slate-500">前のレッスン</span>
                      <span className="block text-sm font-bold text-slate-900">{steps[index - 1].label}</span>
                    </span>
                  </button>
                ) : (
                  <span />
                )}
                <button
                  onClick={() => {
                    markLessonDone(lesson.id);
                    go(steps[index + 1].id);
                  }}
                  className="flex items-center justify-end gap-3 text-right bg-slate-900 hover:bg-slate-700 text-white rounded-xl px-4 py-4 cursor-pointer"
                >
                  <span>
                    <span className="block text-xs text-slate-300">完了して次へ</span>
                    <span className="block text-sm font-bold">{steps[index + 1].label}</span>
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0"><ArrowRight size={15} /></span>
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
                <CompletionReport
                  courseTitle={course.title}
                  learnerName={progress.learnerName ?? ""}
                  score={progress.bestScore ?? 0}
                  completedAt={progress.completedAt}
                  certificateId={progress.certificateId}
                />
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
