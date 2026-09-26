import { notFound } from "next/navigation";
import { courses } from "@/data/academy";
import CourseView from "./CourseView";

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.id }));
}

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: courseId } = await params;
  const course = courses.find((c) => c.id === courseId);
  if (!course) notFound();
  return <CourseView course={course} />;
}
