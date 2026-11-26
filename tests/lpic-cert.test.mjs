import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { normalizeCommandSearchQuery } from "../src/lib/lpic-search.ts";
import { LPIC_LEVELS, LPIC_LEVEL_META } from "../src/components/lpic/lpicCertMeta.ts";
import {
  lpic1ExamFacts,
  lpic1Domains,
  lpic1Comparisons,
  lpic1QuickLookup,
  lpic1PracticeQuestions,
  lpic1OfficialResources,
  lpic1Patterns,
  lpic1Pitfalls,
  lpic1KeyPaths,
} from "../src/data/lpic-1.ts";
import {
  lpic2ExamFacts,
  lpic2Domains,
  lpic2Comparisons,
  lpic2QuickLookup,
  lpic2PracticeQuestions,
  lpic2OfficialResources,
  lpic2Patterns,
  lpic2Pitfalls,
  lpic2KeyPaths,
} from "../src/data/lpic-2.ts";
import {
  lpic300ExamFacts,
  lpic300Domains,
  lpic300Comparisons,
  lpic300QuickLookup,
  lpic300PracticeQuestions,
  lpic300OfficialResources,
  lpic300Patterns,
  lpic300Pitfalls,
  lpic300KeyPaths,
} from "../src/data/lpic-300.ts";
import {
  lpic303ExamFacts,
  lpic303Domains,
  lpic303Comparisons,
  lpic303QuickLookup,
  lpic303PracticeQuestions,
  lpic303OfficialResources,
  lpic303Patterns,
  lpic303Pitfalls,
  lpic303KeyPaths,
} from "../src/data/lpic-303.ts";
import {
  lpic305ExamFacts,
  lpic305Domains,
  lpic305Comparisons,
  lpic305QuickLookup,
  lpic305PracticeQuestions,
  lpic305OfficialResources,
  lpic305Patterns,
  lpic305Pitfalls,
  lpic305KeyPaths,
} from "../src/data/lpic-305.ts";
import {
  lpic306ExamFacts,
  lpic306Domains,
  lpic306Comparisons,
  lpic306QuickLookup,
  lpic306PracticeQuestions,
  lpic306OfficialResources,
  lpic306Patterns,
  lpic306Pitfalls,
  lpic306KeyPaths,
} from "../src/data/lpic-306.ts";

const ROOT = process.cwd();

const DATASETS = {
  "lpic-1": {
    examFacts: lpic1ExamFacts,
    domains: lpic1Domains,
    comparisons: lpic1Comparisons,
    quickLookup: lpic1QuickLookup,
    practiceQuestions: lpic1PracticeQuestions,
    officialResources: lpic1OfficialResources,
    patterns: lpic1Patterns,
    pitfalls: lpic1Pitfalls,
    keyPaths: lpic1KeyPaths,
  },
  "lpic-2": {
    examFacts: lpic2ExamFacts,
    domains: lpic2Domains,
    comparisons: lpic2Comparisons,
    quickLookup: lpic2QuickLookup,
    practiceQuestions: lpic2PracticeQuestions,
    officialResources: lpic2OfficialResources,
    patterns: lpic2Patterns,
    pitfalls: lpic2Pitfalls,
    keyPaths: lpic2KeyPaths,
  },
  "lpic-300": {
    examFacts: lpic300ExamFacts,
    domains: lpic300Domains,
    comparisons: lpic300Comparisons,
    quickLookup: lpic300QuickLookup,
    practiceQuestions: lpic300PracticeQuestions,
    officialResources: lpic300OfficialResources,
    patterns: lpic300Patterns,
    pitfalls: lpic300Pitfalls,
    keyPaths: lpic300KeyPaths,
  },
  "lpic-303": {
    examFacts: lpic303ExamFacts,
    domains: lpic303Domains,
    comparisons: lpic303Comparisons,
    quickLookup: lpic303QuickLookup,
    practiceQuestions: lpic303PracticeQuestions,
    officialResources: lpic303OfficialResources,
    patterns: lpic303Patterns,
    pitfalls: lpic303Pitfalls,
    keyPaths: lpic303KeyPaths,
  },
  "lpic-305": {
    examFacts: lpic305ExamFacts,
    domains: lpic305Domains,
    comparisons: lpic305Comparisons,
    quickLookup: lpic305QuickLookup,
    practiceQuestions: lpic305PracticeQuestions,
    officialResources: lpic305OfficialResources,
    patterns: lpic305Patterns,
    pitfalls: lpic305Pitfalls,
    keyPaths: lpic305KeyPaths,
  },
  "lpic-306": {
    examFacts: lpic306ExamFacts,
    domains: lpic306Domains,
    comparisons: lpic306Comparisons,
    quickLookup: lpic306QuickLookup,
    practiceQuestions: lpic306PracticeQuestions,
    officialResources: lpic306OfficialResources,
    patterns: lpic306Patterns,
    pitfalls: lpic306Pitfalls,
    keyPaths: lpic306KeyPaths,
  },
};

