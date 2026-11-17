"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Filter,
  Shuffle,
  Target,
  Award,
} from "lucide-react";
import { saaDomains, saaPracticeQuestions, type SaaQuestion } from "@/data/aws-saa";
import { playCyberClick, playCyberHover } from "@/lib/sound";

export function isQuestionCorrect(question: SaaQuestion, userChoices?: number[]): boolean {
  if (!userChoices || userChoices.length !== question.correctIndices.length) return false;
  const sortedUser = [...userChoices].sort((a, b) => a - b);
  const sortedCorrect = [...question.correctIndices].sort((a, b) => a - b);
  return sortedUser.every((val, idx) => val === sortedCorrect[idx]);
}

interface AwsSaaPracticeQuizProps {
  answers: Record<string, number[]>;
  onSubmitAnswer: (questionId: string, selectedIndices: number[]) => void;
  onResetQuiz: () => void;
}

const DOMAIN_FILTERS = [
  { id: "all", label: "すべて" },
  { id: "domain-1", label: "D1: セキュリティ" },
  { id: "domain-2", label: "D2: 弾力性" },
  { id: "domain-3", label: "D3: 高パフォーマンス" },
  { id: "domain-4", label: "D4: コスト最適化" },
];

type StatusFilter = "all" | "unanswered" | "wrong";

