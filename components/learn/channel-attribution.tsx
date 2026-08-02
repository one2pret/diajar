import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { CourseModuleItem } from "@/lib/db/queries";

type Teacher = NonNullable<CourseModuleItem["teacher"]>;

export function ChannelAttribution({ teacher }: { teacher: Teacher }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-b-lg border border-t-0 border-border bg-subtle px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
          <Image
            src={teacher.avatarUrl}
            alt={teacher.channelName}
            fill
            className="object-cover"
            sizes="36px"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{teacher.channelName}</p>
          <p className="truncate text-xs text-muted-foreground">Video asli dari channel ini</p>
        </div>
      </div>

      <a
        href={teacher.channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border-strong px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      >
        Tonton di YouTube
        <ExternalLink size={13} strokeWidth={1.75} />
      </a>
    </div>
  );
}
