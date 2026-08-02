import Link from "next/link";
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Masuk — Diajar",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-subtle px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm">
        <Link href="/" className="flex items-center justify-center gap-2 font-semibold text-foreground">
          <GraduationCap size={22} strokeWidth={1.75} className="text-primary" />
          <span className="text-lg">Diajar</span>
        </Link>

        <h1 className="mt-6 text-center text-xl font-semibold text-foreground">Masuk ke akun kamu</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Lanjutkan belajar Prompt Engineering &amp; RAG.
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