function buildSearchHaystacks(dataset) {
  return [
    ...dataset.comparisons.map((c) =>
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
    ...dataset.quickLookup.map((item) =>
      [item.keyword, item.category, item.recommended, item.reason]
        .join(" ")
        .toLowerCase()
    ),
    ...dataset.patterns.map((p) =>
      [p.title, p.badge, p.summary, ...p.flow, ...p.keyDesignPoints]
        .join(" ")
        .toLowerCase()
    ),
    ...dataset.pitfalls.map((pit) =>
      [pit.trap, pit.whyWrong, pit.correctApproach].join(" ").toLowerCase()
    ),
    ...dataset.keyPaths.map((kp) =>
      [kp.target, kp.value, kp.detail].join(" ").toLowerCase()
    ),
  ];
}

test("normalizeCommandSearchQuery strips arguments, leading slashes, and wildcards", () => {
  assert.equal(normalizeCommandSearchQuery("lsmod"), "lsmod");
  assert.equal(normalizeCommandSearchQuery("/etc/pam.d/*"), "etc/pam.d/");
  assert.equal(normalizeCommandSearchQuery("systemctl isolate"), "systemctl");
  assert.equal(normalizeCommandSearchQuery("/boot"), "boot");
  assert.equal(normalizeCommandSearchQuery("source / ."), "source");
});

test("LPIC 全6トラックのデータ整合性・一意性・バッジ/チップ100%ヒット・LPI公式URL妥当性", () => {
  for (const level of LPIC_LEVELS) {
    const meta = LPIC_LEVEL_META[level];
    const dataset = DATASETS[level];
    assert.ok(meta, `${level}: meta が定義されていること`);
    assert.ok(dataset, `${level}: dataset が定義されていること`);

    assert.equal(dataset.examFacts.length, 6, `${level}: examFacts は 6 項目`);
    const factsText = JSON.stringify(dataset.examFacts);
    assert.ok(factsText.includes("500 点"), `${level}: examFacts に合格ライン 500 点 を含むこと`);
    assert.ok(factsText.includes("90 分"), `${level}: examFacts に試験時間 90 分 を含むこと`);
    if (level === "lpic-1") {
      assert.ok(factsText.includes("5 年間"), "lpic-1: examFacts に有効期限 5 年間 を含むこと");
    } else if (level === "lpic-2") {
      assert.ok(factsText.includes("LPIC-1 保持"), "lpic-2: examFacts に前提資格 LPIC-1 保持 を含むこと");
    } else {
      assert.ok(factsText.includes("LPIC-2 保持"), `${level}: examFacts に前提資格 LPIC-2 保持 を含むこと`);
      assert.ok(factsText.includes("5年間"), `${level}: examFacts に 5年間有効 を含むこと`);
    }

    assert.ok(dataset.domains.length > 0, `${level}: domains が空でないこと`);
    const domainIds = new Set();
    const topicIds = new Set();
    for (const d of dataset.domains) {
      assert.ok(!domainIds.has(d.id), `${level}: 重複 domain.id (${d.id})`);
      domainIds.add(d.id);
      assert.ok(d.topics.length > 0, `${level}: ${d.id} に topics が存在すること`);
      for (const t of d.topics) {
        assert.ok(!topicIds.has(t.id), `${level}: 重複 topic.id (${t.id})`);
        topicIds.add(t.id);
        assert.ok(t.commands.length > 0, `${level}: ${t.id} に commands が存在すること`);
      }
    }

    assert.equal(dataset.practiceQuestions.length, 20, `${level}: practiceQuestions は 20 問`);
    const questionIds = new Set();
    for (const q of dataset.practiceQuestions) {
      assert.ok(!questionIds.has(q.id), `${level}: 重複 question.id (${q.id})`);
      questionIds.add(q.id);
      assert.ok(
        domainIds.has(q.domainId),
        `${level}: ${q.id} の domainId (${q.domainId}) が実在すること`
      );
      const selectCount = q.selectCount ?? 1;
      assert.ok(selectCount === 1 || selectCount === 2, `${level}: ${q.id} の selectCount`);
      assert.equal(
        q.correctIndices.length,
        selectCount,
        `${level}: ${q.id} の correctIndices 数が selectCount と一致すること`
      );
      const uniqueIndices = new Set(q.correctIndices);
      assert.equal(
        uniqueIndices.size,
        q.correctIndices.length,
        `${level}: ${q.id} の correctIndices に重複がないこと`
      );
      for (const idx of q.correctIndices) {
        assert.ok(
          Number.isInteger(idx) && idx >= 0 && idx < q.options.length,
          `${level}: ${q.id} の correctIndex (${idx}) が範囲内であること`
        );
      }
    }

    assert.equal(dataset.quickLookup.length, 24, `${level}: quickLookup は 24 枚`);
    const lookupKeywords = new Set(dataset.quickLookup.map((item) => item.keyword));
    assert.equal(lookupKeywords.size, 24, `${level}: quickLookup.keyword が一意であること`);

    assert.ok(dataset.comparisons.length > 0, `${level}: comparisons が空でないこと`);
    const compIds = new Set();
    for (const comp of dataset.comparisons) {
      assert.ok(!compIds.has(comp.id), `${level}: 重複 comp.id (${comp.id})`);
      compIds.add(comp.id);
      assert.ok(comp.columns.length >= 2, `${level}: ${comp.id} の列数`);
      for (const row of comp.rows) {
        assert.equal(
          row.values.length,
          comp.columns.length - 1,
          `${level}: ${comp.id} 行「${row.feature}」の列数一致`
        );
      }
    }

    assert.ok(dataset.patterns.length > 0, `${level}: patterns が空でないこと`);
    const patIds = new Set();
    for (const pat of dataset.patterns) {
      assert.ok(!patIds.has(pat.id), `${level}: 重複 pat.id (${pat.id})`);
      patIds.add(pat.id);
    }

    assert.ok(dataset.pitfalls.length > 0, `${level}: pitfalls が空でないこと`);
    const pitIds = new Set();
    for (const pit of dataset.pitfalls) {
      assert.ok(!pitIds.has(pit.id), `${level}: 重複 pit.id (${pit.id})`);
      pitIds.add(pit.id);
    }

    assert.ok(dataset.keyPaths.length > 0, `${level}: keyPaths が空でないこと`);
    const kpIds = new Set();
    for (const kp of dataset.keyPaths) {
      assert.ok(!kpIds.has(kp.id), `${level}: 重複 keyPath.id (${kp.id})`);
      kpIds.add(kp.id);
    }

    const haystacks = buildSearchHaystacks(dataset);

    // 1. 全トピックのコマンドバッジが正規化後に 0 ミス（100% ヒット）
    const missedCommands = [];
    for (const d of dataset.domains) {
      for (const t of d.topics) {
        for (const cmd of t.commands) {
          const q = normalizeCommandSearchQuery(cmd).toLowerCase();
          if (!q || !haystacks.some((h) => h.includes(q))) {
            missedCommands.push(`${t.code}:${cmd} (query="${q}")`);
          }
        }
      }
    }
    assert.deepEqual(
      missedCommands,
      [],
      `${level}: トピックのコマンドバッジに 0 件ヒットがあってはならない`
    );

    // 2. LPIC_LEVEL_META[level].quickSearchChips 全件が 0 ミス
    assert.ok(
      meta.quickSearchChips.length >= 6,
      `${level}: quickSearchChips が 6 件以上定義されていること`
    );
    const missedChips = meta.quickSearchChips.filter((chip) => {
      const q = chip.trim().toLowerCase();
      return !q || !haystacks.some((h) => h.includes(q));
    });
    assert.deepEqual(
      missedChips,
      [],
      `${level}: quickSearchChips に 0 件ヒットがあってはならない`
    );

    // 3. 公式リソース URL 妥当性と禁止 404 パターン除外
    assert.ok(
      dataset.officialResources.length >= 3,
      `${level}: officialResources が 3 件以上あること`
    );
    const urlSet = new Set();
    for (const res of dataset.officialResources) {
      assert.ok(
        /^https:\/\/(www|wiki|learning)\.lpi\.org\//.test(res.url),
        `${level}: 公式URLが LPI 公式サイト配下であること (${res.url})`
      );
      assert.ok(!urlSet.has(res.url), `${level}: officialResources URL 重複 (${res.url})`);
      urlSet.add(res.url);
      assert.ok(
        !res.url.includes("learning-materials/lpic-"),
        `${level}: 404 の learning-materials/lpic- URL を含まないこと (${res.url})`
      );
      assert.ok(
        !/LPIC-3_30[356]/.test(res.url),
        `${level}: 404 の LPIC-3_30X URL を含まないこと (${res.url})`
      );
      assert.ok(
        !res.url.includes("learning-materials/201-450"),
        `${level}: 404 の learning-materials/201-450 URL を含まないこと (${res.url})`
      );
    }
  }
});

test("lpic-info/page.tsx と lpicCertRegistry.ts が遅延分割・WAI-ARIA・768px 対策・Gate 準拠を満たす", () => {
  const pageSrc = fs.readFileSync(path.join(ROOT, "src/app/lpic-info/page.tsx"), "utf8");
  const registrySrc = fs.readFileSync(
    path.join(ROOT, "src/components/lpic/lpicCertRegistry.ts"),
    "utf8"
  );
  const featureSrc = fs.readFileSync(path.join(ROOT, "src/data/feature-status.ts"), "utf8");
  const routeMetaSrc = fs.readFileSync(path.join(ROOT, "src/data/route-metadata.ts"), "utf8");

  const requiredPageTokens = [
    "<UnderConstructionAlert",
    "normalizeCommandSearchQuery",
    "loadLpicCertData",
    "loadRequestGenRef",
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
    assert.ok(pageSrc.includes(token), `lpic-info/page.tsx に ${token} が含まれていること`);
  }

  assert.ok(
    !pageSrc.includes('text-slate-800 lg:whitespace-nowrap">\n                学習レベル・専門トラック選択') &&
      !pageSrc.includes('text-slate-800 lg:whitespace-nowrap">\r\n                学習レベル・専門トラック選択'),
    "lpic-info/page.tsx の資格切替見出しには 1280px 重なり要因の lg:whitespace-nowrap を付けないこと"
  );

  for (const lazyTrack of ["lpic-2", "lpic-300", "lpic-303", "lpic-305", "lpic-306"]) {
    assert.ok(
      !pageSrc.includes(`from "@/data/${lazyTrack}"`),
      `lpic-info/page.tsx は @/data/${lazyTrack} を静的 import しないこと`
    );
    assert.ok(
      registrySrc.includes(`import("@/data/${lazyTrack}")`),
      `lpicCertRegistry.ts は @/data/${lazyTrack} を動的 import() すること`
    );
  }
  assert.ok(
    registrySrc.includes('from "@/data/lpic-1"'),
    "lpicCertRegistry.ts は初期表示用に @/data/lpic-1 のみ静的 import すること"
  );

  const lpicFeatureIdx = featureSrc.indexOf('id: "lpic-info"');
  assert.ok(lpicFeatureIdx !== -1, 'feature-status.ts に id: "lpic-info" が存在すること');
  const lpicFeatureBlock = featureSrc.slice(lpicFeatureIdx, lpicFeatureIdx + 500);
  assert.ok(lpicFeatureBlock.includes("isVerified: false"));
  assert.ok(routeMetaSrc.includes('"/lpic-info":'));
});
