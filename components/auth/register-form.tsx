"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, type RegisterState } from "@/app/actions/auth";

const initialState: RegisterState | undefined = undefined;

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="displayName" className="text-sm font-medium text-foreground">
          Nama
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground">Minimal 6 karakter.</p>
      </div>

      {state && !state.success && <p className="text-sm text-destructive">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 h-10 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Memproses..." : "Daftar"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}
