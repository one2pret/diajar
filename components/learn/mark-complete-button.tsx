"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { markModuleComplete } from "@/app/actions/progress";

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
        {isPending ? (
          <Loader2 size={16} strokeWidth={1.75} className="animate-spin" />
        ) : isCompleted ? (
          <CheckCircle2 size={16} strokeWidth={1.75} />
        ) : (
          <Circle size={16} strokeWidth={1.75} />
        )}
        {isCompleted ? "Selesai" : "Tandai Selesai"}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
