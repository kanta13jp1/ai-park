import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { normalizeIpaSearchQuery } from "../src/lib/ipa-search.ts";
import {
  IPA_EXAM_COUNTS,
  IPA_EXAM_IDS,
  IPA_EXAM_METAS,
  IPA_EXAM_TIER_MAP,
  IPA_OFFICIAL_RESOURCES,
} from "../src/components/ipa/ipaCertMeta.ts";
import {
  foundationDomains,
  foundationExamMetas,
  foundationFlashcards,
  foundationQuestions,
} from "../src/data/ipa/foundation.ts";
import {
  specialistDomains,
  specialistExamMetas,
  specialistFlashcards,
  specialistQuestions,
} from "../src/data/ipa/specialist.ts";
import {
  managementDomains,
  managementExamMetas,
  managementFlashcards,
  managementQuestions,
} from "../src/data/ipa/management.ts";

const ROOT = process.cwd();

test("normalizeIpaSearchQuery strips full-width/half-width parens, slashes, and whitespace", () => {
  assert.equal(normalizeIpaSearchQuery("ISMS (ISO/IEC 27001)"), "ISMS");
  assert.equal(normalizeIpaSearchQuery("EVM (CPI/SPI/EAC)"), "EVM");
  assert.equal(normalizeIpaSearchQuery("バランススコアカード（BSC）"), "バランススコアカード");
  assert.equal(normalizeIpaSearchQuery("KPI/KGI"), "KPI");
  assert.equal(normalizeIpaSearchQuery("  ゼロトラスト  "), "ゼロトラスト");
});

test("IPA 13区分のメタデータ・カウント・IDプレフィックス・公式URLが整合している", () => {
  const tierMetas = [
    ...foundationExamMetas,
    ...specialistExamMetas,
    ...managementExamMetas,
  ];
  assert.deepEqual(
    IPA_EXAM_METAS.map((m) => m.id),
    [...IPA_EXAM_IDS],
    "IPA_EXAM_METAS は全13区分を定義順に含むこと"
  );
  assert.deepEqual(
    IPA_EXAM_METAS,
    tierMetas,
    "ipaCertMeta.ts の IPA_EXAM_METAS は各階層データの examMetas と完全一致すること"
  );

  const allDomains = [
    ...foundationDomains,
    ...specialistDomains,
    ...managementDomains,
  ];
  const allFlashcards = [
    ...foundationFlashcards,
    ...specialistFlashcards,
    ...managementFlashcards,
  ];
  const allQuestions = [
    ...foundationQuestions,
    ...specialistQuestions,
    ...managementQuestions,
  ];

  for (const examId of IPA_EXAM_IDS) {
    assert.ok(IPA_EXAM_TIER_MAP[examId], `${examId}: tier map が定義されていること`);
    const ds = allDomains.filter((d) => d.examId === examId);
    const ts = ds.flatMap((d) => d.topics);
    const qs = allQuestions.filter((q) => q.examId === examId);
    const cs = allFlashcards.filter((c) => c.examId === examId);

    assert.deepEqual(
      IPA_EXAM_COUNTS[examId],
      {
        totalTopics: ts.length,
        totalQuestions: qs.length,
        totalFlashcards: cs.length,
        firstDomainId: ds[0]?.id,
      },
      `${examId}: IPA_EXAM_COUNTS が実データ件数・先頭ドメインと一致すること`
    );

    const prefix = `${examId}-`;
    for (const t of ts) {
      assert.ok(
        t.id.startsWith(prefix),
        `${examId}: topic.id "${t.id}" は "${prefix}" で始まること`
      );
    }
    for (const q of qs) {
      assert.ok(
        q.id.startsWith(prefix),
        `${examId}: question.id "${q.id}" は "${prefix}" で始まること`
      );
    }
  }

  assert.equal(IPA_OFFICIAL_RESOURCES.length, 3, "IPA_OFFICIAL_RESOURCES は 3 件であること");
  const urls = IPA_OFFICIAL_RESOURCES.map((r) => r.url);
  assert.equal(new Set(urls).size, 3, "IPA_OFFICIAL_RESOURCES の URL が一意であること");
  for (const url of urls) {
    assert.ok(
      url.startsWith("https://www.ipa.go.jp/"),
      `IPA 公式URLは https://www.ipa.go.jp/ 配下であること (${url})`
    );
    assert.ok(
      !url.includes("/shiken/syllabus.html"),
      `IPA 404 旧URL /shiken/syllabus.html を含まないこと (${url})`
    );
  }
  assert.ok(
    urls.includes("https://www.ipa.go.jp/shiken/syllabus/gaiyou.html"),
    "正規シラバス URL https://www.ipa.go.jp/shiken/syllabus/gaiyou.html を含むこと"
  );
});

test("ipa-info/page.tsx と ipaCertRegistry.ts が階層別遅延分割・WAI-ARIA・768px対応・Gate準拠を満たす", () => {
  const pageSrc = fs.readFileSync(path.join(ROOT, "src/app/ipa-info/page.tsx"), "utf8");
  const registrySrc = fs.readFileSync(
    path.join(ROOT, "src/components/ipa/ipaCertRegistry.ts"),
    "utf8"
  );
  const featureSrc = fs.readFileSync(path.join(ROOT, "src/data/feature-status.ts"), "utf8");
  const routeMetaSrc = fs.readFileSync(path.join(ROOT, "src/data/route-metadata.ts"), "utf8");

  const requiredPageTokens = [
    "<UnderConstructionAlert",
    "normalizeIpaSearchQuery",
    "loadIpaTierData",
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
    "ArrowRight",
    "min-w-[640px]",
    "lg:min-w-[360px]",
  ];
  for (const token of requiredPageTokens) {
    assert.ok(pageSrc.includes(token), `ipa-info/page.tsx に ${token} が含まれていること`);
  }

  for (const forbiddenImport of [
    'from "@/data/ipa-exam"',
    'from "@/data/ipa/specialist"',
    'from "@/data/ipa/management"',
  ]) {
    assert.ok(
      !pageSrc.includes(forbiddenImport),
      `ipa-info/page.tsx は ${forbiddenImport} を静的 import しないこと`
    );
  }

  assert.ok(
    registrySrc.includes('from "@/data/ipa/foundation"'),
    "ipaCertRegistry.ts は初期表示用に @/data/ipa/foundation を静的 import すること"
  );
  for (const lazyTier of ["specialist", "management"]) {
    assert.ok(
      registrySrc.includes(`import("@/data/ipa/${lazyTier}")`),
      `ipaCertRegistry.ts は @/data/ipa/${lazyTier} を動的 import() すること`
    );
  }

  const ipaFeatureIdx = featureSrc.indexOf('id: "ipa-info"');
  assert.ok(ipaFeatureIdx !== -1, 'feature-status.ts に id: "ipa-info" が存在すること');
  const ipaFeatureBlock = featureSrc.slice(ipaFeatureIdx, ipaFeatureIdx + 500);
  assert.ok(ipaFeatureBlock.includes("isVerified: false"));
  assert.ok(routeMetaSrc.includes('"/ipa-info":'));
});
