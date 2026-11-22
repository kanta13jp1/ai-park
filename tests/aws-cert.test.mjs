import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { normalizeAwsSearchQuery } from "../src/lib/aws-search.ts";
import { AWS_CERT_IDS, AWS_LEVEL_GROUPS, AWS_CERT_META } from "../src/components/aws/awsCertMeta.ts";
import {
  clfExamFacts,
  clfDomains,
  clfComparisons,
  clfQuickLookup,
  clfPracticeQuestions,
  clfOfficialResources,
  clfArchitecturePatterns,
  clfPitfalls,
  clfKeyLimits,
  clfServiceQueryAliases,
} from "../src/data/aws-clf.ts";
import {
  aifExamFacts,
  aifDomains,
  aifComparisons,
  aifQuickLookup,
  aifPracticeQuestions,
  aifOfficialResources,
  aifArchitecturePatterns,
  aifPitfalls,
  aifKeyLimits,
  aifServiceQueryAliases,
} from "../src/data/aws-aif.ts";
import {
  saaExamFacts,
  saaDomains,
  saaComparisons,
  saaQuickLookup,
  saaPracticeQuestions,
  saaOfficialResources,
  saaArchitecturePatterns,
  saaPitfalls,
  saaKeyLimits,
  saaServiceQueryAliases,
  saaWellArchitectedPillars,
} from "../src/data/aws-saa.ts";
import {
  dvaExamFacts,
  dvaDomains,
  dvaComparisons,
  dvaQuickLookup,
  dvaPracticeQuestions,
  dvaOfficialResources,
  dvaArchitecturePatterns,
  dvaPitfalls,
  dvaKeyLimits,
  dvaServiceQueryAliases,
} from "../src/data/aws-dva.ts";
import {
  soaExamFacts,
  soaDomains,
  soaComparisons,
  soaQuickLookup,
  soaPracticeQuestions,
  soaOfficialResources,
  soaArchitecturePatterns,
  soaPitfalls,
  soaKeyLimits,
  soaServiceQueryAliases,
} from "../src/data/aws-soa.ts";
import {
  sapExamFacts,
  sapDomains,
  sapComparisons,
  sapQuickLookup,
  sapPracticeQuestions,
  sapOfficialResources,
  sapArchitecturePatterns,
  sapPitfalls,
  sapKeyLimits,
  sapServiceQueryAliases,
} from "../src/data/aws-sap.ts";

const ROOT = process.cwd();

const DATASETS = {
  clf: {
    examFacts: clfExamFacts,
    domains: clfDomains,
    comparisons: clfComparisons,
    quickLookup: clfQuickLookup,
    practiceQuestions: clfPracticeQuestions,
    officialResources: clfOfficialResources,
    architecturePatterns: clfArchitecturePatterns,
    pitfalls: clfPitfalls,
    keyLimits: clfKeyLimits,
    aliases: clfServiceQueryAliases,
    expectedGuideSegment: "cloud-practitioner-02/cloud-practitioner-02.html",
  },
  aif: {
    examFacts: aifExamFacts,
    domains: aifDomains,
    comparisons: aifComparisons,
    quickLookup: aifQuickLookup,
    practiceQuestions: aifPracticeQuestions,
    officialResources: aifOfficialResources,
    architecturePatterns: aifArchitecturePatterns,
    pitfalls: aifPitfalls,
    keyLimits: aifKeyLimits,
    aliases: aifServiceQueryAliases,
    expectedGuideSegment: "ai-practitioner-01/ai-practitioner-01.html",
  },
  saa: {
    examFacts: saaExamFacts,
    domains: saaDomains,
    comparisons: saaComparisons,
    quickLookup: saaQuickLookup,
    practiceQuestions: saaPracticeQuestions,
    officialResources: saaOfficialResources,
    architecturePatterns: saaArchitecturePatterns,
    pitfalls: saaPitfalls,
    keyLimits: saaKeyLimits,
    aliases: saaServiceQueryAliases,
    expectedGuideSegment: "solutions-architect-associate-03/solutions-architect-associate-03.html",
  },
  dva: {
    examFacts: dvaExamFacts,
    domains: dvaDomains,
    comparisons: dvaComparisons,
    quickLookup: dvaQuickLookup,
    practiceQuestions: dvaPracticeQuestions,
    officialResources: dvaOfficialResources,
    architecturePatterns: dvaArchitecturePatterns,
    pitfalls: dvaPitfalls,
    keyLimits: dvaKeyLimits,
    aliases: dvaServiceQueryAliases,
    expectedGuideSegment: "developer-associate-03/developer-associate-03.html",
  },
  soa: {
    examFacts: soaExamFacts,
    domains: soaDomains,
    comparisons: soaComparisons,
    quickLookup: soaQuickLookup,
    practiceQuestions: soaPracticeQuestions,
    officialResources: soaOfficialResources,
    architecturePatterns: soaArchitecturePatterns,
    pitfalls: soaPitfalls,
    keyLimits: soaKeyLimits,
    aliases: soaServiceQueryAliases,
    expectedGuideSegment: "sysops-administrator-associate-03/sysops-administrator-associate-03.html",
  },
  sap: {
    examFacts: sapExamFacts,
    domains: sapDomains,
    comparisons: sapComparisons,
    quickLookup: sapQuickLookup,
    practiceQuestions: sapPracticeQuestions,
    officialResources: sapOfficialResources,
    architecturePatterns: sapArchitecturePatterns,
    pitfalls: sapPitfalls,
    keyLimits: sapKeyLimits,
    aliases: sapServiceQueryAliases,
    expectedGuideSegment: "solutions-architect-professional-03/solutions-architect-professional-03.html",
  },
};

