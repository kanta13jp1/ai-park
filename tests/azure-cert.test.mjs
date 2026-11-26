import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { normalizeAzureSearchQuery } from "../src/lib/azure-search.ts";
import { AZURE_CERT_IDS, AZURE_CERT_META } from "../src/components/azure/azureCertMeta.ts";

const repoRoot = process.cwd();

function buildSearchHaystacks(mod, id) {
  const comparisons = mod[`${id}Comparisons`];
  const quickLookup = mod[`${id}QuickLookup`];
  const patterns = mod[`${id}Patterns`];
  const pitfalls = mod[`${id}Pitfalls`];
  const keyFacts = mod[`${id}KeyFacts`];

  const haystacks = [
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
      [item.keyword, item.category, item.recommended, item.reason]
        .join(" ")
        .toLowerCase()
    ),
    ...patterns.map((p) =>
      [p.title, p.badge, p.summary, ...p.flow, ...p.keyDesignPoints]
        .join(" ")
        .toLowerCase()
    ),
    ...pitfalls.map((p) =>
      [p.trap, p.whyWrong, p.correctApproach].join(" ").toLowerCase()
    ),
    ...keyFacts.map((k) =>
      [k.target, k.value, k.detail].join(" ").toLowerCase()
    ),
  ];

  return haystacks;
}

test("normalizeAzureSearchQuery は括弧・スラッシュ注記を除去して検索語を正規化する", () => {
  assert.equal(
    normalizeAzureSearchQuery("Azure Key Vault（シークレット・鍵・証明書統合管理）"),
    "Azure Key Vault"
  );
  assert.equal(
    normalizeAzureSearchQuery("Azure Functions (Serverless / Durable Functions)"),
    "Azure Functions"
  );
  assert.equal(
    normalizeAzureSearchQuery("Microsoft Entra ID / Conditional Access"),
    "Microsoft Entra ID"
  );
  assert.equal(normalizeAzureSearchQuery("  Azure Cosmos DB  "), "Azure Cosmos DB");
});

