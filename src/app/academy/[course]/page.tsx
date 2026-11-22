import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses } from "@/data/academy";
import CourseOverview from "@/components/academy/CourseOverview";

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course: courseId } = await params;
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return { title: "コースが見つかりません" };
  }
  return {
    title: `${course.title} | Antigravity Academy`,
    description: course.summary,
  };
}

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: courseId } = await params;
  const course = courses.find((c) => c.id === courseId);
  if (!course) notFound();
  return <CourseOverview course={course} />;
}
