import assert from "node:assert/strict";
import test from "node:test";
import {
  buildNewIssueUrl,
  formatDate,
  issueToFeedbackItem,
  parseIssueFormBody,
  pick,
} from "../src/lib/githubFeedback.ts";

function makeIssue(overrides = {}) {
  return {
    number: 101,
    title: "[ご意見] 検索フィルタを使いやすくしたい",
    body: null,
    state: "open",
    html_url: "https://github.com/kanta13jp1/ai-park/issues/101",
    created_at: "2026-05-15T06:00:00Z",
    labels: [{ name: "feedback" }],
    user: { login: "octocat" },
    ...overrides,
  };
}

test("parseIssueFormBody parses sections, normalizes _No response_, preserves multiline values, and handles empty input", () => {
  const formBody = [
    "### カテゴリ",
    "",
    "AI実践編",
    "",
    "### お名前",
    "",
    "_No response_",
    "",
    "### いただいたご意見",
    "",
    "1行目のご意見",
    "2行目の補足説明",
    "",
    "### ポータルでの対応方針（任意）",
    "",
    "検索条件を保持する",
  ].join("\n");

  assert.deepEqual(parseIssueFormBody(formBody), {
    カテゴリ: "AI実践編",
    お名前: "",
    いただいたご意見: "1行目のご意見\n2行目の補足説明",
    "ポータルでの対応方針（任意）": "検索条件を保持する",
  });

  assert.deepEqual(parseIssueFormBody(""), {});
  assert.deepEqual(parseIssueFormBody("見出しなしの自由記述テキスト"), {});
  assert.deepEqual(parseIssueFormBody("### 改行なし見出し"), {});
});

test("pick matches section keys by prefix and returns empty string when missing", () => {
  const sections = {
    "カテゴリ（必須）": "開発環境",
    "ポータルでの対応方針（任意）": "ドキュメントへ追記",
  };

  assert.equal(pick(sections, "カテゴリ"), "開発環境");
  assert.equal(pick(sections, "ポータルでの対応方針"), "ドキュメントへ追記");
  assert.equal(pick(sections, "所属部署"), "");
});

test("formatDate formats an ISO timestamp as YYYY/MM/DD", () => {
  assert.equal(formatDate("2026-05-15T06:00:00Z"), "2026/05/15");
  assert.equal(formatDate("2026-01-05T06:00:00Z"), "2026/01/05");
});

test("issueToFeedbackItem parses form fields, strips title prefix, and maps valid metadata", () => {
  const body = [
    "### カテゴリ",
    "",
    "ガイドライン",
    "",
    "### 優先度",
    "",
    "高",
    "",
    "### お名前",
    "",
    "テスト担当",
    "",
    "### 所属部署",
    "",
    "部署A",
    "",
    "### いただいたご意見",
    "",
    "ガイドラインの用語集を追加してほしい",
    "",
    "### ポータルでの対応方針",
    "",
    "用語集セクションを追加予定",
  ].join("\n");

  const item = issueToFeedbackItem(
    makeIssue({
      number: 42,
      title: "[ご意見]   用語集の追加",
      body,
      state: "open",
      labels: [{ name: "feedback" }, { name: "status:in-progress" }],
      html_url: "https://github.com/kanta13jp1/ai-park/issues/42",
    })
  );

  assert.deepEqual(item, {
    id: "GH-42",
    title: "用語集の追加",
    category: "ガイドライン",
    author: "テスト担当 さん",
    authorDept: "部署A",
    date: "2026/05/15",
    priority: "高",
    status: "in_progress",
    feedbackQuote: "「ガイドラインの用語集を追加してほしい」",
    actionPlan: "用語集セクションを追加予定",
    issueNumber: 42,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/42",
  });
});

test("issueToFeedbackItem handles category/priority fallbacks and status transitions", () => {
  const closedWithInProgress = issueToFeedbackItem(
    makeIssue({
      title: "プレフィックスなしのタイトル",
      state: "closed",
      labels: [{ name: "status:in-progress" }],
      body: [
        "### カテゴリ",
        "",
        "存在しないカテゴリ",
        "",
        "### 優先度",
        "",
        "緊急",
      ].join("\n"),
    })
  );

  assert.equal(closedWithInProgress.title, "プレフィックスなしのタイトル");
  assert.equal(closedWithInProgress.category, "UI/UX");
  assert.equal(closedWithInProgress.priority, "中");
  assert.equal(closedWithInProgress.status, "done");

  const lowPriorityTodo = issueToFeedbackItem(
    makeIssue({
      state: "open",
      labels: [{ name: "feedback" }],
      body: ["### 優先度", "", "低"].join("\n"),
    })
  );

  assert.equal(lowPriorityTodo.priority, "低");
  assert.equal(lowPriorityTodo.status, "todo");
});

test("issueToFeedbackItem handles author fallback chain, authorDept fallback, and quote body fallbacks", () => {
  const loginFallback = issueToFeedbackItem(
    makeIssue({
      body: "### お名前\n\n_No response_",
      user: { login: "octocat" },
    })
  );
  assert.equal(loginFallback.author, "octocat さん");
  assert.equal(loginFallback.authorDept, "社内");
  assert.equal(loginFallback.feedbackQuote, "（GitHub Issueからのご意見）");
  assert.equal(loginFallback.actionPlan, "対応方針を検討・反映予定");

  const anonymousFallback = issueToFeedbackItem(
    makeIssue({
      body: "   ",
      user: null,
    })
  );
  assert.equal(anonymousFallback.author, "匿名 さん");
  assert.equal(anonymousFallback.feedbackQuote, "（GitHub Issueからのご意見）");

  const freeformBody = issueToFeedbackItem(
    makeIssue({
      body: "  フォームを使わない自由記述の要望です  ",
      user: { login: "octocat" },
    })
  );
  assert.equal(freeformBody.feedbackQuote, "フォームを使わない自由記述の要望です");
});

test("buildNewIssueUrl generates GitHub new-issue URL with expected origin, path, and search params", () => {
  const rawUrl = buildNewIssueUrl({
    title: "検索機能の改善",
    author: "テスト担当",
    dept: "部署A",
    quote: "キーワード検索を追加したい",
    actionPlan: "検索バーを実装する",
  });

  const parsed = new URL(rawUrl);
  assert.equal(`${parsed.origin}${parsed.pathname}`, "https://github.com/kanta13jp1/ai-park/issues/new");
  assert.equal(parsed.searchParams.get("template"), "feedback.yml");
  assert.equal(parsed.searchParams.get("title"), "[ご意見] 検索機能の改善");
  assert.equal(parsed.searchParams.get("author"), "テスト担当");
  assert.equal(parsed.searchParams.get("dept"), "部署A");
  assert.equal(parsed.searchParams.get("quote"), "キーワード検索を追加したい");
  assert.equal(parsed.searchParams.get("action_plan"), "検索バーを実装する");
});