export default function AwsSaaPracticeQuiz({
  answers,
  onSubmitAnswer,
  onResetQuiz,
}: AwsSaaPracticeQuizProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [shuffledOrder, setShuffledOrder] = useState<string[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [draftMulti, setDraftMulti] = useState<Record<string, number[]>>({});

  const orderedQuestions = useMemo<SaaQuestion[]>(() => {
    if (!shuffledOrder) return saaPracticeQuestions;
    const map = new Map(saaPracticeQuestions.map((q) => [q.id, q]));
    return shuffledOrder.map((id) => map.get(id)).filter((q): q is SaaQuestion => Boolean(q));
  }, [shuffledOrder]);

  const filteredQuestions = useMemo<SaaQuestion[]>(() => {
    return orderedQuestions.filter((q) => {
      if (selectedDomain !== "all" && q.domainId !== selectedDomain) return false;
      const ans = answers[q.id];
      if (statusFilter === "unanswered") return ans === undefined;
      if (statusFilter === "wrong") return ans !== undefined && !isQuestionCorrect(q, ans);
      return true;
    });
  }, [orderedQuestions, selectedDomain, statusFilter, answers]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredQuestions.length - 1));
  const currentQuestion = filteredQuestions[safeIndex];

  const answeredCount = Object.keys(answers).length;
  const correctCount = saaPracticeQuestions.filter((q) => isQuestionCorrect(q, answers[q.id])).length;
  const scorePct = Math.round((correctCount / saaPracticeQuestions.length) * 100);
  const allCompleted = answeredCount === saaPracticeQuestions.length;

  const handleDomainChange = (domainId: string) => {
    playCyberClick();
    setSelectedDomain(domainId);
    setCurrentIndex(0);
  };

  const handleStatusChange = (status: StatusFilter) => {
    playCyberClick();
    setStatusFilter(status);
    setCurrentIndex(0);
  };

  const handleToggleShuffle = () => {
    playCyberClick();
    if (shuffledOrder) {
      setShuffledOrder(null);
    } else {
      const ids = saaPracticeQuestions.map((q) => q.id);
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      setShuffledOrder(ids);
    }
    setCurrentIndex(0);
  };

  const handleOptionClick = (q: SaaQuestion, optIdx: number) => {
    playCyberClick();
    if (q.selectCount === 1) {
      onSubmitAnswer(q.id, [optIdx]);
      return;
    }

    // 複数選択問題：回答済みでも再選択できるようにドラフトを更新
    const currentDraft = draftMulti[q.id] ?? answers[q.id] ?? [];
    const exists = currentDraft.includes(optIdx);
    let nextDraft: number[];
    if (exists) {
      nextDraft = currentDraft.filter((i) => i !== optIdx);
    } else if (currentDraft.length < q.selectCount) {
      nextDraft = [...currentDraft, optIdx];
    } else {
      nextDraft = [...currentDraft.slice(1), optIdx];
    }
    setDraftMulti((prev) => ({ ...prev, [q.id]: nextDraft }));
  };

  const handleConfirmMulti = (q: SaaQuestion) => {
    const selected = draftMulti[q.id] ?? [];
    if (selected.length !== q.selectCount) return;
    playCyberClick();
    onSubmitAnswer(q.id, selected);
  };

  return (
    <div className="space-y-6">
      {/* クイズヘッダー＆サマリー */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                SAA-C03 本番形式演習（択一・複数選択対応）
              </span>
              <span className="text-xs text-slate-500 font-medium">
                全 {saaPracticeQuestions.length} 問 / 回答済み {answeredCount} 問 / 正解 {correctCount} 問（{scorePct}%）
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              実践ミニ模擬テスト（即時採点・詳細解説付き）
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleShuffle}
              onMouseEnter={() => playCyberHover()}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                shuffledOrder
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Shuffle size={14} />
              <span>{shuffledOrder ? "シャッフル中" : "ランダム出題"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playCyberClick();
                onResetQuiz();
                setDraftMulti({});
                setCurrentIndex(0);
              }}
              onMouseEnter={() => playCyberHover()}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>リセット</span>
            </button>
          </div>
        </div>

        {/* ドメイン別正答率ミニバー */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          {saaDomains.map((d) => {
            const domainQs = saaPracticeQuestions.filter((q) => q.domainId === d.id);
            const domainCorrect = domainQs.filter((q) => isQuestionCorrect(q, answers[q.id])).length;
            const pct = domainQs.length > 0 ? Math.round((domainCorrect / domainQs.length) * 100) : 0;
            return (
              <div key={d.id} className="rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-2 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Domain {d.number}</span>
                  <span className="font-mono font-bold text-slate-600">
                    {domainCorrect}/{domainQs.length} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      pct >= 72 ? "bg-emerald-500" : pct > 0 ? "bg-amber-500" : "bg-slate-300"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 全問完了時の合格ライン判定バナー */}
      {allCompleted && (
        <div
          className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            scorePct >= 72
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-amber-50 border-amber-300 text-amber-950"
          }`}
        >
          <div className="flex items-start space-x-3">
            <Award
              className={`w-6 h-6 shrink-0 mt-0.5 ${
                scorePct >= 72 ? "text-emerald-600" : "text-amber-600"
              }`}
            />
            <div className="space-y-1">
              <div className="font-black text-sm sm:text-base">
                {scorePct >= 72
                  ? `全問完了！正答率 ${scorePct}%（合格目安 72% クリア）`
                  : `全問完了！正答率 ${scorePct}%（目標 72% まであと少し）`}
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {scorePct >= 72
                  ? "素晴らしい理解度です。間違えた問題があれば下の「不正解のみ」フィルターで復習し、AWS公式模擬試験へ進みましょう。"
                  : "下の「不正解のみ」フィルターに切り替えて、解説と試験キーワードを重点的に復習してみてください。"}
              </p>
            </div>
          </div>
          {scorePct < 100 && (
            <button
              type="button"
              onClick={() => handleStatusChange("wrong")}
              className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              不正解のみ復習する
            </button>
          )}
        </div>
      )}

      {/* ドメイン & ステータスフィルター */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 mr-1">
            <Filter size={13} />
            <span>分野:</span>
          </span>
          {DOMAIN_FILTERS.map((df) => {
            const active = selectedDomain === df.id;
            return (
              <button
                key={df.id}
                type="button"
                onClick={() => handleDomainChange(df.id)}
                onMouseEnter={() => playCyberHover()}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
                }`}
              >
                {df.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 mr-1">
            <Target size={13} />
            <span>状態:</span>
          </span>
          {(
            [
              { id: "all", label: "全問" },
              { id: "unanswered", label: "未回答" },
              { id: "wrong", label: "不正解" },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => handleStatusChange(st.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* 絞り込み結果が 0 件の場合 */}
      {!currentQuestion ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <div className="text-base font-black text-slate-900">
            該当する問題はありません
          </div>
          <p className="text-xs text-slate-500">
            選択した条件（分野・状態）に当てはまる問題がありません。フィルターを「全問」に戻してください。
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedDomain("all");
              setStatusFilter("all");
              setCurrentIndex(0);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
          >
            すべての問題を表示
          </button>
        </div>
      ) : (
        <>
          {/* 問題番号インジケーター */}
          <div className="flex flex-wrap gap-2">
            {filteredQuestions.map((q, idx) => {
              const ans = answers[q.id];
              const isCur = idx === safeIndex;
              const statusClass =
                ans === undefined
                  ? "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                  : isQuestionCorrect(q, ans)
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-rose-50 text-rose-700 border-rose-300";

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    playCyberClick();
                    setCurrentIndex(idx);
                  }}
                  className={`w-9 h-9 rounded-xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${statusClass} ${
                    isCur ? "ring-2 ring-indigo-500 ring-offset-1 scale-105" : ""
                  }`}
                  title={`問題 ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* 問題本体カード */}
          {(() => {
            const userChoices = answers[currentQuestion.id];
            const hasAnswered = userChoices !== undefined;
            const isCorrect = isQuestionCorrect(currentQuestion, userChoices);
            const activeSelection =
              currentQuestion.selectCount > 1
                ? (draftMulti[currentQuestion.id] ?? userChoices ?? [])
                : (userChoices ?? []);

            return (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                      Q{safeIndex + 1} / {filteredQuestions.length}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {currentQuestion.domainLabel}
                    </span>
                    {currentQuestion.selectCount > 1 && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                        {currentQuestion.selectCount}つ選択
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    難易度: {currentQuestion.difficulty}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  {currentQuestion.question}
                </p>

                {/* 選択肢 */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, optIdx) => {
                    const isSelected = activeSelection.includes(optIdx);
                    const isCorrectOpt = currentQuestion.correctIndices.includes(optIdx);

                    let optionStyle =
                      "border-slate-200 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-300 text-slate-800";

                    if (hasAnswered && (currentQuestion.selectCount === 1 || !draftMulti[currentQuestion.id])) {
                      if (isCorrectOpt) {
                        optionStyle =
                          "border-emerald-400 bg-emerald-50/80 text-emerald-950 font-semibold";
                      } else if (isSelected) {
                        optionStyle = "border-rose-400 bg-rose-50/80 text-rose-950";
                      } else {
                        optionStyle = "border-slate-200 bg-slate-50/40 text-slate-400";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-indigo-500 bg-indigo-50/70 text-indigo-950 font-semibold";
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleOptionClick(currentQuestion, optIdx)}
                        onMouseEnter={() => playCyberHover()}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${optionStyle}`}
                      >
                        <span
                          className={`w-6 h-6 ${
                            currentQuestion.selectCount > 1 ? "rounded-md" : "rounded-full"
                          } border border-current/30 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed flex-1">{option}</span>
                        {hasAnswered && !draftMulti[currentQuestion.id] && isCorrectOpt && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {hasAnswered &&
                          !draftMulti[currentQuestion.id] &&
                          isSelected &&
                          !isCorrectOpt && (
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          )}
                      </button>
                    );
                  })}
                </div>

                {/* 複数選択の確定ボタン */}
                {currentQuestion.selectCount > 1 && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      選択中: {activeSelection.length} / {currentQuestion.selectCount} 個
                    </span>
                    <button
                      type="button"
                      disabled={activeSelection.length !== currentQuestion.selectCount}
                      onClick={() => {
                        handleConfirmMulti(currentQuestion);
                        setDraftMulti((prev) => {
                          const copy = { ...prev };
                          delete copy[currentQuestion.id];
                          return copy;
                        });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                    >
                      回答を確定する
                    </button>
                  </div>
                )}

                {/* 解説パネル */}
                {hasAnswered ? (
                  <div
                    className={`rounded-xl p-5 border space-y-3 ${
                      isCorrect
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                        : "bg-amber-50/70 border-amber-200 text-amber-950"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-black text-sm">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>正解！</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle className="w-5 h-5 text-amber-600" />
                            <span>
                              不正解（正解は{" "}
                              {currentQuestion.correctIndices
                                .map((i) => String.fromCharCode(65 + i))
                                .join("・")}
                              ）
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-bold opacity-75 mr-1">
                        試験キーワード:
                      </span>
                      {currentQuestion.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/80 border border-current/15"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Sparkles size={14} />
                    <span>
                      {currentQuestion.selectCount > 1
                        ? `${currentQuestion.selectCount}つ選択して「回答を確定する」を押すと解説が表示されます`
                        : "選択肢をクリックすると即座に正誤判定と解説が表示されます"}
                    </span>
                  </div>
                )}

                {/* 前へ・次へボタン */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={safeIndex === 0}
                    onClick={() => {
                      playCyberClick();
                      setCurrentIndex((i) => Math.max(0, i - 1));
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ← 前の問題
                  </button>

                  <button
                    type="button"
                    disabled={safeIndex >= filteredQuestions.length - 1}
                    onClick={() => {
                      playCyberClick();
                      setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1));
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>次の問題</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
