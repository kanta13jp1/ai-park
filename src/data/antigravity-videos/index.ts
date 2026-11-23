// Google Antigravity 公式 YouTube 動画学習カタログ（全 91 本統合バレル）
// 出どころ: YouTube 公式チャンネル (@googleantigravity / UC_eVxIPHFZm7oF_gET0x-8Q)
// 取得手段: yt-dlp 一次メタデータ・概要欄・字幕取得（取得日: 2026-11-23）

import type { AntigravityVideo } from "./types";
import { onboardingCoreVideos } from "./track-onboarding-core";
import { updateVideos } from "./track-updates";
import { remoteModelVideos } from "./track-remote-models";
import { usecaseVideos } from "./track-usecases";
import { shortVideos } from "./track-shorts";
import { livestreamVideos } from "./track-livestreams";

export * from "./types";
export * from "./meta";
export {
  onboardingCoreVideos,
  updateVideos,
  remoteModelVideos,
  usecaseVideos,
  shortVideos,
  livestreamVideos,
};

export const antigravityVideos: AntigravityVideo[] = [
  ...onboardingCoreVideos,
  ...updateVideos,
  ...remoteModelVideos,
  ...usecaseVideos,
  ...shortVideos,
  ...livestreamVideos,
].sort((a, b) => a.recommendedOrder - b.recommendedOrder);
