import Link from "next/link";
import { MessagesSquare, PlayCircle, Route, Sparkles, Target } from "lucide-react";
import { dummyCourses, dummyTeachers } from "@/lib/dummy-data";
import { formatDuration } from "@/lib/utils";
import { V2CourseCard } from "@/components/v2/course-card";

const STEPS = [
  {
    icon: PlayCircle,
    title: "Kami kurasi video terbaik",
    description: "Tiap video diseleksi manual dari channel YouTube terpercaya, bukan rekomendasi acak.",
  },
  {
    icon: Route,
    title: "Disusun jadi jalur belajar",
    description: "Video diurutkan jadi course terstruktur, dari konsep dasar sampai hands-on coding.",
  },
  {
    icon: MessagesSquare,
    title: "Tanya AI kalau bingung",
    description: "AI Q&A jawab dari transcript video asli — bukan ngarang dari pengetahuan umum.",
  },
];

export default function V2LandingPage() {
  const totalModules = dummyCourses.reduce((sum, c) => sum + c.modules.length, 0);
  const featured = dummyCourses[0];
  const completedCount = featured?.modules.filter((m) => m.isCompleted).length ?? 0;
  const progressPercent = featured
    ? Math.round((completedCount / featured.modules.length) * 100)
    : 0;

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="v2-chip inline-flex items-center gap-1.5 px-3 py-1.5 text-xs">
              <Sparkles size={14} strokeWidth={2} />
              Baru: Belajar Dibantu AI
            </span>

            <h1 className="v2-heading mt-6 text-5xl font-bold leading-[1.05] sm:text-6xl">
              Belajar AI
              <br />
              <span className="text-[var(--v2-primary-hover)]">Engineering,</span>
              <br />
              Bukan Video Acak!
            </h1>

            <p className="mt-5 max-w-md text-lg leading-normal text-[var(--v2-muted-foreground)]">
              Diajar mengkurasi video YouTube terbaik seputar Prompt Engineering &amp; RAG,
              menyusunnya jadi jalur belajar terstruktur, plus AI Q&amp;A berbasis transcript.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="v2-btn v2-btn-primary px-6 py-3 text-sm">
                Mulai Belajar Gratis &rarr;
              </button>
              <Link href="/courses" className="v2-btn v2-btn-secondary px-6 py-3 text-sm">
                Lihat Course
              </Link>
            </div>

            <div className="mt-10 flex gap-8">
              <div>
                <p className="v2-heading text-3xl font-bold">{dummyCourses.length}</p>
                <p className="text-sm text-[var(--v2-muted-foreground)]">Course</p>
              </div>
              <div>
                <p className="v2-heading text-3xl font-bold">{totalModules}</p>
                <p className="text-sm text-[var(--v2-muted-foreground)]">Module Video</p>
              </div>
              <div>
                <p className="v2-heading text-3xl font-bold">{dummyTeachers.length}</p>
                <p className="text-sm text-[var(--v2-muted-foreground)]">Channel Sumber</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <span className="absolute -right-4 -top-4 flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-[var(--v2-ink)] bg-[var(--v2-secondary)] shadow-[var(--v2-shadow-sm)]">
              <Target size={22} strokeWidth={2} />
            </span>

            <div className="v2-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--v2-ink)] bg-[var(--v2-muted)]">
                  <PlayCircle size={20} strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{featured?.title}</p>
                  {featured && (
                    <p className="text-xs text-[var(--v2-muted-foreground)]">
                      {featured.modules.length} module &bull;{" "}
                      {formatDuration(
                        featured.modules.reduce((sum, m) => sum + m.durationSeconds, 0)
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="mt-1.5 h-3 overflow-hidden rounded-full border-2 border-[var(--v2-ink)] bg-white">
                  <div
                    className="h-full bg-[var(--v2-primary)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button className="v2-btn v2-btn-primary mt-5 w-full py-2.5 text-sm">
                Lanjutkan Belajar
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="v2-heading text-3xl font-bold">Cara Kerjanya</h2>
        <p className="mt-2 max-w-xl text-[var(--v2-muted-foreground)]">
          Tiga langkah sederhana supaya belajar dari YouTube terasa terstruktur.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="v2-card v2-hover-lift p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[var(--v2-ink)] bg-[var(--v2-secondary)]">
                <step.icon size={20} strokeWidth={2} />
              </span>
              <h3 className="v2-heading mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-normal text-[var(--v2-muted-foreground)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="v2-heading text-3xl font-bold">Course Unggulan</h2>
          <Link href="/courses" className="hidden text-sm font-bold hover:underline sm:block">
            Lihat semua &rarr;
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dummyCourses.map((course) => (
            <V2CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="v2-card flex flex-col items-center gap-4 bg-[var(--v2-primary)] p-10 text-center text-[var(--v2-on-primary)]">
          <h2 className="v2-heading text-3xl font-bold">Siap mulai belajar?</h2>
          <p className="max-w-md text-sm leading-normal opacity-90">
            Daftar gratis, ikuti jalur belajarnya, pakai AI Q&amp;A kapan pun kamu buntu.
          </p>
          <button className="v2-btn bg-white px-6 py-3 text-sm text-[var(--v2-ink)]">
            Daftar Gratis
          </button>
        </div>
      </section>
    </div>
  );
}
