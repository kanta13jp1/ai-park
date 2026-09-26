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
