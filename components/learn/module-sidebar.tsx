import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import type { DummyModule } from "@/lib/dummy-data";
import { formatDuration } from "@/lib/utils";

export function ModuleSidebar({
  modules,
  activeModuleId,
}: {
  modules: DummyModule[];
  activeModuleId: string;
}) {
  const sorted = [...modules].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <nav aria-label="Daftar module" className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Daftar Module</h2>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
          {modules.filter((m) => m.isCompleted).length} / {modules.length} selesai
        </p>
      </div>

      <ol className="divide-y divide-border">
        {sorted.map((module) => {
          const isActive = module.id === activeModuleId;
          return (
            <li key={module.id}>
              <div
                className={`flex items-start gap-3 px-4 py-3 ${
                  isActive ? "bg-primary-subtle" : ""
                }`}
              >
                <span className="mt-0.5 shrink-0 text-muted-foreground">
                  {isActive ? (
                    <PlayCircle size={18} strokeWidth={1.75} className="text-primary" />
                  ) : module.isCompleted ? (
                    <CheckCircle2 size={18} strokeWidth={1.75} className="text-success" />
                  ) : (
                    <Circle size={18} strokeWidth={1.75} />
                  )}
                </span>
                <div className="min-w-0">
                  <p
                    className={`text-sm leading-snug ${
                      isActive ? "font-semibold text-foreground" : "text-foreground"
                    }`}
                  >
                    {module.orderIndex}. {module.title}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {formatDuration(module.durationSeconds)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
