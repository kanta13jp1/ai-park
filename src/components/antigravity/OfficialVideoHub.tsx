"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileJson,
  Filter,
  HelpCircle,
  ListChecks,
  Loader2,
  MessageSquare,
  PlayCircle,
  Radio,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Upload,
  Video,
  Zap,
} from "lucide-react";
import type {
  AntigravityVideo,
  VideoFormat,
  VideoTrackId,
} from "@/data/antigravity-videos/types";
import {
  ANTIGRAVITY_VIDEO_COUNTS,
  ANTIGRAVITY_VIDEO_VERIFIED_DATE,
  ANTIGRAVITY_YOUTUBE_CHANNEL_URL,
  VIDEO_TRACKS,
} from "@/data/antigravity-videos/meta";
import {
  computeProgressStats,
  createEmptyProgressStore,
  exportVideoProgressJSON,
  formatDurationClock,
  formatDurationJapanese,
  generateVideoChatReport,
  getVideoStatus,
  importVideoProgressJSON,
  loadVideoProgress,
  recordQuizAnswer,
  saveVideoProgress,
  setVideoNote,
  setVideoStatus,
  type VideoProgressStore,
  type VideoWatchStatus,
} from "@/lib/antigravityVideoProgress";
import InlineCodeText from "@/components/antigravity/InlineCodeText";
import YouTubeFacadePlayer from "@/components/antigravity/YouTubeFacadePlayer";
import { playCyberClick, playCyberHover, playCyberOpen, playCyberSuccess } from "@/lib/sound";

let cachedCatalog: AntigravityVideo[] | null = null;
let inflightCatalogPromise: Promise<AntigravityVideo[]> | null = null;

/**
 * 全 91 本の公式動画カタログを動的 import で遅延ロード・キャッシュする。
 * タブホバー時などの先読みにも安全に利用できる。
 */
export async function preloadAntigravityVideos(): Promise<AntigravityVideo[]> {
  if (cachedCatalog) return cachedCatalog;
  if (inflightCatalogPromise) return inflightCatalogPromise;

  inflightCatalogPromise = import("@/data/antigravity-videos")
    .then((mod) => {
      cachedCatalog = mod.antigravityVideos;
      inflightCatalogPromise = null;
      return cachedCatalog;
    })
    .catch((err) => {
      inflightCatalogPromise = null;
      throw err;
    });

  return inflightCatalogPromise;
}

export interface OfficialVideoHubProps {
  searchQuery: string;
  initialVideoId?: string | null;
  onSelectVideoId?: (videoId: string) => void;
  onResetSearch?: () => void;
}

type FormatFilter = "all" | VideoFormat;
type StatusFilter = "all" | VideoWatchStatus | "with-note";
type SortMode = "recommended" | "newest" | "shortest";

const FORMAT_LABELS: Record<VideoFormat, string> = {
  video: "通常動画",
  short: "Shorts",
  stream: "ライブ配信",
};

const FORMAT_BADGE_CLASS: Record<VideoFormat, string> = {
  video: "bg-indigo-50 text-indigo-700 border-indigo-200",
  short: "bg-rose-50 text-rose-700 border-rose-200",
  stream: "bg-slate-900 text-cyan-300 border-slate-700",
};

const STATUS_META: Record<
  VideoWatchStatus,
  { label: string; badgeClass: string; buttonActiveClass: string }
> = {
  unwatched: {
    label: "未視聴",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
    buttonActiveClass: "bg-slate-900 text-white border-slate-900",
  },
  watching: {
    label: "視聴中",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
    buttonActiveClass: "bg-amber-500 text-white border-amber-600",
  },
  completed: {
    label: "理解完了",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-300",
    buttonActiveClass: "bg-emerald-600 text-white border-emerald-700",
  },
};

function getTrackMeta(trackId: VideoTrackId) {
  return VIDEO_TRACKS.find((t) => t.id === trackId) ?? VIDEO_TRACKS[0];
}

