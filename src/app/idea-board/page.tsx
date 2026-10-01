"use client";

import { useEffect, useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import SpotlightCard from "@/components/SpotlightCard";
import {
  Building2,
  CircleDot,
  ExternalLink,
  HandHelping,
  Plus,
  RefreshCw,
  User,
  Wrench,
  Sparkles,
  Trophy,
  HelpCircle,
  Lightbulb,
  Search,
} from "lucide-react";
import { buildNewIdeaUrl, fetchIdeaIssues, ideaStages, type Idea, type IdeaStage } from "@/lib/githubIdeas";
import { GITHUB_REPO } from "@/lib/githubFeedback";
import { playCyberClick } from "@/lib/sound";

const stageStyle: Record<IdeaStage, string> = {
  アイデア段階: "bg-sky-500/10 text-sky-400 border-sky-400/30",
  作っている: "bg-purple-500/10 text-purple-300 border-purple-400/30",
  "完成・使っている": "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
  終了: "bg-slate-500/10 text-slate-400 border-slate-400/20",
};

const stageSpotlight: Record<IdeaStage, string> = {
  アイデア段階: "rgba(14, 165, 233, 0.15)",
  作っている: "rgba(168, 85, 247, 0.15)",
  "完成・使っている": "rgba(16, 185, 129, 0.15)",
  終了: "rgba(148, 163, 184, 0.08)",
};

export default function IdeaBoardPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [syncState, setSyncState] = useState<"loading" | "ok" | "error">("loading");
  const [stageFilter, setStageFilter] = useState<IdeaStage | "all" | "help">("all");
  const [query, setQuery] = useState("");

  const load = (signal?: AbortSignal) =>
    fetchIdeaIssues(signal).then(
      (items) => {
        setIdeas(items);
        setSyncState("ok");
      },
      (e) => {
        if (signal?.aborted) return;
        console.error("Failed to load ideas", e);
        setSyncState("error");
      }
    );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, []);

  const q = query.trim().toLowerCase();
  const shown = ideas.filter((i) => {
    if (stageFilter === "help" && !(i.wantsHelp && i.stage !== "終了")) return false;
    if (stageFilter !== "all" && stageFilter !== "help" && i.stage !== stageFilter) return false;
    if (!q) return true;
    return [i.title, i.dept, i.author, i.problem, i.idea, i.tools].some((t) => t.toLowerCase().includes(q));
  });

  const filters: { key: IdeaStage | "all" | "help"; label: string; count: number }[] = [
    { key: "all", label: "すべて", count: ideas.length },
    { key: "help", label: "協力者募集中", count: ideas.filter((i) => i.wantsHelp && i.stage !== "終了").length },
    ...ideaStages.map((s) => ({ key: s, label: s, count: ideas.filter((i) => i.stage === s).length })),
  ];

  const handleFilterClick = (key: IdeaStage | "all" | "help") => {
    playCyberClick();
    setStageFilter(key);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="アイデア宣言ボード"
        subtitle="AIで自動化したい業務・創出したいエージェントのアイデアを全社に宣言し、共創パートナーを募る場所"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 宣言の案内 SpotlightCard */}
        <SpotlightCard
          spotlightColor="rgba(99, 102, 241, 0.2)"
          className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border-indigo-700/50 shadow-xl overflow-hidden"
        >
          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-cyan-300 text-xs font-semibold border border-indigo-400/30">
                <Sparkles size={14} className="text-cyan-300" />
                <span>オープン共創プラットフォーム</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                「こんな作業をAIに任せたい」を気軽に宣言してください
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                構想段階でも大歓迎です。宣言すると下の一覧にリアルタイム連携され、Google Chat の「AI勉強会」スペースに自動通知されます。
                進捗が変わったら Issue を編集し、完成・報告完了時に Close します。
              </p>
              <p className="text-xs text-amber-300/90 font-mono flex items-center gap-1.5 pt-1">
                <span>⚠️ 宣言内容は全社公開されます。顧客名・個人情報・機密数値の記載は避けてください。</span>
              </p>
            </div>

            <a
              href={buildNewIdeaUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playCyberClick()}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-black shadow-lg hover:shadow-cyan-400/20 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Plus size={16} />
              <span>アイデアを宣言する</span>
            </a>
          </div>
        </SpotlightCard>

        {/* フィルター・検索 & 同期状況 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterClick(f.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  stageFilter === f.key
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 ring-2 ring-indigo-500/40"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/80"
                }`}
              >
                <span>{f.label}</span>
                <span className="ml-1.5 font-mono text-[11px] opacity-70">({f.count})</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="キーワードで検索（例: 議事録）"
                className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
              <CircleDot size={13} className="text-cyan-500" />
              {syncState === "loading" && <span className="font-mono">GitHub同期中...</span>}
              {syncState === "ok" && <span className="font-mono font-bold text-slate-700">{ideas.length} 件</span>}
              {syncState === "error" && <span className="text-rose-600 font-bold">同期エラー</span>}
              <button
                onClick={() => {
                  playCyberClick();
                  setSyncState("loading");
                  load();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 font-bold cursor-pointer active:scale-95 transition-all"
              >
                <RefreshCw size={12} className={syncState === "loading" ? "animate-spin" : ""} />
                <span>再読込</span>
              </button>
            </div>
          </div>
        </div>

        {/* アイデア一覧カードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {shown.map((i) => (
            <SpotlightCard
              key={i.id}
              spotlightColor={stageSpotlight[i.stage] || "rgba(99, 102, 241, 0.12)"}
              className="bg-white border-slate-200/90"
            >
              <div className="p-6 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-black text-slate-900 text-base leading-snug tracking-tight">
                      {i.title}
                    </h3>
                    <span
                      className={`shrink-0 text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border ${stageStyle[i.stage]}`}
                    >
                      {i.stage}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Building2 size={13} className="text-indigo-500" />
                      {i.dept}
                    </span>
                    {i.author && (
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <User size={13} className="text-slate-400" />
                        {i.author}
                      </span>
                    )}
                    {i.tools && (
                      <span className="inline-flex items-center gap-1.5 font-mono text-slate-600">
                        <Wrench size={13} className="text-cyan-500" />
                        {i.tools}
                      </span>
                    )}
                    {i.wantsHelp && i.stage !== "終了" && (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 animate-pulse">
                        <HandHelping size={13} />
                        協力者募集中
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    <p className="text-slate-700 leading-relaxed font-normal">
                      <strong className="text-slate-900 font-bold block mb-0.5">課題・困りごと:</strong>
                      {i.problem}
                    </p>
                    <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 text-slate-700 leading-relaxed">
                      <strong className="text-indigo-700 font-bold block mb-0.5 font-mono text-[11px]">
                        AIに任せたいこと:
                      </strong>
                      {i.idea}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                  <span className="font-mono text-[11px]">
                    {i.id} • 更新: {i.updated}
                  </span>
                  <a
                    href={i.issueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playCyberClick()}
                    className="inline-flex items-center gap-1 text-indigo-600 font-extrabold hover:text-indigo-700 transition-colors"
                  >
                    <span>コメント・協力する</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </SpotlightCard>
          ))}

          {syncState !== "loading" && shown.length === 0 && (
            <div className="md:col-span-2 text-center py-16 bg-white/60 rounded-3xl border border-dashed border-slate-300 space-y-2">
              <Lightbulb size={32} className="mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">
                {ideas.length === 0
                  ? "まだ宣言はありません。最初のアイデアを宣言してみませんか？"
                  : "該当するアイデアは見つかりませんでした。"}
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center font-mono">
          登録データソース：
          <a
            href={`https://github.com/${GITHUB_REPO}/issues?q=label%3Aidea`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-indigo-600 ml-1 hover:text-indigo-700 font-bold"
          >
            GitHub Issues (label: idea)
          </a>
        </p>

        {/* 社内AIビジネスモデル提案コンテスト（暫定版） */}
        <details className="bg-white border border-amber-300/80 rounded-3xl p-6 shadow-xs group transition-all">
          <summary className="cursor-pointer list-none flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="font-black text-sm sm:text-base text-slate-900 tracking-tight">
                社内AIビジネスモデル提案コンテスト（応募期間：2026/11/2〜12/18）
              </span>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 self-start sm:self-center">
              暫定版（クリックで開閉）
            </span>
          </summary>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-5">
            <div className="space-y-2.5">
              <p><strong className="text-slate-900">目的：</strong>業務効率化だけでなく、AIで新価値・新収益を生むビジネスモデルのアイデアを全社から募集</p>
              <p><strong className="text-slate-900">対象：</strong>全社員（個人・チームどちらでも可、複数応募可）</p>
              <p><strong className="text-slate-900">応募期間：</strong>2026年11月2日（月）〜 12月18日（金）</p>
              <p><strong className="text-slate-900">審査・表彰：</strong>2027年1月中に審査・全社表彰</p>
              <p><strong className="text-slate-900">審査員：</strong>社長・杉村さん・AI推進担当</p>
              <p><strong className="text-slate-900">賞：</strong>最優秀賞 1件・優秀賞 2件・アイデア賞</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <p className="font-extrabold text-amber-900 text-sm">応募方法（社内限定受付）</p>
              <p className="text-amber-900">
                機密保持のため、本サイトや GitHub では受付を行いません。以下の項目を記載のうえ、Google Chat で AI推進担当 へ DM でご提出ください。
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-amber-900 font-medium">
                <li>タイトル（ひとこと）</li>
                <li>解決する課題と対象ターゲット</li>
                <li>AI活用のコアポイント</li>
                <li>収益性・提供価値の見立て</li>
                <li>最初のPoCで検証できること</li>
                <li>応募者氏名・所属部署</li>
              </ol>
            </div>
          </div>
        </details>

        {/* 宣言時のルール */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle size={18} className="text-indigo-600" />
            <span>アイデア宣言の3大ルール</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <h4 className="font-extrabold text-slate-900">1. アイデアの重複は歓迎</h4>
              <p className="text-slate-600 font-normal">
                「似たようなアイデアがあるかも」と躊躇する必要はありません。自部署独自の観点やアレンジは大歓迎です。
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <h4 className="font-extrabold text-slate-900">2. 機密情報の非記載</h4>
              <p className="text-slate-600 font-normal">
                具体的な顧客名・個人情報・未公開案件コードネームを直接記載せず、一般化した業務名で記載してください。
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <h4 className="font-extrabold text-slate-900">3. 作成義務はありません</h4>
              <p className="text-slate-600 font-normal">
                「こんなのあったらいいな」という構想だけで十分です。他のエンジニアが「作ります！」と合流することもあります。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
