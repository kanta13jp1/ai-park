with open('src/components/academy/LessonView.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Imports
import_old = '''import { PASS_RATE, type Course, type LessonBlock } from "@/data/academy";
import { useCourseProgress } from "./useCourseProgress";'''

import_new = '''import { PASS_RATE, type Course, type LessonBlock } from "@/data/academy";
import { useCourseProgress } from "./useCourseProgress";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";'''

code = code.replace(import_old, import_new, 1)

# 2. CodeBlock copy button
codeblock_old = '''        <button
          onClick={() => {
            navigator.clipboard?.writeText(text).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="shrink-0 text-slate-500 hover:text-slate-900 cursor-pointer"
          title="コピー"
        >'''

codeblock_new = '''        <button
          onClick={() => {
            playCyberClick();
            navigator.clipboard?.writeText(text).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          onMouseEnter={() => playCyberHover()}
          className="shrink-0 text-slate-500 hover:text-slate-900 cursor-pointer"
          title="コピー"
        >'''

code = code.replace(codeblock_old, codeblock_new, 1)

# 3. CompletionReport
comp_old = '''        <button
          onClick={() =>
            navigator.clipboard?.writeText(text).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
          }
          disabled={!ready}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold disabled:opacity-40 cursor-pointer"
        >'''

comp_new = '''        <button
          onClick={() => {
            playCyberClick();
            navigator.clipboard?.writeText(text).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}
          onMouseEnter={() => playCyberHover()}
          disabled={!ready}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold disabled:opacity-40 cursor-pointer"
        >'''

code = code.replace(comp_old, comp_new, 1)

# 4. PromptCard
prompt_old = '''function PromptCard({ label, text }: { label?: string; text: string }) {
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
}'''

prompt_new = '''function PromptCard({ label, text }: { label?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-2xl">
      <div
        onMouseEnter={() => playCyberHover()}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden cursor-default"
      >
        <div className="flex items-center gap-1.5 px-4 pt-3">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          {label && <span className="ml-2 text-xs font-bold text-slate-500">{label}</span>}
        </div>
        <p className="mx-3 mt-2 border border-slate-200 rounded-xl px-4 py-3 text-[15px] text-slate-800 leading-relaxed whitespace-pre-wrap">{text}</p>
        <div className="flex justify-end px-4 py-3">
          <button
            onClick={() => {
              playCyberClick();
              navigator.clipboard?.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              });
            }}
            onMouseEnter={() => playCyberHover()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? "コピーしました" : "プロンプトをコピー"}</span>
          </button>
        </div>
      </div>
    </TiltCard>
  );
}'''

code = code.replace(prompt_old, prompt_new, 1)

# 5. Helpful buttons
helpful_old = '''          <button onClick={() => choose("up")} title="役に立った" className="w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
            <ThumbsUp size={16} />
          </button>
          <button onClick={() => choose("down")} title="分かりにくかった" className="w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
            <ThumbsDown size={16} />
          </button>'''

helpful_new = '''          <button
            onClick={() => {
              playCyberClick();
              choose("up");
            }}
            onMouseEnter={() => playCyberHover()}
            title="役に立った"
            className="w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 cursor-pointer transition-transform active:scale-90"
          >
            <ThumbsUp size={16} />
          </button>
          <button
            onClick={() => {
              playCyberClick();
              choose("down");
            }}
            onMouseEnter={() => playCyberHover()}
            title="分かりにくかった"
            className="w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 cursor-pointer transition-transform active:scale-90"
          >
            <ThumbsDown size={16} />
          </button>'''

code = code.replace(helpful_old, helpful_new, 1)

# 6. Nav breadcrumb
nav_old = '''          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 print:hidden">
            <ArrowLeft size={13} />
            <Link href="/academy" className="hover:text-indigo-600 transition-colors">Academy</Link>
            <span>/</span>
            <Link href={`/academy/${course.id}`} className="hover:text-indigo-600 transition-colors">{course.title}</Link>
          </nav>'''

nav_new = '''          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 print:hidden">
            <ArrowLeft size={13} />
            <Link
              href="/academy"
              onClick={() => playCyberClick()}
              onMouseEnter={() => playCyberHover()}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Academy
            </Link>
            <span>/</span>
            <Link
              href={`/academy/${course.id}`}
              onClick={() => playCyberClick()}
              onMouseEnter={() => playCyberHover()}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {course.title}
            </Link>
          </nav>'''

code = code.replace(nav_old, nav_new, 1)

# 7. Prev / Next lesson buttons
nav_btns_old = '''              <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>'''

nav_btns_new = '''              <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {index > 0 ? (
                  <button
                    onClick={() => {
                      playCyberClick();
                      go(steps[index - 1].id);
                    }}
                    onMouseEnter={() => playCyberHover()}
                    className="flex items-center gap-3 text-left bg-white border border-slate-200 rounded-xl px-4 py-4 hover:border-slate-400 cursor-pointer transition-all active:scale-98 shadow-xs hover:shadow-md"
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
                    playCyberClick();
                    markLessonDone(lesson.id);
                    go(steps[index + 1].id);
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className="flex items-center justify-end gap-3 text-right bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white rounded-xl px-4 py-4 cursor-pointer transition-all active:scale-98 shadow-sm hover:shadow-lg"
                >
                  <span>
                    <span className="block text-xs text-slate-300">完了して次へ</span>
                    <span className="block text-sm font-bold">{steps[index + 1].label}</span>
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0"><ArrowRight size={15} /></span>
                </button>
              </div>'''

code = code.replace(nav_btns_old, nav_btns_new, 1)

# 8. Quiz action buttons & radio choices
quiz_choice_old = '''                          <label
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
                          >'''

quiz_choice_new = '''                          <label
                            key={c}
                            onMouseEnter={() => playCyberHover()}
                            className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                              state === "correct"
                                ? "border-emerald-400 bg-emerald-50"
                                : state === "wrong"
                                ? "border-rose-400 bg-rose-50"
                                : chosen
                                ? "border-orange-400 bg-orange-50"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >'''

code = code.replace(quiz_choice_old, quiz_choice_new, 1)

quiz_radio_old = '''                            <input
                              type="radio"
                              name={`q${qi}`}
                              checked={chosen}
                              disabled={submitted}
                              onChange={() => setAnswers(answers.map((a, i) => (i === qi ? ci : a)))}
                            />'''

quiz_radio_new = '''                            <input
                              type="radio"
                              name={`q${qi}`}
                              checked={chosen}
                              disabled={submitted}
                              onChange={() => {
                                playCyberClick();
                                setAnswers(answers.map((a, i) => (i === qi ? ci : a)));
                              }}
                            />'''

code = code.replace(quiz_radio_old, quiz_radio_new, 1)

quiz_actions_old = '''                    {passed && allLessonsDone ? (
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
                  </button>'''

quiz_actions_new = '''                    {passed && allLessonsDone ? (
                      <button
                        onClick={() => {
                          playCyberClick();
                          go("certificate");
                        }}
                        onMouseEnter={() => playCyberHover()}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold cursor-pointer transition-all active:scale-95 shadow-md"
                      >
                        修了証を見る
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playCyberClick();
                          setAnswers(course.quiz.map(() => null));
                          setSubmitted(false);
                        }}
                        onMouseEnter={() => playCyberHover()}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold cursor-pointer transition-all active:scale-95 shadow-md"
                      >
                        もう一度解く
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      playCyberClick();
                      setSubmitted(true);
                      recordQuizScore(score);
                    }}
                    onMouseEnter={() => playCyberHover()}
                    disabled={answers.some((a) => a === null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold disabled:opacity-40 cursor-pointer transition-all active:scale-95 shadow-md"
                  >
                    採点する
                  </button>'''

code = code.replace(quiz_actions_old, quiz_actions_new, 1)

# 9. Certificate print button & certificate tilt
cert_print_old = '''                  <button
                    onClick={() => window.print()}
                    disabled={!progress.learnerName}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold disabled:opacity-40 cursor-pointer"
                  >
                    <Printer size={15} /> 印刷・PDF で保存
                  </button>'''

cert_print_new = '''                  <button
                    onClick={() => {
                      playCyberClick();
                      window.print();
                    }}
                    onMouseEnter={() => playCyberHover()}
                    disabled={!progress.learnerName}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold disabled:opacity-40 cursor-pointer transition-all active:scale-95"
                  >
                    <Printer size={15} /> 印刷・PDF で保存
                  </button>'''

code = code.replace(cert_print_old, cert_print_new, 1)

cert_box_old = '''                <div className="print-area border-8 border-double border-orange-300 rounded-2xl p-10 text-center space-y-4 bg-[#fffdf8]">'''

cert_box_new = '''                <TiltCard maxTilt={4} glareOpacity={0.08} className="rounded-2xl">
                  <div
                    onMouseEnter={() => playCyberHover()}
                    className="print-area border-8 border-double border-orange-300 rounded-2xl p-10 text-center space-y-4 bg-[#fffdf8] cursor-default shadow-lg"
                  >'''

code = code.replace(cert_box_old, cert_box_new, 1)

cert_box_end_old = '''                  <div className="text-xs text-slate-500 space-y-0.5 pt-2">
                    <p>修了日：{new Date(progress.completedAt).toLocaleDateString("ja-JP")}</p>
                    <p>修了証番号：{progress.certificateId}</p>
                    <p className="pt-2 font-bold text-slate-700">MightyLINK AI推進担当 / AI Park</p>
                  </div>
                </div>'''

cert_box_end_new = '''                  <div className="text-xs text-slate-500 space-y-0.5 pt-2">
                    <p>修了日：{new Date(progress.completedAt).toLocaleDateString("ja-JP")}</p>
                    <p>修了証番号：{progress.certificateId}</p>
                    <p className="pt-2 font-bold text-slate-700">MightyLINK AI推進担当 / AI Park</p>
                  </div>
                </div>
              </TiltCard>'''

code = code.replace(cert_box_end_old, cert_box_end_new, 1)

# 10. Sidebar TOC back link
toc_back_old = '''          <Link href={`/academy/${course.id}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:underline">
            <ListChecks size={13} /> コースの目次に戻る
          </Link>'''

toc_back_new = '''          <Link
            href={`/academy/${course.id}`}
            onClick={() => playCyberClick()}
            onMouseEnter={() => playCyberHover()}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ListChecks size={13} /> コースの目次に戻る
          </Link>'''

code = code.replace(toc_back_old, toc_back_new, 1)

with open('src/components/academy/LessonView.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated LessonView.tsx with TiltCard and sound integration")
