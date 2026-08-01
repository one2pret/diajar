import Link from "next/link";
import { BookOpen } from "lucide-react";

export function V2Footer() {
  return (
    <footer className="mt-16 border-t-[3px] border-[var(--v2-ink)] bg-[var(--v2-muted)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-sm items-start gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--v2-ink)] bg-[var(--v2-secondary)]">
              <BookOpen size={18} strokeWidth={2} />
            </span>
            <p className="text-sm leading-normal text-[var(--v2-muted-foreground)]">
              Diajar mengkurasi video YouTube terbaik seputar Prompt Engineering &amp; RAG,
              disusun jadi jalur belajar terstruktur. Semua video tetap milik channel aslinya.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/" className="v2-btn bg-white px-4 py-2 text-sm">
              &larr; Versi klasik
            </Link>
            <Link href="/courses" className="v2-btn v2-btn-secondary px-4 py-2 text-sm">
              Lihat Course
            </Link>
          </div>
        </div>

        <p className="mt-6 font-mono text-xs text-[var(--v2-muted-foreground)]">
          © {new Date().getFullYear()} Diajar — desain eksperimen v2, bukan versi final.
        </p>
      </div>
    </footer>
  );
}
