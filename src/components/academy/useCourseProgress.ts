"use client";

import { useEffect, useState } from "react";
import { PASS_RATE, type Course } from "@/data/academy";
import { loadProgress, newCertificateId, saveCourseProgress, type CourseProgress } from "@/lib/academyProgress";

// コースの学習進捗（ブラウザ保存）を読み書きするフック
export function useCourseProgress(course: Course) {
  const [progress, setProgress] = useState<CourseProgress>({ lessonsDone: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // localStorage はブラウザでのみ読めるため、表示後に反映する
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress()[course.id] ?? { lessonsDone: [] });
    setLoaded(true);
  }, [course.id]);

  const update = (next: CourseProgress) => {
    setProgress(next);
    saveCourseProgress(course.id, next);
  };

  const allLessonsDone = course.lessons.every((l) => progress.lessonsDone.includes(l.id));

  // 修了条件（全レッスン完了＋評価テスト合格）を満たしたら修了日と修了証番号を付与
  const withCompletion = (next: CourseProgress): CourseProgress => {
    const complete =
      !next.completedAt &&
      (next.bestScore ?? 0) >= PASS_RATE &&
      course.lessons.every((l) => next.lessonsDone.includes(l.id));
    return complete ? { ...next, completedAt: new Date().toISOString(), certificateId: newCertificateId(course.id) } : next;
  };

  const markLessonDone = (lessonId: string) => {
    if (progress.lessonsDone.includes(lessonId)) return;
    update(withCompletion({ ...progress, lessonsDone: [...progress.lessonsDone, lessonId] }));
  };

  const recordQuizScore = (score: number) => {
    update(withCompletion({ ...progress, bestScore: Math.max(progress.bestScore ?? 0, score) }));
  };

  const setLearnerName = (learnerName: string) => update({ ...progress, learnerName });

  // 次に進むべき場所（未完了のレッスン → 評価テスト → 修了証）
  const nextStep =
    course.lessons.find((l) => !progress.lessonsDone.includes(l.id))?.id ??
    ((progress.bestScore ?? 0) >= PASS_RATE ? "certificate" : "quiz");

  return { progress, loaded, allLessonsDone, markLessonDone, recordQuizScore, setLearnerName, nextStep };
}

// 進捗表示用：完了数（レッスン＋評価テスト）と全体数
export function stepCounts(course: Course, progress: CourseProgress) {
  const total = course.lessons.length + 1;
  const done = progress.lessonsDone.length + ((progress.bestScore ?? 0) >= PASS_RATE ? 1 : 0);
  return { done, total };
}
