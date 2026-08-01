"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/v2", label: "Beranda" },
  { href: "/courses", label: "Course" },
];

export function V2Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
      <div className="v2-card mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/v2" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl border-2 border-[var(--v2-ink)] bg-[var(--v2-secondary)]">
            <BookOpen size={18} strokeWidth={2} />
          </span>
          <span className="v2-heading text-xl font-bold">Diajar</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button className="text-sm font-semibold hover:underline">Masuk</button>
          <button className="v2-btn v2-btn-primary px-5 py-2 text-sm">Mulai Gratis</button>
        </div>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[var(--v2-ink)] md:hidden"
        >
          {open ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
        </button>
      </div>

      {open && (
        <div className="v2-card mx-auto mt-2 max-w-6xl px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-2 py-2 text-sm font-semibold hover:bg-[var(--v2-muted)]"
              >
                {link.label}
              </Link>
            ))}
            <button className="v2-btn v2-btn-primary mt-2 px-4 py-2 text-sm">Mulai Gratis</button>
          </nav>
        </div>
      )}
    </header>
  );
}
