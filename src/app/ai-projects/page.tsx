"use client";

import { useEffect, useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import {
  Building2,
  CircleDot,
  ExternalLink,
  Plus,
  RefreshCw,
  User,
  Wrench,
  Sparkles,
  ArrowRight,
  Layers,
  FolderGit2,
  Briefcase,
  Code2,
  Users,
  CheckCircle2,
  Zap,
} from "lucide-react";
import {
  buildNewProjectUrl,
  fetchProjectIssues,
  projectStages,
  type AiProject,
  type ProjectStage,
} from "@/lib/githubProjects";
import { GITHUB_REPO } from "@/lib/githubFeedback";

// 部署別の実践活用カード定義
interface DeptPractice {
  dept: string;
  deptIcon: typeof Building2;
  title: string;
  targetTask: string;
  workflow: string[];
  recommendedModel: string;
  effect: string;
}

const DEPT_PRACTICES: DeptPractice[] = [
  {
    dept: "開発・エンジニア",
    deptIcon: Code2,
    title: "TypeScript / Python のテスト作成＆リファクタリング",
    targetTask: "既存ロジックの単体テスト作成、例外処理・型安全性の向上",
    workflow: [
      "1. 対象関数と要件をプロンプト集からコピペ",
      "2. Antigravity または Gemini 3.1 Pro にテストコード（Vitest / Jest）を生成させる",
      "3. 境界値（null, undefined）が網羅されているかレビューしてコミット",
    ],
    recommendedModel: "Gemini 3.1 Pro (思考型)",
    effect: "テスト記述工数を約60%削減、型エラーの早期発見",
  },
  {
    dept: "営業・企画",
    deptIcon: Briefcase,
    title: "提案骨子・比較表の高速ドラフト作成",
    targetTask: "クライアント課題に対するソリューション比較表・導入メリットの整理",
    workflow: [
      "1. 顧客の課題感（個人情報はマスキング）を箇条書きで入力",
      "2. 自社サービスの強みと競合比較のマトリクスを表形式で出力依頼",
      "3. 叩き台をもとに提案スライドやメール文面に反映",
    ],
    recommendedModel: "Gemini 3.1 Flash / Pro",
    effect: "企画初期ドラフトの作成時間を2時間 ➔ 20分に短縮",
  },
  {
    dept: "人事・総務・バックオフィス",
    deptIcon: Users,
    title: "社内規程・申請ルールのQAボット＆通知文作成",
    targetTask: "就業規則・経費精算ルールに関する社員からのよくある問い合わせ対応",
    workflow: [
      "1. 最新の社内規程PDFやテキストをGeminiに入力（会社アカウント環境必須）",
      "2. 「社員からの質問：◯◯の申請期限はいつまで？」に対する回答案を出力",
      "3. 規程条文の該当箇所を引用させ、誤答（ハルシネーション）を二重チェック",
    ],
    recommendedModel: "Gemini 3.1 Pro",
    effect: "問い合わせ対応の初動迅速化、社内案内文の品質均一化",
  },
];

// ご意見TODO-04への対応。AI推進担当 が把握している実在プロジェクト（GitHub Issue 登録分と合わせて表示）
const coeProjects: AiProject[] = [
  {
    id: "COE-01",
    name: "AI Park（社内AIポータル）の構築・運用",
    dept: "AI推進担当",
    owner: "梅澤（AI推進担当）",
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
    dept: "AI推進担当",
    owner: "梅澤（AI推進担当）",
    stage: "PoC中",
    tools: "Google Antigravity, Google Cloud",
    summary:
      "会社の Google アカウントのまま Antigravity を使えるよう、会社の Google Cloud プロジェクト経由（従量課金）の利用環境を整備中。利用者1人あたり月3,000円を目安に上限を設定します。",
    effect: "課題：請求先アカウントのリンクと月額上限の設定待ち。手順は導入ガイドに公開済み。",
    updated: "2026/09/26",
  },
];

const stageStyle: Record<ProjectStage, { bg: string; text: string; border: string; glow: string }> = {
  検討中: {
    bg: "bg-slate-500/10",
    text: "text-slate-600",
    border: "border-slate-300",
    glow: "rgba(100, 116, 139, 0.12)",
  },
  PoC中: {
    bg: "bg-purple-500/10",
    text: "text-purple-700",
    border: "border-purple-300/80",
    glow: "rgba(168, 85, 247, 0.15)",
  },
  本番運用中: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-300/80",
    glow: "rgba(16, 185, 129, 0.15)",
  },
  終了: {
    bg: "bg-slate-200/50",
    text: "text-slate-500",
    border: "border-slate-300/60",
    glow: "rgba(148, 163, 184, 0.1)",
  },
};

