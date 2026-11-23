import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  ANTIGRAVITY_VIDEO_COUNTS,
  ANTIGRAVITY_VIDEO_VERIFIED_DATE,
  ANTIGRAVITY_YOUTUBE_CHANNEL_ID,
  ANTIGRAVITY_YOUTUBE_CHANNEL_URL,
  VIDEO_TRACKS,
} from "../src/data/antigravity-videos/meta.ts";
import { onboardingCoreVideos } from "../src/data/antigravity-videos/track-onboarding-core.ts";
import { updateVideos } from "../src/data/antigravity-videos/track-updates.ts";
import { remoteModelVideos } from "../src/data/antigravity-videos/track-remote-models.ts";
import { usecaseVideos } from "../src/data/antigravity-videos/track-usecases.ts";
import { shortVideos } from "../src/data/antigravity-videos/track-shorts.ts";
import { livestreamVideos } from "../src/data/antigravity-videos/track-livestreams.ts";
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
} from "../src/lib/antigravityVideoProgress.ts";

const rootDir = process.cwd();

const allCatalogVideos = [
  ...onboardingCoreVideos,
  ...updateVideos,
  ...remoteModelVideos,
  ...usecaseVideos,
  ...shortVideos,
  ...livestreamVideos,
].sort((a, b) => a.recommendedOrder - b.recommendedOrder);

function assertAllButtonsHaveTypeButton(source, fileLabel) {
  const buttonMatches = [...source.matchAll(/<button\b/g)];
  assert.ok(buttonMatches.length > 0, `${fileLabel} should contain buttons`);
  for (let i = 0; i < buttonMatches.length; i++) {
    const start = buttonMatches[i].index;
    const nextStart = i + 1 < buttonMatches.length ? buttonMatches[i + 1].index : source.length;
    const chunk = source.slice(start, Math.min(nextStart, start + 350));
    assert.match(
      chunk,
      /\btype="button"/,
      `${fileLabel}: button at index ${start} is missing type="button"`
    );
  }
}

