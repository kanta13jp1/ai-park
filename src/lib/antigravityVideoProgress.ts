// Google Antigravity 公式 YouTube 動画学習の進捗管理ライブラリ（ブラウザ内 localStorage 完結・サーバー送信なし）

import type {
  AntigravityVideo,
  VideoFormat,
  VideoTrackId,
} from "../data/antigravity-videos/types";

export const ANTIGRAVITY_VIDEO_PROGRESS_KEY = "ai_park_antigravity_videos_v1";

export type VideoWatchStatus = "unwatched" | "watching" | "completed";

export interface VideoEntryProgress {
  status: VideoWatchStatus;
  quizChoiceIndex?: 0 | 1 | 2;
  quizPassed?: boolean;
  note?: string;
  updatedAt: string;
}

export interface VideoProgressStore {
  version: 1;
  entries: Record<string, VideoEntryProgress>;
}

export interface StorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export interface TrackProgressSummary {
  total: number;
  completed: number;
  watching: number;
  percent: number;
}

export interface FormatProgressSummary {
  total: number;
  completed: number;
  watching: number;
}

export interface VideoProgressStats {
  totalVideos: number;
  completedVideos: number;
  watchingVideos: number;
  unwatchedVideos: number;
  quizPassedCount: number;
  notesCount: number;
  completionPercent: number;
  totalDurationSeconds: number;
  completedDurationSeconds: number;
  remainingDurationSeconds: number;
  byTrack: Record<VideoTrackId, TrackProgressSummary>;
  byFormat: Record<VideoFormat, FormatProgressSummary>;
  nextRecommendedVideo: AntigravityVideo | null;
}

const VALID_STATUSES = new Set<VideoWatchStatus>(["unwatched", "watching", "completed"]);

const TRACK_IDS: VideoTrackId[] = [
  "onboarding",
  "core-liftoff",
  "updates",
  "remote-models",
  "usecases",
  "shorts",
  "livestreams",
];

function getDefaultStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function createEmptyProgressStore(): VideoProgressStore {
  return {
    version: 1,
    entries: {},
  };
}

function sanitizeEntry(raw: unknown): VideoEntryProgress | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  const status = VALID_STATUSES.has(obj.status as VideoWatchStatus)
    ? (obj.status as VideoWatchStatus)
    : "unwatched";

  const entry: VideoEntryProgress = {
    status,
    updatedAt:
      typeof obj.updatedAt === "string" && obj.updatedAt.trim().length > 0
        ? obj.updatedAt
        : new Date().toISOString(),
  };

  if (obj.quizChoiceIndex === 0 || obj.quizChoiceIndex === 1 || obj.quizChoiceIndex === 2) {
    entry.quizChoiceIndex = obj.quizChoiceIndex;
  }
  if (typeof obj.quizPassed === "boolean") {
    entry.quizPassed = obj.quizPassed;
  }
  if (typeof obj.note === "string" && obj.note.length > 0) {
    entry.note = obj.note.slice(0, 4000);
  }

  return entry;
}

export function loadVideoProgress(storage: StorageLike | null = getDefaultStorage()): VideoProgressStore {
  if (!storage) return createEmptyProgressStore();
  try {
    const raw = storage.getItem(ANTIGRAVITY_VIDEO_PROGRESS_KEY);
    if (!raw) return createEmptyProgressStore();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return createEmptyProgressStore();
    }
    const obj = parsed as Record<string, unknown>;
    if (!obj.entries || typeof obj.entries !== "object" || Array.isArray(obj.entries)) {
      return createEmptyProgressStore();
    }
    const entries: Record<string, VideoEntryProgress> = {};
    for (const [videoId, entryRaw] of Object.entries(obj.entries as Record<string, unknown>)) {
      const sanitized = sanitizeEntry(entryRaw);
      if (sanitized) {
        entries[videoId] = sanitized;
      }
    }
    return { version: 1, entries };
  } catch {
    return createEmptyProgressStore();
  }
}

export function saveVideoProgress(
  store: VideoProgressStore,
  storage: StorageLike | null = getDefaultStorage()
): void {
  if (!storage) return;
  try {
    storage.setItem(ANTIGRAVITY_VIDEO_PROGRESS_KEY, JSON.stringify(store));
  } catch {
    // プライベートブラウジングや容量制限時は安全に無視
  }
}

export function getVideoEntry(
  store: VideoProgressStore,
  videoId: string
): VideoEntryProgress | undefined {
  return store.entries[videoId];
}

export function getVideoStatus(store: VideoProgressStore, videoId: string): VideoWatchStatus {
  return store.entries[videoId]?.status ?? "unwatched";
}

