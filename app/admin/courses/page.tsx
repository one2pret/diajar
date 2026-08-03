import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CoursesManager } from "@/components/admin/courses-manager";

export const metadata: Metadata = {
  title: "Courses — Admin Diajar",
};

export default async function AdminCoursesPage() {
  const session = await auth();

  const rows = await db.query.courses.findMany({
    orderBy: (c, { desc }) => [desc(c.createdAt)],
    with: { modules: { columns: { id: true } } },
  });

  const courses = rows.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    level: (c.level as "beginner" | "intermediate" | "advanced") ?? "beginner",
    isPublished: c.isPublished,
    moduleCount: c.modules.length,
  }));

  return <CoursesManager courses={courses} adminUserId={session!.user.id} />;
}
