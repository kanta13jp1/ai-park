"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
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
  Star,
  Clock,
  ClipboardCheck,
  BookOpenCheck,
} from "lucide-react";
import { saaDomains, saaPracticeQuestions, type SaaQuestion } from "@/data/aws-saa";
import { playCyberClick, playCyberHover } from "@/lib/sound";

export function isQuestionCorrect(question: SaaQuestion, userChoices?: number[]): boolean {
  if (!userChoices || userChoices.length !== question.correctIndices.length) return false;
  const sortedUser = [...userChoices].sort((a, b) => a - b);
  const sortedCorrect = [...question.correctIndices].sort((a, b) => a - b);
  return sortedUser.every((val, idx) => val === sortedCorrect[idx]);
}

export interface MockExamRecord {
  date: string;
  correct: number;
  total: number;
  scaledScore: number;
}

interface AwsSaaPracticeQuizProps {
  answers: Record<string, number[]>;
  bookmarkedIds: string[];
  mockExamHistory: MockExamRecord[];
  initialDomain?: string;
  onSubmitAnswer: (questionId: string, selectedIndices: number[]) => void;
  onToggleBookmark: (questionId: string) => void;
  onRecordMockExam: (record: MockExamRecord) => void;
  onResetQuiz: () => void;
}

const DOMAIN_FILTERS = [
  { id: "all", label: "すべて" },
  { id: "domain-1", label: "D1: セキュリティ" },
  { id: "domain-2", label: "D2: 弾力性" },
  { id: "domain-3", label: "D3: 高パフォーマンス" },
  { id: "domain-4", label: "D4: コスト最適化" },
];

type StatusFilter = "all" | "unanswered" | "wrong" | "bookmarked";
type QuizMode = "practice" | "exam";

const EXAM_DURATION_SECONDS = saaPracticeQuestions.length * 120; // 1問2分ペース

