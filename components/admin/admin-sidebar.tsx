"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/teachers", label: "Teachers", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: LayoutDashboard },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-card md:w-56 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <GraduationCap size={20} strokeWidth={1.75} className="text-primary" />
        <span className="font-semibold text-foreground">Diajar Admin</span>
      </div>

      <nav className="flex flex-row gap-1 p-2 md:flex-col">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-subtle text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={16} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border p-2">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          &larr; Kembali ke situs
        </Link>
      </div>
    </aside>
  );
}