test("Azure 全8資格のデータ整合性・URL妥当性・バッジ/チップ100%ヒット・後継資格注記", async () => {
  for (const id of AZURE_CERT_IDS) {
    const fileUrl = pathToFileURL(
      path.join(repoRoot, "src", "data", `azure-${id}.ts`)
    ).href;
    const mod = await import(fileUrl);

    const examFacts = mod[`${id}ExamFacts`];
    const domains = mod[`${id}Domains`];
    const comparisons = mod[`${id}Comparisons`];
    const patterns = mod[`${id}Patterns`];
    const pitfalls = mod[`${id}Pitfalls`];
    const keyFacts = mod[`${id}KeyFacts`];
    const quickLookup = mod[`${id}QuickLookup`];
    const questions = mod[`${id}PracticeQuestions`];
    const officialResources = mod[`${id}OfficialResources`];

    assert.equal(examFacts.length, 6, `${id}: examFacts は 6 項目`);
    assert.ok(
      examFacts.some((f) => String(f.value).includes("700 / 1000")),
      `${id}: examFacts に合格スコア 700 / 1000 を含むこと`
    );

    assert.ok(domains.length > 0, `${id}: domains が空でないこと`);
    const domainIds = new Set();
    const topicIds = new Set();
    for (const d of domains) {
      assert.ok(!domainIds.has(d.id), `${id}: 重複 domain.id (${d.id})`);
      domainIds.add(d.id);
      assert.ok(d.topics.length > 0, `${id}: ${d.id} に topics が存在すること`);
      for (const t of d.topics) {
        assert.ok(!topicIds.has(t.id), `${id}: 重複 topic.id (${t.id})`);
        topicIds.add(t.id);
        assert.ok(t.services.length > 0, `${id}: ${t.id} に services が存在すること`);
      }
    }

    assert.equal(questions.length, 20, `${id}: practiceQuestions は 20 問`);
    const questionIds = new Set();
    for (const q of questions) {
      assert.ok(!questionIds.has(q.id), `${id}: 重複 question.id (${q.id})`);
      questionIds.add(q.id);
      assert.ok(
        domainIds.has(q.domainId),
        `${id}: ${q.id} の domainId (${q.domainId}) が存在すること`
      );
      assert.ok(
        q.selectCount === 1 || q.selectCount === 2,
        `${id}: ${q.id} の selectCount が 1 または 2 であること`
      );
      assert.equal(
        q.correctIndices.length,
        q.selectCount,
        `${id}: ${q.id} の correctIndices 数が selectCount と一致すること`
      );
      const uniqueIndices = new Set(q.correctIndices);
      assert.equal(
        uniqueIndices.size,
        q.correctIndices.length,
        `${id}: ${q.id} の correctIndices が一意であること`
      );
      for (const idx of q.correctIndices) {
        assert.ok(
          Number.isInteger(idx) && idx >= 0 && idx < q.options.length,
          `${id}: ${q.id} の correctIndex (${idx}) が選択肢範囲内であること`
        );
      }
    }

    assert.equal(quickLookup.length, 24, `${id}: quickLookup は 24 枚`);
    const lookupKeywords = new Set(quickLookup.map((item) => item.keyword));
    assert.equal(
      lookupKeywords.size,
      quickLookup.length,
      `${id}: quickLookup.keyword が一意であること`
    );

    assert.ok(comparisons.length > 0, `${id}: comparisons が空でないこと`);
    const compIds = new Set();
    for (const comp of comparisons) {
      assert.ok(!compIds.has(comp.id), `${id}: 重複 comp.id (${comp.id})`);
      compIds.add(comp.id);
      assert.ok(comp.columns.length >= 2, `${id}: ${comp.id} の列数`);
      for (const row of comp.rows) {
        assert.equal(
          row.values.length,
          comp.columns.length - 1,
          `${id}: ${comp.id} 行「${row.feature}」の値列数がヘッダと一致すること`
        );
      }
    }

    assert.ok(patterns.length > 0, `${id}: patterns が空でないこと`);
    const patIds = new Set();
    for (const pat of patterns) {
      assert.ok(!patIds.has(pat.id), `${id}: 重複 pat.id (${pat.id})`);
      patIds.add(pat.id);
      assert.ok(pat.flow.length >= 2, `${id}: ${pat.id} の flow ステップ数`);
      assert.equal(
        new Set(pat.flow).size,
        pat.flow.length,
        `${id}: ${pat.id} の flow に重複ステップがないこと`
      );
    }

    assert.ok(pitfalls.length > 0, `${id}: pitfalls が空でないこと`);
    assert.ok(keyFacts.length > 0, `${id}: keyFacts が空でないこと`);

    const haystacks = buildSearchHaystacks(mod, id);

    // トピック全サービスバッジが正規化後に 5 セクション横断で 0 ミス（100% ヒット）
    const missedBadges = [];
    for (const d of domains) {
      for (const t of d.topics) {
        for (const svc of t.services) {
          const normalized = normalizeAzureSearchQuery(svc).toLowerCase();
          if (!normalized || !haystacks.some((h) => h.includes(normalized))) {
            missedBadges.push(`${t.id}:${svc}`);
          }
        }
      }
    }
    assert.deepEqual(
      missedBadges,
      [],
      `${id}: トピックのサービスバッジは正規化後に全件ヒットすること`
    );

    // quickSearchChips が 5 セクション横断で 0 ミス
    const chips = AZURE_CERT_META[id].quickSearchChips;
    assert.ok(chips.length >= 4, `${id}: quickSearchChips が定義されていること`);
    const missedChips = chips.filter((chip) => {
      const q = chip.trim().toLowerCase();
      return !q || !haystacks.some((h) => h.includes(q));
    });
    assert.deepEqual(
      missedChips,
      [],
      `${id}: quickSearchChips が全件ヒットすること`
    );

    // officialResources の URL 検証（404 / リダイレクト禁止）
    assert.equal(officialResources.length, 4, `${id}: officialResources は 4 件`);
    const urls = officialResources.map((r) => r.url);
    assert.equal(
      new Set(urls).size,
      4,
      `${id}: officialResources の URL が 4 件とも一意であること`
    );
    for (const url of urls) {
      assert.ok(
        url.startsWith("https://learn.microsoft.com/"),
        `${id}: 公式URLが learn.microsoft.com 配下であること (${url})`
      );
      assert.ok(
        !url.includes("/training/courses/ai-103t00-a"),
        `${id}: 404 の旧コースURLを含まないこと (${url})`
      );
      assert.ok(
        !url.includes("/credentials/certifications/azure-ai-cloud-developer/"),
        `${id}: 404 の資格URLを含まないこと (${url})`
      );
      assert.ok(
        !url.includes("/training/courses/ai-900t00"),
        `${id}: /training/browse/ リダイレクトURLを含まないこと (${url})`
      );
      assert.ok(
        !/\/credentials\/certifications\/exams\/(az-900|dp-900|sc-900|az-104|ai-103|ai-200)\//i.test(
          url
        ),
        `${id}: 重複 /exams/ リダイレクトURLを含まないこと (${url})`
      );
    }

    if (id === "ai103") {
      const serialized = JSON.stringify({
        examFacts,
        domains,
        comparisons,
        patterns,
        pitfalls,
        keyFacts,
        officialResources,
      });
      assert.ok(
        serialized.includes("AI-102"),
        "ai103 データ内に旧試験 AI-102 からの後継注記が含まれること"
      );
    }
    if (id === "ai200") {
      const serialized = JSON.stringify({
        examFacts,
        domains,
        comparisons,
        patterns,
        pitfalls,
        keyFacts,
        officialResources,
      });
      assert.ok(
        serialized.includes("AZ-204"),
        "ai200 データ内に旧試験 AZ-204 からの後継注記が含まれること"
      );
    }
  }
});

