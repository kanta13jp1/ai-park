"use client";

import { useState } from "react";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import {
  studySessions,
  toDocsPreviewUrl,
  toDrivePreviewUrl,
} from "@/data/study-archive";
import {
  Video,
  FileText,
  ListChecks,
  Lock,
  ExternalLink,
  CalendarDays,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Clock,
  Copy,
  Check,
} from "lucide-react";

type MediaTab = "video" | "minutes" | "tasks";

export default function StudyArchivePage() {
  const [selectedId, setSelectedId] = useState<string>(studySessions[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<MediaTab>("video");
  const [copiedTasks, setCopiedTasks] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const currentSession =
    studySessions.find((s) => s.id === selectedId) ?? studySessions[0];

  const videoPreviewUrl = toDrivePreviewUrl(currentSession?.videoDriveUrl ?? null);
  const minutesPreviewUrl = toDocsPreviewUrl(currentSession?.minutesDocUrl ?? null);

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="AI勉強会アーカイブ"
        subtitle="開催回ごとの録画動画・議事メモ・次回課題をまとめて確認できます（社内 Google Workspace 限定公開）"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 社内限定公開・公開ポリシーの案内カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.15)"
              className="bg-white border-slate-200/90 h-full rounded-2xl"
            >
              <div onMouseEnter={() => playCyberHover()} className="p-5 flex gap-3.5 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">
                    録画・議事メモは社内限定公開です
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-normal">
                    動画・ドキュメントは会社の Google Workspace アカウントでログインしている時だけ閲覧できます。埋め込み表示が出ない場合は「別タブで開く」をご利用ください。
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </TiltCard>

          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(245, 158, 11, 0.15)"
              className="bg-white border-slate-200/90 h-full rounded-2xl"
            >
              <div onMouseEnter={() => playCyberHover()} className="p-5 flex gap-3.5 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">
                    公開ポリシー（β版）
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-normal">
                    公開サイト上のため、議事メモの本文や個人情報・案件固有名詞はページ内に記載せず、Google Drive の共有権限（社内限定公開）で保護しています。
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </TiltCard>
        </div>

        {/* 開催回セレクタ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              <span>開催回を選択（全 {studySessions.length} 回）</span>
            </h2>
            <Link
              href="/calendar"
              onClick={() => playCyberClick()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              <span>開催スケジュールは AI Park カレンダーへ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {studySessions.map((session) => {
              const isSelected = session.id === currentSession?.id;
              return (
                <button
                  key={session.id}
                  onClick={() => {
                    playCyberClick();
                    setSelectedId(session.id);
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50/70 text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold mb-1">
                    <span className={isSelected ? "text-indigo-300" : "text-indigo-600"}>
                      {session.roundLabel}
                    </span>
                    <span className={isSelected ? "text-slate-300" : "text-slate-500"}>
                      {session.date}
                    </span>
                  </div>
                  <div className="font-extrabold text-sm leading-snug line-clamp-2">
                    {session.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 選択中の開催回詳細 */}
        {currentSession && (
          <div className="space-y-6">
            {/* 概要カード */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {currentSession.roundLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {currentSession.date} {currentSession.timeRange}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {currentSession.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentSession.summary}
                  </p>
                </div>

                {currentSession.nextSession && (
                  <div className="shrink-0 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs space-y-1">
                    <div className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">
                      次回予定
                    </div>
                    <div className="font-extrabold text-slate-900">
                      {currentSession.nextSession.date}
                    </div>
                    <div className="text-slate-600">
                      {currentSession.nextSession.timeRange}
                    </div>
                  </div>
                )}
              </div>

              {/* 扱ったトピック */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-extrabold text-slate-500 mb-2">
                  今回のトピック
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentSession.topics.map((topic) => (
                    <div
                      key={topic}
                      className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* コンテンツ切り替えタブ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => {
                    playCyberClick();
                    setActiveTab("video");
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "video"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>録画動画</span>
                </button>
                <button
                  onClick={() => {
                    playCyberClick();
                    setActiveTab("minutes");
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "minutes"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>議事メモ</span>
                </button>
                <button
                  onClick={() => {
                    playCyberClick();
                    setActiveTab("tasks");
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "tasks"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  <span>次回の課題・リンク ({currentSession.tasks.length})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {currentSession.videoDriveUrl && (
                  <a
                    href={currentSession.videoDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playCyberClick()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>録画を別タブで開く</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {currentSession.minutesDocUrl && (
                  <a
                    href={currentSession.minutesDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playCyberClick()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>議事メモを別タブで開く</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* タブ中身 */}
            {activeTab === "video" && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-indigo-600" />
                    <span>録画プレビュー（Google Drive）</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    社内アカウントでログイン時のみ再生可能
                  </span>
                </div>
                {videoPreviewUrl ? (
                  <>
                    <div className="aspect-video w-full bg-slate-950">
                      <iframe
                        src={videoPreviewUrl}
                        title={`${currentSession.title} 録画動画`}
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                      />
                    </div>
                    {currentSession.videoDriveUrl && (
                      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                        <span>
                          プレビューが表示されない場合は、会社の Google Workspace アカウントでログインした状態で別タブから開いてください。
                        </span>
                        <a
                          href={currentSession.videoDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                        >
                          <span>Google Drive で開く</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-10 text-center text-sm text-slate-500">
                    録画リンクはまだ登録されていません。
                  </div>
                )}
              </div>
            )}

            {activeTab === "minutes" && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>議事メモプレビュー（Google ドキュメント）</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    社内アカウントでログイン時のみ閲覧可能
                  </span>
                </div>
                {minutesPreviewUrl ? (
                  <>
                    <div className="w-full h-[680px] bg-white">
                      <iframe
                        src={minutesPreviewUrl}
                        title={`${currentSession.title} 議事メモ`}
                        className="w-full h-full border-0"
                      />
                    </div>
                    {currentSession.minutesDocUrl && (
                      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                        <span>
                          プレビューが表示されない場合は、会社の Google Workspace アカウントでログインした状態で別タブから開いてください。
                        </span>
                        <a
                          href={currentSession.minutesDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                        >
                          <span>Google ドキュメントで開く</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-10 text-center space-y-2">
                    <div className="text-sm font-bold text-slate-700">
                      議事メモの共有 URL はまだページに登録されていません（準備中）
                    </div>
                    <p className="text-xs text-slate-500">
                      Google ドキュメントの共有設定を「社内限定公開」で確認したうえで URL を登録すると、ここにプレビュー表示されます。
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-2xs">
                  <span className="text-xs font-bold text-slate-600">
                    {copyFailed
                      ? "クリップボードへのコピーに失敗しました。ブラウザの権限をご確認ください。"
                      : "勉強会後のフォローや共有にそのまま使えます"}
                  </span>
                  <button
                    onClick={async () => {
                      playCyberClick();
                      const text = [
                        `【${currentSession.roundLabel}（${currentSession.date}）課題一覧】`,
                        ...currentSession.tasks.map(
                          (t) => `■ ${t.step}: ${t.title}\n  ${t.description}`
                        ),
                      ].join("\n\n");
                      try {
                        await navigator.clipboard.writeText(text);
                        setCopyFailed(false);
                        setCopiedTasks(true);
                        setTimeout(() => setCopiedTasks(false), 2000);
                      } catch {
                        setCopyFailed(true);
                      }
                    }}
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copiedTasks ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>コピーしました</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Google Chat 用に課題をコピー</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSession.tasks.map((task) => (
                    <div
                      key={task.step}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2"
                    >
                      <div className="text-[11px] font-extrabold text-indigo-600">
                        {task.step}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {task.description}
                      </p>
                      {task.relatedHref && task.relatedLabel && (
                        <div className="pt-1">
                          <Link
                            href={task.relatedHref}
                            onClick={() => playCyberClick()}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                          >
                            <span>{task.relatedLabel}を見る</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