test("Official YouTube catalog covers all 91 unique verified videos without PII or gaps", () => {
  assert.equal(ANTIGRAVITY_YOUTUBE_CHANNEL_URL, "https://www.youtube.com/@googleantigravity");
  assert.equal(ANTIGRAVITY_YOUTUBE_CHANNEL_ID, "UC_eVxIPHFZm7oF_gET0x-8Q");
  assert.match(ANTIGRAVITY_VIDEO_VERIFIED_DATE, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(VIDEO_TRACKS.length, 7);

  assert.equal(allCatalogVideos.length, 91);
  assert.equal(ANTIGRAVITY_VIDEO_COUNTS.total, 91);

  const seenIds = new Set();
  const seenOrders = new Set();
  const formatCounts = { video: 0, short: 0, stream: 0 };
  const trackCounts = new Map();
  let unlistedCount = 0;
  let totalDuration = 0;

  for (const v of allCatalogVideos) {
    assert.match(v.id, /^[A-Za-z0-9_-]{11}$/, `Invalid YouTube ID: ${v.id}`);
    assert.equal(seenIds.has(v.id), false, `Duplicate video ID: ${v.id}`);
    seenIds.add(v.id);

    assert.equal(seenOrders.has(v.recommendedOrder), false, `Duplicate order: ${v.recommendedOrder}`);
    seenOrders.add(v.recommendedOrder);

    assert.ok(v.title.trim().length >= 4, `Missing English title for ${v.id}`);
    assert.ok(v.jaTitle.trim().length >= 4, `Missing Japanese title for ${v.id}`);
    assert.equal(v.jaTitle.includes("`"), false, `Raw backtick found in jaTitle for ${v.id}: ${v.jaTitle}`);
    assert.match(v.uploadDate, /^\d{4}-\d{2}-\d{2}$/, `Bad uploadDate for ${v.id}`);
    assert.ok(Number.isInteger(v.durationSeconds) && v.durationSeconds > 0, `Bad duration on ${v.id}`);
    assert.ok(v.summary.trim().length >= 20, `Too short summary on ${v.id}`);
    assert.equal(v.takeaways.length, 3, `Expected 3 takeaways on ${v.id}`);
    for (const pt of v.takeaways) {
      assert.ok(pt.trim().length >= 8, `Empty/short takeaway on ${v.id}`);
    }
    assert.ok(Array.isArray(v.tags) && v.tags.length >= 1, `Empty tags on ${v.id}`);

    assert.ok(v.quiz.question.trim().length >= 8, `Short quiz question on ${v.id}`);
    assert.equal(v.quiz.choices.length, 3, `Expected 3 quiz choices on ${v.id}`);
    assert.equal(new Set(v.quiz.choices).size, 3, `Duplicate quiz choices on ${v.id}`);
    assert.ok([0, 1, 2].includes(v.quiz.answerIndex), `Invalid answerIndex on ${v.id}`);
    assert.ok(v.quiz.explanation.trim().length >= 10, `Short quiz explanation on ${v.id}`);

    formatCounts[v.format] += 1;
    trackCounts.set(v.track, (trackCounts.get(v.track) ?? 0) + 1);
    if (v.availability === "unlisted") unlistedCount += 1;
    totalDuration += v.durationSeconds;
  }

  for (let i = 1; i <= 91; i++) {
    assert.ok(seenOrders.has(i), `Missing recommendedOrder #${i}`);
  }

  assert.equal(formatCounts.video, ANTIGRAVITY_VIDEO_COUNTS.video);
  assert.equal(formatCounts.short, ANTIGRAVITY_VIDEO_COUNTS.short);
  assert.equal(formatCounts.stream, ANTIGRAVITY_VIDEO_COUNTS.stream);
  assert.equal(unlistedCount, ANTIGRAVITY_VIDEO_COUNTS.unlistedInPlaylist);
  assert.equal(totalDuration, ANTIGRAVITY_VIDEO_COUNTS.totalDurationSeconds);

  assert.equal(trackCounts.get("onboarding"), 8);
  assert.equal(trackCounts.get("core-liftoff"), 15);
  assert.equal(trackCounts.get("updates"), 9);
  assert.equal(trackCounts.get("remote-models"), 16);
  assert.equal(trackCounts.get("usecases"), 14);
  assert.equal(trackCounts.get("shorts"), 22);
  assert.equal(trackCounts.get("livestreams"), 7);

  const beginner = allCatalogVideos.find((v) => v.id === "6C0FjHoN3qE");
  assert.equal(beginner?.relatedAcademyHref, "/academy");

  // Hygiene check on antigravity-videos files
  const dataDir = path.join(rootDir, "src", "data", "antigravity-videos");
  for (const fn of fs.readdirSync(dataDir)) {
    const raw = fs.readFileSync(path.join(dataDir, fn), "utf8");
    assert.equal(/@ml-mightylink\.com/i.test(raw), false, `${fn}: employee email domain leak`);
    assert.equal(/\b0\d{1,3}-\d{2,4}-\d{4}\b/.test(raw), false, `${fn}: phone leak`);
    assert.equal(/[A-Za-z]:\\Users\\/.test(raw), false, `${fn}: local Windows path leak`);
  }
});

test("antigravityVideoProgress manages statuses, quizzes, notes, stats, backup JSON, and Chat report", () => {
  const mem = new Map();
  const mockStorage = {
    getItem: (k) => mem.get(k) ?? null,
    setItem: (k, v) => mem.set(k, v),
  };

  let store = createEmptyProgressStore();
  assert.equal(getVideoStatus(store, "SVCBA-pBgt0"), "unwatched");

  // Play start -> watching
  store = setVideoStatus(store, "SVCBA-pBgt0", "watching", "2026-11-23T10:00:00.000Z");
  assert.equal(getVideoStatus(store, "SVCBA-pBgt0"), "watching");

  // Wrong quiz answer keeps watching, preserves quizPassed = false
  const v2 = allCatalogVideos[1];
  const wrongIdx = ((v2.quiz.answerIndex + 1) % 3);
  store = recordQuizAnswer(store, v2.id, wrongIdx, false, "2026-11-23T10:01:00.000Z");
  assert.equal(getVideoStatus(store, v2.id), "watching");
  assert.equal(store.entries[v2.id]?.quizPassed, false);

  // Correct quiz answer sets completed and quizPassed = true
  store = recordQuizAnswer(
    store,
    v2.id,
    v2.quiz.answerIndex,
    true,
    "2026-11-23T10:02:00.000Z"
  );
  assert.equal(getVideoStatus(store, v2.id), "completed");
  assert.equal(store.entries[v2.id]?.quizPassed, true);

  // Notes save and cleanup
  store = setVideoNote(store, "nTOVIGsqCuY", "実務でテスト済みメモ", "2026-11-23T10:03:00.000Z");
  const stats = computeProgressStats(allCatalogVideos, store);
  assert.equal(stats.totalVideos, 91);
  assert.equal(stats.completedVideos, 1);
  assert.equal(stats.watchingVideos, 1);
  assert.equal(stats.unwatchedVideos, 89);
  assert.equal(stats.quizPassedCount, 1);
  assert.equal(stats.notesCount, 1);
  assert.equal(stats.nextRecommendedVideo?.id, "SVCBA-pBgt0");

  // Revert watching back to unwatched cleans empty entry
  store = setVideoStatus(store, "SVCBA-pBgt0", "unwatched");
  assert.equal(store.entries["SVCBA-pBgt0"], undefined);

  // Save & load roundtrip
  saveVideoProgress(store, mockStorage);
  const reloaded = loadVideoProgress(mockStorage);
  assert.equal(getVideoStatus(reloaded, v2.id), "completed");

  // Malformed storage returns safe empty store
  const badStorage = { getItem: () => "{corrupt-json", setItem: () => {} };
  assert.deepEqual(loadVideoProgress(badStorage).entries, {});

  // Export & import JSON roundtrip + validVideoIds filtering
  const exported = exportVideoProgressJSON(reloaded, "2026-11-23T10:05:00.000Z");
  const validIds = new Set(allCatalogVideos.map((v) => v.id));
  const imported = importVideoProgressJSON(exported, validIds);
  assert.equal(imported.success, true);
  if (imported.success) {
    assert.equal(imported.importedCount, 1);
    assert.equal(imported.store.entries[v2.id]?.status, "completed");
  }

  // Invalid JSON or invalid status rejected safely
  assert.equal(importVideoProgressJSON("not-json").success, false);
  assert.equal(
    importVideoProgressJSON(JSON.stringify({ entries: { bad: { status: "hacked" } } })).success,
    false
  );

  // Chat report & duration formatting
  const report = generateVideoChatReport(allCatalogVideos, reloaded);
  assert.ok(report.includes("1 / 91 本"));
  assert.ok(report.includes("https://kanta13jp1.github.io/ai-park/antigravity-info/?tab=videos"));
  assert.equal(formatDurationClock(183), "3:03");
  assert.equal(formatDurationClock(3661), "1:01:01");
  assert.equal(formatDurationJapanese(183), "3分3秒");
  assert.equal(formatDurationJapanese(3600), "1時間");
});

test("YouTubeFacadePlayer, OfficialVideoHub, and /antigravity-info follow WAI-ARIA, privacy, and Static Export safety", () => {
  const facadeSrc = fs.readFileSync(
    path.join(rootDir, "src", "components", "antigravity", "YouTubeFacadePlayer.tsx"),
    "utf8"
  );
  const hubSrc = fs.readFileSync(
    path.join(rootDir, "src", "components", "antigravity", "OfficialVideoHub.tsx"),
    "utf8"
  );
  const pageSrc = fs.readFileSync(
    path.join(rootDir, "src", "app", "antigravity-info", "page.tsx"),
    "utf8"
  );

  assertAllButtonsHaveTypeButton(facadeSrc, "YouTubeFacadePlayer.tsx");
  assertAllButtonsHaveTypeButton(hubSrc, "OfficialVideoHub.tsx");
  assertAllButtonsHaveTypeButton(pageSrc, "src/app/antigravity-info/page.tsx");

  assert.ok(facadeSrc.includes("https://www.youtube-nocookie.com/embed/"));
  assert.ok(facadeSrc.includes("https://i.ytimg.com/vi/"));
  assert.ok(facadeSrc.includes('rel="noopener noreferrer"'));

  for (const token of [
    'import("@/data/antigravity-videos")',
    'role="progressbar"',
    "aria-valuenow",
    "aria-expanded",
    "aria-controls",
    "aria-pressed",
    'aria-live="polite"',
    'rel="noopener noreferrer"',
    "xl:grid-cols-12",
  ]) {
    assert.ok(hubSrc.includes(token), `OfficialVideoHub.tsx missing required token: ${token}`);
  }

  for (const token of [
    "OfficialVideoHub",
    "preloadAntigravityVideos",
    "ag-tab-videos",
    "ag-panel-videos",
    'setInitialVideoId',
    "window.history.replaceState",
  ]) {
    assert.ok(pageSrc.includes(token), `antigravity-info/page.tsx missing video integration token: ${token}`);
  }

  assert.equal(/useSearchParams/.test(hubSrc), false, "OfficialVideoHub must not use useSearchParams");
  assert.equal(/useSearchParams/.test(pageSrc), false, "antigravity-info page must not use useSearchParams");
  assert.equal(/window\.confirm/.test(hubSrc), false, "OfficialVideoHub must not use window.confirm");
  assert.equal(/dangerouslySetInnerHTML\s*=/.test(hubSrc), false, "OfficialVideoHub must not use dangerouslySetInnerHTML");
});