function matchesComparisonsSearch(dataset, query) {
  const q = query.trim().toLowerCase();
  if (!q) return false;

  const compHit = dataset.comparisons.some((c) => {
    const haystack = [
      c.title,
      c.subtitle,
      c.decisionRule,
      ...c.columns,
      ...c.rows.flatMap((r) => [r.feature, ...r.values]),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
  if (compHit) return true;

  const lookupHit = dataset.quickLookup.some((item) =>
    `${item.keyword} ${item.category} ${item.recommended} ${item.reason}`
      .toLowerCase()
      .includes(q)
  );
  if (lookupHit) return true;

  const pitfallHit = dataset.pitfalls.some((p) =>
    `${p.trap} ${p.whyWrong} ${p.correctApproach}`.toLowerCase().includes(q)
  );
  if (pitfallHit) return true;

  return dataset.keyLimits.some((l) =>
    `${l.service} ${l.limitValue} ${l.detail}`.toLowerCase().includes(q)
  );
}

test("normalizeAwsSearchQuery normalizes vendor prefixes, parens, and aliases", () => {
  assert.equal(normalizeAwsSearchQuery("Amazon S3"), "S3");
  assert.equal(normalizeAwsSearchQuery("AWS Lambda"), "Lambda");
  assert.equal(normalizeAwsSearchQuery("Amazon VPC（VPC Endpoint）"), "VPC");
  assert.equal(
    normalizeAwsSearchQuery("Versions & Aliases", { "Versions & Aliases": "Lambda" }),
    "Lambda"
  );
});

test("AWS metadata covers all 6 certs uniquely across level groups and uses accurate ESL rule", () => {
  assert.deepEqual(AWS_CERT_IDS, ["clf", "aif", "saa", "dva", "soa", "sap"]);
  const groupedIds = AWS_LEVEL_GROUPS.flatMap((g) => g.ids);
  assert.deepEqual(groupedIds, AWS_CERT_IDS);

  const metaSource = fs.readFileSync(
    path.join(ROOT, "src/components/aws/awsCertMeta.ts"),
    "utf8"
  );
  assert.ok(metaSource.includes("英語で受験する場合に限り"));
  assert.ok(metaSource.includes("日本語受験は対象外"));
});

test("all 6 AWS datasets satisfy domain weight, badge lookup, question integrity, and canonical URL checks", () => {
  assert.equal(saaWellArchitectedPillars.length, 6);

  for (const certId of AWS_CERT_IDS) {
    const dataset = DATASETS[certId];
    const meta = AWS_CERT_META[certId];
    assert.ok(dataset && meta, `Missing dataset/meta for ${certId}`);

    const weightSum = dataset.domains.reduce((sum, d) => sum + d.weight, 0);
    assert.equal(weightSum, 100, `${certId} domain weight sum must be 100, got ${weightSum}`);

    const domainIds = new Set(dataset.domains.map((d) => d.id));
    assert.deepEqual(
      [...domainIds],
      Object.keys(meta.domainShortLabels),
      `${certId} domain IDs must match domainShortLabels keys`
    );

    const qIds = new Set();
    assert.ok(dataset.practiceQuestions.length >= 16, `${certId} needs >= 16 questions`);
    for (const q of dataset.practiceQuestions) {
      assert.ok(!qIds.has(q.id), `${certId} duplicate question id ${q.id}`);
      qIds.add(q.id);
      assert.ok(domainIds.has(q.domainId), `${certId} invalid domainId on ${q.id}: ${q.domainId}`);
      assert.ok(q.options.length >= 4, `${certId} ${q.id} options length < 4`);
      assert.ok(q.correctIndices.length >= 1, `${certId} ${q.id} empty correctIndices`);
      if (q.selectCount === 2) {
        assert.equal(q.correctIndices.length, 2, `${certId} ${q.id} selectCount=2 needs 2 correctIndices`);
      } else {
        assert.equal(q.selectCount, 1, `${certId} ${q.id} unexpected selectCount`);
        assert.equal(q.correctIndices.length, 1, `${certId} ${q.id} selectCount=1 needs 1 correctIndex`);
      }
      for (const idx of q.correctIndices) {
        assert.ok(idx >= 0 && idx < q.options.length, `${certId} ${q.id} index out of bounds`);
      }
      assert.ok(q.question.trim().length > 0, `${certId} ${q.id} empty question`);
      assert.ok(q.explanation.trim().length > 0, `${certId} ${q.id} empty explanation`);
      assert.ok(Array.isArray(q.keywords) && q.keywords.length > 0, `${certId} ${q.id} empty keywords`);
    }

    for (const domain of dataset.domains) {
      for (const topic of domain.topics) {
        for (const svc of topic.services) {
          const query = normalizeAwsSearchQuery(svc, dataset.aliases);
          assert.ok(
            matchesComparisonsSearch(dataset, query),
            `${certId} service badge "${svc}" (query="${query}") has zero hits in comparisons tab`
          );
        }
      }
    }

    for (const chip of meta.quickSearchChips) {
      assert.ok(
        matchesComparisonsSearch(dataset, chip),
        `${certId} quickSearchChip "${chip}" has zero hits`
      );
    }

    assert.ok(dataset.officialResources.length >= 5, `${certId} needs >= 5 officialResources`);
    const urlSet = new Set();
    for (const res of dataset.officialResources) {
      assert.ok(res.url.startsWith("https://"), `${certId} invalid URL protocol: ${res.url}`);
      assert.ok(
        !res.url.includes("explore.skillbuilder.aws"),
        `${certId} uses deprecated redirecting URL: ${res.url}`
      );
      assert.ok(!urlSet.has(res.url), `${certId} duplicate resource URL: ${res.url}`);
      urlSet.add(res.url);
    }
    assert.ok(
      dataset.officialResources.some((r) => r.url.includes(dataset.expectedGuideSegment)),
      `${certId} missing canonical Japanese exam guide URL containing ${dataset.expectedGuideSegment}`
    );

    assert.ok(dataset.architecturePatterns.length >= 4, `${certId} architecturePatterns < 4`);
    assert.ok(dataset.pitfalls.length >= 5, `${certId} pitfalls < 5`);
    assert.ok(dataset.keyLimits.length >= 5, `${certId} keyLimits < 5`);
  }
});

test("primary 2026-11 exam facts match CLF-C02 support tiers, AIF-C01 question formats, DVA-C03, and SAP-C03", () => {
  const clfText = JSON.stringify({ clfDomains, clfComparisons, clfPracticeQuestions, clfPitfalls, clfKeyLimits });
  assert.ok(clfText.includes("ビジネスサポート+"), "CLF-C02 must include ビジネスサポート+");
  assert.ok(clfText.includes("エンタープライズサポート"), "CLF-C02 must include エンタープライズサポート");
  assert.ok(clfText.includes("Unified Operations"), "CLF-C02 must include Unified Operations");
  assert.ok(clfText.includes("2027"), "CLF-C02 must note 2027 legacy retirement");

  const aifFormatFact = aifExamFacts.find((f) => f.label === "出題形式");
  assert.ok(aifFormatFact, "AIF-C01 must include 出題形式 fact");
  assert.ok(aifFormatFact.value.includes("並べ替え"));
  assert.ok(aifFormatFact.value.includes("内容一致"));

  assert.equal(AWS_CERT_META.dva.shortCode, "DVA-C03");
  const dvaText = JSON.stringify({ dvaExamFacts, dvaDomains, dvaPracticeQuestions });
  assert.ok(dvaText.includes("テストとデプロイ"), "DVA-C03 Domain 4 must use テストとデプロイ");
  assert.ok(dvaText.includes("Guardrails"), "DVA-C03 must cover Bedrock Guardrails / AI security");
  assert.ok(dvaText.includes("EKS"), "DVA-C03 must include Amazon EKS");

  assert.equal(AWS_CERT_META.sap.shortCode, "SAP-C03");
  assert.equal(sapDomains.length, 5, "SAP-C03 must have 5 domains");
  assert.deepEqual(
    sapDomains.map((d) => d.weight),
    [25, 25, 15, 15, 20],
    "SAP-C03 domain weights must be 25/25/15/15/20"
  );
  assert.equal(sapPracticeQuestions.length, 22, "SAP-C03 must include 22 practice questions");
  const sapText = JSON.stringify({ sapExamFacts, sapDomains, sapComparisons, sapPracticeQuestions });
  assert.ok(sapText.includes("VPC Lattice"));
  assert.ok(sapText.includes("Bedrock"));
  assert.ok(!sapText.includes("SAP-C02 の定石"), "SAP-C03 must not carry stale 'SAP-C02 の定石' copy");
});

test("aws-info page and registry implement lazy loading, WAI-ARIA APG tabs, responsive table, backup guard, and gate compliance", () => {
  const pageSrc = fs.readFileSync(path.join(ROOT, "src/app/aws-info/page.tsx"), "utf8");
  const registrySrc = fs.readFileSync(path.join(ROOT, "src/components/aws/awsCertRegistry.ts"), "utf8");
  const featureSrc = fs.readFileSync(path.join(ROOT, "src/data/feature-status.ts"), "utf8");
  const routeMetaSrc = fs.readFileSync(path.join(ROOT, "src/data/route-metadata.ts"), "utf8");

  assert.ok(pageSrc.includes("<UnderConstructionAlert"));
  assert.ok(pageSrc.includes('role="tablist"'));
  assert.ok(pageSrc.includes('role="tab"'));
  assert.ok(pageSrc.includes('role="tabpanel"'));
  assert.ok(pageSrc.includes("aria-controls"));
  assert.ok(pageSrc.includes("ArrowRight"));
  assert.ok(pageSrc.includes("min-w-[640px]"));
  assert.ok(pageSrc.includes("lg:min-w-[360px]"));
  assert.ok(pageSrc.includes("loadAwsCertData"));
  assert.ok(pageSrc.includes("parsed.certId !== activeCertId"));

  assert.ok(registrySrc.includes('from "@/data/aws-saa"'));
  for (const lazyId of ["clf", "aif", "dva", "soa", "sap"]) {
    assert.ok(
      registrySrc.includes(`import("@/data/aws-${lazyId}")`),
      `awsCertRegistry.ts must dynamically import @/data/aws-${lazyId}`
    );
  }

  const awsFeatureBlock = featureSrc.slice(featureSrc.indexOf('id: "aws-info"'), featureSrc.indexOf('id: "aws-info"') + 600);
  assert.ok(awsFeatureBlock.includes("isVerified: false"));
  assert.ok(awsFeatureBlock.includes("DVA-C03"));
  assert.ok(awsFeatureBlock.includes("SAP-C03"));

  const awsRouteBlock = routeMetaSrc.slice(routeMetaSrc.indexOf('"/aws-info":'), routeMetaSrc.indexOf('"/aws-info":') + 220);
  assert.ok(awsRouteBlock.includes("DVA-C03"));
  assert.ok(awsRouteBlock.includes("SAP-C03"));
});
