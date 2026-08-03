"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";

export interface CourseFormValues {
  id?: string;
  title: string;
  slug: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  isPublished: boolean;
}

interface CourseFormModalProps {
  initialCourse?: CourseFormValues;
  onClose: () => void;
  onSave: (course: CourseFormValues) => void;
  error?: string | null;
  isSaving?: boolean;
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
  onClose,
  onSave,
  error: externalError,
  isSaving,
}: CourseFormModalProps) {
  const [title, setTitle] = useState(initialCourse?.title ?? "");
  const [slug, setSlug] = useState(initialCourse?.slug ?? "");
  const [description, setDescription] = useState(initialCourse?.description ?? "");
  const [level, setLevel] = useState<CourseFormValues["level"]>(initialCourse?.level ?? "beginner");
  const [isPublished, setIsPublished] = useState(initialCourse?.isPublished ?? false);
  const [formError, setFormError] = useState<string | null>(null);

  const error = formError ?? externalError;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setFormError("Judul dan deskripsi course wajib diisi.");
      return;
    }
    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      setFormError("Slug tidak boleh kosong.");
      return;
    }
    setFormError(null);

    onSave({
      id: initialCourse?.id,
      slug: finalSlug,
      title: title.trim(),
      description: description.trim(),
      level,
      isPublished,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-popover p-6 shadow-lg">
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Deskripsi
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-md border border-border-strong bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="level" className="text-sm font-medium text-foreground">
              Level
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value as CourseFormValues["level"])}
              className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="beginner">Pemula</option>
              <option value="intermediate">Menengah</option>
              <option value="advanced">Mahir</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-border-strong accent-primary"
            />
            Publikasikan (tampil ke peserta di /courses)
          </label>

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
              disabled={isSaving}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
