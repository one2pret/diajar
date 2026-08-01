"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import type { DummyTeacher } from "@/lib/dummy-data";

interface TeacherFormModalProps {
  initialTeacher?: DummyTeacher;
  onClose: () => void;
  onSave: (teacher: Omit<DummyTeacher, "id"> & { id?: string }) => void;
}

export function TeacherFormModal({ initialTeacher, onClose, onSave }: TeacherFormModalProps) {
  const [channelName, setChannelName] = useState(initialTeacher?.channelName ?? "");
  const [channelUrl, setChannelUrl] = useState(initialTeacher?.channelUrl ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialTeacher?.avatarUrl ?? "");
  const [bio, setBio] = useState(initialTeacher?.bio ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!channelName.trim() || !channelUrl.trim()) {
      setError("Nama channel dan URL channel wajib diisi.");
      return;
    }
    if (!channelUrl.startsWith("http")) {
      setError("URL channel harus diawali http:// atau https://");
      return;
    }

    onSave({
      id: initialTeacher?.id,
      channelName: channelName.trim(),
      channelUrl: channelUrl.trim(),
      avatarUrl: avatarUrl.trim() || "https://i.pravatar.cc/150",
      bio: bio.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-popover p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {initialTeacher ? "Edit Teacher" : "Tambah Teacher"}
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
            <label htmlFor="channelName" className="text-sm font-medium text-foreground">
              Nama Channel
            </label>
            <input
              id="channelName"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="mis. AI Jason"
              className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="channelUrl" className="text-sm font-medium text-foreground">
              URL Channel YouTube
            </label>
            <input
              id="channelUrl"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="https://www.youtube.com/@..."
              className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="avatarUrl" className="text-sm font-medium text-foreground">
              URL Avatar (opsional)
            </label>
            <input
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bio" className="text-sm font-medium text-foreground">
              Bio Singkat
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Fokus konten channel ini..."
              className="rounded-md border border-border-strong bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
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
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
