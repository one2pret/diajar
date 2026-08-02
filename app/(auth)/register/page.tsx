import Link from "next/link";
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar — Diajar",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-subtle px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm">
        <Link href="/" className="flex items-center justify-center gap-2 font-semibold text-foreground">
          <GraduationCap size={22} strokeWidth={1.75} className="text-primary" />
          <span className="text-lg">Diajar</span>
        </Link>

        <h1 className="mt-6 text-center text-xl font-semibold text-foreground">Buat akun gratis</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Mulai jalur belajar Prompt Engineering &amp; RAG.
        </p>

        <div className="mt-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
