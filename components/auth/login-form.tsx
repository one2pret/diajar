"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type LoginState } from "@/app/actions/auth";

const initialState: LoginState | undefined = undefined;

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginUser, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
          autoComplete="current-password"
          className="h-10 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {state && !state.success && <p className="text-sm text-destructive">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 h-10 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Memproses..." : "Masuk"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Daftar
        </Link>
      </p>
    </form>
  );
}
