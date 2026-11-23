// Google Antigravity 公式 YouTube チャンネルメタデータ・学習トラック定義
// 出どころ: YouTube 公式チャンネル (@googleantigravity / UC_eVxIPHFZm7oF_gET0x-8Q)
// 取得手段: yt-dlp 一次メタデータ・概要欄・字幕取得（取得日: 2026-11-23）

import type { VideoTrackMeta } from "./types";

export const ANTIGRAVITY_YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@googleantigravity";
export const ANTIGRAVITY_YOUTUBE_CHANNEL_ID = "UC_eVxIPHFZm7oF_gET0x-8Q";
export const ANTIGRAVITY_VIDEO_VERIFIED_DATE = "2026-11-23";

export const ANTIGRAVITY_VIDEO_COUNTS = {
  total: 91,
  video: 62,
  short: 22,
  stream: 7,
  unlistedInPlaylist: 2,
  totalDurationSeconds: 31971,
} as const;

export const VIDEO_TRACKS: VideoTrackMeta[] = [
  {
    id: "onboarding",
    stepLabel: "STEP 1",
    title: "全体像・入門・実行環境",
    description:
      "Google Antigravity の基本概念、2.0 / IDE / CLI（`agy`）/ SDK の使い分け、最新デザイン刷新まで最初に押さえる 8 本。",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: "core-liftoff",
    stepLabel: "STEP 2",
    title: "コア機能・The Liftoff Series",
    description:
      "Artifacts・Agent Manager・Knowledge Base・Skills・Subagents・検証と並列開発の実践作法を学ぶ 15 本。",
    badgeClass: "bg-cyan-50 text-cyan-800 border-cyan-200",
  },
  {
    id: "updates",
    stepLabel: "STEP 3",
    title: "アップデート追跡（Ep.1〜9）",
    description:
      "Mission Report Ep.01〜05 から New Updates Episode 6〜9 まで、進化の経緯を時系列で追う 9 本。",
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    id: "remote-models",
    stepLabel: "STEP 4",
    title: "リモート連携・Voice・最新モデル",
    description:
      "Remote Control・Remote Agents・Voice Mode および Gemini 3 Flash / 3.7 / 4（Hydrogen / Carbon / Argon）・Nano Banana Pro の 16 本。",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "usecases",
    stepLabel: "STEP 5",
    title: "実践ユースケース・研究・自動化",
    description:
      "Android・Blender・自動化ツール・物理制御（倒立振子/ピンボール）・ライフサイエンス研究まで幅広い応用 14 本。",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    id: "shorts",
    stepLabel: "STEP 6",
    title: "Shorts 1 分活用 Tips（全 22 本）",
    description:
      "`/btw`・コンテキスト最適化・Projects・Skills・Agent Plugin など、スキマ時間で学べる短尺 Tips 22 本。",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "livestreams",
    stepLabel: "STEP 7",
    title: "Livestream 深掘り解説（全 7 本）",
    description:
      "自動化・Planning & Artifacts・Remote Control & Custom Agents・開発チーム AMA など 38〜51 分のライブ配信アーカイブ 7 本。",
    badgeClass: "bg-slate-800 text-cyan-300 border-slate-700",
  },
];
