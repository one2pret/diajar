import Link from "next/link";
import Image from "next/image";
import { Layers, BarChart3 } from "lucide-react";
import type { DummyCourse } from "@/lib/dummy-data";
import { formatLevel } from "@/lib/utils";

export function V2CourseCard({ course }: { course: DummyCourse }) {
  return (
    <Link href={`/courses/${course.slug}`} className="v2-card v2-hover-lift flex flex-col overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden border-b-[3px] border-[var(--v2-ink)] bg-[var(--v2-muted)]">
        <Image
          src={course.coverImageUrl}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="v2-heading text-lg font-bold leading-tight">{course.title}</h3>
        <p className="line-clamp-2 text-sm leading-normal text-[var(--v2-muted-foreground)]">
          {course.description}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full border-2 border-[var(--v2-ink)] px-2.5 py-1">
            <Layers size={13} strokeWidth={2} />
            {course.modules.length} module
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border-2 border-[var(--v2-ink)] px-2.5 py-1">
            <BarChart3 size={13} strokeWidth={2} />
            {formatLevel(course.level)}
          </span>
        </div>
      </div>
    </Link>
  );
}