export function setVideoStatus(
  store: VideoProgressStore,
  videoId: string,
  status: VideoWatchStatus,
  nowIso: string = new Date().toISOString()
): VideoProgressStore {
  const prev = store.entries[videoId];
  const nextEntries = { ...store.entries };

  const hasExtraData =
    Boolean(prev?.quizPassed) ||
    prev?.quizChoiceIndex !== undefined ||
    Boolean(prev?.note && prev.note.trim().length > 0);

  if (status === "unwatched" && !hasExtraData) {
    delete nextEntries[videoId];
    return { version: 1, entries: nextEntries };
  }

  nextEntries[videoId] = {
    ...prev,
    status,
    updatedAt: nowIso,
  };
  return { version: 1, entries: nextEntries };
}

export function recordQuizAnswer(
  store: VideoProgressStore,
  videoId: string,
  choiceIndex: 0 | 1 | 2,
  isCorrect: boolean,
  nowIso: string = new Date().toISOString()
): VideoProgressStore {
  const prev = store.entries[videoId];
  const nextStatus: VideoWatchStatus = isCorrect
    ? "completed"
    : !prev || prev.status === "unwatched"
      ? "watching"
      : prev.status;

  return {
    version: 1,
    entries: {
      ...store.entries,
      [videoId]: {
        ...prev,
        status: nextStatus,
        quizChoiceIndex: choiceIndex,
        quizPassed: isCorrect ? true : Boolean(prev?.quizPassed),
        updatedAt: nowIso,
      },
    },
  };
}

export function setVideoNote(
  store: VideoProgressStore,
  videoId: string,
  note: string,
  nowIso: string = new Date().toISOString()
): VideoProgressStore {
  const prev = store.entries[videoId];
  const normalized = note.slice(0, 4000);
  const nextEntries = { ...store.entries };
  const isNoteEmpty = normalized.trim().length === 0;
  const hasWatchOrQuiz =
    (prev?.status && prev.status !== "unwatched") ||
    Boolean(prev?.quizPassed) ||
    prev?.quizChoiceIndex !== undefined;

  if (isNoteEmpty && !hasWatchOrQuiz) {
    delete nextEntries[videoId];
    return { version: 1, entries: nextEntries };
  }

  nextEntries[videoId] = {
    status: prev?.status ?? "unwatched",
    quizChoiceIndex: prev?.quizChoiceIndex,
    quizPassed: prev?.quizPassed,
    note: isNoteEmpty ? undefined : normalized,
    updatedAt: nowIso,
  };
  return { version: 1, entries: nextEntries };
}

export function computeProgressStats(
  videos: readonly AntigravityVideo[],
  store: VideoProgressStore
): VideoProgressStats {
  const byTrack = {} as Record<VideoTrackId, TrackProgressSummary>;
  for (const tid of TRACK_IDS) {
    byTrack[tid] = { total: 0, completed: 0, watching: 0, percent: 0 };
  }

  const byFormat: Record<VideoFormat, FormatProgressSummary> = {
    video: { total: 0, completed: 0, watching: 0 },
    short: { total: 0, completed: 0, watching: 0 },
    stream: { total: 0, completed: 0, watching: 0 },
  };

  let completedVideos = 0;
  let watchingVideos = 0;
  let quizPassedCount = 0;
  let notesCount = 0;
  let totalDurationSeconds = 0;
  let completedDurationSeconds = 0;

  for (const video of videos) {
    const entry = store.entries[video.id];
    const status = entry?.status ?? "unwatched";

    totalDurationSeconds += video.durationSeconds;
    byTrack[video.track].total += 1;
    byFormat[video.format].total += 1;

    if (status === "completed") {
      completedVideos += 1;
      completedDurationSeconds += video.durationSeconds;
      byTrack[video.track].completed += 1;
      byFormat[video.format].completed += 1;
    } else if (status === "watching") {
      watchingVideos += 1;
      byTrack[video.track].watching += 1;
      byFormat[video.format].watching += 1;
    }

    if (entry?.quizPassed) {
      quizPassedCount += 1;
    }
    if (entry?.note && entry.note.trim().length > 0) {
      notesCount += 1;
    }
  }

  for (const tid of TRACK_IDS) {
    const bucket = byTrack[tid];
    bucket.percent = bucket.total > 0 ? Math.round((bucket.completed / bucket.total) * 100) : 0;
  }

  const totalVideos = videos.length;
  const unwatchedVideos = Math.max(0, totalVideos - completedVideos - watchingVideos);
  const completionPercent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
  const remainingDurationSeconds = Math.max(0, totalDurationSeconds - completedDurationSeconds);

  const ordered = [...videos].sort((a, b) => a.recommendedOrder - b.recommendedOrder);
  const nextRecommendedVideo =
    ordered.find((v) => getVideoStatus(store, v.id) === "watching") ??
    ordered.find((v) => getVideoStatus(store, v.id) !== "completed") ??
    null;

  return {
    totalVideos,
    completedVideos,
    watchingVideos,
    unwatchedVideos,
    quizPassedCount,
    notesCount,
    completionPercent,
    totalDurationSeconds,
    completedDurationSeconds,
    remainingDurationSeconds,
    byTrack,
    byFormat,
    nextRecommendedVideo,
  };
}

