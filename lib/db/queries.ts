import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { courses, progress } from "./schema";

export interface CourseListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  coverImageUrl: string;
  moduleCount: number;
}

export interface CourseModuleItem {
  id: string;
  youtubeVideoId: string;
  title: string;
  curatorNote: string;
  durationSeconds: number;
  orderIndex: number;
  teacher: {
    id: string;
    channelName: string;
    channelUrl: string;
    avatarUrl: string;
    bio: string;
  } | null;
  isCompleted: boolean;
}

export interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  modules: CourseModuleItem[];
}

function moduleThumbnail(youtubeVideoId: string): string {
  return `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
}

function toLevel(level: string | null): "beginner" | "intermediate" | "advanced" {
  return level === "intermediate" || level === "advanced" ? level : "beginner";
}

/** Hanya course yang sudah dipublish yang boleh tampil ke peserta. */
export async function getPublishedCourses(): Promise<CourseListItem[]> {
  const rows = await db.query.courses.findMany({
    where: eq(courses.isPublished, true),
    with: {
      modules: {
        orderBy: (m, { asc }) => [asc(m.orderIndex)],
        limit: 1,
      },
    },
  });

  return rows.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description ?? "",
    level: toLevel(c.level),
    coverImageUrl: c.modules[0]
      ? moduleThumbnail(c.modules[0].youtubeVideoId)
      : "https://picsum.photos/seed/diajar-course/600/400",
    moduleCount: c.modules.length,
  }));
}

/** Ambil 1 course beserta module & teacher-nya, plus progress user (kalau sedang login). */
export async function getPublishedCourseBySlug(
  slug: string,
  userId?: string
): Promise<CourseDetail | undefined> {
  const course = await db.query.courses.findFirst({
    where: and(eq(courses.slug, slug), eq(courses.isPublished, true)),
    with: {
      modules: {
        orderBy: (m, { asc }) => [asc(m.orderIndex)],
        with: { teacher: true },
      },
    },
  });

  if (!course) return undefined;

  const completedModuleIds = new Set<string>();
  if (userId && course.modules.length > 0) {
    const rows = await db
      .select({ moduleId: progress.moduleId })
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.isCompleted, true)));
    for (const row of rows) completedModuleIds.add(row.moduleId);
  }

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description ?? "",
    level: toLevel(course.level),
    modules: course.modules.map((m) => ({
      id: m.id,
      youtubeVideoId: m.youtubeVideoId,
      title: m.title,
      curatorNote: m.curatorNote ?? "",
      durationSeconds: m.durationSeconds ?? 0,
      orderIndex: m.orderIndex,
      teacher: m.teacher
        ? {
            id: m.teacher.id,
            channelName: m.teacher.channelName,
            channelUrl: m.teacher.channelUrl,
            avatarUrl: m.teacher.avatarUrl ?? "https://i.pravatar.cc/150",
            bio: m.teacher.bio ?? "",
          }
        : null,
      isCompleted: completedModuleIds.has(m.id),
    })),
  };
}
