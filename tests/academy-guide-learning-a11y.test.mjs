import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();

function readSrc(relPath) {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

function extractOpeningTagAttrs(source, startIndex, tagLength) {
  let i = startIndex + tagLength;
  let braceDepth = 0;
  let quote = null;
  while (i < source.length) {
    const ch = source[i];
    if (quote) {
      if (ch === "\\" && i + 1 < source.length) {
        i += 2;
        continue;
      }
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
    } else if (ch === "{") {
      braceDepth++;
    } else if (ch === "}") {
      if (braceDepth > 0) braceDepth--;
    } else if (ch === ">" && braceDepth === 0) {
      return source.slice(startIndex + tagLength, i);
    }
    i++;
  }
  return source.slice(startIndex + tagLength);
}

const TARGET_TSX_FILES = [
  "src/app/academy/page.tsx",
  "src/components/academy/LessonView.tsx",
  "src/components/academy/ProgressManager.tsx",
  "src/app/guide/page.tsx",
  "src/components/GcpSetupGuide.tsx",
  "src/components/WindowsAntigravityGuide.tsx",
  "src/components/TroubleshootingBoard.tsx",
  "src/components/WindowsTroubleshooter.tsx",
  "src/app/learning/page.tsx",
  "src/components/BeginnerCheatsheet.tsx",
  "src/components/InteractivePromptLibrary.tsx",
  "src/components/SafePromptingRules.tsx",
  "src/components/SafetySelfChecker.tsx",
];

test("generateChatReportText formats 0..1 bestScore as integer percentage and uses canonical /academy/ URL", async () => {
  const modPath = path.join(rootDir, "src", "lib", "academyProgress.ts");
  const { generateChatReportText } = await import(pathToFileURL(modPath).href);
  const report = generateChatReportText(
    {
      "antigravity-101": {
        lessonsDone: ["what", "install", "signin", "setup"],
        bestScore: 0.8,
        completedAt: "2026-11-26T10:00:00.000Z",
        certificateId: "AGA-ANT-20261126-TEST01",
      },
      "antigravity-practice": {
        lessonsDone: ["l1", "l2"],
        bestScore: 1,
        completedAt: "2026-11-26T10:00:00.000Z",
        certificateId: "AGA-ANT-20261126-TEST02",
      },
    },
    15,
    8
  );

  assert.ok(report.includes("(正答率: 80%)"), `Expected 80% score in report, got:\n${report}`);
  assert.ok(report.includes("(正答率: 100%)"), `Expected 100% score in report, got:\n${report}`);
  assert.equal(report.includes("(正答率: 0.8%)"), false, "Must not render decimal bestScore as 0.8%");
  assert.ok(report.includes("https://kanta13jp1.github.io/ai-park/academy/"));
});

test("academy page calculates quiz completion via PASS_RATE and avoids h4 heading skips", () => {
  const academy = readSrc("src/app/academy/page.tsx");
  assert.ok(academy.includes("cp.bestScore >= PASS_RATE"), "academy/page.tsx must compare bestScore against PASS_RATE");
  assert.equal(academy.includes("cp.bestScore >= 80"), false, "academy/page.tsx must not compare 0..1 score against 80");
  assert.ok(academy.includes("lg:flex-row"));
  assert.ok(academy.includes("xl:grid-cols-3"));
  assert.equal(/<h4[\s>]/i.test(academy), false, "academy/page.tsx must not skip heading levels to <h4>");
});

test("all 13 academy, guide, and learning TSX files enforce button types and accessible form labels", () => {
  for (const relPath of TARGET_TSX_FILES) {
    const source = readSrc(relPath);
    for (const m of source.matchAll(/<button\b/g)) {
      const attrs = extractOpeningTagAttrs(source, m.index, "<button".length);
      assert.match(
        attrs,
        /\btype="(button|submit)"/,
        `${relPath}: button missing explicit type="button|submit": <button${attrs.slice(0, 120)}>`
      );
    }

    for (const m of source.matchAll(/<(input|select|textarea)\b/g)) {
      const attrs = extractOpeningTagAttrs(source, m.index, m[0].length);
      if (/\b(aria-label|aria-labelledby)=/.test(attrs)) continue;
      const idMatch = attrs.match(/\bid=(?:"([^"]+)"|\{([^}]+)\})/);
      assert.ok(idMatch, `${relPath}: <${m[1]}> missing id or aria-label: ${attrs.slice(0, 120)}`);
      const idToken = idMatch[1] ? `htmlFor="${idMatch[1]}"` : `htmlFor={${idMatch[2]}}`;
      assert.ok(
        source.includes(idToken),
        `${relPath}: <${m[1]}> missing matching <label ${idToken}>`
      );
    }
  }
});

test("LessonView and ProgressManager enforce single <main>, ARIA nav/live regions, and safe clipboard error handling", () => {
  const lessonView = readSrc("src/components/academy/LessonView.tsx");
  assert.equal(/<main\b/i.test(lessonView), false, "LessonView.tsx must not nest <main> inside RootLayout's <main>");
  assert.ok(lessonView.includes('aria-label="パンくずリスト"'));
  assert.ok(lessonView.includes('aria-label="ページ内目次"'));
  assert.ok(lessonView.includes('aria-live="polite"'));
  assert.ok(lessonView.includes("コピーに失敗しました"));

  const progressMgr = readSrc("src/components/academy/ProgressManager.tsx");
  assert.ok(progressMgr.includes("const ok = await safeCopy("));
  assert.ok(progressMgr.includes("if (ok) {"));
  assert.ok(progressMgr.includes("aria-expanded={showImportBox}"));
  assert.ok(progressMgr.includes('aria-controls="academy-import-json-panel"'));
  assert.ok(progressMgr.includes('aria-label="お知らせを閉じる"'));
  assert.ok(progressMgr.includes('aria-live="polite"'));
  assert.ok(progressMgr.includes("grid-cols-1 lg:grid-cols-2"));
  assert.equal(/<h4[\s>]/i.test(progressMgr), false, "ProgressManager.tsx must not skip heading levels to <h4>");
});

test("Guide and Windows components enforce single TroubleshootingBoard, canonical URLs, disclosure ARIA, and heading hierarchy", () => {
  const guide = readSrc("src/app/guide/page.tsx");
  assert.ok(guide.includes("https://antigravity.google/docs/install?tab=cli"));
  assert.equal(guide.includes("https://antigravity.google/docs/cli/install/"), false);
  assert.equal(guide.includes("<TroubleshootingBoard"), false, "guide/page.tsx must not mount duplicate <TroubleshootingBoard />");
  assert.ok(guide.includes('<nav aria-label="ページ内目次"'));
  assert.ok(guide.includes("lg:flex-row"));
  assert.ok(guide.includes("lg:grid-cols-3"));
  assert.equal(/<h4[\s>]/i.test(guide), false, "guide/page.tsx must not skip heading levels to <h4>");

  const gcp = readSrc("src/components/GcpSetupGuide.tsx");
  assert.ok(gcp.includes('aria-live="polite"'));
  assert.equal(/<h4[\s>]/i.test(gcp), false, "GcpSetupGuide.tsx must not skip heading levels to <h4>");

  const winGuide = readSrc("src/components/WindowsAntigravityGuide.tsx");
  assert.ok(winGuide.includes("aria-expanded={isPsOpen}"));
  assert.ok(winGuide.includes('aria-controls="win-guide-ps-panel"'));
  assert.ok(winGuide.includes("aria-expanded={isMcpOpen}"));
  assert.ok(winGuide.includes('aria-controls="win-guide-mcp-panel"'));
  assert.ok(winGuide.includes("aria-expanded={isFaqOpen}"));
  assert.ok(winGuide.includes('aria-controls="win-guide-faq-panel"'));
  assert.ok(winGuide.includes("lg:grid-cols-3"));
  assert.equal(/<h4[\s>]/i.test(winGuide), false, "WindowsAntigravityGuide.tsx must not skip heading levels to <h4>");

  const board = readSrc("src/components/TroubleshootingBoard.tsx");
  assert.ok(board.includes("useId"));
  assert.ok(board.includes('role="group"'));
  assert.ok(board.includes("aria-pressed={isActive}"));
  assert.ok(board.includes("lg:grid-cols-2"));
  assert.equal(/<h4[\s>]/i.test(board), false, "TroubleshootingBoard.tsx must not skip heading levels to <h4>");

  const ts = readSrc("src/components/WindowsTroubleshooter.tsx");
  assert.ok(ts.includes("https://docs.cloud.google.com/sdk/gcloud/reference/auth/login"));
  assert.ok(ts.includes("https://docs.cloud.google.com/docs/authentication/provide-credentials-adc"));
  assert.ok(ts.includes("https://docs.cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=ja"));
  assert.equal(ts.includes("https://cloud.google.com/"), false);
  assert.equal(/@ml-mightylink\.com/i.test(ts), false);
  assert.ok(ts.includes('aria-pressed={selectedCategory === cat}'));
  assert.ok(ts.includes("lg:flex-row"));
});

test("Learning page and child components implement WAI-ARIA Tabs, group/pressed, live regions, and clean 768px grids", () => {
  const learning = readSrc("src/app/learning/page.tsx");
  assert.ok(learning.includes('<h2 className="text-xl sm:text-2xl'));

  const cheatsheet = readSrc("src/components/BeginnerCheatsheet.tsx");
  assert.ok(cheatsheet.includes('aria-live="polite"'));
  assert.ok(cheatsheet.includes("コピーに失敗しました"));

  const promptLib = readSrc("src/components/InteractivePromptLibrary.tsx");
  for (const token of [
    'role="tablist"',
    'role="tab"',
    "aria-selected={isSelected}",
    "aria-controls={`prompt-panel-${tmpl.id}`}",
    'role="tabpanel"',
    "aria-labelledby={`prompt-tab-${currentTemplate.id}`}",
    "ArrowRight",
    "ArrowLeft",
    "Home",
    "End",
    'aria-live="polite"',
  ]) {
    assert.ok(promptLib.includes(token), `InteractivePromptLibrary.tsx missing token: ${token}`);
  }
  assert.equal(/田中/.test(promptLib), false, "InteractivePromptLibrary.tsx must not use fictional surname");

  const rules = readSrc("src/components/SafePromptingRules.tsx");
  assert.ok(rules.includes("lg:grid-cols-2"));
  assert.ok(rules.includes("lg:grid-cols-3"));

  const checker = readSrc("src/components/SafetySelfChecker.tsx");
  assert.ok(checker.includes('role="group"'));
  assert.ok(checker.includes("aria-pressed={isSelected}"));
  assert.ok(checker.includes('aria-live="polite"'));
  assert.ok(checker.includes("lg:grid-cols-2"));
  assert.equal(/<h4[\s>]/i.test(checker), false, "SafetySelfChecker.tsx must not skip heading levels to <h4>");
});
