"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(1, "Password wajib diisi."),
});

export type LoginState =
  | { success: true }
  | { success: false; error: string };

export async function loginUser(
  _prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/courses",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Email atau password salah." };
    }
    throw error;
  }
}

const registerSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
  displayName: z.string().min(2, "Nama minimal 2 karakter.").optional(),
});

export type RegisterState =
  | { success: true }
  | { success: false; error: string };

export async function registerUser(
  _prevState: RegisterState | undefined,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const { email, password, displayName } = parsed.data;

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { success: false, error: "Email sudah terdaftar. Coba masuk." };
  }

  const passwordHash = await hash(password, 10);

  await db.insert(users).values({
    email,
    passwordHash,
    displayName,
    role: "user",
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/courses",
  });

  return { success: true };
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}
