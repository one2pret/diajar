"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { deleteModule } from "@/app/actions/modules";
import { formatDuration } from "@/lib/utils";

export interface ModuleRow {
  id: string;
  orderIndex: number;
  title: string;
  youtubeVideoId: string;
  durationSeconds: number;
  teacherName: string | null;
  chunkCount: number;
}

export function ModuleList({ courseId, modules }: { courseId: string; modules: ModuleRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(moduleId: string, title: string) {
    if (!confirm(`Hapus module "${title}"? Transcript & progress terkait ikut terhapus.`)) return;
    startTransition(async () => {
      await deleteModule(moduleId, courseId);
      router.refresh();
    });
  }

  if (modules.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Belum ada module. Tambah lewat form di bawah.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {modules.map((m) => (
        <li
          key={m.id}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
        >
          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={`https://img.youtube.com/vi/${m.youtubeVideoId}/mqdefault.jpg`}
              alt={m.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {m.orderIndex}. {m.title}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {formatDuration(m.durationSeconds)} · {m.teacherName ?? "Tanpa teacher"} ·{" "}
              {m.chunkCount > 0 ? `${m.chunkCount} chunk transcript` : "belum ada transcript"}
            </p>
          </div>

          <button
            onClick={() => handleDelete(m.id, m.title)}
            disabled={isPending}
            aria-label={`Hapus module ${m.title}`}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            <Trash2 size={15} strokeWidth={1.75} />
          </button>
        </li>
      ))}
    </ul>
  );
}
