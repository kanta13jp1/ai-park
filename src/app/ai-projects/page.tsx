"use client";

import { useEffect, useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import { Building2, CircleDot, ExternalLink, Plus, RefreshCw, User, Wrench } from "lucide-react";
import {
  buildNewProjectUrl,
  fetchProjectIssues,
  projectStages,
  type AiProject,
  type ProjectStage,
} from "@/lib/githubProjects";
import { GITHUB_REPO } from "@/lib/githubFeedback";

// ご意見TODO-04への対応。AI CoE が把握している実在プロジェクト（GitHub Issue 登録分と合わせて表示）
const coeProjects: AiProject[] = [
  {
    id: "COE-01",
    name: "AI Park（社内AIポータル）の構築・運用",
    dept: "AI CoE",
    owner: "AI CoE",
    stage: "本番運用中",
    tools: "Claude Code, GitHub Actions, Google Sheets",
    summary:
      "社内のAI活用情報をまとめたポータル。ご意見・取材立候補・プロジェクト登録を GitHub Issue で受け付け、Google Chat に自動通知しています。",
    effect: "Google Chat でいただいたご意見8件のうち6件を反映済み（2026年9月時点）。",
    updated: "2026/09/26",
  },
  {
    id: "COE-02",
    name: "Antigravity の業務利用（会社の Google Cloud 経由）",
    dept: "AI CoE",
    owner: "AI CoE",
    stage: "PoC中",
    tools: "Google Antigravity, Google Cloud",
    summary:
      "会社の Google アカウントのまま Antigravity を使えるよう、会社の Google Cloud プロジェクト経由（従量課金）の利用環境を整備中。利用者1人あたり月3,000円を目安に上限を設定します。",
    effect: "課題：請求先アカウントのリンクと月額上限の設定待ち。手順は導入ガイドに公開済み。",
    updated: "2026/09/26",
  },
];

const stageStyle: Record<ProjectStage, string> = {
  検討中: "bg-slate-100 text-slate-700 border-slate-300",
  PoC中: "bg-purple-100 text-purple-800 border-purple-300",
  本番運用中: "bg-emerald-100 text-emerald-800 border-emerald-300",
  終了: "bg-slate-200 text-slate-500 border-slate-300",
};

export default function AiProjectsPage() {
  const [issueProjects, setIssueProjects] = useState<AiProject[]>([]);
  const [syncState, setSyncState] = useState<"loading" | "ok" | "error">("loading");
  const [stageFilter, setStageFilter] = useState<ProjectStage | "all">("all");

  const load = (signal?: AbortSignal) =>
    fetchProjectIssues(signal).then(
      (items) => {
        setIssueProjects(items);
        setSyncState("ok");
      },
      (e) => {
        if (signal?.aborted) return;
        console.error("Failed to load AI projects", e);
        setSyncState("error");
      }
    );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, []);

  const all = [...issueProjects, ...coeProjects];
  const shown = stageFilter === "all" ? all : all.filter((p) => p.stage === stageFilter);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="社内AIプロジェクト一覧"
        subtitle="AIに聞いてもわからない「社内のどこで、誰が、何をしているか」を共有する台帳"
      />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        {/* 登録案内 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
            <h2 className="font-bold text-sm text-slate-900">あなたのチームのAIプロジェクトを登録してください</h2>
            <p>
              検討中・PoC中の小さな取り組みでも歓迎です。登録すると一覧に自動で載り、Google Chat で共有されます。
              状況が変わったら登録した Issue を編集し、終わったら Close してください。
            </p>
            <p className="text-amber-800">
              ※ 登録内容は公開されます。顧客名・契約情報・社外秘の数値は書かないでください。
            </p>
          </div>
          <a
            href={buildNewProjectUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs"
          >
            <Plus size={15} />
            プロジェクトを登録する
          </a>
        </div>

        {/* フィルター & 同期状況 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(["all", ...projectStages] as const).map((s) => {
              const count = s === "all" ? all.length : all.filter((p) => p.stage === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setStageFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    stageFilter === s ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {s === "all" ? "すべて" : s} ({count})
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CircleDot size={13} />
            {syncState === "loading" && <span>GitHub から読み込み中...</span>}
            {syncState === "ok" && <span>GitHub 登録分 {issueProjects.length} 件を表示中</span>}
            {syncState === "error" && <span className="text-rose-600">GitHub の読み込みに失敗しました（AI CoE 登録分のみ表示）</span>}
            <button
              onClick={() => {
                setSyncState("loading");
                load();
              }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              <RefreshCw size={12} />
              再読込
            </button>
          </div>
        </div>

        {/* 一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shown.map((p) => (
            <article key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{p.name}</h3>
                <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded border ${stageStyle[p.stage]}`}>
                  {p.stage}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1"><Building2 size={12} />{p.dept}</span>
                {p.owner && <span className="inline-flex items-center gap-1"><User size={12} />{p.owner}</span>}
                {p.tools && <span className="inline-flex items-center gap-1"><Wrench size={12} />{p.tools}</span>}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{p.summary}</p>
              {p.effect && (
                <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
                  <span className="font-bold text-slate-700">成果・課題：</span>
                  {p.effect}
                </p>
              )}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>更新: {p.updated}</span>
                {p.issueUrl ? (
                  <a href={p.issueUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-indigo-700 font-semibold hover:underline">
                    Issue を見る・更新する <ExternalLink size={11} />
                  </a>
                ) : (
                  <span>AI CoE 登録</span>
                )}
              </div>
            </article>
          ))}
          {shown.length === 0 && (
            <p className="text-xs text-slate-500 md:col-span-2 text-center py-10">該当するプロジェクトはありません。</p>
          )}
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          登録データ：
          <a
            href={`https://github.com/${GITHUB_REPO}/issues?q=label%3Aai-project`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GitHub Issue（ai-project ラベル）
          </a>
        </p>
      </div>
    </div>
  );
}
