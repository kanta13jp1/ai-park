"use client";

import { useState } from "react";
import { playCyberClick, playCyberSuccess, playCyberHover } from "@/lib/sound";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Lock,
  UserX,
  KeyRound,
} from "lucide-react";

interface Question {
  id: number;
  title: string;
  desc: string;
  icon: typeof Lock;
  options: {
    label: string;
    sublabel: string;
    isRisk: boolean;
    isBlocker?: boolean;
    type: "personal" | "confidential" | "account";
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Q1. 個人情報（顧客・取引先・社員の実名等）は含まれていますか？",
    desc: "氏名、メールアドレス、電話番号、住所、社員番号などの特定の個人を識別できる情報",
    icon: UserX,
    options: [
      {
        label: "はい（実名や連絡先が含まれている）",
        sublabel: "そのまま入力すると個人情報保護規程に抵触します",
        isRisk: true,
        type: "personal",
      },
      {
        label: "いいえ（含まれていない / 架空のダミーに置換済み）",
        sublabel: "「A社」「田中（仮名）」などマスキング済みであればOK",
        isRisk: false,
        type: "personal",
      },
    ],
  },
  {
    id: 2,
    title: "Q2. 未公開の社外秘情報（契約書・財務・パスワード等）は含まれていますか？",
    desc: "非公開の取引先契約、売上試算、APIキー・シークレット・本番DB接続文字列など",
    icon: KeyRound,
    options: [
      {
        label: "はい（極秘情報や未公開契約・認証情報が含まれる）",
        sublabel: "重大インシデントに繋がるため、AIへの直接投入は禁止されています",
        isRisk: true,
        isBlocker: true,
        type: "confidential",
      },
      {
        label: "いいえ（一般的な技術情報・公開資料・業務ロジックのみ）",
        sublabel: "標準的なプログラムコードや一般的な業務フローの相談であればOK",
        isRisk: false,
        type: "confidential",
      },
    ],
  },
  {
    id: 3,
    title: "Q3. 使用するAIアカウントは会社指定の正規アカウントですか？",
    desc: "会社ドメインのGoogle Workspace / 会社契約のAntigravity環境",
    icon: Lock,
    options: [
      {
        label: "はい（会社の組織アカウントでログインしている）",
        sublabel: "社内データ保護ポリシーが適用された正規の環境です",
        isRisk: false,
        type: "account",
      },
      {
        label: "いいえ / 不明（私用の個人Googleアカウント等）",
        sublabel: "個人の私用アカウントで業務データを入力することは全社規程で禁止です",
        isRisk: true,
        isBlocker: true,
        type: "account",
      },
    ],
  },
];

