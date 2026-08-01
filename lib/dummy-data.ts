/**
 * DATA DUMMY — dipakai di Fase 1 (frontend-only) sebelum backend/database ada.
 *
 * Bentuk objeknya sengaja dibuat semirip mungkin dengan schema.ts (lib/db/schema.ts)
 * supaya nanti waktu pindah ke data asli dari database, komponen UI tidak perlu
 * dirombak — cukup ganti sumber data dari file ini ke query Drizzle.
 */

export interface DummyTeacher {
  id: string;
  channelName: string;
  channelUrl: string;
  avatarUrl: string;
  bio: string;
}

export interface DummyModule {
  id: string;
  youtubeVideoId: string;
  title: string;
  curatorNote: string;
  durationSeconds: number;
  orderIndex: number;
  teacherId: string;
  isCompleted?: boolean; // dummy progress, hardcode true/false per module
}

export interface DummyCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  coverImageUrl: string;
  modules: DummyModule[];
}

export const dummyTeachers: DummyTeacher[] = [
  {
    id: "t1",
    channelName: "AI Jason",
    channelUrl: "https://www.youtube.com/@AIJasonZ",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    bio: "Fokus konten praktik AI engineering: RAG, agent, dan tools terbaru.",
  },
  {
    id: "t2",
    channelName: "LangChain",
    channelUrl: "https://www.youtube.com/@LangChain",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    bio: "Channel resmi LangChain — tutorial RAG, agent, dan framework AI.",
  },
  {
    id: "t3",
    channelName: "BelajarGPT",
    channelUrl: "https://www.youtube.com/@BelajarGPT",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    bio: "Konten prompt engineering berbahasa Indonesia untuk pemula sampai mahir.",
  },
];

export const dummyCourses: DummyCourse[] = [
  {
    id: "c1",
    slug: "prompt-engineering-rag",
    title: "Prompt Engineering + RAG untuk Developer",
    description:
      "Jalur belajar terstruktur dari dasar prompting sampai membangun sistem RAG, dikurasi dari video-video terbaik di YouTube.",
    level: "beginner",
    coverImageUrl: "https://picsum.photos/seed/rag-course/600/400",
    modules: [
      {
        id: "m1",
        youtubeVideoId: "dOxUroR57xs",
        title: "Pengantar Prompt Engineering untuk Developer",
        curatorNote: "Video pembuka paling ringkas untuk mulai memahami dasar prompting.",
        durationSeconds: 1200,
        orderIndex: 1,
        teacherId: "t3",
        isCompleted: true,
      },
      {
        id: "m2",
        youtubeVideoId: "T9aRN5JkmL8",
        title: "Teknik Prompting Lanjutan (Few-shot, Chain of Thought)",
        curatorNote: "Bahas teknik prompting yang lebih advanced dengan contoh kode.",
        durationSeconds: 1800,
        orderIndex: 2,
        teacherId: "t1",
        isCompleted: true,
      },
      {
        id: "m3",
        youtubeVideoId: "sVcwVQRHIc8",
        title: "RAG Dijelaskan dalam 20 Menit",
        curatorNote: "Penjelasan konsep RAG paling jelas yang saya temukan, disertai diagram.",
        durationSeconds: 1200,
        orderIndex: 3,
        teacherId: "t2",
        isCompleted: false,
      },
      {
        id: "m4",
        youtubeVideoId: "wBhY-7B2jdY",
        title: "Membangun RAG dari Nol dengan Python",
        curatorNote: "Hands-on coding, cocok setelah paham konsep dasarnya di video sebelumnya.",
        durationSeconds: 2700,
        orderIndex: 4,
        teacherId: "t2",
        isCompleted: false,
      },
    ],
  },
];

/** Helper: cari course by slug — dipakai halaman detail course. */
export function getDummyCourseBySlug(slug: string): DummyCourse | undefined {
  return dummyCourses.find((c) => c.slug === slug);
}

/** Helper: cari teacher by id — dipakai kartu module/course. */
export function getDummyTeacherById(id: string): DummyTeacher | undefined {
  return dummyTeachers.find((t) => t.id === id);
}
