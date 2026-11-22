import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();

function getCertDataFiles() {
  const dataDir = path.join(rootDir, "src", "data");
  const ipaDir = path.join(dataDir, "ipa");

  const rootFiles = fs
    .readdirSync(dataDir)
    .filter((f) => /^(aws|azure|gcp|lpic)-.*\.ts$/.test(f) && !f.endsWith("-types.ts"))
    .map((f) => path.join(dataDir, f));

  const ipaFiles = fs
    .readdirSync(ipaDir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => path.join(ipaDir, f));

  return [...rootFiles, ...ipaFiles].sort();
}

test("All certification question banks have valid IDs, options, selectCount, and in-bounds correctIndices", async () => {
  const files = getCertDataFiles();
  assert.equal(files.length, 34, `Expected 34 certification data files, got ${files.length}`);

  let totalQuestions = 0;
  let totalCards = 0;

  for (const filePath of files) {
    const rel = path.relative(rootDir, filePath).replace(/\\/g, "/");
    const mod = await import(pathToFileURL(filePath).href);

    const questionKeys = Object.keys(mod).filter(
      (k) => Array.isArray(mod[k]) && mod[k].length > 0 && "options" in mod[k][0]
    );
    const cardKeys = Object.keys(mod).filter(
      (k) => Array.isArray(mod[k]) && mod[k].length > 0 && "keyword" in mod[k][0]
    );

    assert.ok(questionKeys.length > 0, `${rel}: missing question array export`);
    assert.ok(cardKeys.length > 0, `${rel}: missing flashcard array export`);

    for (const qKey of questionKeys) {
      const seenIds = new Set();
      for (const q of mod[qKey]) {
        totalQuestions++;
        assert.ok(typeof q.id === "string" && q.id.trim().length > 0, `${rel}:${qKey}: empty id`);
        assert.ok(!seenIds.has(q.id), `${rel}:${qKey}: duplicate question id "${q.id}"`);
        seenIds.add(q.id);

        assert.ok(
          typeof q.question === "string" && q.question.trim().length > 0,
          `${rel}:${qKey}:${q.id}: empty question text`
        );
        assert.ok(
          typeof q.explanation === "string" && q.explanation.trim().length > 0,
          `${rel}:${qKey}:${q.id}: empty explanation`
        );
        assert.ok(
          Array.isArray(q.options) && q.options.length >= 2,
          `${rel}:${qKey}:${q.id}: options must have at least 2 items`
        );
        for (const opt of q.options) {
          assert.ok(
            typeof opt === "string" && opt.trim().length > 0,
            `${rel}:${qKey}:${q.id}: empty option string`
          );
        }

        const expectedSelect = q.selectCount ?? 1;
        assert.ok(
          Number.isInteger(expectedSelect) && expectedSelect >= 1,
          `${rel}:${qKey}:${q.id}: invalid selectCount (${q.selectCount})`
        );
        assert.ok(
          Array.isArray(q.correctIndices) && q.correctIndices.length === expectedSelect,
          `${rel}:${qKey}:${q.id}: correctIndices length mismatch (expected ${expectedSelect}, got ${q.correctIndices?.length})`
        );

        const uniqueIdx = new Set(q.correctIndices);
        assert.equal(
          uniqueIdx.size,
          q.correctIndices.length,
          `${rel}:${qKey}:${q.id}: duplicate index in correctIndices`
        );
        for (const idx of q.correctIndices) {
          assert.ok(
            Number.isInteger(idx) && idx >= 0 && idx < q.options.length,
            `${rel}:${qKey}:${q.id}: correctIndex ${idx} out of range [0..${q.options.length - 1}]`
          );
        }
      }
    }

    for (const cKey of cardKeys) {
      for (const card of mod[cKey]) {
        totalCards++;
        assert.ok(
          typeof card.keyword === "string" && card.keyword.trim().length > 0,
          `${rel}:${cKey}: empty card keyword`
        );
        assert.ok(
          typeof card.recommended === "string" && card.recommended.trim().length > 0,
          `${rel}:${cKey}:${card.keyword}: empty recommended value`
        );
        assert.ok(
          typeof card.reason === "string" && card.reason.trim().length > 0,
          `${rel}:${cKey}:${card.keyword}: empty reason`
        );
      }
    }
  }

  assert.ok(totalQuestions >= 700, `Unexpectedly low question count: ${totalQuestions}`);
  assert.ok(totalCards >= 700, `Unexpectedly low flashcard count: ${totalCards}`);
});

test("All mcp_config.json starter templates are valid JSON without real secrets", async () => {
  const mcpHubPath = path.join(rootDir, "src", "data", "mcp-hub.ts");
  const mod = await import(pathToFileURL(mcpHubPath).href);
  assert.ok(Array.isArray(mod.MCP_CONFIG_TEMPLATES) && mod.MCP_CONFIG_TEMPLATES.length >= 3);

  for (const tpl of mod.MCP_CONFIG_TEMPLATES) {
    assert.ok(typeof tpl.configJson === "string" && tpl.configJson.trim().length > 0);
    const parsed = JSON.parse(tpl.configJson);
    assert.ok(parsed && typeof parsed === "object" && "mcpServers" in parsed);
  }
});
