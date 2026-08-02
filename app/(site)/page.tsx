import Link from "next/link";
import { MessagesSquare, PlaySquare, Route, Sparkles } from "lucide-react";
import { dummyCourses } from "@/lib/dummy-data";
import { CourseCard } from "@/components/learn/course-card";

const STEPS = [
  {
    icon: PlaySquare,
    title: "1. Kami kurasi video terbaik",
    description:
      "Bukan sembarang video — tiap video di jalur belajar sudah diseleksi manual dari channel YouTube terpercaya seputar Prompt Engineering & RAG.",
  },
  {
    icon: Route,
    title: "2. Disusun jadi jalur belajar",
    description:
      "Video-video itu diurutkan jadi course terstruktur, dari konsep dasar sampai hands-on coding — bukan tontonan acak.",
  },
  {
    icon: MessagesSquare,
    title: "3. Tanya AI kalau bingung",
    description:
      "Nonton sambil belajar, tanya AI Q&A yang jawabannya digali langsung dari transcript video — bukan ngarang dari pengetahuan umum.",
  },
];

export default function Home() {
  const featuredCourses = dummyCourses;

  return (
    <div className="flex flex-col">
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
            <Sparkles size={14} strokeWidth={1.75} />
            Niche pertama: Prompt Engineering + RAG
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Belajar AI Engineering dari video YouTube terbaik, bukan video acak.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-normal text-muted-foreground">
            Diajar mengkurasi video-video terbaik seputar Prompt Engineering &amp; RAG,
            menyusunnya jadi jalur belajar terstruktur, dan menyediakan AI Q&amp;A berbasis
            transcript supaya kamu belajar lebih cepat.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Daftar Gratis
            </Link>
            <Link
              href="/courses"
              className="rounded-md border border-border-strong px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Lihat Course
            </Link>
          </div>

          <Link
            href="/v2"
            className="mt-6 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Coba tampilan eksperimen v2 &rarr;
          </Link>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground">Cara kerjanya</h2>
          <p className="mt-2 max-w-xl text-sm leading-normal text-muted-foreground">
            Tiga langkah sederhana supaya belajar dari YouTube terasa terstruktur, bukan
            tersesat di rekomendasi algoritma.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-xs"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-subtle text-primary">
                  <step.icon size={20} strokeWidth={1.75} />
                </span>
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-normal text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Course unggulan</h2>
              <p className="mt-2 text-sm leading-normal text-muted-foreground">
                Mulai dari jalur belajar yang paling banyak dicari developer Indonesia.
              </p>
            </div>
            <Link
              href="/courses"
              className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:block"
            >
              Lihat semua &rarr;
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Siap belajar Prompt Engineering &amp; RAG dengan terstruktur?
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-normal text-muted-foreground">
            Daftar gratis, ikuti jalur belajarnya, dan pakai AI Q&amp;A kapan pun kamu buntu.
          </p>
          <Link
            href="/register"
            className="mt-6 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Daftar Gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
