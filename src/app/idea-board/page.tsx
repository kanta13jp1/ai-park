"use client";

import { useEffect, useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import { Building2, CircleDot, ExternalLink, HandHelping, Plus, RefreshCw, User, Wrench } from "lucide-react";
import { buildNewIdeaUrl, fetchIdeaIssues, ideaStages, type Idea, type IdeaStage } from "@/lib/githubIdeas";
import { GITHUB_REPO } from "@/lib/githubFeedback";

const stageStyle: Record<IdeaStage, string> = {
  アイデア段階: "bg-sky-50 text-sky-700 border-sky-200",
  作っている: "bg-purple-100 text-purple-800 border-purple-300",
  "完成・使っている": "bg-emerald-100 text-emerald-800 border-emerald-300",
  終了: "bg-slate-200 text-slate-500 border-slate-300",
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

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="アイデア宣言ボード"
        subtitle="AIで自動化したい業務・作りたいエージェントのアイデアを宣言して、協力者を募る場所"
      />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        {/* 宣言の案内 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
            <h2 className="font-bold text-sm text-slate-900">「こんな作業をAIに任せたい」を宣言してください</h2>
            <p>
              構想段階でも歓迎です。宣言すると下の一覧に自動で載り、Google Chat の「AI勉強会」スペースに通知されます。
              進み具合が変わったら宣言した Issue を編集し、やめる・完成して報告も済んだら Close してください。
            </p>
            <p className="text-amber-800">
              ※ 宣言の内容は公開されます。顧客名・個人情報・社外秘の数値は書かないでください。
            </p>
          </div>
          <a
            href={buildNewIdeaUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs"
          >
            <Plus size={15} />
            アイデアを宣言する
          </a>
        </div>

        {/* フィルター・検索 & 同期状況 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setStageFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  stageFilter === f.key ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="キーワードで探す（例: 議事録、定例）"
              className="w-full sm:w-64 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CircleDot size={13} />
              {syncState === "loading" && <span>GitHub から読み込み中...</span>}
              {syncState === "ok" && <span>{ideas.length} 件</span>}
              {syncState === "error" && <span className="text-rose-600">GitHub の読み込みに失敗しました</span>}
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
        </div>

        {/* 一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shown.map((i) => (
            <article key={i.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{i.title}</h3>
                <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded border ${stageStyle[i.stage]}`}>{i.stage}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1"><Building2 size={12} />{i.dept}</span>
                {i.author && <span className="inline-flex items-center gap-1"><User size={12} />{i.author}</span>}
                {i.tools && <span className="inline-flex items-center gap-1"><Wrench size={12} />{i.tools}</span>}
                {i.wantsHelp && i.stage !== "終了" && (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-700"><HandHelping size={12} />協力者募集中</span>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">困っていること：</span>
                {i.problem}
              </p>
              <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
                <span className="font-bold text-slate-700">AIにさせたいこと：</span>
                {i.idea}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>
                  {i.id}・更新: {i.updated}
                </span>
                <a href={i.issueUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline">
                  コメント・協力する <ExternalLink size={11} />
                </a>
              </div>
            </article>
          ))}
          {syncState !== "loading" && shown.length === 0 && (
            <p className="text-xs text-slate-500 md:col-span-2 text-center py-10">
              {ideas.length === 0 ? "まだ宣言はありません。最初のアイデアを宣言してみませんか？" : "該当する宣言はありません。"}
            </p>
          )}
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          登録データ：
          <a href={`https://github.com/${GITHUB_REPO}/issues?q=label%3Aidea`} target="_blank" rel="noopener noreferrer" className="underline">
            GitHub Issue（idea ラベル）
          </a>
        </p>

        {/* ご意見TODO-06：AIビジネスモデル提案コンテスト（暫定版） */}
        <details className="bg-white border border-amber-300 rounded-2xl p-5 shadow-2xs group">
          <summary className="cursor-pointer list-none flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-bold text-sm text-slate-900">🏆 社内AIビジネスモデル提案コンテスト（応募期間：2026/11/2〜12/18）</span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 self-start sm:self-center">
              暫定版：詳細は社長・杉村さんと協議のうえ正式決定します（クリックで詳細）
            </span>
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
            <div className="space-y-2">
              <p><span className="font-bold text-slate-900">目的：</span>業務の効率化だけでなく、AIで新しい顧客価値や収益を生むビジネスモデルのアイデアを全社から集める</p>
              <p><span className="font-bold text-slate-900">対象：</span>全社員（個人・チームどちらでも可、1人何件でも応募可）</p>
              <p><span className="font-bold text-slate-900">応募期間：</span>2026年11月2日（月）〜12月18日（金）</p>
              <p><span className="font-bold text-slate-900">審査・表彰：</span>2027年1月中に審査し、全社の場で表彰</p>
              <p><span className="font-bold text-slate-900">審査員：</span>社長・杉村さん・AI推進担当</p>
              <p><span className="font-bold text-slate-900">審査の観点：</span>顧客にとっての価値／実現できるか／収益につながるか／AIならではの活かし方</p>
              <p><span className="font-bold text-slate-900">賞：</span>最優秀賞 1件・優秀賞 2件・アイデア賞（件数自由）。賞品の内容は協議のうえ決定</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
              <p className="font-bold text-amber-900">応募方法（社内のみで受付）</p>
              <p className="text-amber-900">
                アイデアには社外秘が含まれうるため、このサイトや GitHub では受け付けません。下の項目を記入し、
                Google Chat で AI推進担当 に DM で送ってください。
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-amber-900">
                <li>タイトル（ひとことで）</li>
                <li>誰のどんな困りごと・ニーズを解決するか</li>
                <li>AIをどう使うか</li>
                <li>どうやって収益・価値につながるか</li>
                <li>最初の一歩として試せること</li>
                <li>応募者（個人名またはチーム名・所属）</li>
              </ol>
              <p className="text-amber-800 pt-1">アイデアの種は、Google Chat の「AI勉強会」スペースで気軽に相談してからでもOKです。</p>
            </div>
          </div>
        </details>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-black text-slate-900">📖 宣言するときのルール</h3>
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900">1. アイデアの重複は恐れなくてOK</h4>
              <p className="text-slate-600 text-xs">
                「似たようなアイデアが既にあるかも」と遠慮する必要はありません。自部署ならではの使い方や、ほかの宣言を参考に自部署向けにアレンジした宣言も歓迎します。
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900">2. 機密情報・顧客個人情報の非記載ルール</h4>
              <p className="text-slate-600 text-xs">
                宣言文および背景課題には、具体的な顧客企業名、エンドユーザーの個人情報、未公開案件コードネームを直接記載せず、一般化した業務名で記載してください。
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900">3. 宣言したからといって「必ず作らなければならない」義務はありません</h4>
              <p className="text-slate-600 text-xs">
                「こんなのあったらいいな」という構想段階の宣言でも十分価値があります。他のエンジニアが「それ自分も欲しかったので作ります！」と手を挙げてくれることもあります。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
