import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();

function isQuestionCorrect(question, userChoices) {
  if (!userChoices || userChoices.length !== question.correctIndices.length) return false;
  const sortedUser = [...userChoices].sort((a, b) => a - b);
  const sortedCorrect = [...question.correctIndices].sort((a, b) => a - b);
  return sortedUser.every((val, idx) => val === sortedCorrect[idx]);
}

function calcRemainingDaysJst(endDateStr, nowMs) {
  const [y, m, d] = endDateStr.split("-").map(Number);
  if (!y || !m || !d) return 0;
  const endUtc = Date.UTC(y, m - 1, d);
  const jstNow = new Date(nowMs + 9 * 60 * 60 * 1000);
  const todayJstUtc = Date.UTC(jstNow.getUTCFullYear(), jstNow.getUTCMonth(), jstNow.getUTCDate());
  return Math.max(0, Math.round((endUtc - todayJstUtc) / 86_400_000));
}

test("Quiz grading helper handles single-choice, unordered multi-select, and partial selections", () => {
  const single = { correctIndices: [2] };
  assert.equal(isQuestionCorrect(single, [2]), true);
  assert.equal(isQuestionCorrect(single, [1]), false);
  assert.equal(isQuestionCorrect(single, undefined), false);

  const multi = { correctIndices: [1, 3] };
  assert.equal(isQuestionCorrect(multi, [3, 1]), true);
  assert.equal(isQuestionCorrect(multi, [1]), false);
  assert.equal(isQuestionCorrect(multi, [0, 1, 3]), false);
});

test("JST remaining days calculation matches verified milestones and clamps at 0", () => {
  const oct5Ms = Date.parse("2026-10-05T00:40:00+09:00");
  const nov21Ms = Date.parse("2026-11-21T20:00:00+09:00");
  const pastMs = Date.parse("2027-01-10T09:00:00+09:00");

  assert.equal(calcRemainingDaysJst("2026-12-31", oct5Ms), 87);
  assert.equal(calcRemainingDaysJst("2026-12-31", nov21Ms), 40);
  assert.equal(calcRemainingDaysJst("2026-12-31", pastMs), 0);
});

test("Public data JSON files parse cleanly with masked PII and expected schema", () => {
  const gcpJsonPath = path.join(rootDir, "public", "data", "gcp-usage-live.json");
  const gcpData = JSON.parse(fs.readFileSync(gcpJsonPath, "utf8"));
  assert.ok(gcpData.gcpInfo && typeof gcpData.gcpInfo.trialEndDate === "string");
  assert.ok(Array.isArray(gcpData.users) && gcpData.users.length > 0);
  for (const user of gcpData.users) {
    assert.ok(user.email.includes("***@"), `Unmasked email in gcp-usage-live.json: ${user.email}`);
  }

  const newsJsonPath = path.join(rootDir, "public", "data", "ai-news-live.json");
  const newsData = JSON.parse(fs.readFileSync(newsJsonPath, "utf8"));
  assert.ok(newsData && (Array.isArray(newsData.items) || Array.isArray(newsData.news) || Array.isArray(newsData)));
});

test("Academy courses metadata has unique course IDs and valid lesson quiz answers", async () => {
  const academyPath = path.join(rootDir, "src", "data", "academy.ts");
  const mod = await import(pathToFileURL(academyPath).href);
  assert.ok(Array.isArray(mod.courses) && mod.courses.length >= 3);

  const ids = new Set();
  for (const course of mod.courses) {
    assert.ok(!ids.has(course.id), `Duplicate academy course id: ${course.id}`);
    ids.add(course.id);
    assert.ok(course.title && course.summary);
    assert.ok(Array.isArray(course.lessons) && course.lessons.length > 0);
    for (const q of course.quiz) {
      assert.ok(
        Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length,
        `Out-of-range academy quiz answer in ${course.id}`
      );
    }
  }
});

test("Sidebar nav matching handles trailing slashes and avoids prefix collisions like /tools vs /tools-hub", async () => {
  const navMatchPath = path.join(rootDir, "src", "lib", "navMatch.ts");
  const { isNavHrefActive, normalizePathname } = await import(pathToFileURL(navMatchPath).href);

  assert.equal(normalizePathname("/tools-hub/"), "/tools-hub");
  assert.equal(normalizePathname("/"), "/");
  assert.equal(isNavHrefActive("/tools-hub", "/tools"), false);
  assert.equal(isNavHrefActive("/tools-hub/", "/tools-hub"), true);
  assert.equal(isNavHrefActive("/academy/antigravity-101/what/", "/academy"), true);
  assert.equal(isNavHrefActive("/", "/"), true);
  assert.equal(isNavHrefActive("/news/", "/"), false);
  assert.equal(isNavHrefActive("", "/azure-info"), false);
});

test("normalizeCommandSearchQuery normalizes LPIC command badges cleanly", async () => {
  const { pathToFileURL } = await import("node:url");
  const nodePath = await import("node:path");
  const nodeAssert = (await import("node:assert/strict")).default;
  const searchLibPath = nodePath.join(process.cwd(), "src", "lib", "lpic-search.ts");
  const { normalizeCommandSearchQuery } = await import(pathToFileURL(searchLibPath).href);

  nodeAssert.equal(normalizeCommandSearchQuery("lsmod"), "lsmod");
  nodeAssert.equal(normalizeCommandSearchQuery("/etc/pam.d/*"), "etc/pam.d/");
  nodeAssert.equal(normalizeCommandSearchQuery("systemctl isolate"), "systemctl");
  nodeAssert.equal(normalizeCommandSearchQuery("/boot"), "boot");
  nodeAssert.equal(normalizeCommandSearchQuery("source / ."), "source");
});
