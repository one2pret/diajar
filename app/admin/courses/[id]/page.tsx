import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { teachers, transcriptChunks } from "@/lib/db/schema";
import { ModuleList } from "@/components/admin/module-list";
import { AddModuleForm } from "@/components/admin/add-module-form";

export const metadata: Metadata = {
  title: "Kelola Module — Admin Diajar",
};

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await db.query.courses.findFirst({
    where: (c, { eq }) => eq(c.id, id),
    with: {
      modules: {
        orderBy: (m, { asc }) => [asc(m.orderIndex)],
        with: { teacher: { columns: { channelName: true } } },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const chunkCounts = await db
    .select({ moduleId: transcriptChunks.moduleId, count: count() })
    .from(transcriptChunks)
    .groupBy(transcriptChunks.moduleId);
  const chunkCountByModule = new Map(chunkCounts.map((c) => [c.moduleId, c.count]));

  const allTeachers = await db
    .select({ id: teachers.id, channelName: teachers.channelName })
    .from(teachers)
    .orderBy(teachers.channelName);

  const moduleRows = course.modules.map((m) => ({
    id: m.id,
    orderIndex: m.orderIndex,
    title: m.title,
    youtubeVideoId: m.youtubeVideoId,
    durationSeconds: m.durationSeconds ?? 0,
    teacherName: m.teacher?.channelName ?? null,
    chunkCount: chunkCountByModule.get(m.id) ?? 0,
  }));

  return (
    <div>
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} strokeWidth={1.75} />
        Kembali ke Courses
      </Link>

      <div className="mt-3">
        <h1 className="text-2xl font-semibold text-foreground">{course.title}</h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">/{course.slug}</p>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <ModuleList courseId={course.id} modules={moduleRows} />

        {allTeachers.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Tambah minimal satu teacher dulu di halaman Teachers sebelum bisa menambah module.
          </p>
        ) : (
          <AddModuleForm courseId={course.id} teachers={allTeachers} />
        )}
      </div>
    </div>
  );
}