export function exportVideoProgressJSON(
  store: VideoProgressStore,
  nowIso: string = new Date().toISOString()
): string {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: nowIso,
      source: "MightyLINK AI Park - Antigravity 公式YouTube動画学習",
      entries: store.entries,
    },
    null,
    2
  );
}

export type ImportVideoProgressResult =
  | { success: true; store: VideoProgressStore; importedCount: number }
  | { success: false; error: string };

export function importVideoProgressJSON(
  jsonText: string,
  validVideoIds?: ReadonlySet<string>
): ImportVideoProgressResult {
  try {
    const parsed: unknown = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { success: false, error: "JSON オブジェクト形式ではありません。" };
    }
    const obj = parsed as Record<string, unknown>;
    const rawEntries = obj.entries;
    if (!rawEntries || typeof rawEntries !== "object" || Array.isArray(rawEntries)) {
      return { success: false, error: "有効な entries オブジェクトが見つかりません。" };
    }

    const entries: Record<string, VideoEntryProgress> = {};
    let importedCount = 0;

    for (const [videoId, entryRaw] of Object.entries(rawEntries as Record<string, unknown>)) {
      if (validVideoIds && !validVideoIds.has(videoId)) continue;
      if (!entryRaw || typeof entryRaw !== "object" || Array.isArray(entryRaw)) {
        return { success: false, error: `動画ID "${videoId}" のデータ形式が不正です。` };
      }
      const rawStatus = (entryRaw as Record<string, unknown>).status;
      if (!VALID_STATUSES.has(rawStatus as VideoWatchStatus)) {
        return { success: false, error: `動画ID "${videoId}" のステータスが不正です。` };
      }
      const sanitized = sanitizeEntry(entryRaw);
      if (sanitized) {
        entries[videoId] = sanitized;
        importedCount += 1;
      }
    }

    return {
      success: true,
      store: { version: 1, entries },
      importedCount,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "JSON の解析に失敗しました。";
    return { success: false, error: msg };
  }
}

export function formatDurationJapanese(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;

  if (h > 0) {
    return m > 0 ? `${h}時間${m}分` : `${h}時間`;
  }
  if (m > 0) {
    return s > 0 ? `${m}分${s}秒` : `${m}分`;
  }
  return `${s}秒`;
}

export function formatDurationClock(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  const ss = String(s).padStart(2, "0");

  if (h > 0) {
    const mm = String(m).padStart(2, "0");
    return `${h}:${mm}:${ss}`;
  }
  return `${m}:${ss}`;
}

export function generateVideoChatReport(
  videos: readonly AntigravityVideo[],
  store: VideoProgressStore,
  nowDate: Date = new Date()
): string {
  const stats = computeProgressStats(videos, store);
  const dateStr = nowDate.toLocaleDateString("ja-JP");
  const lines = [
    `【Antigravity 公式YouTube動画学習 進捗報告】 (${dateStr})`,
    "━━━━━━━━━━━━━━━━━━━━━",
    `■ 完了状況: ${stats.completedVideos} / ${stats.totalVideos} 本（達成率 ${stats.completionPercent}%）`,
    `■ 視聴中: ${stats.watchingVideos} 本 / 未視聴: ${stats.unwatchedVideos} 本 / クイズ正解: ${stats.quizPassedCount} 本`,
    `■ 視聴済み再生時間: ${formatDurationJapanese(stats.completedDurationSeconds)} / 全体 ${formatDurationJapanese(stats.totalDurationSeconds)}（残り ${formatDurationJapanese(stats.remainingDurationSeconds)}）`,
    "",
    "■ 種別内訳:",
    `- 通常・シリーズ動画: ${stats.byFormat.video.completed} / ${stats.byFormat.video.total} 本`,
    `- Shorts 1分Tips: ${stats.byFormat.short.completed} / ${stats.byFormat.short.total} 本`,
    `- Livestream アーカイブ: ${stats.byFormat.stream.completed} / ${stats.byFormat.stream.total} 本`,
  ];

  if (stats.nextRecommendedVideo) {
    lines.push(
      "",
      `■ 次に見る予定: #${String(stats.nextRecommendedVideo.recommendedOrder).padStart(2, "0")} ${stats.nextRecommendedVideo.jaTitle}`
    );
  }

  lines.push(
    "",
    "■ 学習ページ: https://kanta13jp1.github.io/ai-park/antigravity-info/?tab=videos",
    "━━━━━━━━━━━━━━━━━━━━━"
  );

  return lines.join("\n");
}
