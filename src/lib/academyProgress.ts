// Antigravity Academy の学習進捗（このブラウザにのみ保存。サーバーには送らない）

const KEY = "ai_park_academy_progress_v1";

export interface CourseProgress {
  lessonsDone: string[];
  bestScore?: number; // 0〜1
  completedAt?: string; // 修了日（ISO）
  certificateId?: string;
  learnerName?: string;
}

type ProgressMap = Record<string, CourseProgress>;

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCourseProgress(courseId: string, progress: CourseProgress): void {
  try {
    const all = loadProgress();
    all[courseId] = progress;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // 保存できない環境（プライベートブラウズ等）では進捗を保持しない
  }
}

export function newCertificateId(courseId: string): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `AGA-${courseId.split("-")[0].slice(0, 3).toUpperCase()}-${date}-${rand}`;
}

export interface ProgressExportData {
  version: string;
  exportedAt: string;
  source: string;
  progress: ProgressMap;
}

/**
 * 学習進捗をJSON文字列としてエクスポート
 */
export function exportProgressJSON(): string {
  const all = loadProgress();
  const data: ProgressExportData = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    source: "MightyLINK AI Park - Antigravity Academy",
    progress: all,
  };
  return JSON.stringify(data, null, 2);
}

/**
 * JSON文字列から進捗をインポートしてlocalStorageへ保存
 */
export function importProgressJSON(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    let progressMap: ProgressMap = {};

    if (parsed && typeof parsed === "object") {
      if (parsed.progress && typeof parsed.progress === "object") {
        progressMap = parsed.progress;
      } else {
        // 直接ProgressMapが渡された場合のフォールバック
        progressMap = parsed;
      }
    } else {
      return { success: false, count: 0, error: "無効なJSONフォーマットです。" };
    }

    const current = loadProgress();
    let importedCount = 0;

    for (const [courseId, prog] of Object.entries(progressMap)) {
      if (prog && typeof prog === "object") {
        current[courseId] = {
          lessonsDone: Array.isArray(prog.lessonsDone) ? prog.lessonsDone : [],
          bestScore: typeof prog.bestScore === "number" ? prog.bestScore : undefined,
          completedAt: typeof prog.completedAt === "string" ? prog.completedAt : undefined,
          certificateId: typeof prog.certificateId === "string" ? prog.certificateId : undefined,
          learnerName: typeof prog.learnerName === "string" ? prog.learnerName : undefined,
        };
        importedCount++;
      }
    }

    localStorage.setItem(KEY, JSON.stringify(current));
    return { success: true, count: importedCount };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "インポートの解析に失敗しました。";
    return { success: false, count: 0, error: errorMsg };
  }
}

/**
 * Google Chat / 社内報告用の修了・進捗テキストを生成
 */
export function generateChatReportText(progress: ProgressMap, totalLessons: number, doneLessons: number): string {
  const completedCourses: string[] = [];
  const inProgressCourses: string[] = [];

  for (const [courseId, cp] of Object.entries(progress)) {
    if (cp.completedAt) {
      const scoreText = cp.bestScore !== undefined ? ` (正答率: ${cp.bestScore}%)` : "";
      const certText = cp.certificateId ? ` [修了証ID: ${cp.certificateId}]` : "";
      completedCourses.push(`- ${courseId}${scoreText}${certText}`);
    } else if ((cp.lessonsDone?.length ?? 0) > 0) {
      inProgressCourses.push(`- ${courseId}: ${cp.lessonsDone.length}レッスン完了`);
    }
  }

  const dateStr = new Date().toLocaleDateString("ja-JP");
  const pct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  let text = `【Antigravity Academy 受講進捗報告】 (${dateStr})\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `■ 全体進捗: ${doneLessons} / ${totalLessons} レッスン (${pct}% 達成)\n\n`;

  if (completedCourses.length > 0) {
    text += `■ 修了済みコース (${completedCourses.length}件):\n`;
    text += completedCourses.join("\n") + "\n\n";
  }

  if (inProgressCourses.length > 0) {
    text += `■ 受講中コース:\n`;
    text += inProgressCourses.join("\n") + "\n\n";
  }

  text += `■ 受講ポータル: https://kanta13jp1.github.io/ai-park/academy\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `※ AI推進担当への修了報告・受講相談用`;

  return text;
}
