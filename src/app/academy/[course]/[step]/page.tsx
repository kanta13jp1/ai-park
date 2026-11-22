import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; step: string }>;
}): Promise<Metadata> {
  const { course: courseId, step } = await params;
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return { title: "レッスンが見つかりません" };
  }
  if (step === "quiz") {
    return {
      title: `評価テスト | ${course.title}`,
      description: `${course.title} の修了確認テスト`,
    };
  }
  if (step === "certificate") {
    return {
      title: `修了証 | ${course.title}`,
      description: `${course.title} の受講修了証と報告テキスト作成画面`,
    };
  }
  const lesson = course.lessons.find((l) => l.id === step);
  if (!lesson) {
    return {
      title: course.title,
      description: course.summary,
    };
  }
  return {
    title: `${lesson.title} | ${course.title}`,
    description: lesson.summary,
  };
}

export default async function StepPage({ params }: { params: Promise<{ course: string; step: string }> }) {
  const { course: courseId, step } = await params;
  const course = courses.find((c) => c.id === courseId);
  if (!course) notFound();
  return <LessonView course={course} stepId={step} />;
}