function formatTimer(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const s = (safe % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function AwsSaaPracticeQuiz({
  answers,
  bookmarkedIds,
  mockExamHistory,
  initialDomain = "all",
  onSubmitAnswer,
  onToggleBookmark,
  onRecordMockExam,
  onResetQuiz,
}: AwsSaaPracticeQuizProps) {
  const [quizMode, setQuizMode] = useState<QuizMode>("practice");
  const [selectedDomain, setSelectedDomain] = useState<string>(initialDomain);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [shuffledOrder, setShuffledOrder] = useState<string[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [draftMulti, setDraftMulti] = useState<Record<string, number[]>>({});

  // 練習モード用経過タイマー
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  // 模擬試験モード用ステート
  const [examAnswers, setExamAnswers] = useState<Record<string, number[]>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examRemainingSeconds, setExamRemainingSeconds] = useState<number>(EXAM_DURATION_SECONDS);
  const recordedExamRef = useRef<boolean>(false);

  useEffect(() => {
    if (quizMode === "practice") {
      if (!timerRunning) return;
      const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
      return () => clearInterval(timer);
    }

    if (examSubmitted) return;
    const examTimer = setInterval(() => {
      setExamRemainingSeconds((prev) => {
        if (prev <= 1) {
          setExamSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(examTimer);
  }, [quizMode, timerRunning, examSubmitted]);

  const activeAnswers = quizMode === "exam" ? examAnswers : answers;
  const showFeedback = quizMode === "practice" || examSubmitted;

  const orderedQuestions = useMemo<SaaQuestion[]>(() => {
    if (!shuffledOrder) return saaPracticeQuestions;
    const map = new Map(saaPracticeQuestions.map((q) => [q.id, q]));
    return shuffledOrder.map((id) => map.get(id)).filter((q): q is SaaQuestion => Boolean(q));
  }, [shuffledOrder]);

  const filteredQuestions = useMemo<SaaQuestion[]>(() => {
    return orderedQuestions.filter((q) => {
      if (quizMode === "practice" && selectedDomain !== "all" && q.domainId !== selectedDomain) {
        return false;
      }
      const ans = activeAnswers[q.id];
      if (statusFilter === "unanswered") return ans === undefined;
      if (statusFilter === "wrong") {
        return showFeedback && ans !== undefined && !isQuestionCorrect(q, ans);
      }
      if (statusFilter === "bookmarked") return bookmarkedIds.includes(q.id);
      return true;
    });
  }, [orderedQuestions, quizMode, selectedDomain, statusFilter, activeAnswers, showFeedback, bookmarkedIds]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredQuestions.length - 1));
  const currentQuestion = filteredQuestions[safeIndex];

  const answeredCount = Object.keys(activeAnswers).length;
  const correctCount = saaPracticeQuestions.filter((q) =>
    isQuestionCorrect(q, activeAnswers[q.id])
  ).length;
  const scorePct = Math.round((correctCount / saaPracticeQuestions.length) * 100);
  const scaledScore = Math.round(100 + (correctCount / saaPracticeQuestions.length) * 900);
  const allCompleted = answeredCount === saaPracticeQuestions.length;

  const onRecordMockExamRef = useRef(onRecordMockExam);
  useEffect(() => {
    onRecordMockExamRef.current = onRecordMockExam;
  }, [onRecordMockExam]);

  useEffect(() => {
    if (quizMode === "exam" && examSubmitted && !recordedExamRef.current) {
      recordedExamRef.current = true;
      onRecordMockExamRef.current({
        date: new Date().toLocaleString("ja-JP", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        correct: correctCount,
        total: saaPracticeQuestions.length,
        scaledScore,
      });
    }
  }, [quizMode, examSubmitted, correctCount, scaledScore]);

  const handleSwitchMode = (mode: QuizMode) => {
    playCyberClick();
    setQuizMode(mode);
    setStatusFilter("all");
    setDraftMulti({});
    setCurrentIndex(0);
    if (mode === "exam") {
      setExamAnswers({});
      setExamSubmitted(false);
      setExamRemainingSeconds(EXAM_DURATION_SECONDS);
      recordedExamRef.current = false;
    }
  };

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

  const commitAnswer = useCallback(
    (questionId: string, selectedIndices: number[]) => {
      if (quizMode === "exam") {
        if (examSubmitted) return;
        setExamAnswers((prev) => ({ ...prev, [questionId]: selectedIndices }));
      } else {
        onSubmitAnswer(questionId, selectedIndices);
      }
    },
    [quizMode, examSubmitted, onSubmitAnswer]
  );

  const handleOptionClick = useCallback(
    (q: SaaQuestion, optIdx: number) => {
      if (quizMode === "exam" && examSubmitted) return;
      playCyberClick();
      if (q.selectCount === 1) {
        commitAnswer(q.id, [optIdx]);
        return;
      }

      const currentDraft = draftMulti[q.id] ?? activeAnswers[q.id] ?? [];
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
    },
    [quizMode, examSubmitted, commitAnswer, draftMulti, activeAnswers]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (e.key === "ArrowLeft" && safeIndex > 0) {
        e.preventDefault();
        playCyberClick();
        setCurrentIndex(safeIndex - 1);
      } else if (e.key === "ArrowRight" && safeIndex < filteredQuestions.length - 1) {
        e.preventDefault();
        playCyberClick();
        setCurrentIndex(safeIndex + 1);
      } else if (currentQuestion && ["1", "2", "3", "4", "5"].includes(e.key)) {
        const idx = Number(e.key) - 1;
        if (idx < currentQuestion.options.length) {
          e.preventDefault();
          handleOptionClick(currentQuestion, idx);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [safeIndex, filteredQuestions.length, currentQuestion, handleOptionClick]);

  const handleConfirmMulti = (q: SaaQuestion) => {
    const selected = draftMulti[q.id] ?? [];
    if (selected.length !== q.selectCount) return;
    playCyberClick();
    commitAnswer(q.id, selected);
  };

  return (
    <div className="space-y-6">
      {/* クイズヘッダー＆モード切替 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                SAA-C03 本番形式演習（全 {saaPracticeQuestions.length} 問）
              </span>
              <span className="text-xs text-slate-500 font-medium">
                回答済み {answeredCount} / {saaPracticeQuestions.length} 問
                {showFeedback && ` ・ 正解 ${correctCount} 問（${scorePct}%）`}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {quizMode === "practice"
                ? "練習モード（1問ごとに即時採点・解説）"
                : "模擬試験モード（制限時間 40:00 ・一括採点）"}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* モード切り替え */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => handleSwitchMode("practice")}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quizMode === "practice"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <BookOpenCheck size={13} />
                <span>練習モード</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode("exam")}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quizMode === "exam"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <ClipboardCheck size={13} />
                <span>模擬試験</span>
              </button>
            </div>

            {/* タイマー */}
            {quizMode === "practice" ? (
              <button
                type="button"
                onClick={() => {
                  playCyberClick();
                  setTimerRunning((r) => !r);
                }}
                title="クリックで一時停止/再開"
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <Clock size={14} className={timerRunning ? "text-indigo-600" : "text-slate-400"} />
                <span>{formatTimer(elapsedSeconds)}</span>
              </button>
            ) : (
              <div
                className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold ${
                  examRemainingSeconds <= 300 && !examSubmitted
                    ? "border-rose-300 bg-rose-50 text-rose-700 animate-pulse"
                    : "border-indigo-200 bg-indigo-50 text-indigo-800"
                }`}
              >
                <Clock size={14} />
                <span>残り {formatTimer(examRemainingSeconds)}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleToggleShuffle}
              onMouseEnter={() => playCyberHover()}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                shuffledOrder
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Shuffle size={14} />
              <span>{shuffledOrder ? "シャッフル中" : "ランダム"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playCyberClick();
                if (quizMode === "exam") {
                  setExamAnswers({});
                  setExamSubmitted(false);
                  setExamRemainingSeconds(EXAM_DURATION_SECONDS);
                  recordedExamRef.current = false;
                } else {
                  onResetQuiz();
                  setElapsedSeconds(0);
                }
                setDraftMulti({});
                setCurrentIndex(0);
              }}
              onMouseEnter={() => playCyberHover()}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>{quizMode === "exam" ? "やり直す" : "リセット"}</span>
            </button>
          </div>
        </div>

        {/* 模擬試験モードの提出バー */}
        {quizMode === "exam" && !examSubmitted && (
          <div className="rounded-xl bg-indigo-50/80 border border-indigo-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-indigo-950 font-medium">
              模擬試験モード中は正解と解説が非表示になります。全 {saaPracticeQuestions.length} 問の回答が終わったら採点してください。
            </span>
            <button
              type="button"
              onClick={() => {
                playCyberClick();
                setExamSubmitted(true);
                setCurrentIndex(0);
              }}
              className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs cursor-pointer"
            >
              テストを提出して採点する ({answeredCount}/{saaPracticeQuestions.length})
            </button>
          </div>
        )}

        {/* 模擬試験モード時の直近スコア履歴 */}
        {quizMode === "exam" && mockExamHistory.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">直近の模試スコア:</span>
            {mockExamHistory.map((rec, idx) => (
              <span
                key={`${rec.date}-${idx}`}
                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
                  rec.scaledScore >= 720
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                {rec.date} : {rec.scaledScore}点 ({rec.correct}/{rec.total})
              </span>
            ))}
          </div>
        )}

        {/* ドメイン別正答率ミニバー（結果表示時のみ） */}
        {showFeedback && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
            {saaDomains.map((d) => {
              const domainQs = saaPracticeQuestions.filter((q) => q.domainId === d.id);
              const domainCorrect = domainQs.filter((q) =>
                isQuestionCorrect(q, activeAnswers[q.id])
              ).length;
              const pct =
                domainQs.length > 0 ? Math.round((domainCorrect / domainQs.length) * 100) : 0;
              return (
                <div
                  key={d.id}
                  className="rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-2 space-y-1"
                >
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
        )}
      </div>

      {/* 合格ライン判定バナー（練習全問完了 または 模擬試験提出後） */}
      {((quizMode === "practice" && allCompleted) || (quizMode === "exam" && examSubmitted)) && (
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
                {quizMode === "exam" ? "模擬試験結果：" : "全問完了！"}
                正答率 {scorePct}%（目安スコア {scaledScore} / 1000点 ・{" "}
                {scaledScore >= 720 ? "合格ライン 720点到達！" : "合格ライン 720点まであと少し"}）
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {scorePct >= 72
                  ? "素晴らしい理解度です。間違えた問題があれば下の「不正解」フィルターで復習し、AWS公式模擬試験へ進みましょう。"
                  : "下の「不正解」フィルターに切り替えて、解説と試験キーワードを重点的に復習してみてください。"}
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {quizMode === "practice" ? (
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
        ) : (
          <div className="text-xs font-bold text-slate-600">
            全 {saaPracticeQuestions.length} 問通し演習（問題番号をクリックして自由に前後移動できます）
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 mr-1">
            <Target size={13} />
            <span>状態:</span>
          </span>
          {(
            [
              { id: "all", label: "全問" },
              { id: "unanswered", label: "未回答" },
              ...(showFeedback ? [{ id: "wrong" as const, label: "不正解" }] : []),
              { id: "bookmarked", label: `★ 要復習 (${bookmarkedIds.length})` },
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
          <div className="text-base font-black text-slate-900">該当する問題はありません</div>
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
              const ans = activeAnswers[q.id];
              const isCur = idx === safeIndex;
              const isBookmarked = bookmarkedIds.includes(q.id);
              let statusClass =
                "bg-white text-slate-600 border-slate-200 hover:border-indigo-300";

              if (ans !== undefined) {
                if (!showFeedback) {
                  statusClass = "bg-indigo-50 text-indigo-700 border-indigo-300";
                } else if (isQuestionCorrect(q, ans)) {
                  statusClass = "bg-emerald-50 text-emerald-700 border-emerald-300";
                } else {
                  statusClass = "bg-rose-50 text-rose-700 border-rose-300";
                }
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    playCyberClick();
                    setCurrentIndex(idx);
                  }}
                  className={`relative w-9 h-9 rounded-xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${statusClass} ${
                    isCur ? "ring-2 ring-indigo-500 ring-offset-1 scale-105" : ""
                  }`}
                  title={`問題 ${idx + 1}`}
                >
                  {idx + 1}
                  {isBookmarked && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 問題本体カード */}
          {(() => {
            const userChoices = activeAnswers[currentQuestion.id];
            const hasAnswered = userChoices !== undefined;
            const isCorrect = isQuestionCorrect(currentQuestion, userChoices);
            const isBookmarked = bookmarkedIds.includes(currentQuestion.id);
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

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      難易度: {currentQuestion.difficulty}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playCyberClick();
                        onToggleBookmark(currentQuestion.id);
                      }}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                        isBookmarked
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-700"
                      }`}
                    >
                      <Star
                        size={12}
                        className={isBookmarked ? "fill-amber-400 text-amber-500" : ""}
                      />
                      <span>{isBookmarked ? "要復習" : "ブックマーク"}</span>
                    </button>
                  </div>
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

                    if (
                      showFeedback &&
                      hasAnswered &&
                      (currentQuestion.selectCount === 1 || !draftMulti[currentQuestion.id])
                    ) {
                      if (isCorrectOpt) {
                        optionStyle =
                          "border-emerald-400 bg-emerald-50/80 text-emerald-950 font-semibold";
                      } else if (isSelected) {
                        optionStyle = "border-rose-400 bg-rose-50/80 text-rose-950";
                      } else {
                        optionStyle = "border-slate-200 bg-slate-50/40 text-slate-400";
                      }
                    } else if (isSelected) {
                      optionStyle =
                        "border-indigo-500 bg-indigo-50/70 text-indigo-950 font-semibold";
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
                        {showFeedback &&
                          hasAnswered &&
                          !draftMulti[currentQuestion.id] &&
                          isCorrectOpt && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                        {showFeedback &&
                          hasAnswered &&
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
                {currentQuestion.selectCount > 1 && !(quizMode === "exam" && examSubmitted) && (
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
                {showFeedback && hasAnswered ? (
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
                      {quizMode === "exam" && !examSubmitted
                        ? "模擬試験モード：全問回答後に「テストを提出して採点する」を押すと結果と解説が表示されます"
                        : currentQuestion.selectCount > 1
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

                  <span className="hidden sm:inline text-[11px] text-slate-400">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-slate-600">
                      1
                    </kbd>
                    -
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-slate-600">
                      5
                    </kbd>{" "}
                    で選択 /{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-slate-600">
                      ←
                    </kbd>{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-slate-600">
                      →
                    </kbd>{" "}
                    で移動
                  </span>

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
