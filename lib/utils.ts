import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format detik jadi "20 menit" / "1 jam 5 menit" untuk tampilan durasi module. */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours} jam ${minutes} menit` : `${hours} jam`;
  }
  return `${minutes} menit`;
}

const LEVEL_LABEL: Record<"beginner" | "intermediate" | "advanced", string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Mahir",
};

export function formatLevel(level: "beginner" | "intermediate" | "advanced"): string {
  return LEVEL_LABEL[level];
}

/** Ekstrak video ID dari berbagai format URL YouTube. Return null kalau tidak cocok. */
export function extractYoutubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
