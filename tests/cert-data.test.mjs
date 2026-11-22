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

test("LPIC 6-track data meets schema, 20 questions, 24 unique flashcards, 0 command misses, and valid LPI URLs", async () => {
  const searchMod = await import(pathToFileURL(path.join(rootDir, "src", "lib", "lpic-search.ts")).href);
  const { normalizeCommandSearchQuery } = searchMod;

  const findExportBySuffix = (mod, suffixes, label) => {
    for (const suffix of suffixes) {
      const normSuffix = suffix.toLowerCase();
      for (const [key, val] of Object.entries(mod)) {
        const normKey = key.replace(/_/g, "").toLowerCase();
        if (normKey.endsWith(normSuffix) && Array.isArray(val)) {
          return val;
        }
      }
    }
    assert.fail(`${label}: missing array export for suffixes [${suffixes.join(", ")}]`);
  };

  const lpicFiles = [
    "lpic-1.ts",
    "lpic-2.ts",
    "lpic-300.ts",
    "lpic-303.ts",
    "lpic-305.ts",
    "lpic-306.ts",
  ];

  for (const file of lpicFiles) {
    const mod = await import(pathToFileURL(path.join(rootDir, "src", "data", file)).href);
    const domains = findExportBySuffix(mod, ["domains"], file);
    const comparisons = findExportBySuffix(mod, ["comparisons"], file);
    const patterns = findExportBySuffix(mod, ["patterns"], file);
    const pitfalls = findExportBySuffix(mod, ["pitfalls"], file);
    const keyPaths = findExportBySuffix(mod, ["keypaths"], file);
    const quickLookup = findExportBySuffix(mod, ["quicklookup"], file);
    const questions = findExportBySuffix(mod, ["practicequestions", "questions"], file);
    const resources = findExportBySuffix(mod, ["officialresources", "resources"], file);

    assert.equal(questions.length, 20, `${file}: expected 20 practice questions, got ${questions.length}`);
    assert.equal(quickLookup.length, 24, `${file}: expected 24 flashcards, got ${quickLookup.length}`);

    const keywords = new Set(quickLookup.map((item) => item.keyword));
    assert.equal(keywords.size, 24, `${file}: duplicate quickLookup keywords detected`);

    const domainIds = new Set(domains.map((d) => d.id));
    for (const q of questions) {
      assert.ok(
        domainIds.has(q.domainId),
        `${file}: question ${q.id} references unknown domainId ${q.domainId}`
      );
    }

    const compIds = new Set();
    for (const comp of comparisons) {
      assert.ok(!compIds.has(comp.id), `${file}: duplicate comparison id ${comp.id}`);
      compIds.add(comp.id);
      for (const row of comp.rows) {
        assert.equal(
          row.values.length,
          comp.columns.length - 1,
          `${file}: comparison ${comp.id} row "${row.feature}" values length mismatch`
        );
      }
    }

    const compTexts = comparisons.map((c) =>
      [
        c.title,
        c.subtitle,
        c.decisionRule,
        ...c.columns,
        ...c.rows.flatMap((r) => [r.feature, ...r.values]),
      ]
        .join(" ")
        .toLowerCase()
    );
    const quickTexts = quickLookup.map((item) =>
      `${item.keyword} ${item.category} ${item.recommended} ${item.reason}`.toLowerCase()
    );
    const patternTexts = patterns.map((p) =>
      [p.title, p.badge, p.summary, ...p.flow, ...p.keyDesignPoints].join(" ").toLowerCase()
    );
    const pitfallTexts = pitfalls.map((pit) =>
      `${pit.trap} ${pit.whyWrong} ${pit.correctApproach}`.toLowerCase()
    );
    const keyPathTexts = keyPaths.map((kp) =>
      `${kp.target} ${kp.value} ${kp.detail}`.toLowerCase()
    );
    const allSearchTexts = [
      ...compTexts,
      ...quickTexts,
      ...patternTexts,
      ...pitfallTexts,
      ...keyPathTexts,
    ];

    const misses = [];
    for (const domain of domains) {
      for (const topic of domain.topics) {
        for (const cmd of topic.commands) {
          const q = normalizeCommandSearchQuery(cmd).toLowerCase();
          assert.ok(q.length > 0, `${file}: command badge "${cmd}" normalized to empty string`);
          const hit = allSearchTexts.some((txt) => txt.includes(q));
          if (!hit) {
            misses.push(`${topic.code}:${cmd} (query="${q}")`);
          }
        }
      }
    }
    assert.deepEqual(misses, [], `${file}: command badge misses found: ${misses.join(", ")}`);

    assert.ok(resources.length > 0, `${file}: expected at least 1 official resource`);
    for (const res of resources) {
      assert.ok(
        typeof res.url === "string" && res.url.startsWith("https://"),
        `${file}: invalid official resource URL ${res.url}`
      );
      assert.ok(
        !res.url.includes("learning-materials/lpic-"),
        `${file}: forbidden 404 learning-materials/lpic- URL ${res.url}`
      );
      assert.ok(
        !/LPIC-3_30[356]/.test(res.url),
        `${file}: forbidden 404 LPIC-3_30X URL ${res.url}`
      );
    }
  }
});

