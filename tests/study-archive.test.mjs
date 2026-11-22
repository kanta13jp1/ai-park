import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();

function extractDriveFileId(url) {
  if (!url) return null;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function extractDocsId(url) {
  if (!url) return null;
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function assertAllButtonsHaveTypeButton(source, fileLabel) {
  const buttonMatches = [...source.matchAll(/<button\b/g)];
  assert.ok(buttonMatches.length > 0, `${fileLabel} should contain buttons`);
  for (let i = 0; i < buttonMatches.length; i++) {
    const start = buttonMatches[i].index;
    const nextStart = i + 1 < buttonMatches.length ? buttonMatches[i + 1].index : source.length;
    const chunk = source.slice(start, Math.min(nextStart, start + 300));
    assert.match(
      chunk,
      /\btype="button"/,
      `${fileLabel}: button at index ${start} is missing type="button"`
    );
  }
}

test("study-archive data contains verified 2026-11-18 session, valid Drive/Docs URLs, and no PII", () => {
  const dataPath = path.join(rootDir, "src", "data", "study-archive.ts");
  const content = fs.readFileSync(dataPath, "utf8");

  assert.match(content, /id:\s*"2026-11-18"/);
  assert.match(content, /date:\s*"2026-11-18"/);

  const driveMatches = [...content.matchAll(/https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+[^\s"']*/g)];
  const docsMatches = [...content.matchAll(/https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+[^\s"']*/g)];
  assert.ok(driveMatches.length >= 1, "At least one Google Drive video URL should be registered");
  assert.ok(docsMatches.length >= 1, "At least one Google Docs minutes URL should be registered");

  for (const m of driveMatches) {
    assert.ok(extractDriveFileId(m[0]), `Invalid Google Drive URL: ${m[0]}`);
  }
  for (const m of docsMatches) {
    assert.ok(extractDocsId(m[0]), `Invalid Google Docs URL: ${m[0]}`);
  }

  // 社員メールアドレス・生電話番号など公開禁止情報が含まれないこと
  assert.equal(/@ml-mightylink\.com/i.test(content), false, "Employee email domain must not appear");
  assert.equal(/\b0\d{1,3}-\d{2,4}-\d{4}\b/.test(content), false, "Raw phone number must not appear");
});

test("study-archive page implements WAI-ARIA APG tabs, heading hierarchy, live regions, and 768px layout", () => {
  const pagePath = path.join(rootDir, "src", "app", "study-archive", "page.tsx");
  const content = fs.readFileSync(pagePath, "utf8");

  assertAllButtonsHaveTypeButton(content, "src/app/study-archive/page.tsx");

  const requiredTokens = [
    'role="tablist"',
    'role="tab"',
    "aria-selected",
    "aria-controls",
    'role="tabpanel"',
    "aria-labelledby",
    "aria-pressed",
    'aria-live="polite"',
    "ArrowRight",
    "ArrowLeft",
    "Home",
    "End",
    "lg:flex-row",
  ];
  for (const token of requiredTokens) {
    assert.ok(content.includes(token), `study-archive/page.tsx missing required token: ${token}`);
  }

  // 案内カードが h1 直下で h4 飛びしていないこと（h2 を使用）
  assert.match(content, /<h2[^>]*>\s*録画・議事メモは社内限定公開です\s*<\/h2>/);
  assert.match(content, /<h2[^>]*>\s*公開ポリシー（β版）\s*<\/h2>/);
});

test("calendar page implements WAI-ARIA group/pressed, heading hierarchy, 768px layout, and study-archive link", () => {
  const pagePath = path.join(rootDir, "src", "app", "calendar", "page.tsx");
  const content = fs.readFileSync(pagePath, "utf8");

  assertAllButtonsHaveTypeButton(content, "src/app/calendar/page.tsx");

  const requiredTokens = [
    'role="group"',
    "aria-pressed",
    "flex-wrap",
    "lg:flex-row",
    'href="/study-archive"',
  ];
  for (const token of requiredTokens) {
    assert.ok(content.includes(token), `calendar/page.tsx missing required token: ${token}`);
  }

  assert.match(content, /<h2[^>]*>\s*AI勉強会のアジェンダは自動で入ります\s*<\/h2>/);
  assert.match(content, /<h2[^>]*>\s*予定は社内限定公開です\s*<\/h2>/);
});

test("study-archive and calendar routes export metadata via getRouteMetadata SSOT", () => {
  const studyLayout = fs.readFileSync(
    path.join(rootDir, "src", "app", "study-archive", "layout.tsx"),
    "utf8"
  );
  const calendarLayout = fs.readFileSync(
    path.join(rootDir, "src", "app", "calendar", "layout.tsx"),
    "utf8"
  );

  assert.match(studyLayout, /export const metadata:\s*Metadata\s*=\s*getRouteMetadata\("\/study-archive"\)/);
  assert.match(calendarLayout, /export const metadata:\s*Metadata\s*=\s*getRouteMetadata\("\/calendar"\)/);
});

test("preflight-checklist records verified UAT status for study-archive and calendar", () => {
  const preflightPath = path.join(rootDir, "src", "data", "preflight-checklist.ts");
  const content = fs.readFileSync(preflightPath, "utf8");

  assert.match(content, /id:\s*"study-archive"[\s\S]*?path:\s*"\/study-archive"[\s\S]*?overallStatus:\s*"passed"/);
  assert.match(content, /id:\s*"calendar"[\s\S]*?path:\s*"\/calendar"[\s\S]*?overallStatus:\s*"passed"/);
});
