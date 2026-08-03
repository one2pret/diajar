"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import { createModule } from "@/app/actions/modules";
import { extractYoutubeVideoId } from "@/lib/utils";

interface Teacher {
  id: string;
  channelName: string;
}

export function AddModuleForm({ courseId, teachers }: { courseId: string; teachers: Teacher[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [curatorNote, setCuratorNote] = useState("");
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
  const [durationMinutes, setDurationMinutes] = useState("15");
  const [showManualTranscript, setShowManualTranscript] = useState(false);
  const [manualTranscript, setManualTranscript] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [ingestMessage, setIngestMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const previewVideoId = extractYoutubeVideoId(youtubeUrl);

  function resetForm() {
    setYoutubeUrl("");
    setTitle("");
    setCuratorNote("");
    setDurationMinutes("15");
    setManualTranscript("");
    setShowManualTranscript(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIngestMessage(null);

    if (!teacherId) {
      setError("Pilih teacher dulu.");
      return;
    }

    startTransition(async () => {
      const result = await createModule({
        courseId,
        teacherId,
        youtubeUrl,
        title,
        curatorNote,
        durationMinutes,
        manualTranscript: manualTranscript.trim() || undefined,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setIngestMessage({ ok: result.ingest.embedded, text: result.ingest.message });
      resetForm();
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">Tambah Module</h3>

      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
        <input
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="URL YouTube (https://youtube.com/watch?v=...)"
          className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {previewVideoId && (
          <div className="relative aspect-video w-40 overflow-hidden rounded-md bg-muted">
            <Image
              src={`https://img.youtube.com/vi/${previewVideoId}/mqdefault.jpg`}
              alt="Preview thumbnail"
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
        )}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul module"
          required
          className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <textarea
          value={curatorNote}
          onChange={(e) => setCuratorNote(e.target.value)}
          placeholder="Curator note — kenapa video ini dipilih"
          rows={2}
          className="rounded-md border border-border-strong bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.channelName}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            placeholder="Durasi (menit)"
            className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowManualTranscript((v) => !v)}
          className="self-start text-xs font-medium text-primary hover:underline"
        >
          {showManualTranscript
            ? "Sembunyikan paste transcript manual"
            : "Video tidak punya caption? Paste transcript manual"}
        </button>

        {showManualTranscript && (
          <textarea
            value={manualTranscript}
            onChange={(e) => setManualTranscript(e.target.value)}
            placeholder="Paste transcript video di sini (fallback kalau auto-fetch caption gagal)..."
            rows={5}
            className="rounded-md border border-border-strong bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {ingestMessage && (
          <p
            className={`inline-flex items-start gap-1.5 text-sm ${
              ingestMessage.ok ? "text-success" : "text-warning"
            }`}
          >
            {ingestMessage.ok ? (
              <CheckCircle2 size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
            )}
            {ingestMessage.text}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || teachers.length === 0}
          className="inline-flex items-center justify-center gap-1.5 self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Plus size={16} strokeWidth={1.75} />
          {isPending ? "Memproses..." : "Tambah Module"}
        </button>
      </form>
    </div>
  );
}
