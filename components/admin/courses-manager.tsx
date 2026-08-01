"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { DummyCourse, DummyTeacher } from "@/lib/dummy-data";
import { formatLevel } from "@/lib/utils";
import { CourseFormModal } from "@/components/admin/course-form-modal";

export function CoursesManager({
  initialCourses,
  teachers,
}: {
  initialCourses: DummyCourse[];
  teachers: DummyTeacher[];
}) {
  const [courses, setCourses] = useState<DummyCourse[]>(initialCourses);
  const [editingCourse, setEditingCourse] = useState<DummyCourse | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openCreateModal() {
    setEditingCourse(undefined);
    setIsModalOpen(true);
  }

  function openEditModal(course: DummyCourse) {
    setEditingCourse(course);
    setIsModalOpen(true);
  }

  function handleSave(data: Omit<DummyCourse, "id"> & { id?: string }) {
    // TODO: connect to database — ganti setCourses ini dengan Server Action createCourse/updateCourse
    if (data.id) {
      setCourses((prev) =>
        prev.map((c) => (c.id === data.id ? { ...c, ...data, id: data.id! } : c))
      );
    } else {
      setCourses((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
    }
    setIsModalOpen(false);
  }

  function handleDelete(id: string) {
    // TODO: connect to database — ganti setCourses ini dengan Server Action deleteCourse
    if (confirm("Hapus course ini beserta semua module-nya?")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Jalur belajar beserta module video di dalamnya.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={teachers.length === 0}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40"
        >
          <Plus size={16} strokeWidth={1.75} />
          Tambah Course
        </button>
      </div>
      {teachers.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Tambah minimal satu teacher dulu sebelum bisa membuat course.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Module</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={course.coverImageUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{course.title}</p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        /{course.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatLevel(course.level)}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">
                  {course.modules.length}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => openEditModal(course)}
                      aria-label={`Edit ${course.title}`}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil size={15} strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      aria-label={`Hapus ${course.title}`}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={15} strokeWidth={1.75} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {courses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
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
          teachers={teachers}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
