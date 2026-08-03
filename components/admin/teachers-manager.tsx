"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { createTeacher, updateTeacher, deleteTeacher } from "@/app/actions/teachers";
import { TeacherFormModal, type TeacherFormValues } from "@/components/admin/teacher-form-modal";

export interface TeacherRow {
  id: string;
  channelName: string;
  channelUrl: string;
  avatarUrl: string | null;
  bio: string | null;
}

export function TeachersManager({ teachers }: { teachers: TeacherRow[] }) {
  const router = useRouter();
  const [editingTeacher, setEditingTeacher] = useState<TeacherFormValues | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreateModal() {
    setEditingTeacher(undefined);
    setModalError(null);
    setIsModalOpen(true);
  }

  function openEditModal(teacher: TeacherRow) {
    setEditingTeacher({
      id: teacher.id,
      channelName: teacher.channelName,
      channelUrl: teacher.channelUrl,
      avatarUrl: teacher.avatarUrl ?? "",
      bio: teacher.bio ?? "",
    });
    setModalError(null);
    setIsModalOpen(true);
  }

  function handleSave(data: TeacherFormValues) {
    startTransition(async () => {
      const result = data.id
        ? await updateTeacher(data.id, data)
        : await createTeacher(data);

      if (result.success) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        setModalError(result.error);
      }
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus teacher "${name}"? Course yang memakai teacher ini perlu dicek manual.`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteTeacher(id);
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
                        src={teacher.avatarUrl || "https://i.pravatar.cc/150"}
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
                      onClick={() => handleDelete(teacher.id, teacher.channelName)}
                      disabled={isPending}
                      aria-label={`Hapus ${teacher.channelName}`}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
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
          error={modalError}
          isSaving={isPending}
        />
      )}
    </div>
  );
}
