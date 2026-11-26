import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

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

function assertAllButtonsExplicitType(source, fileLabel) {
  const buttonMatches = [...source.matchAll(/<button\b/g)];
  assert.ok(buttonMatches.length > 0, `${fileLabel} should contain buttons`);
  for (const m of buttonMatches) {
    const attrs = extractOpeningTagAttrs(source, m.index, "<button".length);
    assert.match(
      attrs,
      /\btype="(button|submit)"/,
      `${fileLabel}: button missing explicit type="button|submit": <button${attrs.slice(0, 120)}>`
    );
  }
}

function assertAllFormControlsLabeled(source, fileLabel) {
  const fieldMatches = [...source.matchAll(/<(input|select|textarea)\b/g)];
  for (const m of fieldMatches) {
    const attrs = extractOpeningTagAttrs(source, m.index, m[0].length);
    const hasAriaLabel = /\b(aria-label|aria-labelledby)=/.test(attrs);
    const idMatch = attrs.match(/\bid="([^"]+)"/);
    if (hasAriaLabel) continue;
    assert.ok(idMatch, `${fileLabel}: <${m[1]}> missing id or aria-label: ${attrs.slice(0, 100)}`);
    assert.ok(
      source.includes(`htmlFor="${idMatch[1]}"`),
      `${fileLabel}: <${m[1]} id="${idMatch[1]}"> missing matching <label htmlFor="${idMatch[1]}">`
    );
  }
}

const TARGET_FILES = [
  "src/components/ExperienceSelector.tsx",
  "src/app/tools/page.tsx",
  "src/app/feedback-todo/page.tsx",
  "src/app/news/page.tsx",
  "src/app/ai-projects/page.tsx",
  "src/app/roadmap/page.tsx",
  "src/app/troubleshooting/page.tsx",
];

test("all 7 interactive pages/components specify explicit button type and form control labels", () => {
  for (const relPath of TARGET_FILES) {
    const content = readSrc(relPath);
    assertAllButtonsExplicitType(content, relPath);
    assertAllFormControlsLabeled(content, relPath);
  }
});

test("ExperienceSelector implements WAI-ARIA APG Tabs and 768px tablet-safe lg breakpoints", () => {
  const content = readSrc("src/components/ExperienceSelector.tsx");
  for (const token of [
    'role="tablist"',
    'role="tab"',
    "aria-selected={isActive}",
    "aria-controls={`persona-panel-${mode.id}`}",
    'role="tabpanel"',
    "aria-labelledby={`persona-tab-${currentMode.id}`}",
    "ArrowRight",
    "ArrowLeft",
    "Home",
    "End",
    "lg:flex-row",
    "lg:grid-cols-3",
  ]) {
    assert.ok(content.includes(token), `ExperienceSelector.tsx missing token: ${token}`);
  }
});

test("tools page implements WAI-ARIA APG Tabs, filter aria-pressed, live sync status, and 768px KPI grid", () => {
  const content = readSrc("src/app/tools/page.tsx");
  for (const token of [
    'role="tablist"',
    'role="tab"',
    "aria-selected={isSelected}",
    "aria-controls={`tools-panel-${tab.id}`}",
    'role="tabpanel"',
    'id="tools-panel-matrix"',
    "ArrowRight",
    "ArrowLeft",
    "Home",
    "End",
    'role="group"',
    'aria-label="社内推奨ランクで絞り込み"',
    'aria-label="利用状態で絞り込み"',
    "aria-pressed={recommendFilter === r.id}",
    "aria-pressed={statusFilter === \"all\"}",
    'aria-live="polite"',
    "grid-cols-2 lg:grid-cols-4",
    "whitespace-nowrap",
  ]) {
    assert.ok(content.includes(token), `tools/page.tsx missing token: ${token}`);
  }
});

test("feedback-todo page implements filter/view aria-pressed, modal labels, heading hierarchy, ObjectURL revoke, and 768px layout", () => {
  const content = readSrc("src/app/feedback-todo/page.tsx");
  for (const token of [
    'aria-label="ステータスで絞り込み"',
    'aria-label="表示モード切替"',
    'aria-label="リスト表示"',
    'aria-label="カンバンボード表示"',
    'aria-live="polite"',
    "URL.revokeObjectURL(url)",
    '<h2 id="feedback-modal-title"',
    "grid-cols-2 lg:grid-cols-4",
    "grid-cols-1 lg:grid-cols-3",
    "lg:flex-row",
  ]) {
    assert.ok(content.includes(token), `feedback-todo/page.tsx missing token: ${token}`);
  }
  assert.equal(/<h4[\s>]/i.test(content), false, "feedback-todo/page.tsx must not skip heading levels to <h4>");
});

test("news page implements filter aria-pressed, safe clipboard copy with aria-live, heading hierarchy, and 768px layout", () => {
  const content = readSrc("src/app/news/page.tsx");
  for (const token of [
    'aria-label="重要度で絞り込み"',
    'aria-label="カテゴリで絞り込み"',
    "aria-pressed={selectedImportance === imp.id}",
    "aria-pressed={isActive}",
    'aria-live="polite"',
    "try {",
    "catch {",
    "コピーに失敗しました",
    "lg:flex-row",
    "motion-safe:animate-pulse",
  ]) {
    assert.ok(content.includes(token), `news/page.tsx missing token: ${token}`);
  }
  assert.equal(/<h4[\s>]/i.test(content), false, "news/page.tsx must not skip heading levels to <h4>");
});

test("ai-projects, roadmap, and troubleshooting pages enforce heading hierarchy, filter ARIA, and 768px tablet layout", () => {
  const projects = readSrc("src/app/ai-projects/page.tsx");
  for (const token of [
    'aria-label="進捗ステージで絞り込み"',
    "aria-pressed={isSelected}",
    'aria-live="polite"',
    "try {",
    "catch {",
    "lg:grid-cols-2",
    "lg:grid-cols-3",
    "lg:flex-row",
  ]) {
    assert.ok(projects.includes(token), `ai-projects/page.tsx missing token: ${token}`);
  }
  assert.equal(/<h4[\s>]/i.test(projects), false, "ai-projects/page.tsx must not skip heading levels to <h4>");

  const roadmap = readSrc("src/app/roadmap/page.tsx");
  for (const token of [
    'aria-label="ステータスで絞り込み"',
    'aria-pressed={selectedStatus === "all"}',
    "lg:flex-row",
    "xl:grid-cols-3",
    "grid-cols-1 lg:grid-cols-2",
    "motion-safe:animate-pulse",
  ]) {
    assert.ok(roadmap.includes(token), `roadmap/page.tsx missing token: ${token}`);
  }
  assert.equal(/<h4[\s>]/i.test(roadmap), false, "roadmap/page.tsx must not skip heading levels to <h4>");

  const trouble = readSrc("src/app/troubleshooting/page.tsx");
  for (const token of [
    'aria-label="カテゴリで絞り込み"',
    "aria-pressed={isActive}",
    'aria-live="polite"',
    "try {",
    "catch {",
    "lg:flex-row",
    "lg:grid-cols-2",
  ]) {
    assert.ok(trouble.includes(token), `troubleshooting/page.tsx missing token: ${token}`);
  }
  assert.equal(/<h4[\s>]/i.test(trouble), false, "troubleshooting/page.tsx must not skip heading levels to <h4>");
});
