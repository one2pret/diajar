import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
              <GraduationCap size={20} strokeWidth={1.75} className="text-primary" />
              <span>Diajar</span>
            </Link>
            <p className="mt-3 text-sm leading-normal text-muted-foreground">
              Kurasi video YouTube terbaik seputar Prompt Engineering &amp; RAG, disusun jadi
              jalur belajar terstruktur untuk developer Indonesia.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Navigasi</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-foreground">
                  Course
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs leading-normal text-muted-foreground">
            Diajar bukan pembuat konten video. Semua video di-embed resmi dari YouTube dan tetap
            milik channel aslinya masing-masing — Diajar hanya mengkurasi &amp; menyusun urutan
            belajarnya.
          </p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Diajar. Dibuat untuk developer Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}
