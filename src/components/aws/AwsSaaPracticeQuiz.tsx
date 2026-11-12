"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Sparkles, ArrowRight, Filter } from "lucide-react";
import { saaPracticeQuestions, type SaaQuestion } from "@/data/aws-saa";
import { playCyberClick, playCyberHover } from "@/lib/sound";

interface AwsSaaPracticeQuizProps {
  answers: Record<string, number>;
  onSelectAnswer: (questionId: string, optionIndex: number) => void;
  onResetQuiz: () => void;
}

const DOMAIN_FILTERS = [
  { id: "all", label: "すべて" },
  { id: "domain-1", label: "Domain 1 (セキュリティ)" },
  { id: "domain-2", label: "Domain 2 (弾力性)" },
  { id: "domain-3", label: "Domain 3 (高パフォーマンス)" },
  { id: "domain-4", label: "Domain 4 (コスト最適化)" },
];

export default function AwsSaaPracticeQuiz({
  answers,
  onSelectAnswer,
  onResetQuiz,
}: AwsSaaPracticeQuizProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const filteredQuestions = useMemo<SaaQuestion[]>(() => {
    if (selectedDomain === "all") return saaPracticeQuestions;
    return saaPracticeQuestions.filter((q) => q.domainId === selectedDomain);
  }, [selectedDomain]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredQuestions.length - 1));
  const currentQuestion = filteredQuestions[safeIndex];

  const answeredCount = Object.keys(answers).length;
  const correctCount = saaPracticeQuestions.filter((q) => answers[q.id] === q.correctIndex).length;

  const handleDomainChange = (domainId: string) => {
    playCyberClick();
    setSelectedDomain(domainId);
    setCurrentIndex(0);
  };

  if (!currentQuestion) return null;

  const userChoice = answers[currentQuestion.id];
  const hasAnswered = userChoice !== undefined;
  const isCorrect = hasAnswered && userChoice === currentQuestion.correctIndex;

  return (
    <div className="space-y-6">
      {/* クイズヘッダー＆サマリー */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              SAA-C03 シナリオ演習
            </span>
            <span className="text-xs text-slate-500 font-medium">
              全 {saaPracticeQuestions.length} 問 / 回答済み {answeredCount} 問 / 正解 {correctCount} 問
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900">
            実践ミニ模擬テスト（即時採点・詳細解説付き）
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            playCyberClick();
            onResetQuiz();
            setCurrentIndex(0);
          }}
          onMouseEnter={() => playCyberHover()}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer self-start md:self-auto"
        >
          <RotateCcw size={14} />
          <span>演習記録をリセット</span>
        </button>
      </div>

      {/* ドメインフィルター */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 mr-1">
          <Filter size={13} />
          <span>絞り込み:</span>
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

      {/* 問題番号インジケーター */}
      <div className="flex flex-wrap gap-2">
        {filteredQuestions.map((q, idx) => {
          const ans = answers[q.id];
          const isCur = idx === safeIndex;
          const statusClass =
            ans === undefined
              ? "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
              : ans === q.correctIndex
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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
              Q{safeIndex + 1} / {filteredQuestions.length}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
              {currentQuestion.domainLabel}
            </span>
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
            const isSelected = userChoice === optIdx;
            const isCorrectOpt = currentQuestion.correctIndex === optIdx;

            let optionStyle =
              "border-slate-200 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-300 text-slate-800";
            if (hasAnswered) {
              if (isCorrectOpt) {
                optionStyle = "border-emerald-400 bg-emerald-50/80 text-emerald-950 font-semibold";
              } else if (isSelected) {
                optionStyle = "border-rose-400 bg-rose-50/80 text-rose-950";
              } else {
                optionStyle = "border-slate-200 bg-slate-50/40 text-slate-400";
              }
            }

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => {
                  playCyberClick();
                  onSelectAnswer(currentQuestion.id, optIdx);
                }}
                onMouseEnter={() => playCyberHover()}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${optionStyle}`}
              >
                <span className="w-6 h-6 rounded-full border border-current/30 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed flex-1">{option}</span>
                {hasAnswered && isCorrectOpt && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {hasAnswered && isSelected && !isCorrectOpt && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

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
                      不正解（正解は {String.fromCharCode(65 + currentQuestion.correctIndex)}）
                    </span>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">{currentQuestion.explanation}</p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold opacity-75 mr-1">試験キーワード:</span>
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
            <span>選択肢をクリックすると即座に正誤判定と解説が表示されます</span>
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
    </div>
  );
}