export default function AiProjectsPage() {
  const [issueProjects, setIssueProjects] = useState<AiProject[]>([]);
  const [syncState, setSyncState] = useState<"loading" | "ok" | "error">("loading");
  const [stageFilter, setStageFilter] = useState<ProjectStage | "all">("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

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
  const departments = Array.from(new Set(all.map((p) => p.dept).filter(Boolean)));

  const shown = all.filter((p) => {
    const matchesStage = stageFilter === "all" || p.stage === stageFilter;
    const matchesDept = deptFilter === "all" || p.dept === deptFilter;
    return matchesStage && matchesDept;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50/70 min-h-screen">
      <HeroBanner
        title="社内AIプロジェクト一覧"
        subtitle="AIに聞いてもわからない「社内のどこで、誰が、何をしているか」を共有する共創台帳"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* プロジェクト登録アナウンスバナー（グラスモーフィズム） */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-700/50 p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 tracking-wider">
                COMMUNITY DRIVEN
              </span>
              <span className="text-xs text-indigo-200">GitHub Issue & Google Chat 自動連携</span>
            </div>
            <h2 className="font-black text-lg sm:text-xl text-white tracking-tight">
              自チームのAI活用プロジェクトを登録・共有しませんか？
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              検討中・PoC中の小さな試みでも大歓迎です。登録するとこの一覧に即時反映され、社内Google Chatにも共有されます。社内の知見をオープンにし、無駄な車輪の再発明を防ぎましょう。
            </p>
            <p className="text-[11px] text-amber-300/90 font-medium">
              ※ 社外公開リポジトリのIssueに登録されます。顧客名・契約情報・機密データは記載しないでください。
            </p>
          </div>

          <a
            href={buildNewProjectUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playCyberClick()}
            onMouseEnter={() => playCyberHover()}
            className="relative z-10 shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 self-start md:self-center cursor-pointer"
          >
            <Plus size={15} />
            <span>プロジェクトを登録する</span>
          </a>
        </div>

        {/* フィルター & リアルタイム同期状況バー */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(["all", ...projectStages] as const).map((s) => {
              const count = s === "all" ? all.length : all.filter((p) => p.stage === s).length;
              const isSelected = stageFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => {
                    playCyberClick();
                    setStageFilter(s);
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {s === "all" ? "すべて" : s} ({count})
                </button>
              );
            })}

            {/* 部署別フィルター */}
            {departments.length > 0 && (
              <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-slate-200">
                <span className="text-[11px] font-bold text-slate-500">部署:</span>
                <select
                  value={deptFilter}
                  onChange={(e) => {
                    playCyberClick();
                    setDeptFilter(e.target.value);
                  }}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100/90 border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="all">全社・全部署</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium self-end md:self-center">
            <div className="flex items-center gap-1.5">
              <CircleDot size={13} className={syncState === "loading" ? "animate-spin text-cyan-600" : "text-emerald-500"} />
              {syncState === "loading" && <span>GitHub 同期中...</span>}
              {syncState === "ok" && <span>GitHub 登録 {issueProjects.length} 件 同期中</span>}
              {syncState === "error" && <span className="text-rose-600">GitHub 同期失敗（CoE登録分のみ表示）</span>}
            </div>
            <button
              onClick={() => {
                playCyberClick();
                setSyncState("loading");
                load();
              }}
              onMouseEnter={() => playCyberHover()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 shadow-2xs cursor-pointer transition-colors"
            >
              <RefreshCw size={11} />
              <span>更新</span>
            </button>
          </div>
        </div>

        {/* プロジェクト一覧カードグリッド（SpotlightCard適用） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {shown.map((p) => {
            const currentStage = stageStyle[p.stage] ?? stageStyle["検討中"];
            return (
              <TiltCard
                key={p.id}
                maxTilt={5}
                glareOpacity={0.12}
                className="h-full rounded-2xl"
              >
                <SpotlightCard
                  spotlightColor={currentStage.glow}
                  className="bg-white border-slate-200/90 h-full"
                >
                  <article className="p-6 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight">
                        {p.name}
                      </h3>
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${currentStage.bg} ${currentStage.text} ${currentStage.border}`}
                      >
                        {p.stage}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                        <Building2 size={12} className="text-slate-400" />
                        {p.dept}
                      </span>
                      {p.owner && (
                        <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                          <User size={12} className="text-slate-400" />
                          {p.owner}
                        </span>
                      )}
                      {p.tools && (
                        <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md text-indigo-700 font-mono">
                          <Wrench size={12} className="text-indigo-500" />
                          {p.tools}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {p.summary}
                    </p>

                    {p.effect && (
                      <div className="text-xs text-slate-700 bg-indigo-50/40 border border-indigo-100/70 rounded-xl p-3 leading-relaxed">
                        <span className="font-bold text-indigo-900 block mb-0.5">成果・課題：</span>
                        {p.effect}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                    <span className="font-mono">更新: {p.updated}</span>
                    {p.issueUrl ? (
                      <a
                        href={p.issueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playCyberClick()}
                        onMouseEnter={() => playCyberHover()}
                        className="inline-flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-700 transition-colors cursor-pointer"
                      >
                        <span>GitHub Issue を見る</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="font-mono text-slate-500">推進担当 公式登録</span>
                    )}
                  </div>
                </article>
              </SpotlightCard>
            </TiltCard>
            );
          })}

          {shown.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 md:col-span-2 space-y-2">
              <FolderGit2 size={36} className="mx-auto text-slate-300" />
              <p className="text-xs font-semibold">該当するステータスのプロジェクトはありません。</p>
            </div>
          )}
        </div>

        {/* 部署別 実務ベストプラクティス・実践フロー */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
                  部署別 実務ベストプラクティス・実践フロー
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                「自分の部署では具体的に何から始めればいい？」を解決する、真似して始められる業務効率化モデルです。
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60 self-start sm:self-auto">
              <span>💡 すぐ試せるワークフロー</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DEPT_PRACTICES.map((dp) => {
              const Icon = dp.deptIcon;
              return (
                <TiltCard
                  key={dp.dept}
                  maxTilt={6}
                  glareOpacity={0.1}
                  className="rounded-2xl"
                >
                  <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between h-full space-y-4 hover:border-indigo-300 transition-all shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                        <Icon size={14} className="text-indigo-600" />
                        <span>{dp.dept}</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {dp.recommendedModel}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                        {dp.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        対象業務: {dp.targetTask}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 block">実践フロー:</span>
                      <ul className="space-y-1 text-[11px] text-slate-600 leading-relaxed font-mono">
                        {dp.workflow.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>効果: {dp.effect}</span>
                  </div>
                </div>
              </TiltCard>
              );
            })}
          </div>
        </section>

        <p className="text-[11px] text-slate-400 text-center font-mono">
          登録データ同期先：
          <a
            href={`https://github.com/${GITHUB_REPO}/issues?q=label%3Aai-project`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-600 transition-colors ml-1"
          >
            GitHub Issue (label: ai-project)
          </a>
        </p>
      </div>
    </div>
  );
}