export function OfficialVideoHub({
  searchQuery,
  initialVideoId,
  onSelectVideoId,
  onResetSearch,
}: OfficialVideoHubProps) {
  const [videos, setVideos] = useState<AntigravityVideo[] | null>(() => cachedCatalog);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedCatalog);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadGenRef = useRef(0);

  const [progressStore, setProgressStore] = useState<VideoProgressStore>(() =>
    createEmptyProgressStore()
  );
  const [selectedVideoId, setSelectedVideoId] = useState<string>(
    initialVideoId ?? cachedCatalog?.[0]?.id ?? "SVCBA-pBgt0"
  );
  const [quizFeedbackChoice, setQuizFeedbackChoice] = useState<0 | 1 | 2 | null>(null);

  const [trackFilter, setTrackFilter] = useState<"all" | VideoTrackId>("all");
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [visibleLimit, setVisibleLimit] = useState<number>(24);

  const [expandedTracks, setExpandedTracks] = useState<Record<VideoTrackId, boolean>>({
    onboarding: true,
    "core-liftoff": false,
    updates: false,
    "remote-models": false,
    usecases: false,
    shorts: false,
    livestreams: false,
  });

  const [showBackupPanel, setShowBackupPanel] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>("");
  const [showImportBox, setShowImportBox] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [backupBanner, setBackupBanner] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>("");

  const appliedInitialIdRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // localStorage からの進捗読み込み（SSR 後）
  useEffect(() => {
    queueMicrotask(() => {
      setProgressStore(loadVideoProgress());
    });
  }, []);

  // カタログの動的ロード
  const triggerLoad = (force = false) => {
    if (!force && cachedCatalog) {
      setVideos(cachedCatalog);
      setIsLoading(false);
      setLoadError(null);
      return;
    }
    const gen = ++loadGenRef.current;
    setIsLoading(true);
    setLoadError(null);
    preloadAntigravityVideos()
      .then((list) => {
        if (loadGenRef.current !== gen) return;
        setVideos(list);
        setIsLoading(false);
      })
      .catch(() => {
        if (loadGenRef.current !== gen) return;
        setIsLoading(false);
        setLoadError("公式動画カタログの読み込みに失敗しました。再試行してください。");
      });
  };

  useEffect(() => {
    if (cachedCatalog) return;
    const gen = ++loadGenRef.current;
    preloadAntigravityVideos()
      .then((list) => {
        if (loadGenRef.current !== gen) return;
        setVideos(list);
        setIsLoading(false);
      })
      .catch(() => {
        if (loadGenRef.current !== gen) return;
        setIsLoading(false);
        setLoadError("公式動画カタログの読み込みに失敗しました。再試行してください。");
      });
  }, []);

  // URL クエリ (?v=...) 指定時の初期選択同期
  useEffect(() => {
    if (!videos || !initialVideoId) return;
    if (appliedInitialIdRef.current === initialVideoId) return;
    const matched = videos.find((v) => v.id === initialVideoId);
    if (!matched) return;
    appliedInitialIdRef.current = initialVideoId;
    queueMicrotask(() => {
      setSelectedVideoId(matched.id);
      setQuizFeedbackChoice(null);
      setExpandedTracks((prev) => ({ ...prev, [matched.track]: true }));
    });
  }, [videos, initialVideoId]);

  const announce = (msg: string) => {
    setLiveAnnouncement(msg);
  };

  const persistStore = (next: VideoProgressStore) => {
    setProgressStore(next);
    saveVideoProgress(next);
  };

  const activeVideo = useMemo(() => {
    if (!videos || videos.length === 0) return null;
    return videos.find((v) => v.id === selectedVideoId) ?? videos[0];
  }, [videos, selectedVideoId]);

  const stats = useMemo(() => {
    return computeProgressStats(videos ?? [], progressStore);
  }, [videos, progressStore]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredVideos = useMemo(() => {
    if (!videos) return [];
    const list = videos.filter((v) => {
      if (trackFilter !== "all" && v.track !== trackFilter) return false;
      if (formatFilter !== "all" && v.format !== formatFilter) return false;

      const entry = progressStore.entries[v.id];
      const status = entry?.status ?? "unwatched";
      if (statusFilter === "with-note") {
        if (!entry?.note || entry.note.trim().length === 0) return false;
      } else if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) return true;
      const haystack = [
        v.id,
        v.title,
        v.jaTitle,
        v.summary,
        v.playlist ?? "",
        ...v.takeaways,
        ...v.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });

    if (sortMode === "newest") {
      return [...list].sort(
        (a, b) => b.uploadDate.localeCompare(a.uploadDate) || a.recommendedOrder - b.recommendedOrder
      );
    }
    if (sortMode === "shortest") {
      return [...list].sort(
        (a, b) => a.durationSeconds - b.durationSeconds || a.recommendedOrder - b.recommendedOrder
      );
    }
    return [...list].sort((a, b) => a.recommendedOrder - b.recommendedOrder);
  }, [videos, trackFilter, formatFilter, statusFilter, sortMode, normalizedQuery, progressStore]);

  const useAccordionLayout =
    sortMode === "recommended" &&
    !normalizedQuery &&
    trackFilter === "all" &&
    formatFilter === "all" &&
    statusFilter === "all";

  const scrollToStage = () => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("ag-video-stage")?.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });
  };

  const selectVideo = (video: AntigravityVideo, shouldScroll = false) => {
    playCyberClick();
    setSelectedVideoId(video.id);
    setQuizFeedbackChoice(null);
    setExpandedTracks((prev) => ({ ...prev, [video.track]: true }));
    onSelectVideoId?.(video.id);
    if (shouldScroll) {
      scrollToStage();
    }
  };

  const handlePlayStart = (videoId: string) => {
    const currentStatus = getVideoStatus(progressStore, videoId);
    if (currentStatus === "unwatched") {
      const next = setVideoStatus(progressStore, videoId, "watching");
      persistStore(next);
      announce("再生を開始したため、ステータスを「視聴中」に記録しました。");
    }
  };

  const handleSetStatus = (videoId: string, status: VideoWatchStatus) => {
    playCyberClick();
    const next = setVideoStatus(progressStore, videoId, status);
    persistStore(next);
    if (status === "completed") {
      playCyberSuccess();
    }
    announce(`視聴ステータスを「${STATUS_META[status].label}」に更新しました。`);
  };

  const handleQuizChoice = (video: AntigravityVideo, choiceIndex: 0 | 1 | 2) => {
    playCyberClick();
    setQuizFeedbackChoice(choiceIndex);
    const isCorrect = choiceIndex === video.quiz.answerIndex;
    const next = recordQuizAnswer(progressStore, video.id, choiceIndex, isCorrect);
    persistStore(next);
    if (isCorrect) {
      playCyberSuccess();
      announce("理解確認クイズに正解しました。この動画を「理解完了」に記録しました。");
    } else {
      announce("不正解です。解説を確認して、別の選択肢で再挑戦できます。");
    }
  };

  const handleCopyWithFeedback = async (key: string, text: string, announcement: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        playCyberSuccess();
        setCopiedKey(key);
        announce(announcement);
        if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = setTimeout(() => {
          setCopiedKey((prev) => (prev === key ? null : prev));
        }, 2200);
        return true;
      }
    } catch {
      // ignore clipboard errors in restricted browsers
    }
    return false;
  };

  const handleShareVideoLink = (videoId: string) => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}?tab=videos&v=${encodeURIComponent(videoId)}`
        : `https://kanta13jp1.github.io/ai-park/antigravity-info/?tab=videos&v=${encodeURIComponent(videoId)}`;
    void handleCopyWithFeedback(`link-${videoId}`, url, "動画の直接リンクをコピーしました。");
  };

  const handleDownloadBackup = () => {
    playCyberClick();
    const json = exportVideoProgressJSON(progressStore);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-park-antigravity-videos-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playCyberSuccess();
    setBackupBanner({
      type: "success",
      text: "学習進捗バックアップ JSON をダウンロードしました。",
    });
    announce("学習進捗バックアップファイルを保存しました。");
  };

  const applyImportedJson = (rawText: string) => {
    const validIds = videos ? new Set(videos.map((v) => v.id)) : undefined;
    const result = importVideoProgressJSON(rawText, validIds);
    if (result.success) {
      playCyberSuccess();
      persistStore(result.store);
      setBackupBanner({
        type: "success",
        text: `${result.importedCount} 本分の視聴進捗・メモを復元しました。`,
      });
      setImportText("");
      setShowImportBox(false);
      announce(`${result.importedCount} 本分の進捗データを復元しました。`);
    } else {
      setBackupBanner({
        type: "error",
        text: `復元に失敗しました: ${result.error}`,
      });
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = typeof ev.target?.result === "string" ? ev.target.result : "";
      applyImportedJson(content);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleResetProgress = () => {
    if (!confirmReset) {
      playCyberClick();
      setConfirmReset(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setConfirmReset(false);
      }, 6000);
      return;
    }
    playCyberClick();
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    const empty = createEmptyProgressStore();
    persistStore(empty);
    setConfirmReset(false);
    setQuizFeedbackChoice(null);
    setBackupBanner({
      type: "success",
      text: "すべての動画視聴進捗・クイズ結果・メモを初期化しました。",
    });
    announce("動画の学習進捗を初期化しました。");
  };

  if (loadError) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center space-y-4 shadow-xs">
        <AlertCircle size={32} className="text-rose-500 mx-auto" aria-hidden="true" />
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-900">動画カタログの読み込みエラー</h3>
          <p className="text-xs sm:text-sm text-slate-600">{loadError}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            playCyberClick();
            triggerLoad(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>再試行する</span>
        </button>
      </div>
    );
  }

  if (isLoading || !videos || !activeVideo) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-xs">
        <Loader2 size={28} className="text-indigo-600 animate-spin mx-auto" aria-hidden="true" />
        <p className="text-sm font-bold text-slate-800">
          公式 YouTube カタログ（全 {ANTIGRAVITY_VIDEO_COUNTS.total} 本）を読み込み中...
        </p>
        <p className="text-xs text-slate-500">
          通常動画 {ANTIGRAVITY_VIDEO_COUNTS.video} 本・Shorts {ANTIGRAVITY_VIDEO_COUNTS.short} 本・ライブ配信{" "}
          {ANTIGRAVITY_VIDEO_COUNTS.stream} 本の要点と確認クイズを準備しています。
        </p>
      </div>
    );
  }

  const activeEntry = progressStore.entries[activeVideo.id];
  const activeStatus = activeEntry?.status ?? "unwatched";
  const activeTrackMeta = getTrackMeta(activeVideo.track);
  const currentListForNav = filteredVideos.some((v) => v.id === activeVideo.id) ? filteredVideos : videos;
  const activeNavIndex = currentListForNav.findIndex((v) => v.id === activeVideo.id);
  const prevVideo = activeNavIndex > 0 ? currentListForNav[activeNavIndex - 1] : null;
  const nextVideo =
    activeNavIndex >= 0 && activeNavIndex < currentListForNav.length - 1
      ? currentListForNav[activeNavIndex + 1]
      : null;

  const shownChoiceIndex = quizFeedbackChoice ?? activeEntry?.quizChoiceIndex ?? null;
  const isShownCorrect =
    shownChoiceIndex !== null && shownChoiceIndex === activeVideo.quiz.answerIndex;

  return (
    <div className="space-y-6">
      <p className="sr-only" role="status" aria-live="polite">
        {liveAnnouncement}
      </p>

      {/* 1. 進捗ダッシュボード HUD */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-700/40 p-5 sm:p-6 text-white shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                OFFICIAL YOUTUBE CURRICULUM
              </span>
              <span className="text-[11px] text-slate-300">
                {ANTIGRAVITY_VIDEO_VERIFIED_DATE} 確認・全 {stats.totalVideos} 本（プレイリスト限定公開{" "}
                {ANTIGRAVITY_VIDEO_COUNTS.unlistedInPlaylist} 本含む）
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              公式 YouTube 全 {stats.totalVideos} 本 学習・進捗トラッカー
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              全動画を 7 つの学習ステップに体系化。日本語要約・要点 3 点・1 問確認クイズ・メモを組み合わせて、どこまで理解したかをブラウザに保存します。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {stats.nextRecommendedVideo ? (
              <button
                type="button"
                onClick={() => selectVideo(stats.nextRecommendedVideo!, true)}
                onMouseEnter={() => playCyberHover()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer"
              >
                <PlayCircle size={16} aria-hidden="true" />
                <span>
                  {getVideoStatus(progressStore, stats.nextRecommendedVideo.id) === "watching"
                    ? `視聴中を再開 (#${String(stats.nextRecommendedVideo.recommendedOrder).padStart(2, "0")})`
                    : `次の未視聴を見る (#${String(stats.nextRecommendedVideo.recommendedOrder).padStart(2, "0")})`}
                </span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
                <CheckCircle2 size={15} aria-hidden="true" />
                <span>全 {stats.totalVideos} 本 コンプリート達成</span>
              </span>
            )}

            <a
              href={ANTIGRAVITY_YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all"
            >
              <span>@googleantigravity</span>
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* 進捗プログレスバー & サマリー数値 */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-black text-base sm:text-lg text-white font-mono">
                {stats.completedVideos}{" "}
                <span className="text-xs font-normal text-slate-400">/ {stats.totalVideos} 本 完了</span>
              </span>
              <span className="font-mono font-bold text-cyan-300">{stats.completionPercent}%</span>
              <span className="text-slate-300">視聴中 {stats.watchingVideos} 本</span>
              <span className="text-emerald-300">クイズ正解 {stats.quizPassedCount} 本</span>
              <span className="text-amber-300">メモ {stats.notesCount} 件</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono">
              視聴済み {formatDurationJapanese(stats.completedDurationSeconds)} / 全体{" "}
              {formatDurationJapanese(stats.totalDurationSeconds)}（残り{" "}
              {formatDurationJapanese(stats.remainingDurationSeconds)}）
            </div>
          </div>

          <div
            role="progressbar"
            aria-label="公式YouTube動画の学習進捗"
            aria-valuenow={stats.completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${stats.completedVideos}本完了（全${stats.totalVideos}本中 ${stats.completionPercent}%）`}
            className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-white/10"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${stats.completionPercent}%` }}
            />
          </div>
        </div>

        {/* 7 トラック別進捗チップ */}
        <div role="group" aria-label="学習トラックで絞り込み" className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            aria-pressed={trackFilter === "all"}
            onClick={() => {
              playCyberClick();
              setTrackFilter("all");
              setVisibleLimit(24);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
              trackFilter === "all"
                ? "bg-white text-slate-950 border-white"
                : "bg-white/5 text-slate-200 border-white/15 hover:bg-white/15"
            }`}
          >
            <span>全トラック</span>
            <span className="font-mono opacity-80">
              {stats.completedVideos}/{stats.totalVideos}
            </span>
          </button>

          {VIDEO_TRACKS.map((track) => {
            const bucket = stats.byTrack[track.id];
            const isSelected = trackFilter === track.id;
            return (
              <button
                key={track.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  playCyberClick();
                  setTrackFilter(isSelected ? "all" : track.id);
                  setExpandedTracks((prev) => ({ ...prev, [track.id]: true }));
                  setVisibleLimit(24);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-400 text-slate-950 border-cyan-300"
                    : "bg-white/5 text-slate-200 border-white/15 hover:bg-white/15"
                }`}
              >
                <span className="font-mono text-[10px] opacity-80">{track.stepLabel}</span>
                <span>{track.title}</span>
                <span className="font-mono opacity-85">
                  {bucket.completed}/{bucket.total}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. アクティブ動画 視聴・理解ステージ */}
      <section
        id="ag-video-stage"
        className="scroll-mt-6 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5"
      >
        {/* ステージ上部バー（位置・種別・前後移動・共有コピー） */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-slate-900 text-cyan-300">
              #{String(activeVideo.recommendedOrder).padStart(2, "0")}
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${activeTrackMeta.badgeClass}`}
            >
              {activeTrackMeta.stepLabel} {activeTrackMeta.title}
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${FORMAT_BADGE_CLASS[activeVideo.format]}`}
            >
              {FORMAT_LABELS[activeVideo.format]}
            </span>
            {activeVideo.playlist && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {activeVideo.playlist}
              </span>
            )}
            {activeVideo.availability === "unlisted" && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                公式プレイリスト限定公開
              </span>
            )}
            <span className="text-xs text-slate-500 font-mono">
              {activeVideo.uploadDate} ・ {formatDurationJapanese(activeVideo.durationSeconds)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleShareVideoLink(activeVideo.id)}
              onMouseEnter={() => playCyberHover()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              {copiedKey === `link-${activeVideo.id}` ? (
                <>
                  <Check size={13} className="text-emerald-600" aria-hidden="true" />
                  <span className="text-emerald-700">リンクコピー済み</span>
                </>
              ) : (
                <>
                  <Copy size={13} aria-hidden="true" />
                  <span>リンクをコピー</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={!prevVideo}
              onClick={() => prevVideo && selectVideo(prevVideo)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs font-bold border border-slate-200 cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowLeft size={13} aria-hidden="true" />
              <span>前へ</span>
            </button>
            <button
              type="button"
              disabled={!nextVideo}
              onClick={() => nextVideo && selectVideo(nextVideo)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold cursor-pointer disabled:cursor-not-allowed"
            >
              <span>次へ</span>
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* プレイヤー + 内容理解の 2 ペイン（xl以上で並列、768px/1024pxでは1カラム安全配置） */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* 左: プレイヤー & 視聴ステータス & 個人メモ */}
          <div className="xl:col-span-7 space-y-4 min-w-0">
            <YouTubeFacadePlayer
              key={activeVideo.id}
              videoId={activeVideo.id}
              title={activeVideo.title}
              format={activeVideo.format}
              durationSeconds={activeVideo.durationSeconds}
              onPlayStart={() => handlePlayStart(activeVideo.id)}
            />

            {/* 視聴ステータス 3 段階トグル */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-900">この動画の進捗ステータス</p>
                <p className="text-[11px] text-slate-500">
                  動画再生で「視聴中」、下のクイズ正解で「理解完了」に自動更新されます。
                </p>
              </div>
              <div role="group" aria-label="動画の視聴ステータス" className="flex flex-wrap gap-1.5">
                {(["unwatched", "watching", "completed"] as const).map((status) => {
                  const isPressed = activeStatus === status;
                  const meta = STATUS_META[status];
                  return (
                    <button
                      key={status}
                      type="button"
                      aria-pressed={isPressed}
                      onClick={() => handleSetStatus(activeVideo.id, status)}
                      onMouseEnter={() => playCyberHover()}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isPressed
                          ? meta.buttonActiveClass
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle2 size={13} aria-hidden="true" />
                      ) : status === "watching" ? (
                        <Clock size={13} aria-hidden="true" />
                      ) : (
                        <Circle size={13} aria-hidden="true" />
                      )}
                      <span>{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 自分用学習メモ */}
            <div className="rounded-2xl bg-amber-50/40 border border-amber-200/80 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={`ag-video-note-${activeVideo.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-slate-900"
                >
                  <StickyNote size={14} className="text-amber-600" aria-hidden="true" />
                  <span>自分用学習メモ（このブラウザ内に自動保存）</span>
                </label>
                {activeEntry?.note && activeEntry.note.trim().length > 0 && (
                  <span className="text-[11px] font-bold text-amber-800">メモ保存中</span>
                )}
              </div>
              <textarea
                id={`ag-video-note-${activeVideo.id}`}
                rows={3}
                value={activeEntry?.note ?? ""}
                onChange={(e) => {
                  const next = setVideoNote(progressStore, activeVideo.id, e.target.value);
                  persistStore(next);
                }}
                placeholder="業務で使えそうな設定、コマンド、気になったタイムスタンプなどをメモできます..."
                className="w-full rounded-xl bg-white border border-amber-200 px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              />
            </div>
          </div>

          {/* 右: 日本語要約・要点3点・理解確認クイズ */}
          <div className="xl:col-span-5 space-y-4 min-w-0">
            <div className="space-y-2">
              <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {activeVideo.jaTitle}
              </h4>
              <p className="text-xs font-mono text-slate-500 break-words">
                原題: {activeVideo.title}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {activeVideo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 space-y-2">
              <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" aria-hidden="true" />
                <span>動画内容の要約（一次情報ベース）</span>
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <InlineCodeText text={activeVideo.summary} />
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50/50 border border-indigo-200/70 p-4 space-y-2.5">
              <h5 className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                <ListChecks size={14} className="text-indigo-600" aria-hidden="true" />
                <span>押さえるべき要点 3 点</span>
              </h5>
              <ul className="space-y-2 text-xs text-slate-800">
                {activeVideo.takeaways.map((point) => (
                  <li key={point} className="flex items-start gap-2 leading-relaxed">
                    <CheckCircle2
                      size={14}
                      className="text-indigo-600 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      <InlineCodeText text={point} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {activeVideo.relatedAcademyHref && (
              <Link
                href={activeVideo.relatedAcademyHref}
                onClick={() => playCyberClick()}
                className="flex items-center justify-between gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-bold transition-colors"
              >
                <span>関連コース：Antigravity Academy の日本語レッスンを見る</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}

            {/* 1問理解確認クイズ */}
            <div className="rounded-2xl bg-white border-2 border-slate-200 p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-emerald-600" aria-hidden="true" />
                  <span>理解確認クイズ（正解で自動完了）</span>
                </h5>
                {activeEntry?.quizPassed && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    正解済み
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                Q. <InlineCodeText text={activeVideo.quiz.question} />
              </p>

              <div role="group" aria-label="理解確認クイズの選択肢" className="space-y-2">
                {activeVideo.quiz.choices.map((choice, idx) => {
                  const choiceIdx = idx as 0 | 1 | 2;
                  const isSelected = shownChoiceIndex === choiceIdx;
                  const isAnswer = choiceIdx === activeVideo.quiz.answerIndex;
                  const labelPrefix = ["A", "B", "C"][choiceIdx];

                  let buttonClass =
                    "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-indigo-300";
                  if (isSelected && isAnswer) {
                    buttonClass = "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/30";
                  } else if (isSelected && !isAnswer) {
                    buttonClass = "bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400/30";
                  }

                  return (
                    <button
                      key={`${activeVideo.id}-q-${choiceIdx}`}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleQuizChoice(activeVideo, choiceIdx)}
                      onMouseEnter={() => playCyberHover()}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 transition-all cursor-pointer ${buttonClass}`}
                    >
                      <span className="font-mono font-black px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[11px] shrink-0">
                        {labelPrefix}
                      </span>
                      <span className="min-w-0 break-words">
                        <InlineCodeText text={choice} />
                      </span>
                    </button>
                  );
                })}
              </div>

              {shownChoiceIndex !== null && (
                <div
                  className={`rounded-xl border p-3 text-xs leading-relaxed space-y-1 ${
                    isShownCorrect
                      ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                      : "bg-rose-50 border-rose-200 text-rose-950"
                  }`}
                >
                  <p className="font-black">
                    {isShownCorrect
                      ? "✓ 正解です！「理解完了」として記録しました。"
                      : "✗ もう一度考えてみましょう（動画や要約を確認して別の選択肢を選べます）。"}
                  </p>
                  <p>
                    <InlineCodeText text={activeVideo.quiz.explanation} />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 絞り込みバー（種別・視聴ステータス・並び順・検索結果件数） */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* 種別フィルタ */}
          <div role="group" aria-label="動画種別で絞り込み" className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 mr-1">
              <Filter size={13} aria-hidden="true" />
              <span>種別:</span>
            </span>
            {(
              [
                { id: "all", label: `すべて (${stats.totalVideos})`, icon: Video },
                { id: "video", label: `通常動画 (${stats.byFormat.video.total})`, icon: PlayCircle },
                { id: "short", label: `Shorts (${stats.byFormat.short.total})`, icon: Zap },
                { id: "stream", label: `ライブ配信 (${stats.byFormat.stream.total})`, icon: Radio },
              ] as const
            ).map((opt) => {
              const Icon = opt.icon;
              const pressed = formatFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => {
                    playCyberClick();
                    setFormatFilter(opt.id);
                    setVisibleLimit(24);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    pressed
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={13} aria-hidden="true" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* 並び順 */}
          <div role="group" aria-label="動画の並び順" className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600 mr-1">並び順:</span>
            {(
              [
                { id: "recommended", label: "推奨学習順" },
                { id: "newest", label: "新しい順" },
                { id: "shortest", label: "短い順" },
              ] as const
            ).map((s) => {
              const pressed = sortMode === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => {
                    playCyberClick();
                    setSortMode(s.id);
                    setVisibleLimit(24);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    pressed
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 視聴状態フィルタ + 件数表示 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div role="group" aria-label="視聴進捗ステータスで絞り込み" className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600 mr-1">進捗:</span>
            {(
              [
                { id: "all", label: "すべて" },
                { id: "unwatched", label: `未視聴 (${stats.unwatchedVideos})` },
                { id: "watching", label: `視聴中 (${stats.watchingVideos})` },
                { id: "completed", label: `理解完了 (${stats.completedVideos})` },
                { id: "with-note", label: `メモあり (${stats.notesCount})` },
              ] as const
            ).map((st) => {
              const pressed = statusFilter === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => {
                    playCyberClick();
                    setStatusFilter(st.id);
                    setVisibleLimit(24);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    pressed
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>
              表示対象: <strong className="text-slate-900 font-mono">{filteredVideos.length}</strong> /{" "}
              {stats.totalVideos} 本
            </span>
            {useAccordionLayout && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    playCyberClick();
                    setExpandedTracks({
                      onboarding: true,
                      "core-liftoff": true,
                      updates: true,
                      "remote-models": true,
                      usecases: true,
                      shorts: true,
                      livestreams: true,
                    });
                  }}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                >
                  すべて開く
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playCyberClick();
                    setExpandedTracks({
                      onboarding: false,
                      "core-liftoff": false,
                      updates: false,
                      "remote-models": false,
                      usecases: false,
                      shorts: false,
                      livestreams: false,
                    });
                  }}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                >
                  すべて閉じる
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. 動画一覧（7トラックアコーディオン または 絞り込みフラット一覧） */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-slate-600">
            条件に一致する動画が見つかりませんでした。フィルタをリセットしてお試しください。
          </p>
          <button
            type="button"
            onClick={() => {
              playCyberClick();
              setTrackFilter("all");
              setFormatFilter("all");
              setStatusFilter("all");
              setSortMode("recommended");
              setVisibleLimit(24);
              onResetSearch?.();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
          >
            フィルタ・検索をリセット
          </button>
        </div>
      ) : useAccordionLayout ? (
        <div className="space-y-4">
          {VIDEO_TRACKS.map((track) => {
            const trackVideos = filteredVideos.filter((v) => v.track === track.id);
            const bucket = stats.byTrack[track.id];
            const isOpen = expandedTracks[track.id];
            return (
              <div
                key={track.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`ag-track-panel-${track.id}`}
                  onClick={() => {
                    playCyberClick();
                    setExpandedTracks((prev) => ({ ...prev, [track.id]: !isOpen }));
                  }}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <span className="block space-y-1 min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${track.badgeClass}`}
                      >
                        {track.stepLabel}
                      </span>
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        {track.title}
                      </span>
                      <span className="font-mono text-xs font-bold text-indigo-700">
                        {bucket.completed} / {bucket.total} 完了 ({bucket.percent}%)
                      </span>
                    </span>
                    <span className="block text-xs text-slate-600 leading-relaxed">
                      <InlineCodeText text={track.description} />
                    </span>
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-slate-400 shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400 shrink-0" aria-hidden="true" />
                  )}
                </button>

                {isOpen && (
                  <div
                    id={`ag-track-panel-${track.id}`}
                    className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/40"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {trackVideos.map((v) => (
                        <VideoCatalogCard
                          key={v.id}
                          video={v}
                          isSelected={v.id === activeVideo.id}
                          status={getVideoStatus(progressStore, v.id)}
                          quizPassed={Boolean(progressStore.entries[v.id]?.quizPassed)}
                          hasNote={Boolean(progressStore.entries[v.id]?.note?.trim())}
                          onSelect={() => selectVideo(v, true)}
                          onToggleComplete={() =>
                            handleSetStatus(
                              v.id,
                              getVideoStatus(progressStore, v.id) === "completed"
                                ? "unwatched"
                                : "completed"
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredVideos.slice(0, visibleLimit).map((v) => (
              <VideoCatalogCard
                key={v.id}
                video={v}
                isSelected={v.id === activeVideo.id}
                status={getVideoStatus(progressStore, v.id)}
                quizPassed={Boolean(progressStore.entries[v.id]?.quizPassed)}
                hasNote={Boolean(progressStore.entries[v.id]?.note?.trim())}
                onSelect={() => selectVideo(v, true)}
                onToggleComplete={() =>
                  handleSetStatus(
                    v.id,
                    getVideoStatus(progressStore, v.id) === "completed" ? "unwatched" : "completed"
                  )
                }
              />
            ))}
          </div>

          {filteredVideos.length > visibleLimit && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  playCyberClick();
                  setVisibleLimit((prev) => prev + 24);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs sm:text-sm font-bold text-slate-800 shadow-xs cursor-pointer"
              >
                <span>
                  さらに表示する（残り {filteredVideos.length - visibleLimit} 本）
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. 進捗バックアップ・復元・Google Chat 報告 */}
      <section className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <button
          type="button"
          aria-expanded={showBackupPanel}
          aria-controls="ag-video-backup-panel"
          onClick={() => {
            if (!showBackupPanel) playCyberOpen();
            else playCyberClick();
            setShowBackupPanel((prev) => !prev);
          }}
          className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
        >
          <span className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
              LOCAL SYNC
            </span>
            <span className="text-sm sm:text-base font-black text-slate-900">
              動画進捗のバックアップ・復元・Google Chat 報告・初期化
            </span>
          </span>
          {showBackupPanel ? (
            <ChevronUp size={18} className="text-slate-400 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown size={18} className="text-slate-400 shrink-0" aria-hidden="true" />
          )}
        </button>

        {showBackupPanel && (
          <div id="ag-video-backup-panel" className="p-5 border-t border-slate-100 space-y-4">
            {backupBanner && (
              <div
                className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-xs ${
                  backupBanner.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : "bg-rose-50 border-rose-200 text-rose-950"
                }`}
              >
                <div className="flex items-center gap-2">
                  {backupBanner.type === "success" ? (
                    <ShieldCheck size={15} className="text-emerald-600 shrink-0" aria-hidden="true" />
                  ) : (
                    <AlertCircle size={15} className="text-rose-600 shrink-0" aria-hidden="true" />
                  )}
                  <span>{backupBanner.text}</span>
                </div>
                <button
                  type="button"
                  aria-label="お知らせを閉じる"
                  onClick={() => setBackupBanner(null)}
                  className="text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadBackup}
                onMouseEnter={() => playCyberHover()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                <Download size={14} aria-hidden="true" />
                <span>JSON 保存 (.json)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const json = exportVideoProgressJSON(progressStore);
                  void handleCopyWithFeedback("json-export", json, "進捗 JSON をコピーしました。");
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 cursor-pointer"
              >
                {copiedKey === "json-export" ? (
                  <Check size={14} className="text-emerald-600" aria-hidden="true" />
                ) : (
                  <FileJson size={14} aria-hidden="true" />
                )}
                <span>{copiedKey === "json-export" ? "JSON コピー済み" : "JSON コピー"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const report = generateVideoChatReport(videos, progressStore);
                  void handleCopyWithFeedback(
                    "chat-report",
                    report,
                    "Google Chat 報告テキストをコピーしました。"
                  );
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                {copiedKey === "chat-report" ? (
                  <Check size={14} aria-hidden="true" />
                ) : (
                  <MessageSquare size={14} aria-hidden="true" />
                )}
                <span>
                  {copiedKey === "chat-report"
                    ? "報告テキスト コピー済み"
                    : "Google Chat 報告文をコピー"}
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileImport}
                aria-label="バックアップ JSON ファイルを選択"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => {
                  playCyberClick();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold border border-indigo-200 cursor-pointer"
              >
                <Upload size={14} aria-hidden="true" />
                <span>JSON ファイルから復元</span>
              </button>

              <button
                type="button"
                aria-expanded={showImportBox}
                aria-controls="ag-video-import-textbox"
                onClick={() => {
                  playCyberClick();
                  setShowImportBox((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 cursor-pointer"
              >
                <span>{showImportBox ? "貼り付け復元を閉じる" : "テキスト貼付で復元"}</span>
              </button>

              <button
                type="button"
                onClick={handleResetProgress}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  confirmReset
                    ? "bg-rose-600 hover:bg-rose-700 text-white border-rose-700"
                    : "bg-white hover:bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>{confirmReset ? "本当に全進捗を消去する" : "進捗をリセット"}</span>
              </button>

              {confirmReset && (
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  キャンセル
                </button>
              )}
            </div>

            {showImportBox && (
              <div
                id="ag-video-import-textbox"
                className="rounded-xl bg-indigo-50/50 border border-indigo-200 p-4 space-y-2.5"
              >
                <label
                  htmlFor="ag-video-import-textarea"
                  className="block text-xs font-bold text-indigo-950"
                >
                  エクスポートした進捗 JSON を貼り付けてください:
                </label>
                <textarea
                  id="ag-video-import-textarea"
                  rows={4}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='{"version": 1, "entries": { ... }}'
                  className="w-full p-2.5 rounded-xl bg-white border border-indigo-200 text-xs font-mono text-slate-800"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => applyImportedJson(importText)}
                    disabled={!importText.trim()}
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                  >
                    進捗を復元する
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

interface VideoCatalogCardProps {
  video: AntigravityVideo;
  isSelected: boolean;
  status: VideoWatchStatus;
  quizPassed: boolean;
  hasNote: boolean;
  onSelect: () => void;
  onToggleComplete: () => void;
}

function VideoCatalogCard({
  video,
  isSelected,
  status,
  quizPassed,
  hasNote,
  onSelect,
  onToggleComplete,
}: VideoCatalogCardProps) {
  const statusMeta = STATUS_META[status];
  return (
    <article
      className={`rounded-2xl bg-white border transition-all flex flex-col justify-between overflow-hidden ${
        isSelected
          ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
          : "border-slate-200/90 hover:border-indigo-300 shadow-xs"
      }`}
    >
      <div>
        <button
          type="button"
          onClick={onSelect}
          onMouseEnter={() => playCyberHover()}
          className="w-full text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <span className="block relative aspect-video bg-slate-900 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt={`${video.jaTitle} のサムネイル`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
            />
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/90 text-cyan-300 font-mono text-[11px] font-black border border-white/15">
              #{String(video.recommendedOrder).padStart(2, "0")}
            </span>
            <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/90 text-white font-mono text-[11px] font-bold border border-white/15">
              {formatDurationClock(video.durationSeconds)}
            </span>
          </span>

          <span className="block p-4 space-y-2">
            <span className="flex flex-wrap items-center gap-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${FORMAT_BADGE_CLASS[video.format]}`}
              >
                {FORMAT_LABELS[video.format]}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusMeta.badgeClass}`}
              >
                {statusMeta.label}
              </span>
              {video.availability === "unlisted" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  限定公開
                </span>
              )}
              {quizPassed && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-0.5">
                  <BookmarkCheck size={10} aria-hidden="true" />
                  <span>クイズ済</span>
                </span>
              )}
              {hasNote && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  メモあり
                </span>
              )}
            </span>

            <span className="block text-sm font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
              {video.jaTitle}
            </span>
            <span className="block text-[11px] font-mono text-slate-500 line-clamp-1">
              {video.title}
            </span>
            <span className="block text-xs text-slate-600 leading-relaxed line-clamp-2">
              {video.summary.replace(/`/g, "")}
            </span>
          </span>
        </button>
      </div>

      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono text-slate-500">{video.uploadDate}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onSelect}
            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold cursor-pointer"
          >
            {isSelected ? "視聴中ステージ" : "見る・学ぶ"}
          </button>
          <button
            type="button"
            aria-pressed={status === "completed"}
            onClick={onToggleComplete}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
              status === "completed"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white hover:bg-emerald-50 text-slate-700 border-slate-200"
            }`}
          >
            <CheckCircle2 size={12} aria-hidden="true" />
            <span>{status === "completed" ? "完了" : "完了にする"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default OfficialVideoHub;
