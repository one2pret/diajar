"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import { logoutUser } from "@/app/actions/auth";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/courses", label: "Course" },
];

interface NavbarProps {
  session: {
    user: {
      name?: string | null;
      email?: string | null;
      role?: string;
    };
  } | null;
}

export function Navbar({ session }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const displayName = session?.user.name || session?.user.email;

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
          {session?.user.role === "admin" && (
            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <span className="max-w-[160px] truncate text-sm font-medium text-foreground">
                Halo, {displayName}
              </span>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <LogOut size={15} strokeWidth={1.75} />
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                Daftar Gratis
              </Link>
            </>
          )}
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
            {session?.user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Admin
              </Link>
            )}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {session ? (
              <>
                <p className="truncate px-2 text-sm font-medium text-foreground">
                  Halo, {displayName}
                </p>
                <form action={logoutUser}>
                  <button
                    type="submit"
                    className="w-full rounded-md border border-border-strong px-4 py-2 text-center text-sm font-medium text-foreground"
                  >
                    Keluar
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
