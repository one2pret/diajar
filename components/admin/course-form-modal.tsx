"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, X } from "lucide-react";
import type { DummyCourse, DummyModule, DummyTeacher } from "@/lib/dummy-data";
import { extractYoutubeVideoId } from "@/lib/utils";

interface CourseFormModalProps {
  initialCourse?: DummyCourse;
  teachers: DummyTeacher[];
  onClose: () => void;
  onSave: (course: Omit<DummyCourse, "id"> & { id?: string }) => void;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function CourseFormModal({
  initialCourse,
  teachers,
  onClose,
  onSave,
}: CourseFormModalProps) {
  const [title, setTitle] = useState(initialCourse?.title ?? "");
  const [slug, setSlug] = useState(initialCourse?.slug ?? "");
  const [description, setDescription] = useState(initialCourse?.description ?? "");
  const [level, setLevel] = useState<DummyCourse["level"]>(initialCourse?.level ?? "beginner");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialCourse?.coverImageUrl ?? "https://picsum.photos/seed/new-course/600/400"
  );
  const [modules, setModules] = useState<DummyModule[]>(initialCourse?.modules ?? []);
  const [error, setError] = useState<string | null>(null);

  // Sub-form tambah module
  const [moduleUrl, setModuleUrl] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleCuratorNote, setModuleCuratorNote] = useState("");
  const [moduleTeacherId, setModuleTeacherId] = useState(teachers[0]?.id ?? "");
  const [moduleMinutes, setModuleMinutes] = useState("15");

  const previewVideoId = extractYoutubeVideoId(moduleUrl);

  function handleAddModule() {
    if (!previewVideoId) {
      setError("URL YouTube module tidak valid.");
      return;
    }
    if (!moduleTitle.trim()) {
      setError("Judul module wajib diisi.");
      return;
    }

    const newModule: DummyModule = {
      id: crypto.randomUUID(),
      youtubeVideoId: previewVideoId,
      title: moduleTitle.trim(),
      curatorNote: moduleCuratorNote.trim(),
      durationSeconds: Math.max(1, Number(moduleMinutes) || 0) * 60,
      orderIndex: modules.length + 1,
      teacherId: moduleTeacherId,
      isCompleted: false,
    };

    setModules((prev) => [...prev, newModule]);
    setModuleUrl("");
    setModuleTitle("");
    setModuleCuratorNote("");
    setModuleMinutes("15");
    setError(null);
  }

  function handleRemoveModule(id: string) {
    setModules((prev) =>
      prev.filter((m) => m.id !== id).map((m, index) => ({ ...m, orderIndex: index + 1 }))
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Judul dan deskripsi course wajib diisi.");
      return;
    }
    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      setError("Slug tidak boleh kosong.");
      return;
    }

    onSave({
      id: initialCourse?.id,
      slug: finalSlug,
      title: title.trim(),
      description: description.trim(),
      level,
      coverImageUrl: coverImageUrl.trim(),
      modules,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-popover p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {initialCourse ? "Edit Course" : "Tambah Course"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium text-foreground">
                Judul Course
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="mis. Prompt Engineering + RAG untuk Developer"
                className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="slug" className="text-sm font-medium text-foreground">
                Slug (opsional, auto dari judul)
              </label>
              <input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="prompt-engineering-rag"
                className="h-10 rounded-md border border-border-strong bg-background px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Deskripsi
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="rounded-md border border-border-strong bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="level" className="text-sm font-medium text-foreground">
                Level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value as DummyCourse["level"])}
                className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="beginner">Pemula</option>
                <option value="intermediate">Menengah</option>
                <option value="advanced">Mahir</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="coverImageUrl" className="text-sm font-medium text-foreground">
                URL Cover
              </label>
              <input
                id="coverImageUrl"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-subtle p-4">
            <h3 className="text-sm font-semibold text-foreground">Module</h3>

            {modules.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {modules.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {m.orderIndex}. {m.title}
                      </p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {m.youtubeVideoId}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(m.id)}
                      aria-label={`Hapus module ${m.title}`}
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <input
                value={moduleUrl}
                onChange={(e) => setModuleUrl(e.target.value)}
                placeholder="URL YouTube module (https://youtube.com/watch?v=...)"
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
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                placeholder="Judul module"
                className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <textarea
                value={moduleCuratorNote}
                onChange={(e) => setModuleCuratorNote(e.target.value)}
                placeholder="Curator note — kenapa video ini dipilih"
                rows={2}
                className="rounded-md border border-border-strong bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={moduleTeacherId}
                  onChange={(e) => setModuleTeacherId(e.target.value)}
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
                  value={moduleMinutes}
                  onChange={(e) => setModuleMinutes(e.target.value)}
                  placeholder="Durasi (menit)"
                  className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="button"
                onClick={handleAddModule}
                className="inline-flex items-center justify-center gap-1.5 self-start rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Plus size={14} strokeWidth={1.75} />
                Tambah Module
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Simpan Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
