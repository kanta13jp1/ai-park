import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();

test("normalizeGcpSearchQuery normalizes GCP service badges cleanly", async () => {
  const gcpSearchPath = path.join(rootDir, "src", "lib", "gcp-search.ts");
  const { normalizeGcpSearchQuery } = await import(pathToFileURL(gcpSearchPath).href);

  assert.equal(normalizeGcpSearchQuery("BigQuery"), "BigQuery");
  assert.equal(normalizeGcpSearchQuery("確約利用割引 (CUD)"), "確約利用割引");
  assert.equal(normalizeGcpSearchQuery("Cloud KMS（CMEK）"), "Cloud KMS");
  assert.equal(normalizeGcpSearchQuery("SLA / SLO / SLI"), "SLA");
  assert.equal(normalizeGcpSearchQuery("Cloud Build / Deploy"), "Cloud Build");
});

test("GCP 11 certification datasets maintain 100% badge/chip hit rate, official URL hygiene, and factual consistency", async () => {
  const [{ normalizeGcpSearchQuery }, { GCP_CERT_IDS, GCP_CERT_META }] = await Promise.all([
    import(pathToFileURL(path.join(rootDir, "src", "lib", "gcp-search.ts")).href),
    import(pathToFileURL(path.join(rootDir, "src", "components", "gcp", "gcpCertMeta.ts")).href),
  ]);

  assert.equal(GCP_CERT_IDS.length, 11, "Expected 11 GCP certifications");

  const findExportBySuffix = (mod, suffix, label) => {
    const normSuffix = suffix.toLowerCase();
    for (const [key, val] of Object.entries(mod)) {
      if (key.toLowerCase().endsWith(normSuffix) && Array.isArray(val)) {
        return val;
      }
    }
    assert.fail(`${label}: missing array export ending with ${suffix}`);
  };

  for (const certId of GCP_CERT_IDS) {
    const file = `gcp-${certId}.ts`;
    const meta = GCP_CERT_META[certId];
    assert.ok(meta, `Missing metadata in GCP_CERT_META for ${certId}`);

    const mod = await import(pathToFileURL(path.join(rootDir, "src", "data", file)).href);
    const examFacts = findExportBySuffix(mod, "ExamFacts", file);
    const domains = findExportBySuffix(mod, "Domains", file);
    const comparisons = findExportBySuffix(mod, "Comparisons", file);
    const patterns = findExportBySuffix(mod, "Patterns", file);
    const pitfalls = findExportBySuffix(mod, "Pitfalls", file);
    const keyFacts = findExportBySuffix(mod, "KeyFacts", file);
    const quickLookup = findExportBySuffix(mod, "QuickLookup", file);
    const questions = findExportBySuffix(mod, "PracticeQuestions", file);
    const resources = findExportBySuffix(mod, "OfficialResources", file);

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

    const allSearchTexts = [
      ...comparisons.map((c) =>
        [
          c.title,
          c.subtitle,
          c.decisionRule,
          ...c.columns,
          ...c.rows.flatMap((r) => [r.feature, ...r.values]),
        ]
          .join(" ")
          .toLowerCase()
      ),
      ...quickLookup.map((item) =>
        `${item.keyword} ${item.category} ${item.recommended} ${item.reason}`.toLowerCase()
      ),
      ...patterns.map((p) =>
        [p.title, p.badge, p.summary, ...p.flow, ...p.keyDesignPoints].join(" ").toLowerCase()
      ),
      ...pitfalls.map((pit) => `${pit.trap} ${pit.whyWrong} ${pit.correctApproach}`.toLowerCase()),
      ...keyFacts.map((kf) => `${kf.target} ${kf.value} ${kf.detail}`.toLowerCase()),
    ];

    const badgeMisses = [];
    for (const domain of domains) {
      for (const topic of domain.topics) {
        for (const svc of topic.services) {
          const q = normalizeGcpSearchQuery(svc).toLowerCase();
          assert.ok(q.length > 0, `${file}: service badge "${svc}" normalized to empty`);
          if (!allSearchTexts.some((txt) => txt.includes(q))) {
            badgeMisses.push(`${topic.code}:${svc} (query="${q}")`);
          }
        }
      }
    }
    assert.deepEqual(badgeMisses, [], `${file}: service badge misses: ${badgeMisses.join(", ")}`);

    const chipMisses = [];
    for (const chip of meta.quickSearchChips) {
      const q = chip.trim().toLowerCase();
      if (!allSearchTexts.some((txt) => txt.includes(q))) {
        chipMisses.push(chip);
      }
    }
    assert.deepEqual(chipMisses, [], `${certId}: quickSearchChips misses: ${chipMisses.join(", ")}`);

    assert.ok(resources.length > 0, `${file}: expected at least 1 official resource`);
    const seenUrls = new Set();
    for (const res of resources) {
      assert.ok(
        typeof res.url === "string" && res.url.startsWith("https://"),
        `${file}: invalid official resource URL ${res.url}`
      );
      assert.ok(!seenUrls.has(res.url), `${file}: duplicate official resource URL ${res.url}`);
      seenUrls.add(res.url);
      assert.ok(
        !/(cloudskillsboost\.google|skills\.google\/paths\/)/.test(res.url),
        `${file}: forbidden 403 training path URL ${res.url}`
      );
      assert.ok(
        !/\/learn\/certification\/guides\/(?:cloud-(?:devops|network|security)-engineer|machine-learning-engineer)/.test(
          res.url
        ),
        `${file}: forbidden redirecting /guides/ URL ${res.url}`
      );
    }

    const factsText = JSON.stringify(examFacts);
    assert.ok(!/Webassessor/i.test(factsText), `${file}: stale Webassessor reference in examFacts`);
    assert.ok(!/70%前後/.test(factsText), `${file}: ungrounded 70% estimate in examFacts`);

    if (certId === "ace") {
      const validity = examFacts.find((f) => f.label === "有効期限");
      assert.equal(validity?.value, "3 年間", "ACE validity must be 3 年間");
      assert.ok(meta.examDayChecklist.subtitle.includes("有効期限 3 年"), "ACE checklist validity mismatch");
    }
    if (certId === "pca") {
      const count = examFacts.find((f) => f.label === "問題数");
      assert.equal(count?.value, "50〜60 問", "PCA question count must be 50〜60 問");
      assert.ok(meta.examDayChecklist.subtitle.includes("50〜60 問"), "PCA checklist question count mismatch");
    }
    if (certId === "pde") {
      const count = examFacts.find((f) => f.label === "問題数");
      assert.equal(count?.value, "40〜50 問", "PDE question count must be 40〜50 問");
      assert.ok(meta.examDayChecklist.subtitle.includes("40〜50 問"), "PDE checklist question count mismatch");
    }
  }
});
