import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();

function readSrc(relPath) {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

function walkTsxFiles(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkTsxFiles(abs));
    else if (ent.name.endsWith(".tsx")) out.push(abs);
  }
  return out;
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
  for (const m of buttonMatches) {
    const attrs = extractOpeningTagAttrs(source, m.index, "<button".length);
    assert.match(
      attrs,
      /\btype="(button|submit)"/,
      `${fileLabel}: button missing explicit type="button|submit": <button${attrs.slice(0, 120)}>`
    );
  }
}

function assertAllFormControlsLabeled(source, fileLabel, selectorPattern = /<(input|select|textarea)\b/g) {
  const fieldMatches = [...source.matchAll(selectorPattern)];
  for (const m of fieldMatches) {
    const attrs = extractOpeningTagAttrs(source, m.index, m[0].length);
    if (/\btype="hidden"/.test(attrs)) continue;
    const hasAriaLabel = /\b(aria-label|aria-labelledby)=/.test(attrs);
    if (hasAriaLabel) continue;
    const staticIdMatch = attrs.match(/\bid="([^"]+)"/);
    if (staticIdMatch) {
      assert.ok(
        source.includes(`htmlFor="${staticIdMatch[1]}"`),
        `${fileLabel}: <${m[1]} id="${staticIdMatch[1]}"> missing matching <label htmlFor="${staticIdMatch[1]}">`
      );
      continue;
    }
    const exprIdMatch = attrs.match(/\bid=\{([^}]+)\}/);
    assert.ok(exprIdMatch, `${fileLabel}: <${m[1]}> missing id or aria-label: ${attrs.slice(0, 100)}`);
    assert.ok(
      source.includes(`htmlFor={${exprIdMatch[1]}}`),
      `${fileLabel}: <${m[1]} id={${exprIdMatch[1]}}> missing matching <label htmlFor={${exprIdMatch[1]}}>`
    );
  }
}

const TARGET_FILES = [
  "src/components/GuideStepCard.tsx",
  "src/components/GcpSetupGuide.tsx",
  "src/components/InteractivePromptLibrary.tsx",
  "src/app/page.tsx",
  "src/components/SiteOmnisearch.tsx",
  "src/components/PurposeJump.tsx",
  "src/components/BookingModal.tsx",
  "src/app/contact/page.tsx",
  "src/app/ambassadors/page.tsx",
  "src/app/interviews/page.tsx",
  "src/app/skills-hub/page.tsx",
  "src/app/gemini-stats/page.tsx",
];

test("site-wide invariant: every <button> has explicit type, every <input> is labeled, and only root layout renders <main>", () => {
  const allTsx = walkTsxFiles(path.join(rootDir, "src"));
  assert.ok(allTsx.length > 0);
  for (const abs of allTsx) {
    const rel = path.relative(rootDir, abs).replace(/\\/g, "/");
    const content = fs.readFileSync(abs, "utf8");
    assertAllButtonsExplicitType(content, rel);
    assertAllFormControlsLabeled(content, rel, /<(input)\b/g);
    const mainCount = [...content.matchAll(/<main\b/g)].length;
    if (rel === "src/app/layout.tsx") {
      assert.equal(mainCount, 1, "src/app/layout.tsx must render exactly one <main>");
    } else {
      assert.equal(mainCount, 0, `${rel} must not render nested <main>`);
    }
  }
});

test("all 12 final-sweep target files label all inputs, selects, and textareas", () => {
  for (const rel of TARGET_FILES) {
    assertAllFormControlsLabeled(readSrc(rel), rel);
  }
});

test("GuideStepCard defaults to h3 and GcpSetupGuide passes h4 under section h3 headings", () => {
  const card = readSrc("src/components/GuideStepCard.tsx");
  const gcp = readSrc("src/components/GcpSetupGuide.tsx");
  assert.ok(card.includes('headingLevel?: "h3" | "h4"'));
  assert.ok(card.includes('headingLevel = "h3"'));
  assert.ok(!card.includes("<h4"), "GuideStepCard should use dynamic HeadingTag instead of hardcoded <h4>");
  assert.equal([...gcp.matchAll(/headingLevel="h4"/g)].length, 2, "GcpSetupGuide should pass headingLevel='h4' for admin & user step cards");
});

test("InteractivePromptLibrary uses lg:flex-row header, nowrap pill badge, and nowrap preview copy button", () => {
  const src = readSrc("src/components/InteractivePromptLibrary.tsx");
  for (const token of ["lg:flex-row", "lg:items-center", "shrink-0 whitespace-nowrap"]) {
    assert.ok(src.includes(token), `InteractivePromptLibrary.tsx missing ${token}`);
  }
  assert.equal([...src.matchAll(/shrink-0 whitespace-nowrap/g)].length, 2);
});

test("GeminiStatsSyncStatus uses sequential h2 heading, faq aria-controls, lg:grid-cols-2, and motion-safe spin", () => {
  const src = readSrc("src/components/GeminiStatsSyncStatus.tsx");
  assert.equal([...src.matchAll(/<h3\b/g)].length, 0, "GeminiStatsSyncStatus should promote h3 to h2");
  for (const token of [
    "<h2",
    'aria-controls="gemini-stats-sync-faq-panel"',
    'id="gemini-stats-sync-faq-panel"',
    "lg:grid-cols-2",
    "motion-safe:animate-spin",
  ]) {
    assert.ok(src.includes(token), `GeminiStatsSyncStatus.tsx missing ${token}`);
  }
});