test("azure-info/page.tsx と azureCertRegistry.ts が遅延分割・WAI-ARIA・検索正規化・768px対応・ノート出力・Gate準拠を満たす", () => {
  const pageSource = fs.readFileSync(
    path.join(repoRoot, "src", "app", "azure-info", "page.tsx"),
    "utf8"
  );
  const registrySource = fs.readFileSync(
    path.join(repoRoot, "src", "components", "azure", "azureCertRegistry.ts"),
    "utf8"
  );

  const requiredTokens = [
    "<UnderConstructionAlert",
    "normalizeAzureSearchQuery",
    "loadAzureCertData",
    "loadRequestGenRef",
    "再読み込みする",
    'role="tablist"',
    'role="tab"',
    'role="tabpanel"',
    "aria-selected",
    "aria-controls",
    "aria-pressed",
    "aria-expanded",
    'aria-live="polite"',
    "min-w-[640px]",
    "lg:min-w-[360px]",
    "handleExportNotesMarkdown",
  ];

  for (const token of requiredTokens) {
    assert.ok(
      pageSource.includes(token),
      `azure-info/page.tsx に ${token} が含まれていること`
    );
  }

  for (const lazyCert of ["ai900", "dp900", "sc900", "az104", "ai103", "ai200", "az305"]) {
    assert.ok(
      !pageSource.includes(`from "@/data/azure-${lazyCert}"`),
      `azure-info/page.tsx は @/data/azure-${lazyCert} を静的 import しないこと`
    );
    assert.ok(
      registrySource.includes(`import("@/data/azure-${lazyCert}")`),
      `azureCertRegistry.ts は @/data/azure-${lazyCert} を動的 import() すること`
    );
  }
  assert.ok(
    registrySource.includes('from "@/data/azure-az900"'),
    "azureCertRegistry.ts は初期表示用に @/data/azure-az900 のみ静的 import すること"
  );
});
