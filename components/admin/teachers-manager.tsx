"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import type { DummyTeacher } from "@/lib/dummy-data";
import { TeacherFormModal } from "@/components/admin/teacher-form-modal";

export function TeachersManager({ initialTeachers }: { initialTeachers: DummyTeacher[] }) {
  const [teachers, setTeachers] = useState<DummyTeacher[]>(initialTeachers);
  const [editingTeacher, setEditingTeacher] = useState<DummyTeacher | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openCreateModal() {
    setEditingTeacher(undefined);
    setIsModalOpen(true);
  }

  function openEditModal(teacher: DummyTeacher) {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  }

  function handleSave(data: Omit<DummyTeacher, "id"> & { id?: string }) {
    // TODO: connect to database — ganti setTeachers ini dengan Server Action createTeacher/updateTeacher
    if (data.id) {
      setTeachers((prev) =>
        prev.map((t) => (t.id === data.id ? { ...t, ...data, id: data.id! } : t))
      );
    } else {
      setTeachers((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
    }
    setIsModalOpen(false);
  }

  function handleDelete(id: string) {
    // TODO: connect to database — ganti setTeachers ini dengan Server Action deleteTeacher
    if (confirm("Hapus teacher ini? Course yang memakai teacher ini perlu dicek manual.")) {
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Teachers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Channel YouTube yang jadi sumber video di course.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus size={16} strokeWidth={1.75} />
          Tambah Teacher
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Bio</th>
              <th className="px-4 py-3 font-medium">Link</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={teacher.avatarUrl}
                        alt={teacher.channelName}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <span className="font-medium text-foreground">{teacher.channelName}</span>
                  </div>
                </td>
                <td className="max-w-xs px-4 py-3 text-muted-foreground">
                  <span className="line-clamp-2">{teacher.bio}</span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={teacher.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Channel
                    <ExternalLink size={12} strokeWidth={1.75} />
                  </a>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => openEditModal(teacher)}
                      aria-label={`Edit ${teacher.channelName}`}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil size={15} strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      aria-label={`Hapus ${teacher.channelName}`}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={15} strokeWidth={1.75} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {teachers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Belum ada teacher. Tambah yang pertama.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <TeacherFormModal
          initialTeacher={editingTeacher}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
