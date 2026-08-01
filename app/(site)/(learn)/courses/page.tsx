import type { Metadata } from "next";
import { dummyCourses } from "@/lib/dummy-data";
import { CourseCard } from "@/components/learn/course-card";

export const metadata: Metadata = {
  title: "Course — Diajar",
  description: "Jalur belajar Prompt Engineering & RAG hasil kurasi video YouTube terbaik.",
};

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Course</h1>
        <p className="mt-3 text-base leading-normal text-muted-foreground">
          Semua jalur belajar yang tersedia di Diajar, disusun dari video-video YouTube
          pilihan seputar AI engineering untuk developer.
        </p>
      </div>

      {dummyCourses.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">Belum ada course tersedia.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dummyCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
