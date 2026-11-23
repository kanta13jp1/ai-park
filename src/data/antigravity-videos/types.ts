// Google Antigravity 公式 YouTube 動画学習カタログ型定義
// 出どころ: YouTube 公式チャンネル (@googleantigravity / UC_eVxIPHFZm7oF_gET0x-8Q)
// 取得手段: yt-dlp 一次メタデータ・概要欄・字幕取得（取得日: 2026-11-23）

export type VideoFormat = "video" | "short" | "stream";

export type VideoTrackId =
  | "onboarding"
  | "core-liftoff"
  | "updates"
  | "remote-models"
  | "usecases"
  | "shorts"
  | "livestreams";

export interface VideoQuizQuestion {
  question: string;
  choices: [string, string, string];
  answerIndex: 0 | 1 | 2;
  explanation: string;
}

export interface AntigravityVideo {
  id: string;
  recommendedOrder: number;
  title: string;
  jaTitle: string;
  format: VideoFormat;
  track: VideoTrackId;
  playlist?: "Mission Report" | "The Liftoff Series";
  availability: "public" | "unlisted";
  uploadDate: string;
  durationSeconds: number;
  summary: string;
  takeaways: [string, string, string];
  quiz: VideoQuizQuestion;
  tags: string[];
  relatedAcademyHref?: string;
}

export interface VideoTrackMeta {
  id: VideoTrackId;
  stepLabel: string;
  title: string;
  description: string;
  badgeClass: string;
}
