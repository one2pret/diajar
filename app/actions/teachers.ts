"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { teachers } from "@/lib/db/schema";

const teacherSchema = z.object({
  channelId: z.string().min(1, "Channel ID/handle wajib diisi."),
  channelName: z.string().min(1, "Nama channel wajib diisi."),
  channelUrl: z.string().url("URL channel tidak valid."),
  avatarUrl: z.string().url("URL avatar tidak valid.").optional().or(z.literal("")),
  bio: z.string().optional(),
});

export type TeacherActionState =
  | { success: true }
  | { success: false; error: string };

function extractHandle(url: string): string {
  const match = url.match(/@([\w-]+)/);
  return match ? match[1] : url;
}

export async function createTeacher(input: {
  channelName: string;
  channelUrl: string;
  avatarUrl: string;
  bio: string;
}): Promise<TeacherActionState> {
  const parsed = teacherSchema.safeParse({
    ...input,
    channelId: extractHandle(input.channelUrl),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  await db.insert(teachers).values({
    channelId: parsed.data.channelId,
    channelName: parsed.data.channelName,
    channelUrl: parsed.data.channelUrl,
    avatarUrl: parsed.data.avatarUrl || null,
    bio: parsed.data.bio || null,
  });

  revalidatePath("/admin/teachers");
  return { success: true };
}

export async function updateTeacher(
  id: string,
  input: { channelName: string; channelUrl: string; avatarUrl: string; bio: string }
): Promise<TeacherActionState> {
  const parsed = teacherSchema.safeParse({
    ...input,
    channelId: extractHandle(input.channelUrl),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  await db
    .update(teachers)
    .set({
      channelName: parsed.data.channelName,
      channelUrl: parsed.data.channelUrl,
      avatarUrl: parsed.data.avatarUrl || null,
      bio: parsed.data.bio || null,
    })
    .where(eq(teachers.id, id));

  revalidatePath("/admin/teachers");
  return { success: true };
}

export async function deleteTeacher(id: string): Promise<TeacherActionState> {
  try {
    await db.delete(teachers).where(eq(teachers.id, id));
  } catch {
    return {
      success: false,
      error: "Teacher ini masih dipakai di satu atau lebih module. Hapus/ubah module itu dulu.",
    };
  }
  revalidatePath("/admin/teachers");
  return { success: true };
}
