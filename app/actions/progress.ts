"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { progress } from "@/lib/db/schema";

export type MarkModuleCompleteState =
  | { success: true }
  | { success: false; error: string };

export async function markModuleComplete(
  moduleId: string,
  courseSlug: string,
  isCompleted: boolean
): Promise<MarkModuleCompleteState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Kamu harus masuk dulu untuk menandai progress." };
  }

  const userId = session.user.id;

  const [existing] = await db
    .select({ id: progress.id })
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.moduleId, moduleId)))
    .limit(1);

  if (existing) {
    await db
      .update(progress)
      .set({ isCompleted, completedAt: isCompleted ? new Date() : null })
      .where(eq(progress.id, existing.id));
  } else {
    await db.insert(progress).values({
      userId,
      moduleId,
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    });
  }

  revalidatePath(`/courses/${courseSlug}`);
  return { success: true };
}
