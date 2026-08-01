import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

type UserRole = "user" | "admin";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: UserRole;
  }

  interface Session {
    user: DefaultSession["user"] & {
      role: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: UserRole;
  }
}