test("Home page (src/app/page.tsx) uses sequential h1->h2->h3 hierarchy and 768px-safe lg/xl grids", () => {
  const src = readSrc("src/app/page.tsx");
  assert.equal([...src.matchAll(/<h[456]\b/g)].length, 0, "src/app/page.tsx should not use h4/h5/h6");
  for (const token of ["lg:grid-cols-3", "lg:grid-cols-2", "xl:grid-cols-4", "motion-safe:animate-pulse"]) {
    assert.ok(src.includes(token), `src/app/page.tsx missing ${token}`);
  }
});

test("SiteOmnisearch associates label, exposes clear button aria-label, polite result live region, and h2->h3 headings", () => {
  const src = readSrc("src/components/SiteOmnisearch.tsx");
  assert.equal([...src.matchAll(/<h4\b/g)].length, 0, "SiteOmnisearch.tsx should not use h4");
  for (const token of [
    'htmlFor="site-omnisearch-input"',
    'id="site-omnisearch-input"',
    'aria-label="検索をクリア"',
    'role="status" aria-live="polite"',
    "lg:flex-row",
    "lg:grid-cols-2",
  ]) {
    assert.ok(src.includes(token), `SiteOmnisearch.tsx missing ${token}`);
  }
});

test("PurposeJump uses WAI-ARIA disclosure attributes, role='group', no headings inside buttons, and sequential headings", () => {
  const src = readSrc("src/components/PurposeJump.tsx");
  assert.equal([...src.matchAll(/<h[456]\b/g)].length, 0, "PurposeJump.tsx should not use h4/h5/h6");
  for (const token of [
    'role="group"',
    'aria-label="目的別カテゴリ選択"',
    "aria-expanded={isSelected}",
    'aria-controls={isSelected ? "purpose-jump-panel" : undefined}',
    'id="purpose-jump-panel"',
    "lg:grid-cols-3",
    "xl:grid-cols-3",
  ]) {
    assert.ok(src.includes(token), `PurposeJump.tsx missing ${token}`);
  }
});

test("BookingModal, contact, ambassadors, interviews, skills-hub, and gemini-stats enforce A11y and safe clipboard handling", () => {
  const booking = readSrc("src/components/BookingModal.tsx");
  assert.equal([...booking.matchAll(/<h4\b/g)].length, 0);
  assert.ok(booking.includes('id="booking-modal-title"'));
  assert.ok(booking.includes('aria-live="polite"'));

  const contact = readSrc("src/app/contact/page.tsx");
  assert.equal([...contact.matchAll(/<h4\b/g)].length, 0);
  for (const token of ['htmlFor="contact-faq-search"', 'id="contact-faq-search"', 'aria-live="polite"', "copySucceeded"]) {
    assert.ok(contact.includes(token), `contact/page.tsx missing ${token}`);
  }

  const ambassadors = readSrc("src/app/ambassadors/page.tsx");
  assert.equal([...ambassadors.matchAll(/<h4\b/g)].length, 0);
  for (const token of [
    'htmlFor="ambassadors-search-input"',
    'id="ambassadors-search-input"',
    'role="group"',
    "aria-pressed={selectedCategory === cat}",
    "lg:grid-cols-2 xl:grid-cols-3",
  ]) {
    assert.ok(ambassadors.includes(token), `ambassadors/page.tsx missing ${token}`);
  }

  const interviews = readSrc("src/app/interviews/page.tsx");
  assert.equal([...interviews.matchAll(/<h4\b/g)].length, 0);
  for (const token of [
    'htmlFor="interviews-search-input"',
    'id="interviews-search-input"',
    'role="group"',
    'aria-live="polite"',
    'handleCopyPrompt("sheet"',
    "lg:flex-row",
  ]) {
    assert.ok(interviews.includes(token), `interviews/page.tsx missing ${token}`);
  }

  const skillsHub = readSrc("src/app/skills-hub/page.tsx");
  assert.equal([...skillsHub.matchAll(/<h4\b/g)].length, 0);
  for (const token of [
    'role="group"',
    'aria-label="カテゴリで絞り込み"',
    'aria-live="polite"',
    "lg:grid-cols-3",
    "lg:flex-row lg:items-start lg:justify-between",
    "break-words",
  ]) {
    assert.ok(skillsHub.includes(token), `skills-hub/page.tsx missing ${token}`);
  }

  const geminiStats = readSrc("src/app/gemini-stats/page.tsx");
  assert.equal([...geminiStats.matchAll(/<h4\b/g)].length, 0);
  for (const token of [
    'role="group"',
    'aria-label="集計期間を選択"',
    'aria-pressed={period === "7d"}',
    'htmlFor="gemini-stats-user-search"',
    'id="gemini-stats-user-search"',
    "aria-expanded={isGcpDocOpen}",
    'aria-controls="gemini-stats-gcp-doc-panel"',
    'id="gemini-stats-gcp-doc-panel"',
    "URL.revokeObjectURL(url)",
    'aria-live="polite"',
    "motion-safe:animate-pulse",
  ]) {
    assert.ok(geminiStats.includes(token), `gemini-stats/page.tsx missing ${token}`);
  }
});
