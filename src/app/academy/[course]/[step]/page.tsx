import { notFound } from "next/navigation";
import { courses } from "@/data/academy";
import LessonView from "@/components/academy/LessonView";

export const dynamicParams = false;

// 各コースのレッスン＋評価テスト（quiz）＋修了証（certificate）を静的に書き出す
export function generateStaticParams() {
  return courses.flatMap((c) =>
    [...c.lessons.map((l) => l.id), "quiz", "certificate"].map((step) => ({ course: c.id, step }))
  );
}

export default async function StepPage({ params }: { params: Promise<{ course: string; step: string }> }) {
  const { course: courseId, step } = await params;
  const course = courses.find((c) => c.id === courseId);
  if (!course) notFound();
  return <LessonView course={course} stepId={step} />;
}