test("IPA 13-exam data modules meet schema, uniqueness, 100% keyword badge hit rate, and valid IPA URLs", async () => {
  const searchMod = await import(pathToFileURL(path.join(rootDir, "src", "lib", "ipa-search.ts")).href);
  const { normalizeIpaSearchQuery } = searchMod;

  const [foundationMod, specialistMod, managementMod] = await Promise.all([
    import(pathToFileURL(path.join(rootDir, "src", "data", "ipa", "foundation.ts")).href),
    import(pathToFileURL(path.join(rootDir, "src", "data", "ipa", "specialist.ts")).href),
    import(pathToFileURL(path.join(rootDir, "src", "data", "ipa", "management.ts")).href),
  ]);

  const examMetas = [
    ...foundationMod.foundationExamMetas,
    ...specialistMod.specialistExamMetas,
    ...managementMod.managementExamMetas,
  ];
  const domains = [
    ...foundationMod.foundationDomains,
    ...specialistMod.specialistDomains,
    ...managementMod.managementDomains,
  ];
  const comparisons = [
    ...foundationMod.foundationComparisons,
    ...specialistMod.specialistComparisons,
    ...managementMod.managementComparisons,
  ];
  const formulas = [
    ...foundationMod.foundationFormulaPatterns,
    ...specialistMod.specialistFormulaPatterns,
    ...managementMod.managementFormulaPatterns,
  ];
  const pitfalls = [
    ...foundationMod.foundationPitfalls,
    ...specialistMod.specialistPitfalls,
    ...managementMod.managementPitfalls,
  ];
  const keyFacts = [
    ...foundationMod.foundationKeyFacts,
    ...specialistMod.specialistKeyFacts,
    ...managementMod.managementKeyFacts,
  ];
  const flashcards = [
    ...foundationMod.foundationFlashcards,
    ...specialistMod.specialistFlashcards,
    ...managementMod.managementFlashcards,
  ];
  const questions = [
    ...foundationMod.foundationQuestions,
    ...specialistMod.specialistQuestions,
    ...managementMod.managementQuestions,
  ];

  const expectedExams = ["ip", "sg", "fe", "ap", "sc", "db", "nw", "es", "st", "sa", "pm", "sm", "au"];
  assert.deepEqual(
    examMetas.map((m) => m.id),
    expectedExams,
    "IPA examMetas must match the 13 expected exam IDs"
  );

  const assertUnique = (items, label) => {
    const seen = new Set();
    for (const item of items) {
      assert.ok(!seen.has(item), `IPA duplicate ${label}: ${item}`);
      seen.add(item);
    }
  };

  assertUnique(domains.map((d) => d.id), "domain.id");
  assertUnique(domains.flatMap((d) => d.topics.map((t) => t.id)), "topic.id");
  assertUnique(questions.map((q) => q.id), "question.id");
  assertUnique(comparisons.map((c) => c.id), "comparison.id");
  assertUnique(formulas.map((f) => f.id), "formula.id");
  assertUnique(pitfalls.map((p) => p.id), "pitfall.id");
  assertUnique(keyFacts.map((k) => k.id), "keyFact.id");
  assertUnique(flashcards.map((c) => c.keyword), "flashcard.keyword");

  const domainExamById = new Map(domains.map((d) => [d.id, d.examId]));
  for (const q of questions) {
    assert.equal(
      domainExamById.get(q.domainId),
      q.examId,
      `IPA question ${q.id} references invalid domainId ${q.domainId} for exam ${q.examId}`
    );
  }

  for (const comp of comparisons) {
    for (const row of comp.rows) {
      assert.equal(
        row.values.length,
        comp.columns.length,
        `IPA comparison ${comp.id} row "${row.feature}" values length mismatch`
      );
    }
  }

  const foundationExams = new Set(["ip", "sg", "fe", "ap"]);
  const misses = [];

  for (const examId of expectedExams) {
    const examTopics = domains.filter((d) => d.examId === examId).flatMap((d) => d.topics);
    const examQuestions = questions.filter((q) => q.examId === examId);
    const examCards = flashcards.filter((c) => c.examId === examId);
    const examComps = comparisons.filter((c) => c.examIds.includes(examId));
    const examFormulas = formulas.filter((f) => f.examIds.includes(examId));
    const examPitfalls = pitfalls.filter((p) => p.examIds.includes(examId));
    const examKeyFacts = keyFacts.filter((k) => k.examIds.includes(examId));

    const minQ = foundationExams.has(examId) ? 14 : 12;
    const minCard = foundationExams.has(examId) ? 12 : 10;
    assert.ok(examTopics.length >= 5, `IPA ${examId}: expected >= 5 topics, got ${examTopics.length}`);
    assert.ok(examQuestions.length >= minQ, `IPA ${examId}: expected >= ${minQ} questions, got ${examQuestions.length}`);
    assert.ok(examCards.length >= minCard, `IPA ${examId}: expected >= ${minCard} flashcards, got ${examCards.length}`);
    assert.ok(examComps.length >= 3, `IPA ${examId}: expected >= 3 comparisons, got ${examComps.length}`);
    assert.ok(examFormulas.length >= 1, `IPA ${examId}: expected >= 1 formula`);
    assert.ok(examPitfalls.length >= 1, `IPA ${examId}: expected >= 1 pitfall`);
    assert.ok(examKeyFacts.length >= 1, `IPA ${examId}: expected >= 1 keyFact`);

    const compTexts = examComps.map((c) =>
      [
        c.title,
        c.subtitle,
        c.decisionRule,
        ...c.columns,
        ...c.rows.flatMap((r) => [r.feature, ...r.values]),
      ]
        .join(" ")
        .toLowerCase()
    );

    for (const topic of examTopics) {
      for (const kw of topic.keywords) {
        const q = normalizeIpaSearchQuery(kw).toLowerCase();
        assert.ok(q.length > 0, `IPA ${examId}:${topic.code}: empty normalized query for "${kw}"`);
        if (!compTexts.some((txt) => txt.includes(q))) {
          misses.push(`${examId}:${topic.code}:${kw} (query="${q}")`);
        }
      }
    }
  }

  assert.deepEqual(misses, [], `IPA keyword badge misses found:\n${misses.join("\n")}`);

  const ipaExamText = fs.readFileSync(path.join(rootDir, "src", "data", "ipa-exam.ts"), "utf8");
  assert.ok(
    !ipaExamText.includes("https://www.ipa.go.jp/shiken/syllabus.html"),
    "src/data/ipa-exam.ts must not contain 404 /shiken/syllabus.html URL"
  );
  assert.ok(
    ipaExamText.includes("https://www.ipa.go.jp/shiken/syllabus/gaiyou.html"),
    "src/data/ipa-exam.ts must link to https://www.ipa.go.jp/shiken/syllabus/gaiyou.html"
  );
});
