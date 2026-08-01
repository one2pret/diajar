import type { Metadata } from "next";
import { dummyCourses, dummyTeachers } from "@/lib/dummy-data";
import { CoursesManager } from "@/components/admin/courses-manager";

export const metadata: Metadata = {
  title: "Courses — Admin Diajar",
};

export default function AdminCoursesPage() {
  return <CoursesManager initialCourses={dummyCourses} teachers={dummyTeachers} />;
}
