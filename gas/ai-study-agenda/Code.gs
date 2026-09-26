/**
 * AI勉強会 アジェンダ自動追加（Google Apps Script）
 *
 * 「AI Park イベント」カレンダーを定期的に確認し、タイトルに「AI勉強会」を含む予定の説明欄に
 * アジェンダがまだ無ければ、AI Park の最新状況（GitHub Issue）を反映したアジェンダを書き込む。
 *
 * 設置手順は同じフォルダの README.md を参照。
 */

// ===== 設定 =====
const CONFIG = {
  // 「AI Park イベント」カレンダーのカレンダーID（カレンダーの設定 →「カレンダーの統合」に表示）
  CALENDAR_ID: "",
  // この文字列をタイトルに含む予定を対象にする
  TITLE_KEYWORD: "AI勉強会",
  // 何日先までの予定を確認するか
  LOOKAHEAD_DAYS: 60,
  GITHUB_REPO: "kanta13jp1/ai-park",
  SITE_URL: "https://kanta13jp1.github.io/ai-park",
};

// アジェンダの目印。説明欄にこれがあれば追加済みとみなす（消すと次回の実行で作り直す）
const AGENDA_MARKER = "【アジェンダ（自動生成）】";

/** 定期実行の本体：対象の予定にアジェンダを追加する */
function addAgendaToStudySessions() {
  if (!CONFIG.CALENDAR_ID) throw new Error("CONFIG.CALENDAR_ID を設定してください");
  const calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
  if (!calendar) throw new Error("カレンダーが見つかりません: " + CONFIG.CALENDAR_ID);

  const now = new Date();
  const until = new Date(now.getTime() + CONFIG.LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000);
  const targets = calendar
    .getEvents(now, until)
    .filter((e) => e.getTitle().indexOf(CONFIG.TITLE_KEYWORD) !== -1)
    .filter((e) => (e.getDescription() || "").indexOf(AGENDA_MARKER) === -1);
  if (targets.length === 0) return;

  const status = fetchParkStatus_();
  targets.forEach((event) => {
    const current = event.getDescription() || "";
    const agenda = buildAgenda(status, event.getStartTime(), CONFIG.SITE_URL);
    event.setDescription(current ? current + "\n\n" + agenda : agenda);
    console.log("アジェンダを追加: " + event.getTitle() + " " + event.getStartTime());
  });
}

/** GitHub の公開 Issue から AI Park の状況を集める（test ラベルは除外） */
function fetchParkStatus_() {
  const url =
    "https://api.github.com/repos/" + CONFIG.GITHUB_REPO + "/issues?state=open&per_page=100&sort=created&direction=desc";
  const res = UrlFetchApp.fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    console.warn("GitHub API " + res.getResponseCode());
    return null;
  }
  const issues = JSON.parse(res.getContentText()).filter(
    (i) => !i.pull_request && !i.labels.some((l) => l.name === "test")
  );
  const byLabel = (name) => issues.filter((i) => i.labels.some((l) => l.name === name));
  return {
    feedback: byLabel("feedback"),
    projects: byLabel("ai-project"),
    interviews: byLabel("interview"),
    ambassadors: byLabel("ambassador"),
  };
}

/**
 * アジェンダ本文を組み立てる（外部 API を使わない純粋関数）
 * @param {?{feedback: Object[], projects: Object[], interviews: Object[], ambassadors: Object[]}} status
 * @param {Date} start 予定の開始日時
 * @param {string} siteUrl
 */
function buildAgenda(status, start, siteUrl) {
  const title = (i) => "・#" + i.number + " " + i.title.replace(/^\[[^\]]+\]\s*/, "");
  const list = (items, empty) => (items.length ? items.slice(0, 5).map(title).join("\n") : "・" + empty);
  const lines = [
    AGENDA_MARKER,
    "目的：AI活用の知見共有と AI Park の進捗確認",
    "",
    "1. 前回からの振り返り・アクションの確認（5分）",
    "",
    "2. AI Park の更新とロードマップ（10分）",
    "・開発ロードマップ：" + siteUrl + "/roadmap",
  ];
  if (status) {
    lines.push(
      "",
      "3. 新しいご意見・改善要望（" + status.feedback.length + "件・10分）",
      list(status.feedback, "新しいご意見はありません"),
      "・ボード：" + siteUrl + "/feedback-todo",
      "",
      "4. 社内AIプロジェクトの共有（" + status.projects.length + "件・10分）",
      list(status.projects, "新しい登録はありません"),
      "・一覧：" + siteUrl + "/ai-projects",
      "",
      "5. 取材立候補・アンバサダー応募の確認（5分）",
      "・取材立候補 " + status.interviews.length + "件 / アンバサダー応募 " + status.ambassadors.length + "件"
    );
  } else {
    lines.push("", "3〜5. ご意見・プロジェクト・応募の確認（GitHub から取得できなかったため各ページで確認）");
  }
  lines.push(
    "",
    "6. 自由相談・次回までのアクション（10分）",
    "",
    "※ " +
      Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm") +
      " 時点の情報で自動生成（開催日 " +
      Utilities.formatDate(start, "Asia/Tokyo", "yyyy/MM/dd") +
      "）。作り直す場合は「" +
      AGENDA_MARKER +
      "」以降を削除してください。"
  );
  return lines.join("\n");
}

/** 初回に1度だけ実行：10分ごとの定期実行を登録する（重複登録はしない） */
function setupTrigger() {
  const name = "addAgendaToStudySessions";
  if (ScriptApp.getProjectTriggers().some((t) => t.getHandlerFunction() === name)) return;
  ScriptApp.newTrigger(name).timeBased().everyMinutes(10).create();
}
