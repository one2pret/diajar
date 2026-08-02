import Link from "next/link";
import Image from "next/image";
import { Layers, BarChart3 } from "lucide-react";
import type { CourseListItem } from "@/lib/db/queries";
import { formatLevel } from "@/lib/utils";

export function CourseCard({ course }: { course: CourseListItem }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={course.coverImageUrl}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-xl font-semibold leading-tight text-foreground">{course.title}</h3>
        <p className="line-clamp-2 text-sm leading-normal text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-auto flex items-center gap-4 pt-2 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Layers size={14} strokeWidth={1.75} />
            {course.moduleCount} module
          </span>
          <span className="inline-flex items-center gap-1">
            <BarChart3 size={14} strokeWidth={1.75} />
            {formatLevel(course.level)}
          </span>
        </div>
      </div>
    </Link>
  );
}
