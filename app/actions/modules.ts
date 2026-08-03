"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { courses, modules } from "@/lib/db/schema";
import { extractVideoId, getVideoMetadata } from "@/lib/youtube";
import { ingestModuleTranscript, ingestManualTranscript, type IngestResult } from "@/lib/ai/ingest";

const createModuleSchema = z.object({
  courseId: z.string().uuid(),
  teacherId: z.string().uuid(),
  youtubeUrl: z.string().min(1, "URL YouTube wajib diisi."),
  title: z.string().min(1, "Judul module wajib diisi."),
  curatorNote: z.string().optional(),
  durationMinutes: z.coerce.number().int().min(1, "Durasi minimal 1 menit."),
  manualTranscript: z.string().optional(),
});

export type CreateModuleState =
  | { success: true; ingest: IngestResult }
  | { success: false; error: string };

export async function createModule(input: {
  courseId: string;
  teacherId: string;
  youtubeUrl: string;
  title: string;
  curatorNote: string;
  durationMinutes: string | number;
  manualTranscript?: string;
}): Promise<CreateModuleState> {
  const parsed = createModuleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const videoId = extractVideoId(parsed.data.youtubeUrl);
  if (!videoId) {
    return { success: false, error: "URL YouTube tidak valid — pastikan link video benar." };
  }

  const [course] = await db
    .select({ id: courses.id })
    .from(courses)
    .where(eq(courses.id, parsed.data.courseId))
    .limit(1);
  if (!course) {
    return { success: false, error: "Course tidak ditemukan." };
  }

  // Best-effort: isi metadata dari YouTube Data API kalau YOUTUBE_API_KEY tersedia.
  // Gagal/skip tidak menghentikan proses — field dari admin tetap dipakai.
  let title = parsed.data.title;
  try {
    if (process.env.YOUTUBE_API_KEY) {
      const metadata = await getVideoMetadata(videoId);
      if (!title.trim()) title = metadata.title;
    }
  } catch {
    // abaikan — pakai data yang diisi admin
  }

  const [lastModule] = await db
    .select({ orderIndex: modules.orderIndex })
    .from(modules)
    .where(eq(modules.courseId, parsed.data.courseId))
    .orderBy(desc(modules.orderIndex))
    .limit(1);
  const nextOrderIndex = (lastModule?.orderIndex ?? 0) + 1;

  const [inserted] = await db
    .insert(modules)
    .values({
      courseId: parsed.data.courseId,
      teacherId: parsed.data.teacherId,
      youtubeVideoId: videoId,
      title,
      curatorNote: parsed.data.curatorNote || null,
      durationSeconds: parsed.data.durationMinutes * 60,
      orderIndex: nextOrderIndex,
    })
    .returning({ id: modules.id });

  const manualTranscript = parsed.data.manualTranscript?.trim();
  const ingest = manualTranscript
    ? await ingestManualTranscript(inserted.id, manualTranscript)
    : await ingestModuleTranscript(inserted.id, videoId);

  revalidatePath(`/admin/courses/${parsed.data.courseId}`);
  revalidatePath("/courses");

  return { success: true, ingest };
}

export async function deleteModule(moduleId: string, courseId: string): Promise<void> {
  await db.delete(modules).where(eq(modules.id, moduleId));
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/courses");
}
