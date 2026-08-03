"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";

const courseSchema = z.object({
  title: z.string().min(1, "Judul course wajib diisi."),
  slug: z
    .string()
    .min(1, "Slug wajib diisi.")
    .regex(/^[a-z0-9-]+$/, "Slug cuma boleh huruf kecil, angka, dan tanda hubung."),
  description: z.string().min(1, "Deskripsi wajib diisi."),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  isPublished: z.boolean(),
});

export type CourseActionState =
  | { success: true; id?: string }
  | { success: false; error: string };

export async function createCourse(input: {
  title: string;
  slug: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  isPublished: boolean;
  createdBy: string;
}): Promise<CourseActionState> {
  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const [existing] = await db
    .select({ id: courses.id })
    .from(courses)
    .where(eq(courses.slug, parsed.data.slug))
    .limit(1);
  if (existing) {
    return { success: false, error: "Slug ini sudah dipakai course lain." };
  }

  const [inserted] = await db
    .insert(courses)
    .values({ ...parsed.data, createdBy: input.createdBy })
    .returning({ id: courses.id });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
  return { success: true, id: inserted.id };
}

export async function updateCourse(
  id: string,
  input: {
    title: string;
    slug: string;
    description: string;
    level: "beginner" | "intermediate" | "advanced";
    isPublished: boolean;
  }
): Promise<CourseActionState> {
  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const [existing] = await db
    .select({ id: courses.id })
    .from(courses)
    .where(eq(courses.slug, parsed.data.slug))
    .limit(1);
  if (existing && existing.id !== id) {
    return { success: false, error: "Slug ini sudah dipakai course lain." };
  }

  await db
    .update(courses)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(courses.id, id));

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath(`/courses/${parsed.data.slug}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteCourse(id: string): Promise<CourseActionState> {
  await db.delete(courses).where(eq(courses.id, id));
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
  return { success: true };
}
