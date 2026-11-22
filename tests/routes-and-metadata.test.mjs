import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();
const srcDir = path.join(rootDir, "src");
const appDir = path.join(srcDir, "app");

function walkFiles(dir, extFilter) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full, extFilter));
    } else if (extFilter(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

test("Every static route has metadata layout.tsx and dynamic routes export generateMetadata", () => {
  const pageFiles = walkFiles(appDir, (n) => n === "page.tsx");
  assert.ok(pageFiles.length >= 34);

  const missingMetadata = [];
  for (const pageFile of pageFiles) {
    const dir = path.dirname(pageFile);
    if (dir === appDir) {
      const rootLayout = fs.readFileSync(path.join(appDir, "layout.tsx"), "utf8");
      if (!/export const metadata\b/.test(rootLayout)) {
        missingMetadata.push("src/app/layout.tsx");
      }
      continue;
    }

    const isDynamic = dir.split(path.sep).some((seg) => seg.startsWith("[") && seg.endsWith("]"));
    if (isDynamic) {
      const pageContent = fs.readFileSync(pageFile, "utf8");
      if (!/export (async )?function generateMetadata\b/.test(pageContent)) {
        missingMetadata.push(path.relative(rootDir, pageFile));
      }
    } else {
      const segLayout = path.join(dir, "layout.tsx");
      const pageContent = fs.readFileSync(pageFile, "utf8");
      const hasLayoutMeta =
        fs.existsSync(segLayout) &&
        /export const metadata\b/.test(fs.readFileSync(segLayout, "utf8"));
      const hasPageMeta = /export const metadata\b/.test(pageContent);
      if (!hasLayoutMeta && !hasPageMeta) {
        missingMetadata.push(path.relative(rootDir, pageFile));
      }
    }
  }

  assert.deepEqual(missingMetadata, [], `Routes missing metadata: ${missingMetadata.join(", ")}`);
  assert.ok(fs.existsSync(path.join(appDir, "error.tsx")), "src/app/error.tsx must exist");
  assert.ok(fs.existsSync(path.join(appDir, "not-found.tsx")), "src/app/not-found.tsx must exist");
});

test("All internal navigation hrefs and hash anchors resolve to existing pages and IDs", () => {
  const navFiles = [
    "src/data/navigation.ts",
    "src/data/feature-status.ts",
    "src/components/SiteOmnisearch.tsx",
    "src/components/CommandPalette.tsx",
    "src/components/PurposeJump.tsx",
    "src/components/Footer.tsx",
    "src/app/how-to/page.tsx",
    "src/app/agent-tools/page.tsx",
  ];

  const allComponentContent = walkFiles(path.join(srcDir, "components"), (n) =>
    n.endsWith(".tsx")
  )
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("\n");

  const hrefs = new Set();
  for (const rel of navFiles) {
    const txt = fs.readFileSync(path.join(rootDir, rel), "utf8");
    for (const m of txt.matchAll(/href:\s*["'](\/[^"']*)["']/g)) hrefs.add(m[1]);
    for (const m of txt.matchAll(/href=["'](\/[^"']*)["']/g)) hrefs.add(m[1]);
  }

  for (const rawHref of hrefs) {
    const [routePath, hash] = rawHref.split("#");
    const pagePath =
      routePath === "/"
        ? path.join(appDir, "page.tsx")
        : path.join(appDir, routePath.slice(1), "page.tsx");

    assert.ok(fs.existsSync(pagePath), `Broken internal href "${rawHref}" (${pagePath} missing)`);

    if (hash) {
      const pageContent = fs.readFileSync(pagePath, "utf8");
      const idPattern = new RegExp(`id=["']${hash}["']`);
      const foundInPage = idPattern.test(pageContent);
      const foundInComponents = idPattern.test(allComponentContent);
      assert.ok(
        foundInPage || foundInComponents,
        `Broken hash anchor "${rawHref}": id="${hash}" not found`
      );
    }
  }
});

test('All <a target="_blank"> tags specify rel="noopener noreferrer"', () => {
  const tsxFiles = walkFiles(srcDir, (n) => n.endsWith(".tsx"));
  const violations = [];

  for (const file of tsxFiles) {
    const txt = fs.readFileSync(file, "utf8");
    for (const m of txt.matchAll(/<a\b[^>]*\btarget=["']_blank["'][^>]*>/gs)) {
      const tag = m[0];
      if (!/\brel=["'][^"']*noopener[^"']*["']/.test(tag)) {
        violations.push(`${path.relative(rootDir, file)}: ${tag.slice(0, 80)}`);
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found target="_blank" without rel="noopener":\n${violations.join("\n")}`
  );
});

test("GitHub Actions deploy workflow does not override next.config.ts via configure-pages", () => {
  const workflowPath = path.join(rootDir, ".github", "workflows", "deploy.yml");
  const workflowContent = fs.readFileSync(workflowPath, "utf8");
  assert.doesNotMatch(
    workflowContent,
    /static_site_generator:\s*next/,
    "actions/configure-pages@v5 with static_site_generator: next overwrites next.config.ts"
  );
});

test("All modal components implement dialog ARIA role and aria-modal", () => {
  const modalFiles = [
    "src/components/CommandPalette.tsx",
    "src/components/BookingModal.tsx",
    "src/components/KeyboardShortcutsModal.tsx",
    "src/components/skills/SkillApplicationModal.tsx",
    "src/components/interviews/InterviewCandidateModal.tsx",
    "src/components/tools/ToolApplicationDraftModal.tsx",
    "src/components/tools/ToolApplicationModal.tsx",
    "src/app/feedback-todo/page.tsx",
    "src/app/ambassadors/page.tsx",
    "src/app/interviews/page.tsx",
    "src/app/tools/page.tsx",
  ];

  const missingDialogAria = [];
  for (const rel of modalFiles) {
    const content = fs.readFileSync(path.join(rootDir, rel), "utf8");
    const hasRole = /role=["']dialog["']/.test(content);
    const hasModal = /aria-modal=["']true["']/.test(content);
    if (!hasRole || !hasModal) {
      missingDialogAria.push(rel);
    }
  }

  assert.deepEqual(
    missingDialogAria,
    [],
    `Modal components missing role="dialog" or aria-modal="true": ${missingDialogAria.join(", ")}`
  );
});

test("Multi-tab pages implement WAI-ARIA APG tablist, tab, aria-selected, and tabpanel roles", () => {
  const tabPages = [
    "src/app/mcp-hub/page.tsx",
    "src/app/antigravity-info/page.tsx",
    "src/app/agent-cases/page.tsx",
    "src/app/skills-hub/page.tsx",
  ];

  const missingTabAria = [];
  for (const rel of tabPages) {
    const content = fs.readFileSync(path.join(rootDir, rel), "utf8");
    const ok =
      /role=["']tablist["']/.test(content) &&
      /role=["']tab["']/.test(content) &&
      /aria-selected=/.test(content) &&
      /role=["']tabpanel["']/.test(content);
    if (!ok) {
      missingTabAria.push(rel);
    }
  }

  assert.deepEqual(
    missingTabAria,
    [],
    `Pages missing WAI-ARIA APG tab attributes: ${missingTabAria.join(", ")}`
  );
});

test("All HTML tables declare responsive min-w width classes", () => {
  const tsxFiles = walkFiles(srcDir, (n) => n.endsWith(".tsx"));
  const violations = [];

  for (const file of tsxFiles) {
    const txt = fs.readFileSync(file, "utf8");
    for (const m of txt.matchAll(/<table\b([^>]*)>/g)) {
      const attrs = m[1];
      if (!/min-w-\[(?:[6-9]\d{2}|[1-9]\d{3})px\]/.test(attrs)) {
        violations.push(`${path.relative(rootDir, file)}: <table${attrs}>`);
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Tables missing min-w-[600px+] class:\n${violations.join("\n")}`
  );
});

test("No input/textarea placeholder contains fictional full names or internal domain email", () => {
  const tsxFiles = walkFiles(srcDir, (n) => n.endsWith(".tsx"));
  const forbidden = /(?:佐々木\s*拓也|佐藤\s*花子|山田\s*太郎|@ml-mightylink\.com)/;
  const violations = [];

  for (const file of tsxFiles) {
    const txt = fs.readFileSync(file, "utf8");
    for (const m of txt.matchAll(/placeholder=["']([^"']*)["']/g)) {
      if (forbidden.test(m[1])) {
        violations.push(`${path.relative(rootDir, file)}: placeholder="${m[1]}"`);
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found fictional or domain placeholder:\n${violations.join("\n")}`
  );
});
