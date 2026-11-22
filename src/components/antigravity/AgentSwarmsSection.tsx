"use client";

import SpotlightCard from "@/components/SpotlightCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import {
  AlertTriangle,
  ArrowRight,
  GitBranch,
  MessageSquare,
  Network,
  Users,
} from "lucide-react";

export interface SwarmWorkspaceModeItem {
  mode: "inherit" | "share" | "branch";
  label: string;
  mechanism: string;
  bestFor: string;
  caution: string;
}

export interface SwarmRolePatternItem {
  role: string;
  workspace: string;
  responsibility: string;
  handoffTip: string;
}

export interface SwarmLifecycleStepItem {
  step: string;
  title: string;
  detail: string;
}

export interface AgentSwarmsSectionProps {
  workspaceModes: SwarmWorkspaceModeItem[];
  rolePatterns: SwarmRolePatternItem[];
  lifecycleSteps: SwarmLifecycleStepItem[];
  onJumpToSwarmExamples: () => void;
}

const WORKSPACE_MODE_BADGE_CLASS: Record<SwarmWorkspaceModeItem["mode"], string> = {
  inherit: "bg-slate-100 text-slate-800 border-slate-300",
  share: "bg-indigo-50 text-indigo-700 border-indigo-200",
  branch: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

const ROLE_VISUALS: Record<string, { iconBg: string; spotlight: string }> = {
  coordinator: {
    iconBg: "bg-slate-900 text-cyan-300",
    spotlight: "rgba(6, 182, 212, 0.12)",
  },
  author: {
    iconBg: "bg-indigo-600 text-white",
    spotlight: "rgba(99, 102, 241, 0.12)",
  },
  verifier: {
    iconBg: "bg-emerald-600 text-white",
    spotlight: "rgba(16, 185, 129, 0.12)",
  },
  monitor: {
    iconBg: "bg-amber-600 text-white",
    spotlight: "rgba(245, 158, 11, 0.12)",
  },
};

function getWorkspaceBadgeClass(workspace: string): string {
  const normalized = workspace.trim().toLowerCase();
  if (normalized === "inherit" || normalized === "share" || normalized === "branch") {
    return WORKSPACE_MODE_BADGE_CLASS[normalized];
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function getRoleVisual(role: string): { iconBg: string; spotlight: string } {
  const normalized = role.trim().toLowerCase();
  return (
    ROLE_VISUALS[normalized] ?? {
      iconBg: "bg-slate-900 text-cyan-300",
      spotlight: "rgba(99, 102, 241, 0.12)",
    }
  );
}

/**
 * Antigravity 情報局「全体像・使い分け」タブ内の Agent Swarms (/swarm) 解説セクション。
 * 共有ボード上の @メンション協調、workspace 分離モード、役割パターン、運用ライフサイクルを表示する。
 */
export function AgentSwarmsSection({
  workspaceModes,
  rolePatterns,
  lifecycleSteps,
  onJumpToSwarmExamples,
}: AgentSwarmsSectionProps) {
  return (
    <section className="space-y-6">
      {/* 1. 見出し＆概要バナー */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Network size={19} className="text-indigo-600 shrink-0" />
            <span>Agent Swarms（/swarm）並列マルチエージェント協調</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            共有メッセージボード上の{" "}
            <code className="font-mono text-xs bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded">
              @メンション
            </code>{" "}
            による協調と作業コピー分離により、複数ロールのエージェントを安全に並列稼働できます。
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300">
                  /swarm
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  共有ボード並列実行
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  作業コピー分離
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                役割別の複数ワーカーを同時起動し、必要な相手だけを起床させてハンドオフ
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Coordinator が共有ボードにブリーフを公開して Author・Verifier・Monitor を編成します。
                ワーカーは{" "}
                <code className="font-mono text-xs bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded">
                  swarm_wait
                </code>{" "}
                でトークンを消費せずに待機し、作業コピー分離とコミット＆統合の運用ルールで編集競合を防ぎます。
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                playCyberClick();
                onJumpToSwarmExamples();
              }}
              onMouseEnter={() => playCyberHover()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer shrink-0 group self-start lg:self-center"
            >
              <span>Agent Swarms の実務実行例を見る</span>
              <ArrowRight
                size={15}
                className="text-cyan-300 group-hover:text-white group-hover:translate-x-0.5 transition-all"
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-start gap-2.5">
              <Network size={16} className="text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-900">共有ボード並列実行</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  所有ファイルと完了条件をブリーフで明示し、独立タスクを同時進行させます。
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-start gap-2.5">
              <MessageSquare size={16} className="text-cyan-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-900">@メンション協調</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  次工程の担当だけを{" "}
                  <code className="font-mono text-[11px] text-indigo-700">@name</code>{" "}
                  で起床させ、不要な割り込みを抑えます。
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-start gap-2.5">
              <GitBranch size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-900">作業コピー分離</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <code className="font-mono text-[11px] text-indigo-700">inherit</code> /{" "}
                  <code className="font-mono text-[11px] text-indigo-700">share</code> /{" "}
                  <code className="font-mono text-[11px] text-indigo-700">branch</code>{" "}
                  を役割に応じて使い分けます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. workspace 分離モード比較テーブル */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <GitBranch size={17} className="text-cyan-600 shrink-0" />
            <span>workspace 分離モード比較（inherit / share / branch）</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-500">
            {workspaceModes.length} modes
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs">
                  <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">mode</th>
                  <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">分離形態</th>
                  <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">仕組み</th>
                  <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">適した役割・用途</th>
                  <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">運用上の注意点</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {workspaceModes.map((item) => (
                  <tr key={item.mode} className="hover:bg-slate-50/80 transition-colors align-top">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <code
                        className={`inline-flex items-center font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border ${WORKSPACE_MODE_BADGE_CLASS[item.mode]}`}
                      >
                        {item.mode}
                      </code>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {item.label}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                      {item.mechanism}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                      {item.bestFor}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                      {item.caution}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. 4 役割パターンカードグリッド */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Users size={17} className="text-indigo-600 shrink-0" />
            <span>役割（ロール）パターンとハンドオフ設計</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-500">
            {rolePatterns.length} roles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rolePatterns.map((pattern) => {
            const visual = getRoleVisual(pattern.role);
            return (
              <SpotlightCard
                key={pattern.role}
                spotlightColor={visual.spotlight}
                className="bg-white border-slate-200/90 rounded-2xl p-5"
              >
                <div className="flex flex-col justify-between h-full space-y-3.5">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${visual.iconBg}`}
                        >
                          <Users size={16} />
                        </div>
                        <h5 className="text-base font-black text-slate-900">{pattern.role}</h5>
                      </div>
                      <code
                        className={`font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getWorkspaceBadgeClass(
                          pattern.workspace
                        )}`}
                      >
                        workspace: {pattern.workspace}
                      </code>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {pattern.responsibility}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 flex items-start gap-2 text-xs text-slate-700">
                    <MessageSquare size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">ハンドオフのコツ: </span>
                      <span>{pattern.handoffTip}</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>

      {/* 4. 運用 4 ステップバー & kill 前注意ボックス */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Network size={17} className="text-emerald-600 shrink-0" />
            <span>運用 4 ステップとクリーンアップルール</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-500">
            {lifecycleSteps.length} steps
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {lifecycleSteps.map((item, idx) => (
            <div
              key={item.step}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-2.5"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300">
                    STEP {item.step}
                  </span>
                  {idx < lifecycleSteps.length - 1 && (
                    <ArrowRight
                      size={14}
                      className="hidden lg:block text-slate-300 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h5 className="text-sm font-black text-slate-900 leading-snug">{item.title}</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-amber-50/90 border border-amber-300/80 p-4 sm:p-5 flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div className="space-y-1 text-amber-950">
            <p className="text-xs sm:text-sm font-black">
              重要：
              <code className="font-mono text-xs bg-amber-100/90 border border-amber-300/70 px-1.5 py-0.5 rounded mx-1">
                share
              </code>
              /
              <code className="font-mono text-xs bg-amber-100/90 border border-amber-300/70 px-1.5 py-0.5 rounded mx-1">
                branch
              </code>
              は{" "}
              <code className="font-mono text-xs bg-amber-100/90 border border-amber-300/70 px-1.5 py-0.5 rounded">
                kill
              </code>{" "}
              前にコミット＆統合が必須です
            </p>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              ワーカーに対して{" "}
              <code className="font-mono text-xs font-semibold">kill</code>{" "}
              を実行するとワーカーは恒久的に終了し、そのワーカー専用の{" "}
              <code className="font-mono text-xs font-semibold">share</code> /{" "}
              <code className="font-mono text-xs font-semibold">branch</code>{" "}
              作業コピーも同時に削除されます（終了したワーカー名の再開・復活はできません）。
              必ず対象ブランチへ変更をコミットし、Coordinator 側へマージまたは cherry-pick で統合・検証を完了してから{" "}
              <code className="font-mono text-xs font-semibold">kill</code>{" "}
              してください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AgentSwarmsSection;
