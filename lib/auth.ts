import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user) return null;

        const passwordMatches = await compare(password, user.passwordHash);
        if (!passwordMatches) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.displayName ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: authConfig.callbacks,
});
