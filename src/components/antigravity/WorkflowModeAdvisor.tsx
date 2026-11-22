"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Cpu,
  GitBranch,
  Layers,
  Lightbulb,
  Terminal,
} from "lucide-react";
import { playCyberClick, playCyberHover, playCyberSuccess } from "@/lib/sound";
import InlineCodeText from "@/components/antigravity/InlineCodeText";

export interface WorkflowAdvisorScenarioItem {
  id: string;
  label: string;
  taskType: string;
  recommendedSurface: string;
  recommendedMode: string;
  recommendedWorkspace?: "inherit" | "share" | "branch";
  reason: string;
  starterPrompt: string;
}

export interface WorkflowModeAdvisorProps {
  scenarios: WorkflowAdvisorScenarioItem[];
}

type RepoCondition = "normal" | "nested-or-heavy";

const WORKSPACE_BADGE_CLASS: Record<"inherit" | "share" | "branch", string> = {
  inherit: "bg-slate-100 text-slate-800 border-slate-300",
  share: "bg-indigo-50 text-indigo-700 border-indigo-200",
  branch: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

/**
 * Antigravity 情報局「全体像・使い分け」タブ向けのインタラクティブ実行モード診断コンポーネント。
 * やりたい作業に応じて最適な Surface・モダリティ・workspace・スタータープロンプトを提案する。
 */
export function WorkflowModeAdvisor({ scenarios }: WorkflowModeAdvisorProps) {
  const [selectedId, setSelectedId] = useState<string>(() => scenarios[0]?.id ?? "");
  const [repoCondition, setRepoCondition] = useState<RepoCondition>("normal");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyAnnouncement, setCopyAnnouncement] = useState("");
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const selectedScenario =
    scenarios.find((scenario) => scenario.id === selectedId) ?? scenarios[0] ?? null;

  const handleCopyPrompt = (id: string, text: string) => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        playCyberSuccess();
        setCopiedId(id);
        setCopyAnnouncement("スタータープロンプトをクリップボードにコピーしました。");
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = setTimeout(() => {
          setCopiedId((prev) => (prev === id ? null : prev));
          setCopyAnnouncement("");
        }, 2000);
      })
      .catch(() => {});
  };

  return (
    <section className="space-y-4">
      <p className="sr-only" role="status" aria-live="polite">
        {copyAnnouncement}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Compass size={19} className="text-indigo-600 shrink-0" />
            <span>目的に合う実行モード診断</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            やりたい作業を選ぶと、最適な Surface・モダリティ・推奨{" "}
            <code className="font-mono text-xs bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded">
              workspace
            </code>
            ・すぐ使えるスタータープロンプトを提案します。
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          {scenarios.length} scenarios
        </span>
      </div>

      {!selectedScenario ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
          <p className="text-xs sm:text-sm text-slate-500">
            選択可能な診断シナリオが現在登録されていません。
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          {/* 1. シナリオ選択ボタングリッド */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-slate-500">
              STEP 1: やりたい作業タイプを選択
            </p>
            <div
              role="group"
              aria-label="作業タイプ選択"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
            >
              {scenarios.map((scenario) => {
                const isSelected = scenario.id === selectedScenario.id;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      playCyberClick();
                      setSelectedId(scenario.id);
                    }}
                    onMouseEnter={() => playCyberHover()}
                    className={`text-left rounded-xl border p-3.5 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-white hover:border-indigo-300 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
                            : "bg-indigo-50 text-indigo-700 border-indigo-200"
                        }`}
                      >
                        {scenario.taskType}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={14} className="text-cyan-300 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-black leading-snug">
                      {scenario.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 選択中シナリオの診断結果パネル */}
          <div className="pt-5 border-t border-slate-200/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-indigo-600">
                  RECOMMENDED SETUP — {selectedScenario.taskType}
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  {selectedScenario.label}
                </h4>
              </div>

              {selectedScenario.recommendedWorkspace && (
                <div className="flex flex-wrap items-center gap-2">
                  <code
                    className={`font-mono text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${
                      WORKSPACE_BADGE_CLASS[selectedScenario.recommendedWorkspace]
                    }`}
                  >
                    workspace: {selectedScenario.recommendedWorkspace}
                  </code>
                  {selectedScenario.recommendedWorkspace === "share" &&
                    repoCondition === "nested-or-heavy" && (
                      <code className="font-mono text-xs font-bold px-3 py-1 rounded-full border bg-amber-100 text-amber-900 border-amber-300 shrink-0">
                        フォールバック: inherit
                      </code>
                    )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-3.5 flex items-start gap-2.5">
                <Layers size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-slate-500">推奨環境（Surface）</p>
                  <p className="text-xs sm:text-sm font-black text-slate-900">
                    {selectedScenario.recommendedSurface}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-3.5 flex items-start gap-2.5">
                <Cpu size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-slate-500">推奨モード（モダリティ）</p>
                  <p className="text-xs sm:text-sm font-black text-slate-900">
                    {selectedScenario.recommendedMode}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-3.5 flex items-start gap-2.5">
              <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">選定理由: </span>
                <span>
                  <InlineCodeText text={selectedScenario.reason} />
                </span>
              </div>
            </div>

            {/* 3. 補助トグル「リポジトリ状態チェック」（share 推奨時のみ表示） */}
            {selectedScenario.recommendedWorkspace === "share" && (
              <div className="rounded-xl bg-indigo-50/50 border border-indigo-200/80 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GitBranch size={16} className="text-indigo-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      リポジトリ状態チェック
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">
                    <code className="font-mono text-indigo-700">workspace: &quot;share&quot;</code>{" "}
                    適用前の確認
                  </span>
                </div>

                <div
                  role="group"
                  aria-label="リポジトリ状態チェック"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  <button
                    type="button"
                    aria-pressed={repoCondition === "normal"}
                    onClick={() => {
                      playCyberClick();
                      setRepoCondition("normal");
                    }}
                    onMouseEnter={() => playCyberHover()}
                    className={`text-left rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      repoCondition === "normal"
                        ? "bg-white border-indigo-500 text-indigo-900 shadow-xs ring-1 ring-indigo-500/20"
                        : "bg-white/70 border-slate-200 text-slate-600 hover:bg-white hover:border-indigo-300"
                    }`}
                  >
                    <CheckCircle2
                      size={14}
                      className={
                        repoCondition === "normal"
                          ? "text-indigo-600 shrink-0"
                          : "text-slate-300 shrink-0"
                      }
                    />
                    <span>通常リポジトリ（未追跡ネスト .git なし）</span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={repoCondition === "nested-or-heavy"}
                    onClick={() => {
                      playCyberClick();
                      setRepoCondition("nested-or-heavy");
                    }}
                    onMouseEnter={() => playCyberHover()}
                    className={`text-left rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      repoCondition === "nested-or-heavy"
                        ? "bg-amber-50 border-amber-500 text-amber-950 shadow-xs ring-1 ring-amber-500/20"
                        : "bg-white/70 border-slate-200 text-slate-600 hover:bg-white hover:border-amber-300"
                    }`}
                  >
                    <AlertTriangle
                      size={14}
                      className={
                        repoCondition === "nested-or-heavy"
                          ? "text-amber-600 shrink-0"
                          : "text-slate-300 shrink-0"
                      }
                    />
                    <span>未追跡ネスト .git や大量未追跡ファイルあり</span>
                  </button>
                </div>

                {repoCondition === "nested-or-heavy" && (
                  <div className="rounded-xl bg-amber-50/90 border border-amber-300/80 p-3.5 sm:p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 border border-amber-200 text-amber-700 shrink-0">
                      <AlertTriangle size={16} />
                    </div>
                    <div className="space-y-1 text-amber-950">
                      <p className="text-xs sm:text-sm font-black">
                        安全フォールバック：
                        <code className="font-mono text-xs bg-amber-100/90 border border-amber-300/70 px-1.5 py-0.5 rounded mx-1">
                          workspace: &quot;inherit&quot;
                        </code>
                        ＋ ファイル単位の排他分担へ切り替え
                      </p>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        未追跡のネストされた{" "}
                        <code className="font-mono text-xs font-semibold">.git</code>{" "}
                        や大量の未追跡ファイルがある状態では、作業コピーの複製負荷や意図しないファイル混入を避けるため、
                        <code className="font-mono text-xs font-semibold">
                          workspace: &quot;inherit&quot;
                        </code>{" "}
                        を選択してください。同一ファイルの同時編集を防ぐため、各ワーカーのブリーフに所有ファイルを重複なく明記するファイル単位の排他分担で安全に並列作業できます。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. スタータープロンプトのコードブロック＋ワンクリックコピー */}
            <div className="rounded-xl bg-slate-950 text-cyan-200 border border-slate-800 p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400">
                  <Terminal size={13} className="text-cyan-400" />
                  <span>スタータープロンプト例</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyPrompt(selectedScenario.id, selectedScenario.starterPrompt)
                  }
                  onMouseEnter={() => playCyberHover()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-all cursor-pointer"
                >
                  {copiedId === selectedScenario.id ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-300">コピー済み</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>コピー</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs text-cyan-200 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {selectedScenario.starterPrompt}
              </pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default WorkflowModeAdvisor;
