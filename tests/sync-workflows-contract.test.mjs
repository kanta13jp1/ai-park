import assert from "node:assert/strict";
import fs from "node:fs";
import { builtinModules } from "node:module";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();
const builtinSet = new Set([
  ...builtinModules,
  ...builtinModules.map((mod) => (mod.startsWith("node:") ? mod : `node:${mod}`)),
]);

function extractImportSpecifiers(source) {
  const specifiers = [];
  const staticRe = /(?:^|\n)\s*import\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;
  const dynamicRe = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
  const requireRe = /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g;
  for (const re of [staticRe, dynamicRe, requireRe]) {
    let match;
    while ((match = re.exec(source)) !== null) {
      specifiers.push(match[1]);
    }
  }
  return specifiers;
}

const SYNC_TARGETS = [
  {
    workflow: ".github/workflows/sync-ai-news.yml",
    script: "scripts/sync-ai-news.mjs",
    group: "sync-ai-news",
  },
  {
    workflow: ".github/workflows/sync-gcp-usage.yml",
    script: "scripts/sync-gcp-usage.mjs",
    group: "sync-gcp-usage",
  },
];

test("Scheduled sync scripts depend only on Node.js built-in modules", () => {
  for (const { script } of SYNC_TARGETS) {
    const content = fs.readFileSync(path.join(rootDir, script), "utf8");
    const specifiers = extractImportSpecifiers(content);
    assert.ok(specifiers.length > 0, `${script} should have explicit built-in imports`);
    const nonBuiltin = specifiers.filter((spec) => !builtinSet.has(spec));
    assert.deepEqual(
      nonBuiltin,
      [],
      `${script} imported non-builtin modules (${nonBuiltin.join(", ")}); restore npm ci if external dependencies are added`
    );
  }
});

test("Scheduled sync workflows skip redundant npm ci/install and keep concurrency, timeout, and minimal permissions", () => {
  for (const { workflow, script, group } of SYNC_TARGETS) {
    const content = fs.readFileSync(path.join(rootDir, workflow), "utf8");

    assert.doesNotMatch(content, /\bnpm\s+(?:ci|install)\b/, `${workflow} should not run redundant npm ci/install`);
    assert.match(content, new RegExp(`node\\s+${script.replace(/\./g, "\\.")}`), `${workflow} must execute ${script}`);
    assert.match(content, /^concurrency:\s*$/m, `${workflow} must configure concurrency`);
    assert.match(content, new RegExp(`group:\\s*["']?${group}["']?`), `${workflow} must use concurrency group ${group}`);
    assert.match(content, /cancel-in-progress:\s*false/, `${workflow} must not cancel in-progress scheduled sync commits`);
    assert.match(content, /timeout-minutes:\s*\d+/, `${workflow} must set timeout-minutes`);
    assert.match(content, /^\s*schedule:\s*$/m, `${workflow} must keep schedule trigger`);
    assert.match(content, /^\s*workflow_dispatch:/m, `${workflow} must keep workflow_dispatch trigger`);
    assert.match(content, /\[skip ci\]/, `${workflow} must keep [skip ci] in automated commit message`);
    assert.match(content, /^\s*contents:\s*write\s*$/m, `${workflow} must keep contents: write permission`);
    assert.doesNotMatch(content, /^\s*pages:\s*write\s*$/m, `${workflow} must not request unused pages: write`);
    assert.doesNotMatch(content, /^\s*id-token:\s*write\s*$/m, `${workflow} must not request unused id-token: write`);
  }
});
