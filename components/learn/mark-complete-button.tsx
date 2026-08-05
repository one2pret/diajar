"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { markModuleComplete } from "@/app/actions/progress";
import { cn } from "@/lib/utils";

export function MarkCompleteButton({
  moduleId,
  courseSlug,
  initialCompleted,
  isLoggedIn,
}: {
  moduleId: string;
  courseSlug: string;
  initialCompleted: boolean;
  isLoggedIn: boolean;
}) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isLoggedIn) {
      setError("Masuk dulu untuk menandai progress.");
      return;
    }

    const next = !isCompleted;
    setIsCompleted(next);
    setError(null);

    startTransition(async () => {
      const result = await markModuleComplete(moduleId, courseSlug, next);
      if (!result.success) {
        setIsCompleted(!next);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
          isCompleted
            ? "border-success bg-success-subtle text-success"
            : "border-border-strong text-foreground hover:bg-muted"
        }`}
      >
        {/*
          Ketiga ikon selalu di-mount, cuma di-toggle lewat CSS (bukan
          conditional mount/unmount elemen berbeda tipe). Kalau elemen
          berbeda tipe di-swap tepat saat Next.js auto-refresh RSC (karena
          revalidatePath di markModuleComplete) berlangsung di transition
          yang sama, React bisa gagal reconcile ("insertBefore" error).
        */}
        <Loader2
          size={16}
          strokeWidth={1.75}
          className={cn("animate-spin", isPending ? "block" : "hidden")}
        />
        <CheckCircle2
          size={16}
          strokeWidth={1.75}
          className={cn(!isPending && isCompleted ? "block" : "hidden")}
        />
        <Circle
          size={16}
          strokeWidth={1.75}
          className={cn(!isPending && !isCompleted ? "block" : "hidden")}
        />
        {isCompleted ? "Selesai" : "Tandai Selesai"}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