export default function SafetySelfChecker() {
  const [answers, setAnswers] = useState<Record<number, number | null>>({
    1: null,
    2: null,
    3: null,
  });

  const handleSelect = (qId: number, optIdx: number) => {
    playCyberClick();
    const nextAnswers = { ...answers, [qId]: optIdx };
    setAnswers(nextAnswers);

    // 3問すべて回答完了した瞬間
    const nextCompleted = nextAnswers[1] !== null && nextAnswers[2] !== null && nextAnswers[3] !== null;
    if (nextCompleted) {
      const isClean = nextAnswers[3] === 0 && nextAnswers[2] === 1 && nextAnswers[1] === 1;
      if (isClean) {
        setTimeout(() => playCyberSuccess(), 180);
      }
    }
  };

  const handleReset = () => {
    playCyberClick();
    setAnswers({ 1: null, 2: null, 3: null });
  };

  const answeredCount = [answers[1], answers[2], answers[3]].filter((a) => a !== null).length;
  const progressPercent = Math.round((answeredCount / 3) * 100);

  const isCompleted = answers[1] !== null && answers[2] !== null && answers[3] !== null;

  // 診断結果判定
  const hasAccountRisk = answers[3] === 1; // 私用アカウント
  const hasConfidentialRisk = answers[2] === 0; // 社外秘あり
  const hasPersonalRisk = answers[1] === 0; // 個人情報あり

  return (
    <div id="self-check" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* タイトルヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              社内AI入力 セルフチェック診断ツール
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            「この業務データや議事録はAIに入力して大丈夫？」を3つの質問で10秒判定します。
          </p>
        </div>
        <button
          onClick={handleReset}
          onMouseEnter={() => playCyberHover()}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>リセット</span>
        </button>
      </div>

      {/* 回答進捗HUDバー */}
      <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">
              HUD PROGRESS
            </span>
            <span className="text-slate-600 font-semibold text-[11px]">
              診断進捗：{answeredCount} / 3 問回答完了
            </span>
          </div>
          <span className="font-mono font-bold text-indigo-600 text-xs">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 設問カード */}
      <div className="space-y-4">
        {QUESTIONS.map((q) => {
          const Icon = q.icon;
          const currentAns = answers[q.id];
          return (
            <div
              key={q.id}
              className={`p-4 rounded-2xl border transition-all ${
                currentAns !== null
                  ? "bg-slate-50/60 border-indigo-200"
                  : "bg-white border-slate-200/80"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 mt-0.5">
                  <Icon size={16} />
                </div>
                <div className="space-y-2 flex-1">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {q.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{q.desc}</p>
                  </div>

                  {/* 選択肢ボタン */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, idx) => {
                      const isSelected = currentAns === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelect(q.id, idx)}
                          onMouseEnter={() => playCyberHover()}
                          className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                            isSelected
                              ? opt.isRisk
                                ? "bg-rose-50 border-rose-300 text-rose-950 shadow-xs"
                                : "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs"
                              : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                          }`}
                        >
                          <span className="text-xs font-bold leading-tight flex items-center justify-between">
                            <span>{opt.label}</span>
                            {isSelected && (
                              opt.isRisk ? (
                                <AlertTriangle size={14} className="text-rose-600 shrink-0 ml-1" />
                              ) : (
                                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 ml-1" />
                              )
                            )}
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            {opt.sublabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 診断結果の表示 */}
      {isCompleted ? (
        <div className="pt-2 animate-in fade-in zoom-in-95 duration-500">
          {hasAccountRisk ? (
            /* 私用アカウントによるNG */
            <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <h4 className="text-base font-extrabold text-rose-900">
                  【利用不可】個人の私用アカウントでの入力は禁止されています
                </h4>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                私用アカウントで入力した業務データは、一般利用規約に基づき外部モデルの再学習に利用される恐れがあります。
                直ちに利用を中止し、必ず<strong>社内から付与された会社Googleアカウント</strong>（または社内Antigravity環境）にログインし直してください。
              </p>
            </div>
          ) : hasConfidentialRisk ? (
            /* 未公開社外秘によるNG */
            <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <h4 className="text-base font-extrabold text-rose-900">
                  【入力禁止】未公開の社外秘データ・認証情報はAIに投入できません
                </h4>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                未発表の財務数値、契約書の固有条件、本番APIキー・パスワードはAIへの直接投入が禁止されています。
                <strong>対応策:</strong> プログラムの構文やロジック、架空のサンプル数値のみを抽出して質問するか、AI推進事務局へ個別にご相談ください。
              </p>
            </div>
          ) : hasPersonalRisk ? (
            /* 個人情報マスキングによる注意OK */
            <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <h4 className="text-base font-extrabold text-amber-900">
                  【条件付きOK】実名をダミーに「マスキング」すれば安全に入力できます
                </h4>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                会社アカウント環境のため学習には利用されませんが、個人情報保護の観点から実名の入力は避けるルールとなっています。
              </p>
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900 block">💡 マスキングの推奨例:</span>
                <p className="text-slate-700">「株式会社佐藤商事の山田様（yamada@example.jp）」➔ <strong>「A社のご担当者様」</strong> に置き換えてプロンプトを作成してください。</p>
              </div>
            </div>
          ) : (
            /* 完全クリア（安全に入力可能） */
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <h4 className="text-base font-extrabold text-emerald-900">
                  【入力OK】社内ガイドラインに適合しています。安心してご利用ください！
                </h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                会社正規アカウント環境下で、個人情報や極秘データを含まない一般的な業務データです。
                プロンプト集のテンプレートを活用して、日々の業務効率化を進めてください。
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
          すべての質問（3問）を選択すると、判定結果と推奨アクションが表示されます。
        </div>
      )}
    </div>
  );
}
