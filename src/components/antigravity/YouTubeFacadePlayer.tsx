"use client";

import { useState } from "react";
import { Captions, ExternalLink, Play } from "lucide-react";
import type { VideoFormat } from "@/data/antigravity-videos/types";
import { formatDurationClock } from "@/lib/antigravityVideoProgress";
import { playCyberClick, playCyberHover } from "@/lib/sound";

export interface YouTubeFacadePlayerProps {
  videoId: string;
  title: string;
  format: VideoFormat;
  durationSeconds: number;
  onPlayStart?: () => void;
}

/**
 * 初期表示はサムネイルと再生ボタンのみを描画し、クリック時に初めて youtube-nocookie.com の iframe をマウントする
 * ゼロ依存・パフォーマンス配慮型 YouTube プレイヤー。
 */
export function YouTubeFacadePlayer({
  videoId,
  title,
  format,
  durationSeconds,
  onPlayStart,
}: YouTubeFacadePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const watchUrl =
    format === "short"
      ? `https://www.youtube.com/shorts/${videoId}`
      : `https://www.youtube.com/watch?v=${videoId}`;

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=ja&hl=ja`;

  const handleActivate = () => {
    playCyberClick();
    setIsPlaying(true);
    onPlayStart?.();
  };

  return (
    <div className="space-y-2.5">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
        {isPlaying ? (
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={handleActivate}
            onMouseEnter={() => playCyberHover()}
            aria-label={`${title} を再生する（YouTube プレイヤーを読み込みます）`}
            className="group relative w-full h-full block text-left cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={`${title} のサムネイル`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="block absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/20" />

            {/* 中央再生アイコン */}
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-4">
              <span className="w-16 h-16 rounded-full bg-rose-600 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-xl ring-4 ring-white/25 transition-transform duration-200 group-hover:scale-110">
                <Play size={28} className="fill-white ml-1" aria-hidden="true" />
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-950/85 border border-white/20 text-xs font-bold text-white shadow-sm">
                クリックして動画を再生（自動で「視聴中」に記録）
              </span>
            </span>

            {/* 右下再生時間バッジ */}
            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-white/15 font-mono text-xs font-bold text-white">
              {formatDurationClock(durationSeconds)}
            </span>
          </button>
        )}
      </div>

      {/* 日本語自動翻訳字幕ガイド + YouTube 直接リンク */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-200/90 px-3.5 py-2.5 text-xs text-slate-600">
        <div className="flex items-start sm:items-center gap-2 min-w-0">
          <Captions size={15} className="text-indigo-600 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <span className="leading-relaxed">
            英語音声の動画は、プレイヤー右下の <strong className="text-slate-800">字幕（CC）</strong> →{" "}
            <strong className="text-slate-800">設定（歯車）</strong> →{" "}
            <strong className="text-slate-800">自動翻訳 → 日本語</strong> で日本語字幕を表示できます。
          </span>
        </div>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-indigo-700 hover:text-indigo-800 hover:underline shrink-0"
        >
          <span>YouTube で直接開く</span>
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export default YouTubeFacadePlayer;
