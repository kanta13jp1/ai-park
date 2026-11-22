import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();

function readSrc(relPath) {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

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

test("preflight page implements vertical WAI-ARIA tabs, clipboard error handling, heading hierarchy, clickable unverified links, and 768px layout", () => {
  const content = readSrc("src/app/preflight/page.tsx");
  assertAllButtonsHaveTypeButton(content, "src/app/preflight/page.tsx");

  const requiredTokens = [
    'role="tablist"',
    'aria-orientation="vertical"',
    'role="tab"',
    "aria-selected",
    'aria-controls="preflight-detail-panel"',
    'id="preflight-detail-panel"',
    'role="tabpanel"',
    "aria-labelledby",
    "ArrowDown",
    "ArrowUp",
    "Home",
    "End",
    'role="status"',
    'aria-live="polite"',
    "try {",
    "catch {",
    "コピーに失敗しました",
    "href={f.href}",
    "lg:flex-row",
    "xl:flex-row",
    "xl:grid-cols-2",
    "flex-wrap",
  ];

  for (const token of requiredTokens) {
    assert.ok(content.includes(token), `preflight/page.tsx missing required token: ${token}`);
  }

  assert.equal(/<h5[\s>]/i.test(content), false, "preflight/page.tsx must not skip heading levels to <h5>");
  assert.equal(content.includes("社内標準"), false, "preflight/page.tsx must not claim unverified 社内標準PC環境");
  assert.equal(content.includes('"100% 承認"'), false, "preflight/page.tsx must calculate passRate dynamically");
});

test("how-to page keeps /tools PoC badge alignment, links /study-archive, fixes heading hierarchy and 768px responsiveness", () => {
  const content = readSrc("src/app/how-to/page.tsx");

  assert.match(content, /href:\s*"\/tools"[\s\S]*?badge:\s*"🧪 PoC中"/);
  assert.match(content, /href:\s*"\/study-archive"[\s\S]*?badge:\s*"β版"/);
  assert.match(content, /<h2[^>]*>\s*日々の開発・業務を加速するリソース集\s*<\/h2>/);

  for (const token of ["lg:flex-row", "lg:grid-cols-3", "xl:flex-row", "flex-wrap"]) {
    assert.ok(content.includes(token), `how-to/page.tsx missing 768px responsive token: ${token}`);
  }
});

test("agent-tools page aligns /agent-cases facts, removes speculative schedule wording, fixes heading hierarchy and 768px layout", () => {
  const content = readSrc("src/app/agent-tools/page.tsx");

  assert.match(content, /実運用エージェント（6種）/);
  assert.match(content, /href:\s*"\/agent-cases"[\s\S]*?badge:\s*"🚧 工事中"/);
  assert.equal(
    content.includes("本番データ連携予定日は"),
    false,
    "agent-tools/page.tsx must not imply confirmed release dates"
  );

  assert.match(content, /<h2[^>]*>\s*自律型エージェント活用の3ステップ\s*<\/h2>/);
  assert.match(content, /<h3[^>]*>\s*\{st\.title\}\s*<\/h3>/);
  assert.match(content, /<h2[^>]*>\s*PoC中・工事中機能の正式稼働スケジュール\s*<\/h2>/);

  for (const token of ["lg:grid-cols-3", "lg:flex-row", "flex-wrap"]) {
    assert.ok(content.includes(token), `agent-tools/page.tsx missing 768px responsive token: ${token}`);
  }
});

test("idea-board page implements filter group ARIA, search label, live sync status, AbortController, heading hierarchy, and 768px layout", () => {
  const content = readSrc("src/app/idea-board/page.tsx");
  assertAllButtonsHaveTypeButton(content, "src/app/idea-board/page.tsx");

  const requiredTokens = [
    'role="group"',
    'aria-label="進捗ステージで絞り込み"',
    "aria-pressed",
    'htmlFor="idea-search-input"',
    'id="idea-search-input"',
    'role="status"',
    'aria-live="polite"',
    'disabled={syncState === "loading"}',
    "AbortController",
    "motion-safe:animate-pulse",
    "lg:flex-row",
    "lg:grid-cols-2",
    "lg:grid-cols-3",
  ];

  for (const token of requiredTokens) {
    assert.ok(content.includes(token), `idea-board/page.tsx missing required token: ${token}`);
  }

  assert.match(content, /<h2[^>]*>宣言されたアイデア一覧<\/h2>/);
  assert.match(content, /<h2[^>]*>[\s\S]*アイデア宣言の3大ルール[\s\S]*<\/h2>/);
  assert.match(content, /<h3[^>]*>1\. アイデアの重複は歓迎<\/h3>/);
});

test("route-metadata and route layouts register /preflight, /how-to, /agent-tools, and /idea-board via SSOT", () => {
  const metaContent = readSrc("src/data/route-metadata.ts");
  const routes = ["/preflight", "/how-to", "/agent-tools", "/idea-board"];

  for (const route of routes) {
    assert.ok(metaContent.includes(`"${route}"`), `route-metadata.ts missing ${route}`);
    const seg = route.slice(1);
    const layoutContent = readSrc(`src/app/${seg}/layout.tsx`);
    assert.match(
      layoutContent,
      new RegExp(`export const metadata:\\s*Metadata\\s*=\\s*getRouteMetadata\\("${route}"\\)`),
      `${seg}/layout.tsx must export getRouteMetadata("${route}")`
    );
  }
});
