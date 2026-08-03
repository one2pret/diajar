"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { createCourse, updateCourse, deleteCourse } from "@/app/actions/courses";
import { formatLevel } from "@/lib/utils";
import { CourseFormModal, type CourseFormValues } from "@/components/admin/course-form-modal";

export interface CourseRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  level: "beginner" | "intermediate" | "advanced";
  isPublished: boolean;
  moduleCount: number;
}

export function CoursesManager({
  courses,
  adminUserId,
}: {
  courses: CourseRow[];
  adminUserId: string;
}) {
  const router = useRouter();
  const [editingCourse, setEditingCourse] = useState<CourseFormValues | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreateModal() {
    setEditingCourse(undefined);
    setModalError(null);
    setIsModalOpen(true);
  }

  function openEditModal(course: CourseRow) {
    setEditingCourse({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description ?? "",
      level: course.level,
      isPublished: course.isPublished,
    });
    setModalError(null);
    setIsModalOpen(true);
  }

  function handleSave(data: CourseFormValues) {
    startTransition(async () => {
      const result = data.id
        ? await updateCourse(data.id, data)
        : await createCourse({ ...data, createdBy: adminUserId });

      if (result.success) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        setModalError(result.error);
      }
    });
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus course "${title}" beserta semua module-nya?`)) return;
    startTransition(async () => {
      const result = await deleteCourse(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Jalur belajar. Kelola module di halaman detail tiap course.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus size={16} strokeWidth={1.75} />
          Tambah Course
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Module</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{course.title}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      /{course.slug}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatLevel(course.level)}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">{course.moduleCount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      course.isPublished
                        ? "bg-success-subtle text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      aria-label={`Kelola module ${course.title}`}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Layers size={15} strokeWidth={1.75} />
                    </Link>
                    <button
                      onClick={() => openEditModal(course)}
                      aria-label={`Edit ${course.title}`}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil size={15} strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
                      disabled={isPending}
                      aria-label={`Hapus ${course.title}`}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    >
                      <Trash2 size={15} strokeWidth={1.75} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {courses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Belum ada course. Tambah yang pertama.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CourseFormModal
          initialCourse={editingCourse}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          error={modalError}
          isSaving={isPending}
        />
      )}
    </div>
  );
}
