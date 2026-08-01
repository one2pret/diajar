"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/courses", label: "Course" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <GraduationCap size={22} strokeWidth={1.75} className="text-primary" />
          <span className="text-lg">Diajar</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Masuk
          </button>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
            Daftar Gratis
          </button>
        </div>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
        >
          {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            <button className="rounded-md px-2 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              Masuk
            </button>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Daftar Gratis
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
